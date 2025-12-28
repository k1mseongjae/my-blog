'use client'

import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';


export default function NotionRenderer({ post, className, hideTitle = false }: { post: any, className?: string, hideTitle?: boolean }) {
  if (!post) return <div>포스트를 불러올 수 없습니다.</div>

  const renderRichText = (richTextArray: any[]) => richTextArray.map((text: any, idx: number) => {
    const color = text.annotations.color;
    const colorMap: Record<string, string> = {
      red: 'text-red-500', orange: 'text-orange-500', yellow: 'text-yellow-500',
      green: 'text-green-500', blue: 'text-blue-500', purple: 'text-purple-500',
      pink: 'text-pink-500', brown: 'text-amber-700', gray: 'text-gray-500',
    };
    const colorClass = color && color !== 'default' ? colorMap[color.replace('_background', '')] || '' : '';

    const className = `
      ${text.annotations.bold ? 'font-bold' : ''}
      ${text.annotations.italic ? 'italic' : ''}
      ${text.annotations.strikethrough ? 'line-through' : ''}
      ${text.annotations.underline ? 'underline' : ''}
      ${text.annotations.code ? 'bg-gray-200 dark:bg-gray-500 font-mono px-1 py-0.5 rounded' : ''}
      ${colorClass}
    `;

    return text.href ? (
      <a key={idx} href={text.href} target="_blank" rel="noopener noreferrer" className={`${className} text-gray-400 hover:underline`}>
        {text.plain_text}
      </a>
    ) : (
      <span key={idx} className={className}>{text.plain_text}</span>
    );
  });

  const renderContent = (block: any, index?: number): React.ReactNode => {
    let content;
    let childrenHandledInside = false;

    if (block.type === 'paragraph') {
      const hasText = block.paragraph.rich_text.some((text: any) => text.plain_text.trim() !== '');
      content = <p className="my-2 text-lg min-h-[1rem] whitespace-pre-wrap">{hasText ? renderRichText(block.paragraph.rich_text) : <br />}</p>;

    } else if (block.type === 'image') {
      const url = block.image.file?.url || block.image.external?.url;
      const caption = block.image.caption?.[0]?.plain_text;
      content = (
        <figure className="my-6 text-center">
          <img src={url} alt={caption || 'notion image'} className="mx-auto max-w-full rounded" />
          {caption && <figcaption className="text-sm text-gray-500 mt-2">{caption}</figcaption>}
        </figure>
      );

    } else if (block.type === 'to_do') {
      content = (
        <div className="flex items-center my-2">
          <input type="checkbox" checked={block.to_do.checked} readOnly className="mr-2" />
          <span className={block.to_do.checked ? 'line-through text-gray-500' : ''}>{renderRichText(block.to_do.rich_text)}</span>
        </div>
      );

    } else if (block.type === 'divider') {
      content = <hr className="my-4 border-t border-gray-300 dark:border-gray-600" />;

    } else if (block.type === 'heading_1') {
      content = block.heading_1.is_toggleable ? (
        <details className="my-4">
          <summary className="cursor-pointer text-3xl font-semibold">{renderRichText(block.heading_1.rich_text)}</summary>
          <div className="pl-4">{block.children?.map((child: any) => renderContent(child))}</div>
        </details>
      ) : (
        <h1 className="text-3xl font-semibold my-4">{renderRichText(block.heading_1.rich_text)}</h1>
      );
      childrenHandledInside = block.heading_1.is_toggleable;

    } else if (block.type === 'heading_2') {
      content = block.heading_2.is_toggleable ? (
        <details className="my-4">
          <summary className="cursor-pointer text-2xl font-semibold">{renderRichText(block.heading_2.rich_text)}</summary>
          <div className="pl-4">{block.children?.map((child: any) => renderContent(child))}</div>
        </details>
      ) : (
        <h2 className="text-2xl font-semibold my-4">{renderRichText(block.heading_2.rich_text)}</h2>
      );
      childrenHandledInside = block.heading_2.is_toggleable;

    } else if (block.type === 'heading_3') {
      content = block.heading_3.is_toggleable ? (
        <details className="my-4">
          <summary className="cursor-pointer text-xl font-semibold">{renderRichText(block.heading_3.rich_text)}</summary>
          <div className="pl-4">{block.children?.map((child: any) => renderContent(child))}</div>
        </details>
      ) : (
        <h3 className="text-xl font-semibold my-4">{renderRichText(block.heading_3.rich_text)}</h3>
      );
      childrenHandledInside = block.heading_3.is_toggleable;

    } else if (block.type === 'bulleted_list_item') {
      content = (
        <ul className="list-disc pl-5 my-2">
          <li className="whitespace-pre-wrap">
            {renderRichText(block.bulleted_list_item.rich_text)}
            {block.children?.map((child: any) => renderContent(child))}
          </li>
        </ul>
      );
      childrenHandledInside = true;

    } else if (block.type === 'numbered_list_item') {
      return null;

    } else if (block.type === 'toggle') {
      content = (
        <details className="my-2">
          <summary className="cursor-pointer font-semibold">{renderRichText(block.toggle.rich_text)}</summary>
          <div className="pl-4">{block.children?.map((child: any) => renderContent(child))}</div>
        </details>
      );
      childrenHandledInside = true;

    } else if (block.type === 'code') {
      const codeContent = block.code.rich_text.map((text: any) => text.plain_text).join('');
      content = (
        <figure className="my-4 rounded bg-gray-900 overflow-x-auto overflow-y-hidden">
          <SyntaxHighlighter
            language={block.code.language || 'text'}
            style={oneDark}
            showLineNumbers={true}
            wrapLongLines={false}
            PreTag="div"
            customStyle={{
              fontSize: '0.875rem',
              padding: '1rem',
              backgroundColor: '#282c34',
              borderRadius: '0.5rem',
              margin: 0,
              overflow: 'auto'
            }}

          >

            {codeContent}
          </SyntaxHighlighter>
          {block.code.caption?.length > 0 && (
            <figcaption className="text-xs text-gray-400 mt-1 px-2">
              {block.code.caption.map((c: any, i: number) => <span key={i}>{c.plain_text}</span>)}
            </figcaption>
          )}
        </figure>
      );

    } else if (block.type === 'quote') {
      content = <blockquote className="border-l-4 pl-4 italic my-4 whitespace-pre-wrap">{renderRichText(block.quote.rich_text)}</blockquote>;

    } else if (block.type === 'callout') {
      content = (
        <div className="my-4 p-4 rounded-lg border flex items-start gap-3 bg-gray-50 dark:bg-gray-800 overflow-x-auto">
          <div className="text-xl">{block.callout.icon?.emoji}</div>
          <div className="flex-1">
            {block.callout.rich_text.map((text: any, idx: number) => <p key={idx}>{text.plain_text}</p>)}
            {block.children?.map((child: any) => renderContent(child))}
          </div>
        </div>
      );
      childrenHandledInside = true;

    } else if (block.type === 'table') {
      content = (
        <table className="w-full my-4 border-collapse table-auto border rounded-lg">
          <tbody>
            {block.children?.map((row: any) => (
              row.type === 'table_row' ? (
                <tr key={row.id} className="border hover:bg-gray-50 dark:hover:bg-gray-500">
                  {row.table_row.cells.map((cell: any, idx: number) => (
                    <td key={idx} className="border p-4 text-left min-w-[80px] text-sm whitespace-nowrap">
                      {cell.map((text: any, textIdx: number) => renderRichText([text]))}
                    </td>
                  ))}
                </tr>
              ) : null
            ))}
          </tbody>
        </table>
      );
      childrenHandledInside = true;
    }

    return <div key={block.id}>{content}{!childrenHandledInside && block.children?.map((child: any) => renderContent(child))}</div>;
  };

  const renderBlocksGroup = (blocks: any[]) => {
    const elements: React.ReactNode[] = [];
    let i = 0;

    while (i < blocks.length) {
      if (blocks[i].type === 'numbered_list_item') {
        const listItems: any[] = [];
        while (i < blocks.length && blocks[i].type === 'numbered_list_item') {
          listItems.push(blocks[i]);
          i++;
        }
        elements.push(
          <ol key={listItems[0].id} className="list-decimal pl-5 my-2">
            {listItems.map((block: any) => (
              <li key={block.id} className="whitespace-pre-wrap">
                {renderRichText((block as any).numbered_list_item.rich_text)}
                {(block.children ?? []).map((child: any) => renderContent(child))}
              </li>
            ))}
          </ol>
        );
      } else {
        elements.push(renderContent(blocks[i], i));
        i++;
      }
    }

    return elements;
  };

  return (
    <div className={`font-stylish text-lg leading-relaxed ${className}`}>
      {!hideTitle && <h1 className="text-5xl font-bold mb-6">{post.title}</h1>}
      {post.content?.blocks?.length > 0 ? renderBlocksGroup(post.content.blocks) : <p>내용이 없습니다.</p>}
    </div>
  );
}
