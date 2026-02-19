import type { NextConfig } from "next"

const normalizeBasePath = (value: string | undefined) => {
    if (!value) return ""
    const trimmed = value.trim()
    if (!trimmed || trimmed === "/") return ""
    return `/${trimmed.replace(/^\/+|\/+$/g, "")}`
}

const basePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH ?? process.env.BASE_PATH)

const nextConfig: NextConfig = {
    reactCompiler: true,
    output: "export",
    trailingSlash: true,
    images: {
        unoptimized: true,
    },
    basePath: basePath || undefined,
    assetPrefix: basePath || undefined,
}

export default nextConfig
