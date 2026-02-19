import { Suspense } from "react"
import { HomePage } from "@/components/HomePage"

export default function Page() {
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
