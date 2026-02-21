import type { Metadata } from "next"
import { hasLocale, NextIntlClientProvider } from "next-intl"
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server"
import { Geist_Mono, Noto_Sans, Noto_Sans_SC } from "next/font/google"
import { notFound } from "next/navigation"

import { routing } from "@/i18n/routing"

import "./styles.tw.css"

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

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>
}): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: "Metadata" })

    return {
        title: `${t("title")} - ${t("subtitle")}`,
        description: t("description"),
        authors: [{ name: "Rong Bao", url: "https://csmantle.top/" }],
        openGraph: {
            title: `${t("title")} - ${t("subtitle")}`,
            description: t("description"),
            type: "website",
            locale,
            alternateLocale: routing.locales.filter((l) => l !== locale),
        },
    }
}

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }))
}

export const dynamicParams = false

interface LocaleLayoutProps {
    children: React.ReactNode
    params: Promise<{ locale: string }>
}

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
