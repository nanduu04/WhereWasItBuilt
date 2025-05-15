// Utility to generate a browser action icon as ImageData for a given platform
// Supported platforms: wordpress, react, next, vue, angular, shopify, wix, squarespace, default

const PLATFORM_ICON_MAP = {
  wordpress:   { color: '#27ae60', letter: 'W' }, // green
  react:       { color: '#2980d9', letter: 'R' }, // blue
  next:        { color: '#222',    letter: 'N' }, // black
  vue:         { color: '#41b883', letter: 'V' }, // green
  angular:     { color: '#e74c3c', letter: 'A' }, // red
  shopify:     { color: '#7ab55c', letter: 'S' }, // teal
  wix:         { color: '#f6e05e', letter: 'W' }, // yellow
  squarespace: { color: '#888',    letter: 'S' }, // gray
  default:     { color: '#bbb',    letter: '?' }  // gray
};

/**
 * Generate an ImageData icon for a given platform
 * @param {string} platform - Platform key
 * @param {number} [size=32] - Icon size (width/height in px)
 * @returns {Promise<ImageData>} - Resolves to ImageData
 */
export async function generatePlatformIcon(platform, size = 32) {
  const { color, letter } = PLATFORM_ICON_MAP[platform] || PLATFORM_ICON_MAP.default;
  // Create a canvas
  const canvas = new OffscreenCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Draw background
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, size, size);

  // Draw letter
  ctx.font = `bold ${Math.floor(size * 0.7)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#fff';
  ctx.fillText(letter, size / 2, size / 2 + 1);

  return ctx.getImageData(0, 0, size, size);
}

export { PLATFORM_ICON_MAP }; 