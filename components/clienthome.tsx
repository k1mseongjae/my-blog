'use client'

import Image from 'next/image'
import Link from 'next/link'  
import { BlogPosts } from 'components/posts'
import { Typewriter } from 'react-simple-typewriter'

export default function ClientHome({ posts }: { posts: any }) {
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

      <div className="text-2xl font-dongle my-8">
        <BlogPosts posts={posts} />
        <Link href="/blog" className="inline-block mt-4 text-xl text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
          더 많은 글 보기 →
        </Link>
      </div>

      
    </section>

    
  )
}
