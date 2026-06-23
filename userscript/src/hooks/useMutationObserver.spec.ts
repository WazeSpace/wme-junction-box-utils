import { renderHook } from '@testing-library/react';
import { useMutationObserver } from './useMutationObserver';

// Mock the dependencies
jest.mock('usehooks-ts', () => ({
  useEventCallback: jest.fn((callback) => callback),
  useUnmount: jest.fn(),
}));

jest.mock('@/utils', () => ({
  debounce: jest.fn((fn, delay) => {
    // Simple mock that tracks if debounce was called
    const mockDebounced = jest.fn((...args) => {
      // For testing, we'll call the original function immediately
      fn(...args);
    });
    mockDebounced.isDebounced = true;
    mockDebounced.delay = delay;
    return mockDebounced;
  }),
}));

describe('useMutationObserver', () => {
  let mockObserver: { observe: jest.Mock; disconnect: jest.Mock };
  let mockCallback: jest.Mock;
  let targetElement: Element;

  beforeEach(() => {
    mockObserver = {
      observe: jest.fn(),
      disconnect: jest.fn(),
    };

    global.MutationObserver = jest.fn().mockImplementation((callback) => {
      mockObserver.callback = callback;
      return mockObserver;
    });

    mockCallback = jest.fn();
    targetElement = document.createElement('div');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create MutationObserver without debouncing when no delay is provided', () => {
    renderHook(() =>
      useMutationObserver(
        targetElement,
        mockCallback,
        { childList: true },
      )
    );

    expect(global.MutationObserver).toHaveBeenCalledTimes(1);
    expect(mockObserver.observe).toHaveBeenCalledWith(targetElement, { childList: true });
  });

  it('should create MutationObserver with debouncing when delay is provided', () => {
    const { debounce } = require('@/utils');
    
    renderHook(() =>
      useMutationObserver(
        targetElement,
        mockCallback,
        { childList: true },
        100,
      )
    );

    expect(debounce).toHaveBeenCalledWith(mockCallback, 100);
    expect(global.MutationObserver).toHaveBeenCalledTimes(1);
    expect(mockObserver.observe).toHaveBeenCalledWith(targetElement, { childList: true });
  });

  it('should not apply debouncing when delay is 0', () => {
    const { debounce } = require('@/utils');
    
    renderHook(() =>
      useMutationObserver(
        targetElement,
        mockCallback,
        { childList: true },
        0,
      )
    );

    expect(debounce).not.toHaveBeenCalled();
  });

  it('should not apply debouncing when delay is negative', () => {
    const { debounce } = require('@/utils');
    
    renderHook(() =>
      useMutationObserver(
        targetElement,
        mockCallback,
        { childList: true },
        -10,
      )
    );

    expect(debounce).not.toHaveBeenCalled();
  });

  it('should disconnect observer when target is null', () => {
    const { rerender } = renderHook(
      ({ target }) =>
        useMutationObserver(
          target,
          mockCallback,
          { childList: true },
        ),
      { initialProps: { target: targetElement } }
    );

    expect(mockObserver.observe).toHaveBeenCalledWith(targetElement, { childList: true });

    rerender({ target: null });

    expect(mockObserver.disconnect).toHaveBeenCalled();
  });
});