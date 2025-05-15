import { detectWordPress } from '../../src/utils/platform-detection.js';

describe('WordPress Detection', () => {
  let mockDocument;

  beforeEach(() => {
    // Reset the mock document before each test
    mockDocument = {
      querySelector: jest.fn(),
      getElementsByTagName: jest.fn(),
      querySelectorAll: jest.fn().mockReturnValue([]), // Default to []
    };
  });

  test('should detect WordPress from meta generator tag', () => {
    mockDocument.querySelector.mockImplementation((selector) => {
      if (selector === 'meta[name="generator"]') {
        return { content: 'WordPress 6.4.3' };
      }
      return null;
    });
    // All querySelectorAll calls return [] by default
    const result = detectWordPress(mockDocument);
    expect(result.detected).toBe(true);
    expect(result.confidence).toBeGreaterThanOrEqual(0.8);
    expect(result.version).toBe('6.4.3');
  });

  test('should detect WordPress from wp-content URL', () => {
    mockDocument.querySelectorAll.mockImplementation((selector) => {
      if (selector === 'link[href*="wp-content"], script[src*="wp-content"]') {
        return [
          { href: 'https://example.com/wp-content/themes/twentytwentyfour/style.css' }
        ];
      }
      return [];
    });
    mockDocument.querySelector.mockReturnValue(null);
    const result = detectWordPress(mockDocument);
    expect(result.detected).toBe(true);
    expect(result.confidence).toBeGreaterThanOrEqual(0.7);
  });

  test('should detect WordPress from wp-includes URL', () => {
    mockDocument.querySelectorAll.mockImplementation((selector) => {
      if (selector === 'script[src*="wp-includes"]') {
        return [
          { src: 'https://example.com/wp-includes/js/jquery/jquery.min.js' }
        ];
      }
      return [];
    });
    mockDocument.querySelector.mockReturnValue(null);
    const result = detectWordPress(mockDocument);
    expect(result.detected).toBe(true);
    expect(result.confidence).toBeGreaterThanOrEqual(0.7);
  });

  test('should detect WordPress from wp-json endpoint', () => {
    mockDocument.querySelectorAll.mockImplementation((selector) => {
      if (selector === 'link[href*="wp-json"]') {
        return [
          { href: 'https://example.com/wp-json/wp/v2/posts' }
        ];
      }
      return [];
    });
    mockDocument.querySelector.mockReturnValue(null);
    const result = detectWordPress(mockDocument);
    expect(result.detected).toBe(true);
    expect(result.confidence).toBeGreaterThanOrEqual(0.7);
  });

  test('should return false for non-WordPress site', () => {
    mockDocument.querySelector.mockReturnValue(null);
    mockDocument.querySelectorAll.mockReturnValue([]);
    const result = detectWordPress(mockDocument);
    expect(result.detected).toBe(false);
    expect(result.confidence).toBe(0);
  });

  test('should handle multiple detection methods for higher confidence', () => {
    mockDocument.querySelector.mockImplementation((selector) => {
      if (selector === 'meta[name="generator"]') {
        return { content: 'WordPress 6.4.3' };
      }
      return null;
    });
    mockDocument.querySelectorAll.mockImplementation((selector) => {
      if (selector === 'link[href*="wp-content"], script[src*="wp-content"]') {
        return [
          { href: 'https://example.com/wp-content/themes/twentytwentyfour/style.css' }
        ];
      }
      return [];
    });
    const result = detectWordPress(mockDocument);
    expect(result.detected).toBe(true);
    expect(result.confidence).toBeGreaterThan(0.9);
  });
}); 