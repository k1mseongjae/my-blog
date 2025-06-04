const NOTION_API_KEY = process.env.NOTION_API_KEY;
const DATABASE_ID = process.env.NOTION_DATABASE_ID;
const notionHeaders = {
  Authorization: `Bearer ${NOTION_API_KEY}`,
  "Notion-Version": "2022-06-28",
  "Content-Type": "application/json",
};

export async function fetchBlockChildren(blockId: string): Promise<any[]> {
  const res = await fetch(`https://api.notion.com/v1/blocks/${blockId}/children`, {
    headers: notionHeaders,
  });
  const data = await res.json();

  const childrenWithNested = await Promise.all(data.results.map(async (child: any) => {
    if (child.has_children) {
      const nestedChildren = await fetchBlockChildren(child.id);
      return { ...child, children: nestedChildren };
    }
    return child;
  }));

  return childrenWithNested;
}

async function fetchPageBlocks(pageId: string) {
  let results: any[] = [];
  let cursor: string | undefined = undefined;

  do {
    const res = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children${cursor ? `?start_cursor=${cursor}` : ''}`, {
      headers: notionHeaders,
    });
    const data = await res.json();
    results = results.concat(data.results);
    cursor = data.has_more ? data.next_cursor : undefined;
  } while (cursor);

  const blocksWithChildren = await Promise.all(results.map(async (block: any) => {
    if (block.has_children) {
      const children = await fetchBlockChildren(block.id);
      return { ...block, children };
    }
    return block;
  }));

  return blocksWithChildren;
}

// 메타데이터만 가져오는 함수 (목록 페이지용)
export async function fetchPostsMetadata() {
  const res = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
    method: "POST",
    headers: notionHeaders,
    next: { revalidate: 60 }, // 1분 캐싱
  });

  if (!res.ok) throw new Error("❌ Notion fetch 실패");

  const data = await res.json();

  const posts = data.results.map((page: any) => ({
    id: page.id,
    title: page.properties.Name?.title[0]?.plain_text || 'No Title',
    slug: page.properties.slug?.rich_text[0]?.plain_text || 'no-slug',
    date: page.properties.Date?.date?.start || 'no-date',
    category: page.properties.category?.select?.name || 'no-category',
    description: page.properties.description?.rich_text[0]?.plain_text || 'no description',
    image: page.properties.image?.files[0]?.file?.url || page.properties.image?.files[0]?.external?.url || null,
    bgm: page.properties.bgm?.rich_text?.[0]?.plain_text || null,
  }));

  return posts;
}

// 단일 포스트의 전체 콘텐츠를 가져오는 함수 (개별 포스트 페이지용)
export async function fetchSinglePost(slug: string) {
  // 먼저 slug로 페이지 ID 찾기
  const res = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
    method: "POST",
    headers: notionHeaders,
    body: JSON.stringify({
      filter: {
        property: "slug",
        rich_text: {
          equals: slug
        }
      }
    }),
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error("❌ Notion fetch 실패");

  const data = await res.json();
  const page = data.results[0];

  if (!page) return null;

  // 메타데이터 추출
  const post: any = {
    id: page.id,
    title: page.properties.Name?.title[0]?.plain_text || 'No Title',
    slug: page.properties.slug?.rich_text[0]?.plain_text || 'no-slug',
    date: page.properties.Date?.date?.start || 'no-date',
    category: page.properties.category?.select?.name || 'no-category',
    description: page.properties.description?.rich_text[0]?.plain_text || 'no description',
    image: page.properties.image?.files[0]?.file?.url || page.properties.image?.files[0]?.external?.url || null,
    bgm: page.properties.bgm?.rich_text?.[0]?.plain_text || null,
    content: { blocks: [] as any[] },
  };

  // content 필드에서 Notion 페이지 URL 확인
  const notionPageUrl = page.properties.content?.rich_text[0]?.plain_text;
  
  if (notionPageUrl) {
    const pageIdMatch = notionPageUrl.match(/([a-f0-9]{32})/);
    const pageIdFromUrl = pageIdMatch ? pageIdMatch[1] : null;
    
    if (pageIdFromUrl) {
      const blocks = await fetchPageBlocks(pageIdFromUrl);
      post.content = { blocks };
    }
  }

  return post;
}

// 기존 함수 (이전 버전과의 호환성을 위해 유지, 하지만 사용하지 않음)
export async function fetchPostsFromNotion() {
  console.warn('fetchPostsFromNotion은 성능 문제로 사용하지 않는 것을 권장합니다. fetchPostsMetadata를 사용하세요.');
  return fetchPostsMetadata();
}