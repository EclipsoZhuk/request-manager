export type StatisticsRegion = {
	id: string
	label: string
	totalExpense: number
	remainingLimit: number
}

export type PaymentGoalStatistics = {
	id: string
	title: string
	values: Record<string, number>
}

const REGION_NAMES = [
	'Регион 222',
	'Регион Альфа',
	'Регион Бета',
	'Регион Гамма',
	'Регион Дельта',
	'Регион Эпсилон',
	'Регион Зета',
	'Регион Эта',
	'Регион Тета',
	'Регион Йота'
]

export const MOCK_STATISTICS_REGIONS: StatisticsRegion[] = REGION_NAMES.map(
	(label, index) => ({
		id: `region-${index + 1}`,
		label,
		totalExpense: [1000, 2000, 3000][index % 3],
		remainingLimit: [4000, 3000, 2000][index % 3]
	})
)

export const MOCK_PAYMENT_GOALS: PaymentGoalStatistics[] = Array.from(
	{ length: 24 },
	(_, rowIndex) => {
		const values = Object.fromEntries(
			MOCK_STATISTICS_REGIONS.map((region, regionIndex) => [
				region.id,
				rowIndex < 2 && regionIndex === 0 ? 1155 : 50 + regionIndex * 10
			])
		) as Record<string, number>

		return {
			id: `payment-goal-${rowIndex + 1}`,
			title:
				rowIndex % 4 === 0
					? 'Оплата за Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum'
					: 'Оплата за Lorem Ipsum Lorem Ipsum Lorem Ipsum',
			values
		}
	}
)

export function getMockStatistics() {
	return {
		regions: MOCK_STATISTICS_REGIONS,
		paymentGoals: MOCK_PAYMENT_GOALS
	}
}
