import { notFound } from 'next/navigation'
import { fetchPostsMetadata, fetchPostDetail } from '@/lib/notion'
import NotionRenderer from 'components/NotionRenderer'
import Comment from 'components/Comment'
import BgmPlayer from '@/components/BgmPlayer'


export const runtime = 'edge'
const baseUrl = 'https://kimsongje.com';

export async function generateStaticParams() {
  const posts = await fetchPostsMetadata()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await fetchPostDetail(params.slug)

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

import { Suspense } from 'react'
import PostContentFetcher from '@/components/PostContentFetcher'

export default async function Blog({ params }: { params: { slug: string } }) {
  const post = await fetchPostDetail(params.slug)

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
      {post.bgm && <BgmPlayer src={post.bgm} />}

      {/* Title rendered immediately for better perceived performance */}
      <h1 className="font-stylish text-5xl font-bold mb-6">{post.title}</h1>

      {/* Content streamed via Suspense */}
      <Suspense fallback={<div className="font-stylish text-lg mt-10">Loading content...</div>}>
        <PostContentFetcher notionPageUrl={post.notionPageUrl} />
      </Suspense>

      <Comment />
    </section>
  )
}