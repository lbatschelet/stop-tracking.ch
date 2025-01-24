/// <reference types="@testing-library/jest-dom" />
import { fireEvent, render, screen } from '@testing-library/react';
import HideAndSeek from './HideAndSeek';

describe('HideAndSeek Component', () => {
  it('should initially show a hidden button', () => {
    render(<HideAndSeek />)
    const hiddenButton = screen.getByRole('button', { name: /find/i })
    expect(hiddenButton).toBeInTheDocument()
    expect(hiddenButton).toHaveClass('opacity-0')
  })

  it('should make the button visible when mouse is nearby', () => {
    // Mock window dimensions
    Object.defineProperty(window, 'innerWidth', { value: 1000 })
    Object.defineProperty(window, 'innerHeight', { value: 1000 })
    
    const { container } = render(<HideAndSeek />)
    const hiddenButton = screen.getByRole('button', { name: /find/i })
    
    // Get button position from style
    const buttonStyle = window.getComputedStyle(hiddenButton)
    const left = parseFloat(buttonStyle.left)
    const top = parseFloat(buttonStyle.top)
    
    // Move mouse near the button's position
    fireEvent.mouseMove(container, { 
      clientX: (left / 100) * window.innerWidth,
      clientY: (top / 100) * window.innerHeight
    })
    
    expect(hiddenButton).toHaveClass('opacity-100')
  })
}) 