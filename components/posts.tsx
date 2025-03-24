'use client'

import Link from 'next/link'

export function BlogPosts({ posts }: { posts: any[] }) {
  return (
    <div>
      {posts
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group flex flex-col space-y-1 mb-4"
          >
            <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2 bg-neutral-200 p-2 rounded-lg">
              <p className="text-neutral-900 dark:text-neutral-100 tracking-tight font-dongle text-2xl group-hover:underline">
                {post.title}
              </p>
              <p className="text-neutral-600 dark:text-neutral-400 w-[100px] tabular-nums">
                {post.date}
              </p>
            </div>
          </Link>
        ))}
    </div>
  )
}
