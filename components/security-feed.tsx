// lib/security-feed.ts
import { NewsItem, PaperItem, MixedContentItem } from '@/types/security'

interface RSSItem {
  title: string
  link: string
  description: string
  pubDate: string
}

interface DBpiaEntry {
  title: string
  authors: string[]
  abstract: string
  link: string
  published: string
  id: string
}

export async function getSecurityNews(limit: number): Promise<NewsItem[]> {
  try {
    // 보안뉴스 RSS 피드 (한국 정보보호학회 또는 다른 국내 보안 뉴스)
    // 여러 소스를 시도해볼 수 있습니다
    const sources = [
      'https://www.boannews.com/media/news_rss.xml',
      'https://www.dailysecu.com/rss/allArticle.xml'
    ]
    
    let allItems: RSSItem[] = []
    
    for (const source of sources) {
      try {
        const response = await fetch(source, {
          next: { revalidate: 3600 }
        })
        const text = await response.text()
        const items = parseRSS(text)
        allItems = [...allItems, ...items]
      } catch (error) {
        console.error(`Failed to fetch from ${source}:`, error)
      }
    }
    
    const randomItems = getRandomItems(allItems, limit)
    
    return randomItems.map(item => ({
      title: item.title,
      description: item.description,
      link: item.link,
      publishedAt: item.pubDate,
      source: '보안뉴스'
    }))
  } catch (error) {
    console.error('뉴스 가져오기 실패:', error)
    // 대체 데이터
    return [{
      title: "최신 랜섬웨어 공격 동향과 대응 방안",
      description: "국내 기업을 대상으로 한 랜섬웨어 공격이 증가하고 있으며...",
      link: "https://www.boannews.com",
      publishedAt: new Date().toISOString(),
      source: "보안뉴스"
    }]
  }
}

export async function getSecurityPapers(limit: number): Promise<PaperItem[]> {
  try {
    // DBpia API 또는 RISS API를 사용할 수 있지만, API 키가 필요합니다
    // 대신 정적 데이터나 크롤링 가능한 소스를 사용
    
    // 한국정보보호학회 논문 예시 (실제로는 API나 크롤링 필요)
    const papers: PaperItem[] = [
      {
        title: "양자 내성 암호 알고리즘의 국내 적용 방안 연구",
        authors: ["김철수", "이영희", "박민수"],
        abstract: "양자 컴퓨터의 발전으로 인한 기존 암호체계의 위협에 대응하기 위한 양자 내성 암호 알고리즘의 국내 적용 방안을 연구하였다...",
        link: "https://www.kiisc.or.kr",
        publishedAt: new Date().toISOString(),
        arxivId: "KIISC-2024-001"
      },
      {
        title: "제로 트러스트 보안 모델의 중소기업 적용 사례 분석",
        authors: ["정보안", "최보안"],
        abstract: "국내 중소기업 환경에서 제로 트러스트 보안 모델을 효과적으로 적용하기 위한 방안을 실제 사례를 통해 분석하였다...",
        link: "https://www.kiisc.or.kr",
        publishedAt: new Date().toISOString(),
        arxivId: "KIISC-2024-002"
      }
    ]
    
    return getRandomItems(papers, limit)
  } catch (error) {
    console.error('논문 가져오기 실패:', error)
    return []
  }
}

// 뉴스와 논문을 섞어서 반환하는 새로운 함수
export async function getMixedSecurityContent(totalLimit: number = 3): Promise<MixedContentItem[]> {
  const [news, papers] = await Promise.all([
    getSecurityNews(2),  // 뉴스 2개
    getSecurityPapers(1)  // 논문 1개
  ])
  
  // 타입을 구분할 수 있도록 type 필드 추가
  const mixedContent: MixedContentItem[] = [
    ...news.map(item => ({ ...item, type: 'news' as const })),
    ...papers.map(item => ({ ...item, type: 'paper' as const }))
  ]
  
  // 랜덤하게 섞기
  return mixedContent.sort(() => Math.random() - 0.5).slice(0, totalLimit)
}

function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

function parseRSS(xml: string): RSSItem[] {
  const items: RSSItem[] = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  let match
  
  while ((match = itemRegex.exec(xml)) !== null) {
    const item = match[1]
    const title = item.match(/<title>(.*?)<\/title>/)?.[1] || ''
    const link = item.match(/<link>(.*?)<\/link>/)?.[1] || ''
    const description = item.match(/<description>(.*?)<\/description>/)?.[1] || ''
    const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || ''
    
    items.push({
      title: decodeHTMLEntities(title),
      link,
      description: decodeHTMLEntities(description.replace(/<[^>]*>/g, '')),
      pubDate
    })
  }
  
  return items
}

function decodeHTMLEntities(text: string): string {
  if (typeof window === 'undefined') {
    return text
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&nbsp;/g, ' ')
  }
  
  const textarea = document.createElement('textarea')
  textarea.innerHTML = text
  return textarea.value
}