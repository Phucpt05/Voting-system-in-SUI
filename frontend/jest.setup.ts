import '@testing-library/jest-dom';
import * as React from 'react';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver
(globalThis as any).ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
(globalThis as any).IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock @mysten/dapp-kit
jest.mock('@mysten/dapp-kit', () => ({
  ConnectButton: ({ connectText, className }: { connectText?: string; className?: string }) =>
    React.createElement('button', { className, 'data-testid': 'connect-button' }, connectText || 'Connect Wallet'),
  useCurrentWallet: jest.fn(() => ({
    currentWallet: null,
    connectionStatus: 'disconnected',
    isConnected: false,
    isDisconnected: true,
  })),
  useSignAndExecuteTransaction: jest.fn(() => ({
    mutate: jest.fn(),
    isPending: false,
    isSuccess: false,
    reset: jest.fn(),
  })),
  useSuiClient: jest.fn(() => ({
    waitForTransaction: jest.fn(),
    queryEvents: jest.fn(),
  })),
  useSuiClientQuery: jest.fn(),
  useCurrentAccount: jest.fn(() => null),
  WalletProvider: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children),
  SuiClientProvider: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children),
}));

// Mock @mysten/sui
jest.mock('@mysten/sui/transactions', () => ({
  Transaction: jest.fn().mockImplementation(() => ({
    moveCall: jest.fn().mockReturnThis(),
    object: jest.fn().mockReturnThis(),
    pure: {
      string: jest.fn().mockReturnThis(),
      u64: jest.fn().mockReturnThis(),
      bool: jest.fn().mockReturnThis(),
    },
  })),
}));

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: jest.fn((message: string) => message),
  ToastContainer: () => null,
}));

