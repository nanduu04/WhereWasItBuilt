import { detectReact } from '../../src/utils/platform-detection.js';

describe('React Detection', () => {
  let mockDocument;
  let originalWindow;

  beforeEach(() => {
    // Save original window
    originalWindow = global.window;
    
    // Reset mock document before each test
    mockDocument = {
      querySelector: jest.fn().mockReturnValue(null),
      querySelectorAll: jest.fn().mockReturnValue([])
    };

    // Create a fresh window object for each test
    global.window = {
      __REACT_DEVTOOLS_GLOBAL_HOOK__: undefined
    };
  });

  afterEach(() => {
    // Restore original window
    global.window = originalWindow;
  });

  test('should detect React via DevTools hook', () => {
    global.window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
      renderers: new Map([[1, { version: '18.2.0' }]])
    };

    const result = detectReact(mockDocument);
    expect(result.detected).toBe(true);
    expect(result.confidence).toBeGreaterThanOrEqual(0.9);
    expect(result.version).toBe('18.2.0');
    expect(result.methods).toContain('react_devtools');
  });

  test('should detect React via root element', () => {
    mockDocument.querySelector.mockImplementation((selector) => {
      if (selector === '[data-reactroot]') {
        return { tagName: 'DIV' };
      }
      return null;
    });

    const result = detectReact(mockDocument);
    expect(result.detected).toBe(true);
    expect(result.confidence).toBeGreaterThanOrEqual(0.8);
    expect(result.methods).toContain('react_root');
  });

  test('should detect React via script sources', () => {
    mockDocument.querySelectorAll.mockImplementation((selector) => {
      if (selector === 'script[src*="react"]') {
        return [
          { src: 'https://unpkg.com/react@18.2.0/umd/react.production.min.js' }
        ];
      }
      return [];
    });

    const result = detectReact(mockDocument);
    expect(result.detected).toBe(true);
    expect(result.confidence).toBeGreaterThanOrEqual(0.7);
    expect(result.version).toBe('18.2.0');
    expect(result.methods).toContain('react_scripts');
  });

  test('should detect React via class names', () => {
    mockDocument.querySelectorAll.mockImplementation((selector) => {
      if (selector === '[class*="react-"]') {
        return [
          { className: 'react-component' },
          { className: 'react-container' }
        ];
      }
      return [];
    });

    const result = detectReact(mockDocument);
    expect(result.detected).toBe(true);
    expect(result.confidence).toBeGreaterThanOrEqual(0.6);
    expect(result.methods).toContain('react_classes');
  });

  test('should combine multiple detection methods', () => {
    // Set up DevTools hook
    global.window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
      renderers: new Map([[1, { version: '18.2.0' }]])
    };

    // Set up root element
    mockDocument.querySelector.mockImplementation((selector) => {
      if (selector === '[data-reactroot]') {
        return { tagName: 'DIV' };
      }
      return null;
    });

    // Set up script and class detection
    mockDocument.querySelectorAll.mockImplementation((selector) => {
      if (selector === 'script[src*="react"]') {
        return [
          { src: 'https://unpkg.com/react@18.2.0/umd/react.production.min.js' }
        ];
      }
      if (selector === '[class*="react-"]') {
        return [{ className: 'react-component' }];
      }
      return [];
    });

    const result = detectReact(mockDocument);
    expect(result.detected).toBe(true);
    expect(result.confidence).toBe(1);
    expect(result.version).toBe('18.2.0');
    expect(result.methods).toContain('react_devtools');
    expect(result.methods).toContain('react_root');
    expect(result.methods).toContain('react_scripts');
    expect(result.methods).toContain('react_classes');
  });

  test('should not detect React when no indicators are present', () => {
    // Ensure all mocks return empty/null values
    mockDocument.querySelector.mockReturnValue(null);
    mockDocument.querySelectorAll.mockReturnValue([]);
    global.window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = undefined;

    const result = detectReact(mockDocument);
    expect(result.detected).toBe(false);
    expect(result.confidence).toBe(0);
    expect(result.version).toBeNull();
    expect(result.methods).toHaveLength(0);
  });

  test('should handle missing window object', () => {
    delete global.window;
    const result = detectReact(mockDocument);
    expect(result.detected).toBe(false);
    expect(result.confidence).toBe(0);
  });

  test('should handle DevTools hook without version', () => {
    global.window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
      renderers: new Map([[1, {}]])
    };

    const result = detectReact(mockDocument);
    expect(result.detected).toBe(true);
    expect(result.confidence).toBeGreaterThanOrEqual(0.9);
    expect(result.version).toBeNull();
    expect(result.methods).toContain('react_devtools');
  });

  test('should handle script source without version', () => {
    mockDocument.querySelectorAll.mockImplementation((selector) => {
      if (selector === 'script[src*="react"]') {
        return [
          { src: 'https://unpkg.com/react/umd/react.production.min.js' }
        ];
      }
      return [];
    });

    const result = detectReact(mockDocument);
    expect(result.detected).toBe(true);
    expect(result.confidence).toBeGreaterThanOrEqual(0.7);
    expect(result.version).toBeNull();
    expect(result.methods).toContain('react_scripts');
  });
}); 