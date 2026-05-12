import { describe, expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Lightbox } from '@/components/Lightbox'

describe('Lightbox', () => {
  test('renders image and caption', () => {
    render(
      <Lightbox
        src="https://placehold.co/256/png"
        alt="Test image"
        caption="PC-104 · MEA"
        onClose={() => {}}
      />
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://placehold.co/256/png')
    expect(screen.getByText('PC-104 · MEA')).toBeInTheDocument()
  })

  test('calls onClose when backdrop clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <Lightbox
        src="https://placehold.co/256/png"
        alt="Test"
        caption="Caption"
        onClose={onClose}
      />
    )
    await user.click(screen.getByRole('dialog'))
    expect(onClose).toHaveBeenCalled()
  })

  test('calls onClose when close button clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <Lightbox
        src="https://placehold.co/256/png"
        alt="Test"
        caption="Caption"
        onClose={onClose}
      />
    )
    await user.click(screen.getByLabelText('Close image preview'))
    expect(onClose).toHaveBeenCalled()
  })
})
