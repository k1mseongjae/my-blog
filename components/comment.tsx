// To enable comments:
// 1. Uncomment this component
// 2. Update repo, repoId, and categoryId with your own giscus settings
// 3. Visit https://giscus.app to get your settings
'use client'
import Giscus from '@giscus/react'


export default function Comment() {
  return (
    <Giscus
      id="comments"
      repo="k1mseongjae/my-blog" 
      repoId="R_kgDOONPcHA"
      category="Announcements"
      categoryId="DIC_kwDOONPcHM4CoYKI"
      mapping="pathname"
      strict="0"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme="preferred_color_scheme"
      lang="ko"
      loading="lazy"
    />
  )
}
