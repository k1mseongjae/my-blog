import posts, { Post } from 'content/posts'
import Link from 'next/link'

export default function CategoryPage({ params }: { params: { category: string } }) {
  const { category } = params

  const filteredPosts: Post[] = posts.filter((post) => post.category === category)

  if (filteredPosts.length === 0) return <div>No posts in this category</div>

  return (
    <section>
      <h1 className="text-3xl font-dongle capitalize mb-6">{category} !</h1>
      {filteredPosts.map((post) => (
        <div key={post.slug} className="my-4">
          <Link href={`/blog/${post.slug}`} className="text-3xl font-dongle hover:underline">
            {post.title}
          </Link>
          <p className="text-gray-500 font-dongle">{post.date}</p>
        </div>
      ))}
    </section>
  )
}

export async function generateStaticParams() {
  const categories = [...new Set(posts.map((post) => post.category))]
  return categories.map((category) => ({ category }))
}