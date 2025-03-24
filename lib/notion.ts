const NOTION_API_KEY = process.env.NOTION_API_KEY;
const DATABASE_ID = process.env.NOTION_DATABASE_ID;
const notionHeaders = {
  Authorization: `Bearer ${NOTION_API_KEY}`,
  "Notion-Version": "2022-06-28",
  "Content-Type": "application/json",
};

export async function fetchPostsFromNotion() {
  const res = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
    method: "POST",
    headers: notionHeaders,
  });

  if (!res.ok) throw new Error("❌ Notion fetch 실패");

  const data = await res.json();

  // 페이지 돌면서 블록까지 fetch
  const posts = await Promise.all(
    data.results.map(async (page: any) => {
      // block 불러오기
      const blocksRes = await fetch(`https://api.notion.com/v1/blocks/${page.id}/children`, {
        headers: notionHeaders,
      });
      const blocksData = await blocksRes.json();

      return {
        id: page.id,
        title: page.properties.Name?.title[0]?.plain_text || 'No Title',
        slug: page.properties.slug?.rich_text[0]?.plain_text || 'no-slug',
        date: page.properties.Date?.date?.start || 'no-date',
        category: page.properties.category?.select?.name || 'no-category',
        description: page.properties.description?.rich_text[0]?.plain_text || 'no description',
        content: { blocks: blocksData.results || [] }, // blocks 추가!
      };
    })
  );

  return posts;
}
