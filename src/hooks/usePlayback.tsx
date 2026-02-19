"use client"

import { useState, useEffect, RefObject } from "react"
import { animate } from "framer-motion"
import type { MotionValue } from "framer-motion"
import isClient from "@/utils/isClient"

type Phase = "idle" | "moving" | "typing" | "clicking"
type ButtonVisualState = "idle" | "hover" | "active"

interface UsePlaybackProps {
    query: string
    enabled: boolean
    inputRef: RefObject<HTMLInputElement | null>
    buttonRef: RefObject<HTMLButtonElement | null>
    cursorX: MotionValue<number>
    cursorY: MotionValue<number>
    onComplete: () => void
}

export const usePlayback = ({
    query,
    enabled,
    inputRef,
    buttonRef,
    cursorX,
    cursorY,
    onComplete,
}: UsePlaybackProps) => {
    const [phase, setPhase] = useState<Phase>("idle")
    const [displayText, setDisplayText] = useState("")
    const [buttonVisualState, setButtonVisualState] = useState<ButtonVisualState>("idle")

    useEffect(() => {
        if (!enabled || !isClient()) return

        let cancelled = false
        const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
        const activeAnimations: Array<{ stop: () => void }> = []

        const animateCursorTo = async (x: number, y: number, duration: number) => {
            const xAnimation = animate(cursorX, x, { duration, ease: "easeInOut" })
            const yAnimation = animate(cursorY, y, { duration, ease: "easeInOut" })
            activeAnimations.push(xAnimation, yAnimation)
            await Promise.all([xAnimation.finished, yAnimation.finished])
        }

        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        if (prefersReducedMotion) {
            onComplete()
            return
        }

        const startAnimation = async () => {
            cursorX.set(20)
            cursorY.set(20)
            setButtonVisualState("idle")
            setDisplayText("")
            await wait(250)
            if (cancelled) return

            setPhase("moving")

            const inputRect = inputRef.current?.getBoundingClientRect()
            if (inputRect) {
                console.debug(
                    `animateCursorTo(${inputRect.x + 16}, ${inputRect.y + inputRect.height / 2}, 0.85)`
                )
                await animateCursorTo(
                    inputRect.x + 16,
                    inputRect.y + inputRect.height / 2,
                    0.85
                )
            }
            if (cancelled) return

            setPhase("typing")

            for (let i = 0; i <= query.length; i++) {
                if (cancelled) return
                setDisplayText(query.slice(0, i))
                await wait(75)
            }
            if (cancelled) return

            await wait(220)
            setPhase("moving")

            const buttonRect = buttonRef.current?.getBoundingClientRect()
            if (buttonRect) {
                console.debug(
                    `animateCursorTo(${buttonRect.x + buttonRect.width / 2}, ${buttonRect.y + buttonRect.height / 2}, 0.75)`
                )
                await animateCursorTo(
                    buttonRect.x + buttonRect.width / 2,
                    buttonRect.y + buttonRect.height / 2,
                    0.75
                )
            }
            if (cancelled) return

            setButtonVisualState("hover")
            await wait(160)
            if (cancelled) return

            setPhase("clicking")
            setButtonVisualState("active")
            onComplete()
        }

        startAnimation()

        return () => {
            cancelled = true
            activeAnimations.forEach((animation) => animation.stop())
            setPhase("idle")
            setButtonVisualState("idle")
        }
    }, [enabled, query, inputRef, buttonRef, cursorX, cursorY, onComplete])

    return { phase, displayText, buttonVisualState }
}
