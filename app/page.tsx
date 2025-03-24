import { fetchPostsFromNotion } from '@/lib/notion'
import ClientHome from '@/components/clienthome'

export default async function Page() {
  const posts = await fetchPostsFromNotion()

  return <ClientHome posts={posts} />
}
