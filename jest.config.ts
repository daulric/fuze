import type {Config} from 'jest';
import nextJest from "next/jest"

const createJestConfig = nextJest({
    dir: './',
})

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
  },

  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/*.config.js', // Add the files you want to ignore
    '<rootDir>/*.config.mjs',
  ],
  verbose: true,
  preset: 'ts-jest',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },

};

export default createJestConfig(config);
