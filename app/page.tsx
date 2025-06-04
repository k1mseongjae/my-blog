import { fetchPostsMetadata } from '@/lib/notion'
import ClientHome from '@/components/clienthome'

export default async function Page() {
  const posts = await fetchPostsMetadata() // 메타데이터만 가져오기

  return <ClientHome posts={posts} />
}