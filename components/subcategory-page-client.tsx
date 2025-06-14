'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function SubcategoryPageClient({ 
  category, 
  subcategory, 
  posts 
}: { 
  category: string
  subcategory: string
  posts: any[] 
}) {
  const [searchTerm, setSearchTerm] = useState('')

  // 검색어에 따라 게시물 필터링
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <section>
      {/* 브레드크럼 네비게이션 */}
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
        <Link href="/blog" className="hover:text-gray-900 dark:hover:text-gray-100">
          Blog
        </Link>
        <span>/</span>
        <Link href={`/category/${category}`} className="hover:text-gray-900 dark:hover:text-gray-100">
          {category}
        </Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-gray-100">{subcategory}</span>
      </div>

      <h1 className="text-3xl font-kiranghaerang mb-6">
        {subcategory}
        <span className="text-xl text-gray-600 dark:text-gray-400 ml-2">
          in {category}
        </span>
      </h1>
      
      {/* ✅ 검색 창 */}
      <div className="mb-6">
        <input
          type="text"
          placeholder={`${subcategory}에서 검색...`}
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

      {/* ✅ 게시물 목록 */}
      {filteredPosts.map((post) => (
        <div key={post.slug} className="my-4 bg-neutral-200 dark:bg-zinc-700 p-4 rounded-lg">
          <Link href={`/blog/${post.slug}`} className="text-2xl font-dongle hover:underline">
            {post.title}
          </Link>
          <p className="text-gray-500 font-dongle text-2xl">{post.date}</p>
        </div>
      ))}
      
      {/* ✅ 검색 결과가 없을 때 */}
      {filteredPosts.length === 0 && searchTerm && (
        <p className="text-neutral-500 dark:text-neutral-400 font-dongle text-2xl mt-8">
          검색 결과가 없습니다.
        </p>
      )}

      {/* ✅ 게시물이 없을 때 */}
      {posts.length === 0 && !searchTerm && (
        <p className="text-neutral-500 dark:text-neutral-400 font-dongle text-2xl mt-8">
          아직 작성된 글이 없습니다.
        </p>
      )}
    </section>
  )
}