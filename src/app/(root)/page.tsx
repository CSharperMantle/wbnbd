"use client"

import Link from "next/link"
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
            <p lang="zh">正在跳转到以你的语言显示的页面……</p>
            <hr id="landing-main-hr" />
            <p>
                <Link lang="zh" href="/zh/" className="underline">
                    中文
                </Link>
                <span className="px-2">|</span>
                <Link lang="en" href="/en/" className="underline">
                    English
                </Link>
            </p>
        </main>
    )
}
