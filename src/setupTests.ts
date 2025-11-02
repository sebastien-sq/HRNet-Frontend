/// <reference types="@testing-library/jest-dom" />

import '@testing-library/jest-dom';

// Polyfills pour les APIs Web dans Jest
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

// Mock localStorage pour les tests
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
(globalThis as any).localStorage = localStorageMock as unknown as Storage;
