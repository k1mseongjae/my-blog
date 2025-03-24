const NOTION_API_KEY = process.env.NOTION_API_KEY;
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

export async function fetchPostsFromNotion() {
  const res = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${NOTION_API_KEY}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json"
    }
  });

  if (!res.ok) throw new Error("❌ Notion fetch 실패");

  const data = await res.json();

  return data.results.map((page: any) => ({
    id: page.id,
    title: page.properties.title.title[0].plain_text,
    slug: page.properties.slug.rich_text[0].plain_text,
    date: page.properties.date.date.start,
    category: page.properties.category.rich_text[0].plain_text,
    description: page.properties.description.rich_text[0].plain_text,
  }));
}
