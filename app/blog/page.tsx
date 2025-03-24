import Link from 'next/link'
import { fetchPostsFromNotion } from '@/lib/notion'
import { BlogPosts } from '@/components/posts' // ✅ BlogPosts 올바르게 가져오기

export const metadata = {
  title: 'Blog',
  description: 'Read my blog.',
}

export default async function Page() {
  const posts = await fetchPostsFromNotion() // ✅ Notion에서 데이터 가져오기

  return (
    <section>
      <h1 className="font-bytesized text-5xl mb-8 tracking-tighter">Blog</h1>

      {/* ✅ 카테고리 버튼 추가 */}
      <div className="flex space-x-4 my-6">
        <Link href="/category/study" className="font-kiranghaerang text-1.5xl px-4 py-2 bg-neutral-200 dark:bg-zinc-700 p-4 rounded-lg hover:bg-neutral-300">
          Study
        </Link>
        <Link href="/category/daily" className="font-kiranghaerang text-1.5xl px-4 py-2 bg-neutral-200 dark:bg-zinc-700 p-4 rounded-lg hover:bg-neutral-300">
          Daily
        </Link>
      </div>

      {/* ✅ BlogPosts에 props로 posts 전달 */}
      <div className="text-2xl font-dongle">
        <BlogPosts posts={posts} />
      </div>
    </section>
  )
}
