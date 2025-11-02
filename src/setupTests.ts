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

// Polyfills pour Radix UI dans jsdom
// Radix UI utilise des API qui ne sont pas supportées par jsdom
if (typeof Element !== 'undefined') {
  // Polyfill pour hasPointerCapture
  if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = function() {
      return false;
    };
  }
  
  // Polyfill pour setPointerCapture
  if (!Element.prototype.setPointerCapture) {
    Element.prototype.setPointerCapture = function() {
      // No-op
    };
  }
  
  // Polyfill pour releasePointerCapture
  if (!Element.prototype.releasePointerCapture) {
    Element.prototype.releasePointerCapture = function() {
      // No-op
    };
  }
  
  // Polyfill pour scrollIntoView si nécessaire
  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = function() {
      // No-op
    };
  }
}

// Mock pour ResizeObserver utilisé par certains composants
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));