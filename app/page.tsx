import { fetchPostsMetadata } from '@/lib/notion'
import ClientHome from '@/components/clienthome'

export default async function Page() {
  const allPosts = await fetchPostsMetadata() // 메타데이터만 가져오기
  
  // 날짜순으로 정렬하고 최신 3개만 선택
  const recentPosts = allPosts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)

  return <ClientHome posts={recentPosts} />
}