import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin', 'cyrillic']
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin', 'cyrillic']
})

export const metadata: Metadata = {
	title: 'Request Manager',
	description: 'Система управления заявками'
}

type RootLayoutProps = {
	children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<html
			lang='ru'
			className={`${geistSans.variable} ${geistMono.variable}`}
		>
			<body>{children}</body>
		</html>
	)
}
