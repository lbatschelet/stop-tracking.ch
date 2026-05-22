import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
}

export default async () => {
  const config = await createJestConfig(customJestConfig)()
  config.moduleNameMapper = {
    '^@react-pdf/renderer$': '<rootDir>/src/pdf/__mocks__/reactPdfRenderer.ts',
    '^@/pdf/downloadZinePdf$': '<rootDir>/src/pdf/__mocks__/downloadZinePdf.ts',
    ...config.moduleNameMapper,
  }
  return config
}
