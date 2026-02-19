"use client"

import { useState, useEffect, RefObject } from "react"
import { animate } from "framer-motion"
import type { MotionValue } from "framer-motion"
import isClient from "@/utils/isClient"

type Phase = "idle" | "moving-to-input" | "typing" | "moving-to-button" | "hovering" | "click"
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

async function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
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
            /*
             * HACK: The animator gets inputRect's position on the fly. So we need to first show
             * the note box. Otherwise the layout will change, and the fetched position will be
             * stale.
             */
            setPhase("moving-to-input")
            cursorX.set(20)
            cursorY.set(20)
            await sleep(100)
            if (cancelled) return
            const inputRect = inputRef.current?.getBoundingClientRect()
            if (inputRect) {
                await animateCursorTo(
                    inputRect.left + 16,
                    inputRect.top + inputRect.height * 0.5,
                    1.5
                )
            }
            if (inputRect) {
                await animateCursorTo(
                    inputRect.left + inputRect.width * 0.25,
                    inputRect.top + inputRect.height * 0.75,
                    1
                )
            }
            if (cancelled) return

            setPhase("typing")
            for (let i = 0; i <= query.length; i++) {
                setDisplayText(query.slice(0, i))
                await sleep(100)
                if (cancelled) return
            }
            await sleep(220)
            if (cancelled) return

            setPhase("moving-to-button")
            const buttonRect = buttonRef.current?.getBoundingClientRect()
            if (buttonRect) {
                console.debug(
                    `animateCursorTo(${buttonRect.x + buttonRect.width / 2}, ${buttonRect.y + buttonRect.height / 2}, 0.75)`
                )
                await animateCursorTo(
                    buttonRect.left + buttonRect.width / 2,
                    buttonRect.top + buttonRect.height / 2,
                    3
                )
            }
            if (cancelled) return

            setPhase("hovering")
            setButtonVisualState("hover")
            await sleep(2000)
            if (cancelled) return

            setPhase("click")
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
