// components/NotionRendererWithTOC.tsx
'use client'

import React, { useEffect, useRef, useState } from 'react';
import NotionRenderer from './notion-renderer';

export default function NotionRendererWithTOC({ post }: { post: any }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [headings, setHeadings] = useState<{ id: string, text: string, level: number }[]>([]);

  useEffect(() => {
    if (!contentRef.current) return;
    const headingElements = contentRef.current.querySelectorAll('h1, h2, h3');
    const newHeadings = Array.from(headingElements).map((el: any) => {
      const id = el.innerText.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      el.id = id;
      return {
        id,
        text: el.innerText,
        level: Number(el.tagName.replace('H', '')),
      };
    });
    setHeadings(newHeadings);
  }, [post]);

  return (
    <div className="flex gap-8">
      <div className="flex-1" ref={contentRef}>
        <NotionRenderer post={post} />
      </div>
      <aside className="w-64 hidden xl:block sticky top-20 self-start max-h-[calc(100vh-5rem)] overflow-auto border-l pl-4 text-sm">
        <div className="font-bold mb-2">목차</div>
        <ul className="space-y-2">
          {headings.map(({ id, text, level }) => (
            <li key={id} className={`ml-${(level - 1) * 4}`}>
              <a href={`#${id}`} className="hover:underline text-gray-600 dark:text-gray-300">
                {text}
              </a>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
