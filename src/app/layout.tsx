import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'OCR Assessment System',
  description: 'Programming assessment system for OCR',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
