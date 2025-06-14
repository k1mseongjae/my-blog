import { fetchPostsMetadata } from '@/lib/notion'
import SubcategoryPageClient from '@/components/subcategory-page-client'

export default async function SubcategoryPage({ 
  params 
}: { 
  params: { category: string, subcategory: string } 
}) {
  const { category, subcategory } = params

  // 메타데이터만 fetch
  const posts = await fetchPostsMetadata()
  const filteredPosts = posts.filter((post) => 
    post.category === category && post.subcategory === subcategory
  )

  if (filteredPosts.length === 0) return <div>No posts in this subcategory</div>

  return <SubcategoryPageClient 
    category={category} 
    subcategory={subcategory} 
    posts={filteredPosts} 
  />
}

export async function generateStaticParams() {
  const posts = await fetchPostsMetadata()
  
  // 카테고리와 서브카테고리 조합 생성
  const categorySubcategoryPairs = posts
    .filter(post => post.subcategory) // 서브카테고리가 있는 포스트만
    .map(post => ({
      category: post.category,
      subcategory: post.subcategory
    }))
  
  // 중복 제거
  const uniquePairs = Array.from(
    new Map(
      categorySubcategoryPairs.map(item => 
        [`${item.category}-${item.subcategory}`, item]
      )
    ).values()
  )
  
  return uniquePairs
}