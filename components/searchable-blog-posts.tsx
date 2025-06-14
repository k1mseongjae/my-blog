'use client'

import { useState } from 'react'
import { BlogPosts } from '@/components/posts'

export default function SearchableBlogPosts({ posts }: { posts: any[] }) {
  const [searchTerm, setSearchTerm] = useState('')

  // 검색어에 따라 게시물 필터링
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
      {/* ✅ 검색 창 추가 */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="게시물 제목 검색..."
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

      {/* ✅ BlogPosts에 필터링된 posts 전달 */}
      <div className="text-2xl font-dongle">
        <BlogPosts posts={filteredPosts} />
      </div>
    </>
  )
}