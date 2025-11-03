/// <reference types="@testing-library/jest-dom" />

import '@testing-library/jest-dom';

// Polyfills pour les APIs Web dans Jest
// TextEncoder et TextDecoder sont disponibles dans l'environnement Node.js/Jest
if (typeof globalThis.TextEncoder === 'undefined') {
  // @ts-expect-error - require est disponible dans l'environnement Node.js/Jest
  const { TextEncoder, TextDecoder } = require('util');
  (globalThis as any).TextEncoder = TextEncoder;
  (globalThis as any).TextDecoder = TextDecoder;
}

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
(globalThis as any).ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));