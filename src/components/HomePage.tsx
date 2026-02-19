"use client"

import { useMotionValue } from "framer-motion"
import { Check, Copy, Search } from "lucide-react"
import { useQueryState } from "nuqs"
import { useRef, useState } from "react"

import { Cursor } from "@/components/Cursor"
import { usePlayback } from "@/hooks/usePlayback"
import { useLocale } from "@/i18n/useLocale"

const QUERY_PLACEHOLDER = "@QUERY@"
const DEFAULT_ENGINE = `https://www.baidu.com/s?wd=${QUERY_PLACEHOLDER}`
const COPY_TIMEOUT = 2000

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
    const searchEngine = engine ?? DEFAULT_ENGINE

    const { phase, displayText, buttonVisualState } = usePlayback({
        query: query ?? "",
        enabled: isPlayback,
        inputRef,
        buttonRef,
        cursorX,
        cursorY,
        onComplete: () => {
            const url = searchEngine.replaceAll(QUERY_PLACEHOLDER, encodeURIComponent(query ?? ""))
            window.location.href = url
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
        setTimeout(() => setCopied(false), COPY_TIMEOUT)
    }

    return (
        <div id="app-shell">
            <h1 id="app-title">{t.title}</h1>
            <p id="app-subtitle">{t.subtitle}</p>
            <div id="app-form">
                <div id="app-search-bar">
                    <input
                        ref={inputRef}
                        type="text"
                        value={isPlayback ? displayText : inputValue}
                        onChange={(e) => !isPlayback && setInputValue(e.target.value)}
                        placeholder={t.placeholder}
                        id="app-search-input"
                        readOnly={isPlayback}
                    />
                    <button
                        ref={buttonRef}
                        onClick={isPlayback ? undefined : handleGenerate}
                        disabled={isPlayback}
                        data-hovered={buttonVisualState === "hover"}
                        data-clicked={buttonVisualState === "active"}
                        id="app-search-button"
                    >
                        <Search size={18} />
                        {t.search}
                    </button>
                </div>

                {!isPlayback && (
                    <input
                        type="text"
                        value={engineValue}
                        onChange={(e) => setEngineValue(e.target.value)}
                        placeholder={t.enginePlaceholder}
                        id="app-engine-input"
                    />
                )}

                {generatedUrl && (
                    <div id="app-generated-box">
                        <input type="text" value={generatedUrl} readOnly id="app-generated-input" />
                        <button onClick={handleCopy} id="app-copy-button" aria-label="Copy link">
                            {copied ? <Check size={18} /> : <Copy size={18} />}
                        </button>
                    </div>
                )}

                {isPlayback && phase !== "idle" && (
                    <p id="app-caption">
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
