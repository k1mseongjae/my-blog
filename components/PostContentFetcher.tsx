import { fetchPostContent } from '@/lib/notion'
import NotionRenderer from './NotionRenderer'

export default async function PostContentFetcher({
    notionPageUrl
}: {
    notionPageUrl: string | null
}) {
    if (!notionPageUrl) {
        return <div>Content not found.</div>
    }

    const { blocks } = await fetchPostContent(notionPageUrl)

    // NotionRenderer expects a 'post' object with 'content.blocks'
    const postData = {
        title: '', // Title hidden via prop
        content: { blocks }
    }

    return <NotionRenderer post={postData} hideTitle={true} className="custom-scrollbar" />
}
