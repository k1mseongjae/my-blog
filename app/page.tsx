// app/page.tsx
import ClientHome from '@/components/clienthome'
import { getMixedSecurityContent } from '@/lib/security-feed'

export const dynamic = 'force-dynamic';

export default async function Page() {
  // 뉴스와 논문을 섞어서 3개 가져오기
  const mixedContent = await getMixedSecurityContent(3)

  return <ClientHome mixedContent={mixedContent} />
}