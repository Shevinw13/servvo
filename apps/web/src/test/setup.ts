import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Framer Motion to avoid animation timing issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    span: 'span',
    button: 'button',
    p: 'p',
    h1: 'h1',
    h2: 'h2',
    section: 'section',
    ul: 'ul',
    li: 'li',
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  useAnimation: () => ({ start: () => {} }),
  useInView: () => true,
}));
