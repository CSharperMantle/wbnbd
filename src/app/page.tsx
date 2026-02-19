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

export default function Page() {
    useEffect(() => {
        const locale = detectLocale()
        window.location.replace(`${APP_BASE_PATH}/${locale}/`)
    }, [])

    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-2 px-4 text-center text-sm text-slate-700">
            <p>Redirecting to your locale...</p>
            <p>
                <a href={`${APP_BASE_PATH}/zh/`} className="underline">
                    中文
                </a>
                <span className="px-2">|</span>
                <a href={`${APP_BASE_PATH}/en/`} className="underline">
                    English
                </a>
            </p>
        </main>
    )
}
