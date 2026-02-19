"use client"

import { useQueryState } from "nuqs"
import { messages, Locale } from "./messages"

export const useLocale = () => {
    const [locale] = useQueryState("lang")
    const currentLocale: Locale = locale === "zh" ? "zh" : "en"
    const t = messages[currentLocale]
    return { locale: currentLocale, t }
}
