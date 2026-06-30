import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'
import { Providers } from './providers'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin', 'cyrillic']
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin', 'cyrillic']
})

export const metadata: Metadata = {
	title: {
		default: 'Request Manager',
		template: '%s | Request Manager'
	},
	description: 'Система управления заявками'
}

type RootLayoutProps = Readonly<{
	children: React.ReactNode
}>

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<html
			lang='ru'
			className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			suppressHydrationWarning
		>
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}
