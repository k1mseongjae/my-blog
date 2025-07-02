// types/security.ts
export interface NewsItem {
  title: string
  //description: string
  link: string
  publishedAt: string
  source: string
  type?: 'news'
}

export interface PaperItem {
  title: string
  authors: string[]
  abstract: string
  link: string
  publishedAt: string
  arxivId: string
  type?: 'paper'
}

export interface SecurityContent {
  news: NewsItem[]
  papers: PaperItem[]
}

export type MixedContentItem = (NewsItem | PaperItem) & { type: 'news' | 'paper' }