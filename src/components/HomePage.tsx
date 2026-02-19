"use client"

import { useQueryState } from "nuqs"
import { useState, useRef } from "react"
import { Search, Copy, Check } from "lucide-react"
import { useMotionValue } from "framer-motion"
import { Cursor } from "@/components/Cursor"
import { usePlayback } from "@/hooks/usePlayback"
import { useLocale } from "@/i18n/useLocale"

const DEFAULT_ENGINE = "https://www.baidu.com/s?wd=@QUERY@"

export const HomePage = () => {
    const { t } = useLocale()
    const [query] = useQueryState("q")
    const [engine] = useQueryState("e")
    const [inputValue, setInputValue] = useState("")
    const [engineValue, setEngineValue] = useState("")
    const [generatedUrl, setGeneratedUrl] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const cursorX = useMotionValue(20)
    const cursorY = useMotionValue(20)

    const isPlayback = !!query
    const searchEngine = engine || DEFAULT_ENGINE

    const { phase, displayText, buttonVisualState } = usePlayback({
        query: query || "",
        enabled: isPlayback,
        inputRef,
        buttonRef,
        cursorX,
        cursorY,
        onComplete: () => {
            const url = searchEngine.replace("@QUERY@", encodeURIComponent(query!))
            // TODO: window.location.href = url
            console.log(`Navigate to: ${url}`)
        },
    })

    const handleGenerate = () => {
        if (!inputValue.trim()) return
        const params = new URLSearchParams()
        params.set("q", inputValue)
        if (engineValue.trim() && engineValue !== DEFAULT_ENGINE) {
            params.set("e", engineValue)
        }
        const url = `${window.location.origin}/?${params.toString()}`
        setGeneratedUrl(url)
    }

    const handleCopy = async () => {
        if (!generatedUrl) return
        await navigator.clipboard.writeText(generatedUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="app-shell">
            <h1 className="app-title">{t.title}</h1>
            <p className="app-subtitle">{t.subtitle}</p>

            <div className="app-form">
                <div className="app-search-row">
                    <input
                        ref={inputRef}
                        type="text"
                        value={isPlayback ? displayText : inputValue}
                        onChange={(e) => !isPlayback && setInputValue(e.target.value)}
                        placeholder={t.placeholder}
                        className="app-input"
                        readOnly={isPlayback}
                    />
                    <button
                        ref={buttonRef}
                        onClick={isPlayback ? undefined : handleGenerate}
                        disabled={isPlayback}
                        data-hovered={buttonVisualState === "hover"}
                        data-clicked={buttonVisualState === "active"}
                        className="app-button"
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
                        className="app-engine-input"
                    />
                )}

                {generatedUrl && (
                    <div className="app-generated-box">
                        <input
                            type="text"
                            value={generatedUrl}
                            readOnly
                            className="app-generated-input"
                        />
                        <button onClick={handleCopy} className="app-copy-button" aria-label="Copy link">
                            {copied ? <Check size={18} /> : <Copy size={18} />}
                        </button>
                    </div>
                )}

                {isPlayback && phase !== "idle" && (
                    <p className="app-caption">
                        {phase === "moving" && t.step1}
                        {phase === "typing" && t.step2}
                        {phase === "clicking" && t.step3}
                    </p>
                )}
            </div>

            {isPlayback && <Cursor x={cursorX} y={cursorY} visible={phase !== "idle"} />}
        </div>
    )
}
