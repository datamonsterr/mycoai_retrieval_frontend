import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ConfidenceBar } from '@/components/ConfidenceBar'

describe('ConfidenceBar', () => {
  test.each([0.91, 0.5])('renders score %.2f and bar', (score) => {
    render(<ConfidenceBar score={score} />)
    expect(screen.getByText(score.toFixed(2))).toBeInTheDocument()
  })

  test.each([
    [0.85, 'emerald'],
    [0.7, 'amber'],
    [0.5, 'orange'],
    [0.2, 'red'],
  ])('score %.2f uses %s color class', (score, colorClass) => {
    render(<ConfidenceBar score={score} />)
    expect(screen.getByTestId('confidence-fill').className).toContain(colorClass)
  })

  test('bar width matches percent', () => {
    render(<ConfidenceBar score={0.73} />)
    expect(screen.getByTestId('confidence-fill')).toHaveStyle({ width: '73%' })
  })
})
