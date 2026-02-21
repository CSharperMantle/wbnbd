"use client"

import { useEffect } from "react"

import normalizeBasePath from "@/utils/normalizeBasePath"

const APP_BASE_PATH = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH)

const detectLocale = () => {
    const candidates = [navigator.language, ...navigator.languages].map((value) =>
        value.toLowerCase()
    )
    return candidates.some((value) => value.startsWith("en")) ? "en" : "zh"
}

export default function RootPage() {
    useEffect(() => {
        const locale = detectLocale()
        window.location.replace(`${APP_BASE_PATH}/${locale}/`)
    }, [])

    return (
        <main id="landing-main">
            <p lang="en">Redirecting to your locale...</p>
            <p>
                <a lang="zh" href={`${APP_BASE_PATH}/zh/`} className="underline">
                    中文
                </a>
                <span className="px-2">|</span>
                <a lang="en" href={`${APP_BASE_PATH}/en/`} className="underline">
                    English
                </a>
            </p>
        </main>
    )
}
