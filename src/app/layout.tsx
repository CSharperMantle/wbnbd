import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import "./globals.css"

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
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
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <NuqsAdapter>{children}</NuqsAdapter>
            </body>
        </html>
    )
}
