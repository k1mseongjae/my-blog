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



export async function fetchPostsFromNotion() {
  const res = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
    method: "POST",
    headers: notionHeaders,
    next: { revalidate: 0 },
  });

  if (!res.ok) throw new Error("❌ Notion fetch 실패");

  const data = await res.json();

  const posts = await Promise.all(
    data.results.map(async (page: any) => {
      const notionPageUrl = page.properties.content?.rich_text[0]?.plain_text;
      let blocks: any[] = [];

      
      // content 칸에 notion page url이 있다면 해당 페이지 블록 가져오기
      if (notionPageUrl) {
        const pageIdMatch = notionPageUrl.match(/([a-f0-9]{32})/);
        const pageIdFromUrl = pageIdMatch ? pageIdMatch[1] : null;
        if (pageIdFromUrl) {
          blocks = await fetchPageBlocks(pageIdFromUrl);
        }
      }

      return {
        id: page.id,
        title: page.properties.Name?.title[0]?.plain_text || 'No Title',
        slug: page.properties.slug?.rich_text[0]?.plain_text || 'no-slug',
        date: page.properties.Date?.date?.start || 'no-date',
        category: page.properties.category?.select?.name || 'no-category',
        description: page.properties.description?.rich_text[0]?.plain_text || 'no description',
        content: { blocks }, // children까지 다 채워진 상태
        bgm: page.properties.bgm?.rich_text?.[0]?.plain_text || null, 
      };
    })
  );

  return posts;
}
