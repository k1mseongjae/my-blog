'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function CategoryPageClient({ category, posts }: { category: string, posts: any[] }) {
  const [searchTerm, setSearchTerm] = useState('')

  // 검색어에 따라 게시물 필터링
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // 서브카테고리별로 그룹화
  const postsBySubcategory = filteredPosts.reduce((acc: any, post: any) => {
    const key = post.subcategory || 'uncategorized'
    if (!acc[key]) acc[key] = []
    acc[key].push(post)
    return acc
  }, {})

  return (
    <section>
     <h1 className="font-bytesized text-5xl mb-8 tracking-tighter">
    <span><Link href="/blog" className="hover:underline">Blog</Link></span>[{category}]
    </h1>
      
      
      {/* ✅ 검색 창 */}
      <div className="mb-6">
        <input
          type="text"
          placeholder={`게시물 제목 검색...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 
                     bg-white dark:bg-black text-black dark:text-white
                     placeholder-neutral-500 dark:placeholder-neutral-400
                     focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600
                     font-dongle text-2xl"
        />
      </div>

      {/* ✅ 검색 결과 표시 */}
      {searchTerm && (
        <p className="mb-4 text-neutral-600 dark:text-neutral-400 font-dongle text-2xl">
          "{searchTerm}" 검색 결과: {filteredPosts.length}개
        </p>
      )}

      {/* ✅ 서브카테고리별로 게시물 표시 */}
      {Object.entries(postsBySubcategory).map(([subcategory, subcategoryPosts]: [string, any]) => (
        <div key={subcategory} className="mb-8">
          {subcategory !== 'uncategorized' && (
            <h2 className="text-xl font-dongle mb-2 text-nuetral-700 dark:text-gray-300">
              📂 {subcategory}
            </h2>
          )}
          {subcategoryPosts.map((post: any) => (
            <div key={post.slug} className="my-4 bg-neutral-200 dark:bg-zinc-700 p-4 rounded-lg">
              <Link href={`/blog/${post.slug}`} className="text-2xl font-dongle hover:underline">
                {post.title}
              </Link>
              <p className="text-gray-500 font-dongle text-2xl">{post.date}</p>
            </div>
          ))}
        </div>
      ))}
      
      {/* ✅ 검색 결과가 없을 때 */}
      {filteredPosts.length === 0 && searchTerm && (
        <p className="text-neutral-500 dark:text-neutral-400 font-dongle text-2xl mt-8">
          검색 결과가 없습니다.
        </p>
      )}
    </section>
  )
}