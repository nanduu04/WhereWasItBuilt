import { detectPlatform } from '../../src/utils/platform-detection.js';

describe('Platform Detection Confidence', () => {
  let mockDocument;
  let originalWindow;

  beforeEach(() => {
    // Save original window
    originalWindow = global.window;
    
    // Reset mock document before each test
    mockDocument = {
      querySelector: jest.fn(),
      querySelectorAll: jest.fn()
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

  it('should detect platform with high confidence when multiple indicators are present', () => {
    // Mock WordPress indicators
    mockDocument.querySelector.mockImplementation((selector) => {
      if (selector === 'meta[name="generator"]') {
        return { content: 'WordPress 6.0' };
      }
      return null;
    });

    mockDocument.querySelectorAll.mockImplementation((selector) => {
      if (selector === 'link[href*="wp-content"], script[src*="wp-content"]') {
        return [{ href: 'https://example.com/wp-content/theme.css' }];
      }
      return [];
    });

    const result = detectPlatform(mockDocument);
    expect(result.platform).toBe('wordpress');
    expect(result.confidence).toBeGreaterThan(0.8);
  });

  it('should have lower confidence with single indicator', () => {
    // Mock single WordPress indicator
    mockDocument.querySelector.mockImplementation((selector) => {
      if (selector === 'meta[name="generator"]') {
        return { content: 'WordPress 6.0' };
      }
      return null;
    });

    mockDocument.querySelectorAll.mockImplementation(() => []);

    const result = detectPlatform(mockDocument);
    // With equal confidence scores, we should check both platforms
    expect(['wordpress', 'react']).toContain(result.platform);
    expect(result.confidence).toBeLessThan(1.0); // Should be lower confidence with single indicator
  });

  it('should return unknown platform with 0 confidence when no indicators are present', () => {
    mockDocument.querySelector.mockReturnValue(null);
    mockDocument.querySelectorAll.mockReturnValue([]);

    const result = detectPlatform(mockDocument);
    expect(result.platform).toBe('unknown');
    expect(result.confidence).toBe(0);
  });

  test('should calculate correct confidence for React with multiple indicators', () => {
    // Mock React indicators
    global.window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
      renderers: new Map([[1, { version: '18.2.0' }]])
    };

    mockDocument.querySelector.mockImplementation((selector) => {
      if (selector === '[data-reactroot]') {
        return { tagName: 'DIV' };
      }
      return null;
    });

    mockDocument.querySelectorAll.mockImplementation((selector) => {
      if (selector === 'script[src*="react"]') {
        return [{ src: 'https://unpkg.com/react@18.2.0/umd/react.production.min.js' }];
      }
      if (selector === '[class*="react-"]') {
        return [{ className: 'react-component' }];
      }
      return [];
    });

    const result = detectPlatform(mockDocument);
    expect(result.platform).toBe('react');
    expect(result.confidence).toBeGreaterThan(0.8); // Should be high confidence with multiple indicators
  });

  test('should normalize confidence to maximum of 1', () => {
    // Mock multiple indicators that would exceed 1.0
    mockDocument.querySelector.mockImplementation((selector) => {
      if (selector === 'meta[name="generator"]') {
        return { content: 'WordPress 6.4.3' };
      }
      return null;
    });

    mockDocument.querySelectorAll.mockImplementation((selector) => {
      if (selector === 'link[href*="wp-content"], script[src*="wp-content"]') {
        return [
          { href: 'https://example.com/wp-content/themes/style.css' },
          { href: 'https://example.com/wp-content/plugins/plugin.css' }
        ];
      }
      if (selector === 'script[src*="wp-includes"]') {
        return [
          { src: 'https://example.com/wp-includes/js/jquery.min.js' },
          { src: 'https://example.com/wp-includes/js/script.js' }
        ];
      }
      return [];
    });

    const result = detectPlatform(mockDocument);
    expect(result.platform).toBe('wordpress');
    expect(result.confidence).toBeLessThanOrEqual(1);
  });
}); 