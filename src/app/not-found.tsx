"use client"

import { useEffect } from "react"

import normalizeBasePath from "@/utils/normalizeBasePath"

const APP_BASE_PATH = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH)

export default function NotFound() {
    useEffect(() => {
        window.location.replace(`${APP_BASE_PATH}/zh/`)
    }, [])

    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-2 px-4 text-center text-sm text-slate-700">
            <p>Redirecting...</p>
            <a href={`${APP_BASE_PATH}/zh/`} className="underline">
                前往中文
            </a>
        </main>
    )
}
