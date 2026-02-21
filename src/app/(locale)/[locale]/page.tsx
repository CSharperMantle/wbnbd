import { setRequestLocale } from "next-intl/server"
import { use } from "react"

import { HomePage } from "@/components/HomePage"

export default function LocalePage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = use(params)
    setRequestLocale(locale)

    return <HomePage />
}
