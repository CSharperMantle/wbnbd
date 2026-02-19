"use client";

import { useQueryState } from "nuqs";
import { useState, useRef } from "react";
import { Search, Copy, Check } from "lucide-react";
import { Cursor } from "@/components/Cursor";
import { usePlayback } from "@/hooks/usePlayback";
import { useLocale } from "@/i18n/useLocale";

const DEFAULT_ENGINE = "https://www.baidu.com/s?wd=@QUERY@";

export const HomePage = () => {
  const { t } = useLocale();
  const [query] = useQueryState("q");
  const [engine] = useQueryState("e");
  const [inputValue, setInputValue] = useState("");
  const [engineValue, setEngineValue] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const isPlayback = !!query;
  const searchEngine = engine || DEFAULT_ENGINE;

  const { phase, displayText, cursorPos } = usePlayback({
    query: query || "",
    enabled: isPlayback,
    inputRef,
    buttonRef,
    onComplete: () => {
      const url = searchEngine.replace("@QUERY@", encodeURIComponent(query!));
      window.location.href = url;
    },
  });

  const handleGenerate = () => {
    if (!inputValue.trim()) return;
    const params = new URLSearchParams();
    params.set("q", inputValue);
    if (engineValue.trim() && engineValue !== DEFAULT_ENGINE) {
      params.set("e", engineValue);
    }
    const url = `${window.location.origin}/?${params.toString()}`;
    setGeneratedUrl(url);
  };

  const handleCopy = async () => {
    if (!generatedUrl) return;
    await navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-4">
      <h1 className="mb-8 text-4xl font-bold text-blue-600">{t.title}</h1>
      <p className="mb-6 text-gray-500">{t.subtitle}</p>

      <div className="flex w-full max-w-xl flex-col gap-4">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={isPlayback ? displayText : inputValue}
            onChange={(e) => !isPlayback && setInputValue(e.target.value)}
            placeholder={t.placeholder}
            className="flex-1 rounded-full border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
            readOnly={isPlayback}
          />
          <button
            ref={buttonRef}
            onClick={isPlayback ? undefined : handleGenerate}
            className="flex items-center gap-2 rounded-full bg-blue-500 px-6 py-3 text-white hover:bg-blue-600"
          >
            <Search size={18} />
            {isPlayback ? t.search : t.getLink}
          </button>
        </div>

        {!isPlayback && (
          <input
            type="text"
            value={engineValue}
            onChange={(e) => setEngineValue(e.target.value)}
            placeholder={t.enginePlaceholder}
            className="rounded-full border border-gray-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        )}

        {generatedUrl && (
          <div className="flex items-center gap-2 rounded-lg bg-gray-100 p-3">
            <input type="text" value={generatedUrl} readOnly className="flex-1 bg-transparent text-sm" />
            <button onClick={handleCopy} className="text-gray-600 hover:text-blue-500">
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>
        )}

        {isPlayback && phase !== "idle" && (
          <p className="text-center text-gray-500">
            {phase === "moving" && t.step1}
            {phase === "typing" && t.step2}
            {phase === "clicking" && t.step3}
          </p>
        )}
      </div>

      {isPlayback && <Cursor position={cursorPos} visible={phase !== "idle"} />}
    </div>
  );
};
