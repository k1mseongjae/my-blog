import Link from 'next/link'
import { BlogPosts } from 'components/posts'
import { fetchPostsFromNotion } from '@/lib/notion'

export const metadata = {
  title: 'Blog',
  description: 'Read my blog.',
}

export default async function Page() {
  const posts = await fetchPostsFromNotion()

  return (
    <section>
      <h1 className="font-bytesized text-5xl mb-8 tracking-tighter">Blog</h1>

      {/* 카테고리 버튼 추가 */}
      <div className="flex space-x-4 my-6">
        <Link href="/category/study" className="font-kiranghaerang text-1.5xl px-4 py-2 bg-neutral-200 rounded hover:bg-neutral-300">Study</Link>
        <Link href="/category/daily" className="font-kiranghaerang text-1.5xl px-4 py-2 bg-neutral-200 rounded hover:bg-neutral-300">Daily</Link>
      </div>

      <div className="text-2xl font-dongle">
        <BlogPosts posts={posts} />
      </div>
    </section>
  )
}
