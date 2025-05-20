import { detectShopify } from '../../src/utils/platform-detection.js';

describe('Shopify Detection', () => {
  let mockDocument;
  let originalWindow;

  beforeEach(() => {
    // Save original window
    originalWindow = global.window;
    
    // Reset mock document before each test
    mockDocument = {
      querySelector: jest.fn().mockReturnValue(null),
      querySelectorAll: jest.fn().mockReturnValue([]),
      cookie: ''
    };

    // Create a fresh window object for each test
    global.window = {
      Shopify: undefined
    };
  });

  afterEach(() => {
    // Restore original window
    global.window = originalWindow;
  });

  test('should detect Shopify via meta tag', () => {
    mockDocument.querySelector.mockImplementation((selector) => {
      if (selector === 'meta[name="shopify-checkout-api-token"]') {
        return { content: 'some-token' };
      }
      return null;
    });

    const result = detectShopify(mockDocument);
    expect(result.detected).toBe(true);
    expect(result.confidence).toBeGreaterThanOrEqual(0.9);
    expect(result.methods).toContain('shopify_meta');
  });

  test('should detect Shopify via JavaScript variable', () => {
    global.window.Shopify = {
      theme: { version: '2.0.0' }
    };

    const result = detectShopify(mockDocument);
    expect(result.detected).toBe(true);
    expect(result.confidence).toBeGreaterThanOrEqual(0.9);
    expect(result.version).toBe('2.0.0');
    expect(result.methods).toContain('shopify_js');
  });

  test('should detect Shopify via CSS classes', () => {
    mockDocument.querySelectorAll.mockImplementation((selector) => {
      if (selector === '[class*="shopify-"], [class*="shopify-section"]') {
        return [
          { className: 'shopify-section-header' },
          { className: 'shopify-section-footer' }
        ];
      }
      return [];
    });

    const result = detectShopify(mockDocument);
    expect(result.detected).toBe(true);
    expect(result.confidence).toBeGreaterThanOrEqual(0.8);
    expect(result.methods).toContain('shopify_classes');
  });

  test('should detect Shopify via URLs', () => {
    mockDocument.querySelectorAll.mockImplementation((selector) => {
      if (selector === 'link[href*="shopify"], script[src*="shopify"]') {
        return [
          { href: 'https://cdn.shopify.com/s/files/1/1234/5678/t/1/assets/theme.css' }
        ];
      }
      return [];
    });

    const result = detectShopify(mockDocument);
    expect(result.detected).toBe(true);
    expect(result.confidence).toBeGreaterThanOrEqual(0.8);
    expect(result.methods).toContain('shopify_urls');
  });

  test('should detect Shopify via cookies', () => {
    mockDocument.cookie = '_shopify_s=abc123; _shopify_y=xyz789';

    const result = detectShopify(mockDocument);
    expect(result.detected).toBe(true);
    expect(result.confidence).toBeGreaterThanOrEqual(0.7);
    expect(result.methods).toContain('shopify_cookies');
  });

  test('should combine multiple detection methods for higher confidence', () => {
    // Set up meta tag
    mockDocument.querySelector.mockImplementation((selector) => {
      if (selector === 'meta[name="shopify-checkout-api-token"]') {
        return { content: 'some-token' };
      }
      return null;
    });

    // Set up JavaScript variable
    global.window.Shopify = {
      theme: { version: '2.0.0' }
    };

    // Set up CSS classes
    mockDocument.querySelectorAll.mockImplementation((selector) => {
      if (selector === '[class*="shopify-"], [class*="shopify-section"]') {
        return [{ className: 'shopify-section-header' }];
      }
      return [];
    });

    const result = detectShopify(mockDocument);
    expect(result.detected).toBe(true);
    expect(result.confidence).toBe(1);
    expect(result.version).toBe('2.0.0');
    expect(result.methods).toContain('shopify_meta');
    expect(result.methods).toContain('shopify_js');
    expect(result.methods).toContain('shopify_classes');
  });

  test('should not detect Shopify when no indicators are present', () => {
    const result = detectShopify(mockDocument);
    expect(result.detected).toBe(false);
    expect(result.confidence).toBe(0);
    expect(result.version).toBeNull();
    expect(result.methods).toHaveLength(0);
  });

  test('should handle missing window object', () => {
    delete global.window;
    const result = detectShopify(mockDocument);
    expect(result.detected).toBe(false);
    expect(result.confidence).toBe(0);
  });

  test('should handle Shopify object without theme version', () => {
    global.window.Shopify = {};
    const result = detectShopify(mockDocument);
    expect(result.detected).toBe(true);
    expect(result.confidence).toBeGreaterThanOrEqual(0.9);
    expect(result.version).toBeNull();
    expect(result.methods).toContain('shopify_js');
  });
}); 