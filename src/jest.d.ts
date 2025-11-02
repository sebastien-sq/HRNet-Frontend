/// <reference types="@testing-library/jest-dom" />

declare global {
  namespace jest {
    interface Matchers<R = void> {
      toBeInTheDocument(): R;
    }
  }
}

export {};

