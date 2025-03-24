import { fetchPostsFromNotion } from '@/lib/notion'
import Link from 'next/link'

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const { category } = params

  // Notion에서 fetch
  const posts = await fetchPostsFromNotion()
  const filteredPosts = posts.filter((post) => post.category === category)

  if (filteredPosts.length === 0) return <div>No posts in this category</div>

  return (
    <section>
      <h1 className="text-3xl font-kiranghaerang capitalize mb-6 ">{category} 카테고리</h1>
      {filteredPosts.map((post) => (
        <div key={post.slug} className="my-4 bg-neutral-200">
          <Link href={`/blog/${post.slug}`} className="text-2xl font-dongle hover:underline">
            {post.title}
          </Link>
          <p className="text-gray-500 font-dongle text-2xl">{post.date}</p>
        </div>
      ))}
    </section>
  )
}

export async function generateStaticParams() {
  const posts = await fetchPostsFromNotion()
  const categories = [...new Set(posts.map((post) => post.category))]
  return categories.map((category) => ({ category }))
}
