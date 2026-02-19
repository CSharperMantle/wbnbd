import { Suspense } from "react"

import { HomePage } from "@/components/HomePage"

export default function LocalePage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center">Loading...</div>
            }
        >
            <HomePage />
        </Suspense>
    )
}
