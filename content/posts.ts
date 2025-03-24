import post1 from '../notion-data/1c067034-7811-809f-a639-f46047ff4ea4.json'
import post2 from '../notion-data/127ce18c-fd83-805c-bebd-d6772e18bf02.json'

const posts = [
  {
    title: post1.properties.title.title[0].plain_text,
    slug: "first-post",
    content: post1,
    date: "2025-03-23",
    category: "daily",
    description: "위대한 첫 발걸음ㄷㄷㄷ",
    image: undefined
  },
  {
    title: "Naver Search Bar UX: Analysis and Implementation Guide",
    slug: "naver-search-bar-ux",
    content: post2,
    date: "2023-10-23",
    category: "study",
    description: "Explore the UX analysis of Naver's search bar and strategies for replicating its features. The post examines the UX triggers, selection of search results, and the refreshing of result lists. It also compares coding approaches for implementing search bar functionalities, aiming for a concise and effective execution.",
    image: undefined
  }
] as Post[];

export default posts;

export type Post = {
  title: string;
  slug: string;
  content: { blocks: any[] };
  date: string;
  category: string;
  description: string;
  image?: string;
};
