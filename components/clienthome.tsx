'use client'

import Image from 'next/image'
import Link from 'next/link'  
import { Typewriter } from 'react-simple-typewriter'
import SecurityFeed from './security-feed'
import type { MixedContentItem } from '@/types/security'

interface ClientHomeProps {
  mixedContent: MixedContentItem[]
}

export default function ClientHome({ mixedContent }: ClientHomeProps) {
  return (
    <section>
      <div className="flex items-center mb-8">
        <Image
          src="/profile.png"
          alt="profile image"
          width={100}
          height={100}
          className="rounded-full mr-4"
        />
        <h1 className="text-5xl font-bytesized">
          <Typewriter
            words={['Nice to meet you! 👋', 'Welcome to my blog ✨', 'Have a great day! ☀️']}
            loop={0}
            cursor
            cursorStyle="|"
            typeSpeed={70}
            deleteSpeed={50}
            delaySpeed={1500}
          />
        </h1>
      </div>

      <p className="text-2xl font-kiranghaerang mb-4 text-right">그의 흔적😶</p>
      <p className="text-1xl font-kiranghaerang mb-4 text-right">Since 2025</p>

      <SecurityFeed content={mixedContent} />
    </section>
  )
}