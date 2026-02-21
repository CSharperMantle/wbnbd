import type { Metadata } from "next"
import { hasLocale, NextIntlClientProvider } from "next-intl"
import { getMessages, setRequestLocale } from "next-intl/server"
import { Geist_Mono, Noto_Sans, Noto_Sans_SC } from "next/font/google"
import { notFound } from "next/navigation"

import { routing } from "@/i18n/routing"

import "./styles.tw.css"

interface LocaleLayoutProps {
    children: React.ReactNode
    params: Promise<{ locale: string }>
}

const notoSans = Noto_Sans({
    variable: "--font-noto-sans",
    subsets: ["latin"],
})

const notoSansSC = Noto_Sans_SC({
    variable: "--font-noto-sans-sc",
})

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
})

export const metadata: Metadata = {
    title: "WBNBD - 我帮你百度",
    description:
        "Let Me Baidu That For You - A passive-aggressive but helpful tool to teach people how to use search engines.",
    openGraph: {
        title: "WBNBD - 我帮你百度",
        description: "Let Me Baidu That For You",
        type: "website",
    },
}

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }))
}

export const dynamicParams = false

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
    const { locale } = await params

    if (!hasLocale(routing.locales, locale)) {
        notFound()
    }

    setRequestLocale(locale)
    const messages = await getMessages()

    return (
        <html lang={locale}>
            <body
                className={`${notoSans.variable} ${notoSansSC.variable} ${geistMono.variable} antialiased`}
            >
                <NextIntlClientProvider locale={locale} messages={messages}>
                    {children}
                </NextIntlClientProvider>
            </body>
        </html>
    )
}
