import { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig: Config = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jsdom', 
  collectCoverage: true,
  coverageReporters: ["json", "lcov", "text", "html"],

  testMatch: [
    "<rootDir>/__tests__/**/*.[jt]s?(x)",
    "<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}"
  ],

  testPathIgnorePatterns: [
    "<rootDir>/tests/"
  ],
};

export default createJestConfig(customJestConfig);