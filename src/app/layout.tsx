import type { Metadata } from 'next'
import { Nunito_Sans } from 'next/font/google'

import './globals.css'

const SITE_NAME = 'Request Manager'

const nunitoSans = Nunito_Sans({
	variable: '--font-nunito-sans',
	subsets: ['latin', 'cyrillic'],
	display: 'swap'
})

export const metadata: Metadata = {
	title: {
		default: SITE_NAME,
		template: `%s | ${SITE_NAME}`
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
			className={`${nunitoSans.variable} antialiased`}
		>
			<body>{children}</body>
		</html>
	)
}
