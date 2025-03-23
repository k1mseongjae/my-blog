import Image from 'next/image'
import { BlogPosts } from 'components/posts'

export default function Page() {
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
        <h1 className="text-5xl font-bytesized animate-pulse">
          Welcome to k1mseongjae's blog
        </h1>
      </div>
      <p className="text-2xl font-kiranghaerang mb-4 text-right">
        {`부담없이 쓰는 공간👀`}
      </p>
      <p className="text-1xl font-kiranghaerang mb-4 text-right">
        {`Since 2025`}
      </p>
      <div className="text-2xl font-dongle my-8">
        <BlogPosts />
      </div>
    </section>
  )
}
