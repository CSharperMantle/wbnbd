"use client"

import { useState, useEffect, RefObject } from "react"

type Phase = "idle" | "moving" | "typing" | "clicking"

interface UsePlaybackProps {
    query: string
    enabled: boolean
    inputRef: RefObject<HTMLInputElement | null>
    buttonRef: RefObject<HTMLButtonElement | null>
    onComplete: () => void
}

export const usePlayback = ({
    query,
    enabled,
    inputRef,
    buttonRef,
    onComplete,
}: UsePlaybackProps) => {
    const [phase, setPhase] = useState<Phase>("idle")
    const [displayText, setDisplayText] = useState("")
    const [cursorPos, setCursorPos] = useState({
        x: -50,
        y: window?.innerHeight || 800,
    })

    useEffect(() => {
        if (!enabled || typeof window === "undefined") return

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
        if (prefersReducedMotion) {
            onComplete()
            return
        }

        const startAnimation = async () => {
            await new Promise((r) => setTimeout(r, 500))
            setPhase("moving")

            const inputRect = inputRef.current?.getBoundingClientRect()
            if (inputRect) {
                setCursorPos({
                    x: inputRect.left + inputRect.width / 2,
                    y: inputRect.top + inputRect.height / 2,
                })
            }

            await new Promise((r) => setTimeout(r, 1000))
            setPhase("typing")

            for (let i = 0; i <= query.length; i++) {
                setDisplayText(query.slice(0, i))
                await new Promise((r) => setTimeout(r, 80 + Math.random() * 40))
            }

            await new Promise((r) => setTimeout(r, 300))
            setPhase("clicking")

            const buttonRect = buttonRef.current?.getBoundingClientRect()
            if (buttonRect) {
                setCursorPos({
                    x: buttonRect.left + buttonRect.width / 2,
                    y: buttonRect.top + buttonRect.height / 2,
                })
            }

            await new Promise((r) => setTimeout(r, 800))
            onComplete()
        }

        startAnimation()
    }, [enabled, query, inputRef, buttonRef, onComplete])

    return { phase, displayText, cursorPos }
}
