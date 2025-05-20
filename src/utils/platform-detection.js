/**
 * Detects if a website is built with WordPress
 * @param {Document} doc - The document object to use (for testing)
 * @returns {Object} Detection result with confidence score and version
 */
export function detectWordPress(doc = document) {
  const result = {
    detected: false,
    confidence: 0,
    version: null,
    methods: []
  };

  // Check meta generator tag
  const generatorMeta = doc.querySelector('meta[name="generator"]');
  if (generatorMeta && generatorMeta.content.toLowerCase().includes('wordpress')) {
    result.detected = true;
    result.confidence += 0.9;
    result.methods.push('meta_generator');
    
    // Extract version if available
    const versionMatch = generatorMeta.content.match(/WordPress\s+(\d+\.\d+(\.\d+)?)/i);
    if (versionMatch) {
      result.version = versionMatch[1];
    }
  }

  // Check for wp-content URLs
  const wpContentElements = doc.querySelectorAll('link[href*="wp-content"], script[src*="wp-content"]');
  if (wpContentElements.length > 0) {
    result.detected = true;
    result.confidence += 0.8;
    result.methods.push('wp_content_url');
  }

  // Check for wp-includes URLs
  const wpIncludesElements = doc.querySelectorAll('script[src*="wp-includes"]');
  if (wpIncludesElements.length > 0) {
    result.detected = true;
    result.confidence += 0.8;
    result.methods.push('wp_includes_url');
  }

  // Check for wp-json endpoint
  const wpJsonElements = doc.querySelectorAll('link[href*="wp-json"]');
  if (wpJsonElements.length > 0) {
    result.detected = true;
    result.confidence += 0.8;
    result.methods.push('wp_json_endpoint');
  }

  // Normalize confidence score
  if (result.detected) {
    result.confidence = Math.min(result.confidence, 1);
  }

  return result;
}

/**
 * Detects if a website is built with React
 * @param {Document} doc - The document object to use (for testing)
 * @returns {Object} Detection result with confidence score and version
 */
export function detectReact(doc = document) {
  const result = {
    detected: false,
    confidence: 0,
    version: null,
    methods: []
  };

  let found = false;

  // Check for React DevTools hook
  if (typeof window !== 'undefined' && window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    found = true;
    result.confidence += 0.9;
    result.methods.push('react_devtools');
    try {
      const reactInstance = window.__REACT_DEVTOOLS_GLOBAL_HOOK__.renderers.get(1);
      if (reactInstance && reactInstance.version) {
        result.version = reactInstance.version;
      }
    } catch (e) {}
  }

  // Check for React root element
  const reactRoot = doc.querySelector('[data-reactroot]');
  if (reactRoot) {
    found = true;
    result.confidence += 0.8;
    result.methods.push('react_root');
  }

  // Check for React in script sources
  const reactScripts = doc.querySelectorAll('script[src*="react"]');
  if (reactScripts && reactScripts.length > 0) {
    found = true;
    result.confidence += 0.7;
    result.methods.push('react_scripts');
    for (const script of reactScripts) {
      const versionMatch = script.src.match(/react@?(\d+\.\d+\.\d+)/);
      if (versionMatch && !result.version) {
        result.version = versionMatch[1];
      }
    }
  }

  // Check for React-specific class names
  const reactClasses = doc.querySelectorAll('[class*="react-"]');
  if (reactClasses && reactClasses.length > 0) {
    found = true;
    result.confidence += 0.6;
    result.methods.push('react_classes');
  }

  // Check for React-specific data attributes
  const reactDataAttrs = doc.querySelectorAll('[data-reactid], [data-reactroot], [data-react-class]');
  if (reactDataAttrs && reactDataAttrs.length > 0) {
    found = true;
    result.confidence += 0.7;
    result.methods.push('react_data_attrs');
  }

  // Check for React-specific global variables
  if (typeof window !== 'undefined' && (window.React || window.__REACT_DEVTOOLS_GLOBAL_HOOK__)) {
    found = true;
    result.confidence += 0.8;
    result.methods.push('react_globals');
  }

  // Only set detected if at least one indicator was found
  if (found) {
    result.detected = true;
    result.confidence = Math.min(result.confidence, 1);
  } else {
    result.confidence = 0;
  }

  return result;
}

/**
 * Detects if a website is built with Shopify
 * @param {Document} doc - The document object to use (for testing)
 * @returns {Object} Detection result with confidence score and version
 */
export function detectShopify(doc = document) {
  const result = {
    detected: false,
    confidence: 0,
    version: null,
    methods: []
  };

  // Check for Shopify-specific meta tags
  const shopifyMeta = doc.querySelector('meta[name="shopify-checkout-api-token"]');
  if (shopifyMeta) {
    result.detected = true;
    result.confidence += 0.9;
    result.methods.push('shopify_meta');
  }

  // Check for Shopify-specific JavaScript variables
  if (typeof window !== 'undefined' && window.Shopify) {
    result.detected = true;
    result.confidence += 0.9;
    result.methods.push('shopify_js');
    if (window.Shopify.theme) {
      result.version = window.Shopify.theme.version;
    }
  }

  // Check for Shopify-specific CSS classes
  const shopifyClasses = doc.querySelectorAll('[class*="shopify-"], [class*="shopify-section"]');
  if (shopifyClasses && shopifyClasses.length > 0) {
    result.detected = true;
    result.confidence += 0.8;
    result.methods.push('shopify_classes');
  }

  // Check for Shopify-specific URLs
  const shopifyUrls = doc.querySelectorAll('link[href*="shopify"], script[src*="shopify"]');
  if (shopifyUrls && shopifyUrls.length > 0) {
    result.detected = true;
    result.confidence += 0.8;
    result.methods.push('shopify_urls');
  }

  // Check for Shopify-specific cookies
  if (typeof document !== 'undefined' && document.cookie.includes('_shopify_')) {
    result.detected = true;
    result.confidence += 0.7;
    result.methods.push('shopify_cookies');
  }

  // Normalize confidence score
  if (result.detected) {
    result.confidence = Math.min(result.confidence, 1);
  }

  return result;
}

/**
 * Detects the platform of the current website
 * @param {Document} doc - The document object to use (for testing)
 * @returns {Object} Platform detection results
 */
export function detectPlatform(doc = document) {
  const results = {
    wordpress: detectWordPress(doc),
    react: detectReact(doc),
    shopify: detectShopify(doc)
  };

  // Find the platform with highest confidence
  const detectedPlatform = Object.entries(results)
    .filter(([_, result]) => result.detected)
    .sort(([_, a], [__, b]) => b.confidence - a.confidence)[0];

  // If no platform is detected, return unknown with 0 confidence
  if (!detectedPlatform) {
    return {
      platform: 'unknown',
      details: results,
      confidence: 0
    };
  }

  // Return the detected platform with its confidence
  return {
    platform: detectedPlatform[0],
    details: results,
    confidence: detectedPlatform[1].confidence
  };
} 