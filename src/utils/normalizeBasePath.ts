export default function normalizeBasePath(value?: string): string {
    if (!value) return ""
    const trimmed = value.trim()
    if (!trimmed || trimmed === "/") return ""
    return `/${trimmed.replace(/^\/+|\/+$/g, "")}`
}
