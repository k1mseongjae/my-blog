'use client'

import { fetchPostsFromNotion } from '@/lib/notion'

export const baseUrl = 'https://k1mseongjae.com'

export default async function sitemap() {
  const posts = await fetchPostsFromNotion()

  const blogs = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.date,
  }))

  const routes = ['', '/blog', '/guide', '/guide/kr'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...blogs]
}
