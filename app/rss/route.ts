import { baseUrl } from 'app/sitemap'
import { fetchPostsFromNotion } from '@/lib/notion'

export const runtime = 'edge'
export const revalidate = 0  // ✅ 여기에 추가 (ISR 무시하고 매번 fresh하게)

export async function GET() {
  const posts = await fetchPostsFromNotion()

  const itemsXml = posts
    .sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1))
    .map(
      (post) => `
        <item>
          <title>${post.title}</title>
          <link>${baseUrl}/blog/${post.slug}</link>
          <description>${post.description}</description>
          <pubDate>${new Date(post.date).toUTCString()}</pubDate>
        </item>`
    )
    .join('\n')

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
        <title>My Portfolio</title>
        <link>${baseUrl}</link>
        <description>This is my portfolio RSS feed</description>
        ${itemsXml}
    </channel>
  </rss>`

  return new Response(rssFeed, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
