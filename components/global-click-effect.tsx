'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function GlobalClickEffect() {
    const [clicks, setClicks] = useState<{ id: number; x: number; y: number }[]>([])

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const id = Date.now()
            setClicks((prev) => [...prev, { id, x: e.clientX, y: e.clientY }])
        }

        window.addEventListener('click', handleClick)
        return () => window.removeEventListener('click', handleClick)
    }, [])

    return (
        <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
            <AnimatePresence>
                {clicks.map((click) => (
                    <motion.div
                        key={click.id}
                        initial={{ opacity: 0.8, scale: 0, x: "-50%", y: "-50%" }}
                        animate={{ opacity: 0, scale: 2, x: "-50%", y: "-50%" }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="absolute rounded-full border-2 border-current text-gray-500 dark:text-gray-300"
                        style={{
                            left: click.x,
                            top: click.y,
                            width: '40px',
                            height: '40px',
                            boxShadow: '0 0 10px currentColor'
                        }}
                        onAnimationComplete={() => {
                            setClicks((prev) => prev.filter((c) => c.id !== click.id))
                        }}
                    />
                ))}
            </AnimatePresence>
        </div>
    )
}
