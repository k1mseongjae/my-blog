import Link from 'next/link'
import posts from '../content/posts'

export function BlogPosts() {

  return (
    <div>
      {posts
        .sort((a, b) => {
          if (
            new Date(a.date) > new Date(b.date)
          ) {
            return -1
          }
          return 1
        })
        .map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
             className="group flex flex-col space-y-1 mb-4"
          >
            <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2 bg-neutral-200">
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
