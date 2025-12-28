// lib/security-feed.ts
import { NewsItem, PaperItem, MixedContentItem } from '../types/security'
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


// Comprehensive Security Keywords & Sources (Top Conferences Only)
const SECURITY_KEYWORDS = [
  // 🏆 Top Tier Conferences (Big 4) & Journals
  'source:"IEEE Symposium on Security and Privacy"',
  'source:"USENIX Security Symposium"',
  'source:"ACM Conference on Computer and Communications Security"',
  'source:"NDSS Symposium"',
  'source:"정보보호학회논문지"', // Top Korean Journal (KIISC)
];

export async function getSecurityPapers(limit: number): Promise<PaperItem[]> {
  try {
    const randomKeyword = SECURITY_KEYWORDS[Math.floor(Math.random() * SECURITY_KEYWORDS.length)];
    const query = encodeURIComponent(randomKeyword);
    const targetUrl = `https://scholar.google.co.kr/scholar?hl=ko&as_sdt=0%2C5&q=${query}&btnG=`;

    const response = await fetch(targetUrl, {
      next: { revalidate: 600 },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
        'Referer': 'https://scholar.google.co.kr/'
      }
    });

    const data = await response.text();

    // Check for blocking
    if (data.includes('recaptcha') || data.includes('detected unusual traffic')) {
      console.error('❌ Google Scholar Blocked Request');
      return [];
    }

    const $ = cheerio.load(data);
    const papers: PaperItem[] = [];

    $('.gs_r.gs_or.gs_scl').each((index, element) => {
      // Fetch all items on the page (usually 10) to create a pool for randomness
      // if (papers.length >= limit) return; <-- Removed to allow full scanning

      const titleElement = $(element).find('.gs_rt');
      const link = titleElement.find('a').attr('href');
      const title = titleElement.text().replace('[PDF]', '').replace('[HTML]', '').trim();
      const metaText = $(element).find('.gs_a').text().trim();
      const abstract = $(element).find('.gs_rs').text().trim() || 'No abstract available.';

      // Extract authors and likely year from meta text (e.g. "Hong, Kim - 2023 - source")
      const metaParts = metaText.split('-');
      const authors = metaParts[0] ? metaParts[0].split(',').map(a => a.trim()) : ['Unknown'];
      const publishedAt = new Date().toISOString(); // Default to now as Scholar dates are fuzzy

      if (title && link) {
        papers.push({
          title,
          authors,
          abstract,
          link,
          publishedAt,
          arxivId: ''
        });
      }
    });

    // ✨ Return random selection from the pool
    return getRandomItems(papers, limit);

  } catch (error) {
    console.error('Google Scholar scraping failed:', error);
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
  ];

  // ✨ 랜덤 섞기 제거하고 고정 순서 반환 (뉴스 2개 -> 논문 1개)
  return mixedContent;
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