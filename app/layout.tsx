import './global.css'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Navbar } from 'components/nav'
import Footer from 'components/footer'
import GlobalClickEffect from '@/components/global-click-effect'
import { Inter } from 'next/font/google'
import { Noto_Sans_KR } from 'next/font/google'
import Providers from '@/components/providers'


export const metadata: Metadata = {
  metadataBase: new URL('https://k1mseongjae.com'),
  title: {
    default: 'k1mseongjae\'s world',
    template: '%s | k1mseongjae\'s world',
  },
  description: 'Coding, writing, and sharing stories about development, technology, and daily life.',
  openGraph: {
    title: 'Hello !',
    description: 'This is my personal blog !',
    url: 'https://k1mseongjae.com',
    siteName: 'k1mseongjae\'s world',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/profile.png',
        width: 800,
        height: 600,
        alt: '프로필 이미지',
      }
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/profile.png'],
  },
  icons: {
    icon: '/profile.png',
    apple: '/profile.png',
  },
}

const cx = (...classes) => classes.filter(Boolean).join(' ')

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cx(
        GeistSans.variable,
        GeistMono.variable,
        inter.variable,
        notoSansKr.variable
      )}
    >
      <body className="antialiased max-w-xl mx-4 mt-8 sm:mx-auto text-black bg-white dark:text-white dark:bg-black">
        <GlobalClickEffect />
        <Providers>
          <main className="flex-auto min-w-0 mt-6 flex flex-col px-2 md:px-0">
            <Navbar />
            {children}
            <Footer />
          </main>
        </Providers>
      </body>
    </html>
  )
}

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '700'], // 필요하면 weight 추가
  variable: '--font-noto',
})

