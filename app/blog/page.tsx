import Link from 'next/link'
import { fetchPostsMetadata } from '@/lib/notion'
import SearchableBlogPosts from '@/components/searchable-blog-posts'

export const metadata = {
  title: 'Blog',
  description: 'Read my blog.',
}

export default async function Page() {
  const posts = await fetchPostsMetadata() // ✅ 메타데이터만 가져오기

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

      {/* ✅ 검색 가능한 BlogPosts 컴포넌트 */}
      <SearchableBlogPosts posts={posts} />
    </section>
  )
}