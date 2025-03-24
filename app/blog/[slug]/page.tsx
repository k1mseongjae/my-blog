import { notFound } from 'next/navigation'
import { fetchPostsFromNotion } from '@/lib/notion'
import NotionRenderer from 'components/notion-renderer'
import Comment from 'components/comment'
import { baseUrl } from 'app/sitemap'

export const runtime = 'edge'

export async function generateStaticParams() {
  const posts = await fetchPostsFromNotion()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const posts = await fetchPostsFromNotion()
  const post = posts.find((p) => p.slug === params.slug)

  if (!post) return

  const ogImage = post.image
    ? `${baseUrl}${post.image}`
    : `${baseUrl}/og?title=${encodeURIComponent(post.title)}`

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      url: `${baseUrl}/blog/${post.slug}`,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [ogImage],
    },
  }
}

export default async function Blog({ params }: { params: { slug: string } }) {
  const posts = await fetchPostsFromNotion()
  const post = posts.find((p) => p.slug === params.slug)

  if (!post) notFound()

  return (
    <section>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            datePublished: post.date,
            dateModified: post.date,
            description: post.description,
            image: post.image ? `${baseUrl}${post.image}` : `/og?title=${encodeURIComponent(post.title)}`,
            url: `${baseUrl}/blog/${post.slug}`,
            author: { '@type': 'Person', name: 'My Portfolio' },
          }),
        }}
      />
      <NotionRenderer post={post} />
      <Comment />
    </section>
  )
}
