// lib/security-feed.ts
import { NewsItem, PaperItem, MixedContentItem } from '@/types/security'
import axios from 'axios';
import * as cheerio from 'cheerio';


interface RSSItem {
  title: string
  link: string
  description: string
  pubDate: string
}

export async function getSecurityNews(limit: number): Promise<NewsItem[]> {
  try {
    const newsSources = [
      { name: '보안뉴스', url: 'https://www.boannews.com/media/news_rss.xml' },
      { name: '데일리시큐', url: 'https://www.dailysecu.com/rss/S1N2.xml' }
    ];

    let allItems: NewsItem[] = [];

    for (const source of newsSources) {
      try {
        const response = await fetch(source.url, {
          next: { revalidate: 600 }
        });

        const buffer = await response.arrayBuffer();
        const contentType = response.headers.get('content-type');
        let text;

        // ✨ 수정된 인코딩 처리 로직
        // '보안뉴스'는 헤더에 인코딩 정보가 없으므로 URL을 직접 확인하여 EUC-KR로 강제 디코딩
        if (source.url.includes('boannews.com')) {
          const decoder = new TextDecoder('euc-kr');
          text = decoder.decode(buffer);
        }
        // 다른 피드는 헤더 정보를 기반으로 동적 처리
        else if (contentType && contentType.toLowerCase().includes('euc-kr')) {
          const decoder = new TextDecoder('euc-kr');
          text = decoder.decode(buffer);
        }
        // 그 외 기본값은 UTF-8
        else {
          const decoder = new TextDecoder('utf-8');
          text = decoder.decode(buffer);
        }

        const parsedItems = parseRSS(text);

        const itemsWithSource = parsedItems.map(item => ({
          ...item,
          source: source.name
        }));

        allItems = [...allItems, ...itemsWithSource];

      } catch (error) {
        console.error(`Failed to fetch from ${source.url}:`, error);
      }
    }

    return getRandomItems(allItems, limit);

  } catch (error) {
    console.error('뉴스 가져오기 실패:', error);
    return [];
  }
}


// ✨ getSecurityPapers 함수를 디버깅 기능이 추가된 코드로 교체
export async function getSecurityPapers(limit: number): Promise<PaperItem[]> {
  try {
    const targetUrl = 'https://www.dbpia.co.kr/search/topSearch?searchOption=all&query=%EC%A0%95%EB%B3%B4%EB%B3%B4%ED%98%B8';

    // ✨ axios.get 대신 fetch 사용
    const response = await fetch(targetUrl, {
      // ✨ 이 fetch 요청은 절대 캐시하지 말라고 명시 (가장 중요)
      // ✨ 이 fetch 요청은 절대 캐시하지 말라고 명시 (가장 중요)
      next: { revalidate: 600 },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    // fetch로 받은 응답에서 HTML 텍스트를 추출
    const data = await response.text();

    const $ = cheerio.load(data);

    const papers: PaperItem[] = [];

    $('.search_list_area .list_wrap .item').each((index, element) => {
      const titleElement = $(element).find('.tit_box .tit > a');
      const authorElement = $(element).find('.info_box .author');

      const title = titleElement.text().trim();
      const link = 'https://www.dbpia.co.kr' + titleElement.attr('href');
      const authors = authorElement.text().trim().split(',').map(name => name.trim());

      if (title && link) {
        papers.push({
          title,
          authors,
          abstract: '크롤링을 통해 가져온 정보입니다.',
          link,
          publishedAt: new Date().toISOString(),
          arxivId: ''
        });
      }
    });

    return getRandomItems(papers, limit);

  } catch (error) {
    console.error('논문 크롤링 실패:', error);
    return [];
  }
}


// 뉴스와 논문을 섞어서 반환하는 새로운 함수 - 반환 타입을 MixedContentItem[]로 수정
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

function parseRSS(xml: string): Omit<NewsItem, 'source'>[] {
  const items: Omit<NewsItem, 'source'>[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const item = match[1];

    let title = item.match(/<title>([\s\S]*?)<\/title>/)?.[1] || '';
    if (title.startsWith('<![CDATA[') && title.endsWith(']]>')) {
      title = title.substring(9, title.length - 3);
    }

    // ✨ description 파싱 로직 전체 삭제

    const link = item.match(/<link>(.*?)<\/link>/)?.[1] || '';
    const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || '';

    items.push({
      title: decodeHTMLEntities(title),
      link,
      // ✨ description 필드 삭제
      publishedAt: pubDate
    });
  }

  return items;
}



function decodeHTMLEntities(text: string): string {
  // 더 많은 HTML 엔티티와 특수 문자 처리
  const entities: { [key: string]: string } = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': "'",
    '&#39;': "'",
    '&nbsp;': ' ',
    '&ldquo;': '"',
    '&rdquo;': '"',
    '&lsquo;': "'",
    '&rsquo;': "'",
    '&hellip;': '...',
    '&mdash;': '—',
    '&ndash;': '–',
    '&copy;': '©',
    '&reg;': '®',
    '&trade;': '™'
  }

  let decodedText = text

  // HTML 엔티티 디코딩
  Object.entries(entities).forEach(([entity, char]) => {
    decodedText = decodedText.replace(new RegExp(entity, 'gi'), char)
  })

  // 숫자 형태의 HTML 엔티티 처리 (예: &#8216; 같은 것들)
  decodedText = decodedText.replace(/&#(\d+);/gi, (match, dec) => {
    return String.fromCharCode(dec)
  })

  // 16진수 형태의 HTML 엔티티 처리 (예: &#x27; 같은 것들)
  decodedText = decodedText.replace(/&#x([0-9a-f]+);/gi, (match, hex) => {
    return String.fromCharCode(parseInt(hex, 16))
  })

  // 특수 따옴표를 일반 따옴표로 변환
  decodedText = decodedText
    .replace(/[''`]/g, "'")  // 모든 종류의 작은따옴표
    .replace(/[""]/g, '"')   // 모든 종류의 큰따옴표
    .replace(/…/g, '...')    // 말줄임표

  // 유니코드 정규화
  return decodedText.normalize('NFC')
}