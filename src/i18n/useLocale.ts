"use client"

import { useQueryState } from "nuqs"
import { messages, Locale } from "./messages"

export const useLocale = () => {
    const [locale] = useQueryState("lang")
    const currentLocale: Locale = locale === "en" ? "en" : "zh"
    const t = messages[currentLocale]
    return { locale: currentLocale, t }
}
