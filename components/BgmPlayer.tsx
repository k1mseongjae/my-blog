'use client'

import { useRef, useState } from 'react'

export default function BgmPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)

  const togglePlay = () => {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setPlaying(!playing)
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 bg-white/80 backdrop-blur shadow-md rounded-full px-4 py-2 flex items-center gap-3 border border-gray-300 dark:bg-gray-900/80 dark:border-gray-700">
      <audio ref={audioRef} loop>
        <source src={src} type="audio/mpeg" />
        브라우저가 오디오 태그를 지원하지 않습니다.
      </audio>

      <button onClick={togglePlay}>
        {playing ? '⏸ 멈춤' : '▶️ 재생'}
      </button>

      <span className="text-sm text-gray-800 dark:text-gray-200 font-medium">BGM</span>
    </div>
  )
}
