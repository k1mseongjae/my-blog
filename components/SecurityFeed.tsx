'use client'

import Link from 'next/link'
import { MixedContentItem } from '@/types/security'

interface SecurityFeedProps {
  content: MixedContentItem[]
}

export default function SecurityFeed({ content }: SecurityFeedProps) {
  if (!content || content.length === 0) {
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-kiranghaerang mb-4">📰 보안 동향</h2>
        <p className="text-gray-500 font-dongle text-xl">컨텐츠를 불러오는 중...</p>
      </div>
    )
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-dongle mb-4">📰 Recent</h2>
      <div className="space-y-4">
        {content.map((item, index) => (
          <div 
            key={index} 
            className="bg-neutral-100 dark:bg-zinc-800 p-4 rounded-lg border hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-2">
              <span className={`text-xs px-2 py-1 rounded-full ${
                item.type === 'news' 
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 font-stylish'
                  : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 font-stylish'
              }`}>
                {item.type === 'news' ? 'NEWS' : 'ARTICLE'}
              </span>
              <span className="text-xs text-gray-500 font-dongle">
                {new Date(item.publishedAt).toLocaleDateString('ko-KR')}
              </span>
            </div>
            
            <h3 className="font-semibold text-lg mb-2 font-stylish">
              <Link 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {item.title}
              </Link>
            </h3>
            
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 font-dongle">
              {item.type === 'news' 
                ? (item as any).description 
                : (item as any).abstract
              }
            </p>
            
            {item.type === 'paper' && (
              <div className="text-xs text-gray-500 font-dongle">
                저자: {(item as any).authors.join(', ')}
              </div>
            )}
            
            {item.type === 'news' && (
              <div className="text-xs text-gray-500 font-dongle">
                출처: {(item as any).source}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}