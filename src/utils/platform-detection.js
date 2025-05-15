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
    result.confidence += 0.8;
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
    result.confidence += 0.7;
    result.methods.push('wp_content_url');
  }

  // Check for wp-includes URLs
  const wpIncludesElements = doc.querySelectorAll('script[src*="wp-includes"]');
  if (wpIncludesElements.length > 0) {
    result.detected = true;
    result.confidence += 0.7;
    result.methods.push('wp_includes_url');
  }

  // Check for wp-json endpoint
  const wpJsonElements = doc.querySelectorAll('link[href*="wp-json"]');
  if (wpJsonElements.length > 0) {
    result.detected = true;
    result.confidence += 0.7;
    result.methods.push('wp_json_endpoint');
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
    // Other platform detections will be added here
  };

  // Find the platform with highest confidence
  const detectedPlatform = Object.entries(results)
    .filter(([_, result]) => result.detected)
    .sort(([_, a], [__, b]) => b.confidence - a.confidence)[0];

  return {
    platform: detectedPlatform ? detectedPlatform[0] : 'unknown',
    details: results,
    confidence: detectedPlatform ? detectedPlatform[1].confidence : 0
  };
} 