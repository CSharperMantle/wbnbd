"use client"

import { useMotionValue } from "framer-motion"
import { Check, Copy, Search } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useEffect, useRef, useState } from "react"

import Cursor from "@/components/Cursor"
import usePlayback from "@/hooks/usePlayback"
import normalizeBasePath from "@/utils/normalizeBasePath"

const QUERY_PLACEHOLDER = "@QUERY@"
const DEFAULT_ENGINE = `https://www.baidu.com/s?wd=${QUERY_PLACEHOLDER}`
const COPY_TIMEOUT = 2000

const APP_BASE_PATH = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH)

interface PlaybackState {
    query: string
    engine: string | null
}

const parseHashPlaybackState = (): PlaybackState => {
    if (typeof window === "undefined") {
        return { query: "", engine: null }
    }

    const rawHash = window.location.hash.startsWith("#")
        ? window.location.hash.slice(1)
        : window.location.hash

    const params = new URLSearchParams(rawHash)
    return {
        query: params.get("q") ?? "",
        engine: params.get("e"),
    }
}

export const HomePage = () => {
    const t = useTranslations("HomePage")
    const locale = useLocale()

    const [playbackState, setPlaybackState] = useState<PlaybackState>({ query: "", engine: null })

    const [inputValue, setInputValue] = useState("")
    const [engineValue, setEngineValue] = useState("")
    const [generatedUrl, setGeneratedUrl] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)

    const inputRef = useRef<HTMLInputElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)

    const cursorX = useMotionValue(20)
    const cursorY = useMotionValue(20)

    const isPlayback = !!playbackState.query
    const searchEngine = playbackState.engine ?? DEFAULT_ENGINE

    useEffect(() => {
        const syncFromHash = () => {
            setPlaybackState(parseHashPlaybackState())
        }

        syncFromHash()
        window.addEventListener("hashchange", syncFromHash)

        return () => {
            window.removeEventListener("hashchange", syncFromHash)
        }
    }, [])

    const { phase, displayText, buttonVisualState } = usePlayback({
        query: playbackState.query,
        enabled: isPlayback,
        inputRef,
        buttonRef,
        cursorX,
        cursorY,
        onComplete: () => {
            const url = searchEngine.replaceAll(
                QUERY_PLACEHOLDER,
                encodeURIComponent(playbackState.query)
            )
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
        const url = new URL(`${APP_BASE_PATH}/${locale}/`, window.location.origin)
        url.hash = params.toString()
        setGeneratedUrl(url.toString())
    }

    const handleCopy = async () => {
        if (!generatedUrl) return
        await navigator.clipboard.writeText(generatedUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), COPY_TIMEOUT)
    }

    const selectCaption = () => {
        switch (phase) {
            case "moving-to-input":
            case "typing":
                return t("step1")
            case "moving-to-button":
                return t("step2")
            case "hovering":
            case "click":
                return t("step3")
        }
    }

    return (
        <div id="app-shell">
            <main id="app-main">
                <h1 id="app-title">{t("title")}</h1>
                <h2 id="app-subtitle">{t("subtitle")}</h2>
                <div id="app-form">
                    <div id="app-search-bar">
                        <input
                            ref={inputRef}
                            type="text"
                            value={isPlayback ? displayText : inputValue}
                            onChange={(e) => !isPlayback && setInputValue(e.target.value)}
                            placeholder={t("placeholder")}
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
                            {t("search")}
                        </button>
                    </div>

                    {!isPlayback && (
                        <input
                            type="text"
                            value={engineValue}
                            onChange={(e) => setEngineValue(e.target.value)}
                            placeholder={t("enginePlaceholder")}
                            id="app-engine-input"
                        />
                    )}

                    {generatedUrl && (
                        <div id="app-generated-box">
                            <input
                                type="text"
                                value={generatedUrl}
                                readOnly
                                id="app-generated-input"
                            />
                            <button
                                onClick={handleCopy}
                                id="app-copy-button"
                                aria-label={t("copyLink")}
                            >
                                {copied ? <Check size={18} /> : <Copy size={18} />}
                            </button>
                        </div>
                    )}

                    {isPlayback && phase !== "idle" && <p id="app-caption">{selectCaption()}</p>}
                </div>
            </main>

            <footer id="app-footer">
                <a href="https://github.com/CSharperMantle/wbnbd" target="_blank" rel="noreferrer">
                    https://github.com/CSharperMantle/wbnbd
                </a>
                <a
                    href="https://github.com/CSharperMantle/wbnbd/blob/main/LICENSE"
                    target="_blank"
                    rel="noreferrer"
                >
                    BSD-3-Clause
                </a>
            </footer>

            {isPlayback && <Cursor x={cursorX} y={cursorY} visible={phase !== "idle"} />}
        </div>
    )
}
