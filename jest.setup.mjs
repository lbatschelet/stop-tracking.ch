import '@testing-library/jest-dom'

// Extend Jest matchers with custom DOM matchers
global.expect.extend({
  toBeInTheDocument(received) {
    const pass = received !== null
    return {
      message: () => `expected ${received} ${pass ? 'not ' : ''}to be in the document`,
      pass,
    }
  },
  toHaveClass(received, className) {
    const pass = received.classList.contains(className)
    return {
      message: () => `expected ${received} ${pass ? 'not ' : ''}to have class "${className}"`,
      pass,
    }
  },
}) 