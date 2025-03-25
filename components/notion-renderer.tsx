'use client'

export default function NotionRenderer({ post, className }: { post: any, className?: string }) {
  if (!post) return <div>포스트를 불러올 수 없습니다.</div>
  
  const renderContent = (block: any) => {
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

    if (block.type === 'heading_3') {
      return (
        <h3 key={block.id} className="text-xl font-semibold my-4">
          {block.heading_3.rich_text.map((text: any, idx: number) => (
            <span key={idx}>{text.plain_text}</span>
          ))}
        </h3>
      )
    }

    if (block.type === 'bulleted_list_item') {
      return (
        <ul key={block.id} className="list-disc pl-5 my-2">
          <li>
            {block.bulleted_list_item.rich_text.map((text: any, idx: number) => (
              <span key={idx}>{text.plain_text}</span>
            ))}
          </li>
        </ul>
      )
    }

    if (block.type === 'numbered_list_item') {
      return (
        <ol key={block.id} className="list-decimal pl-5 my-2">
          <li>
            {block.numbered_list_item.rich_text.map((text: any, idx: number) => (
              <span key={idx}>{text.plain_text}</span>
            ))}
          </li>
        </ol>
      )
    }
    
    if (block.type === 'toggle') {
      return (
        <details key={block.id} className="my-2">
          <summary className="cursor-pointer font-semibold">
            {block.toggle.rich_text.map((text: any, idx: number) => (
              <span key={idx}>{text.plain_text}</span>
            ))}
          </summary>
          <div className="pl-4">
            {/* children 렌더링 */}
            {block.children?.map((child: any) => renderContent(child))}
          </div>
        </details>
      );
    }

    if (block.type === 'code') {
      return (
        <pre key={block.id} className="bg-gray-800 text-white p-4 rounded my-4">
          <code>{block.code.rich_text.map((text: any, idx: number) => (
            <span key={idx}>{text.plain_text}</span>
          ))}</code>
        </pre>
      )
    }

    if (block.type === 'quote') {
      return (
        <blockquote key={block.id} className="border-l-4 pl-4 italic my-4">
          {block.quote.rich_text.map((text: any, idx: number) => (
            <span key={idx}>{text.plain_text}</span>
          ))}
        </blockquote>
      )
    }

    if (block.type === 'table') {
      return (
        <table key={block.id} className="w-full my-4 border-collapse table-auto border rounded-lg">
          <tbody>
            {block.children?.map((row: any) => (
              row.type === 'table_row' ? (
                <tr key={row.id} className="border hover:bg-gray-50">
                  {row.table_row.cells.map((cell: any, idx: number) => (
                    <td 
                      key={idx} 
                      className="border p-4 text-left min-w-[120px] whitespace-nowrap"
                    >
                      {cell.map((text: any, textIdx: number) => (
                        <span key={textIdx}>{text.plain_text}</span>
                      ))}
                    </td>
                  ))}
                </tr>
              ) : null
            ))}
          </tbody>
        </table>
      );
    }

    return null
  }

  return (
    <div className="font-stylish text-lg leading-relaxed">
      <h1 className="text-5xl font-bold mb-6">{post.title}</h1>

      {post.content?.blocks?.length > 0 ? (
        post.content.blocks.map((block: any) => renderContent(block))
      ) : (
        <p>내용이 없습니다.</p>
      )}
    </div>
  )
}
