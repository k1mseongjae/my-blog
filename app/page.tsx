import Image from 'next/image'
import { BlogPosts } from 'components/posts'
import { Typewriter } from 'react-simple-typewriter'
import { fetchPostsFromNotion } from '@/lib/notion'

export default async function Page() {
  const posts = await fetchPostsFromNotion()

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

      <p className="text-2xl font-kiranghaerang mb-4 text-right">부담없이 쓰는 공간👀</p>
      <p className="text-1xl font-kiranghaerang mb-4 text-right">Since 2025</p>

      <div className="text-2xl font-dongle my-8">
        <BlogPosts posts={posts} />
      </div>
    </section>
  )
}
