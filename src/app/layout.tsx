import type { Metadata } from "next"
import { Geist_Mono, Noto_Sans, Noto_Sans_SC } from "next/font/google"
import { NuqsAdapter } from "nuqs/adapters/next/app"

import "./globals.css"

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

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body
                className={`${notoSans.variable} ${notoSansSC.variable} ${geistMono.variable} antialiased`}
            >
                <NuqsAdapter>{children}</NuqsAdapter>
            </body>
        </html>
    )
}
