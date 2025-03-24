'use client'

export default function NotionRenderer({ post }: { post: any }) {
  if (!post) return <div>포스트를 불러올 수 없습니다.</div>

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">{post.title}</h1>

      {post.content?.blocks?.length > 0 ? (
        post.content.blocks.map((block: any) => {
          if (block.type === 'paragraph') {
            return (
              <p key={block.id} className="my-2 text-lg">
                {block.paragraph.rich_text.map((text: any, idx: number) => (
                  <span key={idx}>{text.plain_text}</span>
                ))}
              </p>
            )
          }
          if (block.type === 'heading_1') {
            return (
              <h1 key={block.id} className="text-3xl font-semibold my-4">
                {block.heading_1.rich_text.map((text: any, idx: number) => (
                  <span key={idx}>{text.plain_text}</span>
                ))}
              </h1>
            )
          }
          if (block.type === 'heading_2') {
            return (
              <h2 key={block.id} className="text-2xl font-semibold my-4">
                {block.heading_2.rich_text.map((text: any, idx: number) => (
                  <span key={idx}>{text.plain_text}</span>
                ))}
              </h2>
            )
          }
          // 추가로 image, quote, etc 처리 가능
          return null
        })
      ) : (
        <p>내용이 없습니다.</p>
      )}
    </div>
  )
}
