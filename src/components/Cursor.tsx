"use client"

import type { MotionValue } from "framer-motion"
import { motion } from "framer-motion"
import Image from "next/image"

import cursorIcon from "@/../assets/cursor-min.svg"

interface CursorProps {
    x: MotionValue<number>
    y: MotionValue<number>
    visible: boolean
}

export default function Cursor({ x, y, visible }: CursorProps) {
    if (!visible) return null
    return (
        <motion.div className="pointer-events-none fixed z-50 top-0 left-0" style={{ x, y }}>
            <Image src={cursorIcon} alt="Cursor" width={24} height={24} id="app-cursor" />
        </motion.div>
    )
}
