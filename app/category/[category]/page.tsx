import { fetchPostsMetadata } from '@/lib/notion'
import CategoryPageClient from '@/components/category-page-client'

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const { category } = params

  // 메타데이터만 fetch
  const posts = await fetchPostsMetadata()
  const filteredPosts = posts.filter((post) => post.category === category)

  if (filteredPosts.length === 0) return <div>No posts in this category</div>

  return <CategoryPageClient category={category} posts={filteredPosts} />
}

export async function generateStaticParams() {
  const posts = await fetchPostsMetadata()
  const categories = [...new Set(posts.map((post) => post.category))]
  return categories.map((category) => ({ category }))
}