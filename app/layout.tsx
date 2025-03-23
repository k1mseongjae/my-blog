import './global.css'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Navbar } from 'components/nav'
import Footer from 'components/footer'
import { baseUrl } from './sitemap'
import { ThemeProvider } from 'next-themes'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'k1mseongjae\'s world',
    template: '%s | k1mseongjae\'s world',
  },
  description: 'Coding, writing, and sharing stories about development, technology, and daily life.',
  openGraph: {
    title: 'Hello !',
    description: 'This is my personal blog !',
    url: baseUrl,
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
        GeistMono.variable
      )}
    >
      <body className="antialiased max-w-xl mx-4 mt-8 sm:mx-auto text-black bg-white dark:text-white dark:bg-black">
        <ThemeProvider attribute='class' defaultTheme='light' >
          <main className="flex-auto min-w-0 mt-6 flex flex-col px-2 md:px-0">
            <Navbar />
            {children}
            <Footer />
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
