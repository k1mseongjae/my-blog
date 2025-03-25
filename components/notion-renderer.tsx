'use client'

import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';


export default function NotionRenderer({ post, className }: { post: any, className?: string }) {
  if (!post) return <div>포스트를 불러올 수 없습니다.</div>
  
  const renderContent = (block: any) => {

    if (block.type === 'paragraph') {
      const hasText = block.paragraph.rich_text.some((text: any) => text.plain_text.trim() !== '');
      return (
        <p key={block.id} className="my-2 text-lg min-h-[1rem]">
          {hasText
            ? block.paragraph.rich_text.map((text: any, idx: number) =>
                text.plain_text.split('\n').map((line: string, lineIdx: number) => (
                  text.href ? (
                    <a 
                      key={`${idx}-${lineIdx}`} 
                      href={text.href} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-gray-400 underline"
                    >
                      {line}
                    </a>
                  ) : (
                    <React.Fragment key={`${idx}-${lineIdx}`}>
                      {line}
                      <br />
                    </React.Fragment>
                  )
                ))
              )
            : <br />}
        </p>
      );
    }
    
    
    

    if (block.type === 'image') {
      const url = block.image.file?.url || block.image.external?.url;
      return (
        <img 
          key={block.id} 
          src={url} 
          alt="notion image" 
          className="my-4 max-w-full rounded"
        />
      );
    }

    if (block.type === 'to_do') {
      return (
        <div key={block.id} className="flex items-center my-2">
          <input type="checkbox" checked={block.to_do.checked} readOnly className="mr-2" />
          <span className={block.to_do.checked ? 'line-through text-gray-500' : ''}>
            {block.to_do.rich_text.map((text: any, idx: number) => (
              <span key={idx}>{text.plain_text}</span>
            ))}
          </span>
        </div>
      );
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
      const codeContent = block.code.rich_text.map((text: any) => text.plain_text).join('');
      return (
        <div 
          key={block.id} 
          className="my-4 rounded bg-gray-900 overflow-x-auto overflow-y-hidden"
        >
          <SyntaxHighlighter
            language={block.code.language}
            style={oneDark}
            wrapLongLines={false}
            PreTag="div"
            customStyle={{
              //background: 'transparent',
              fontSize: '0.75rem',
              padding: '0.75rem',
              minWidth: '100%',
              maxWidth: '100%',
              //color: '#E5E7EB',
            }}
          >
            {codeContent}
          </SyntaxHighlighter>
        </div>
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
