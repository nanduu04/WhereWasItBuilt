import { generatePlatformIcon, PLATFORM_ICON_MAP } from '../../src/utils/icon-generator.js';

// Helper to convert hex color to RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Patch OffscreenCanvas for Node.js test environment
beforeAll(() => {
  if (typeof global.OffscreenCanvas === 'undefined') {
    global.OffscreenCanvas = class {
      constructor(width, height) {
        this.width = width;
        this.height = height;
        let currentFillStyle = '#000000';
        let backgroundColor = '#000000';
        this._ctx = {
          get fillStyle() {
            return currentFillStyle;
          },
          set fillStyle(value) {
            currentFillStyle = value;
          },
          font: '',
          textAlign: '',
          textBaseline: '',
          fillRect: jest.fn((x, y, w, h) => {
            // When fillRect is called, set the background color
            backgroundColor = currentFillStyle;
          }),
          fillText: jest.fn(),
          getImageData: () => {
            const data = new Uint8ClampedArray(width * height * 4);
            const rgb = hexToRgb(backgroundColor);
            if (rgb) {
              for (let i = 0; i < data.length; i += 4) {
                data[i] = rgb.r;     // R
                data[i + 1] = rgb.g; // G
                data[i + 2] = rgb.b; // B
                data[i + 3] = 255;   // A
              }
            }
            return {
              width,
              height,
              data
            };
          }
        };
      }
      getContext() {
        return this._ctx;
      }
    };
  }
});

describe('generatePlatformIcon', () => {
  const platforms = Object.keys(PLATFORM_ICON_MAP);
  const size = 32;

  it('should return ImageData for each supported platform', async () => {
    for (const platform of platforms) {
      const imageData = await generatePlatformIcon(platform, size);
      expect(imageData).toBeDefined();
      expect(imageData.width).toBe(size);
      expect(imageData.height).toBe(size);
      // Should be an instance of ImageData (in browser/Node with canvas polyfill)
      expect(imageData.data).toBeInstanceOf(Uint8ClampedArray);
    }
  });

  it('should return ImageData for unknown platform (fallback to default)', async () => {
    const imageData = await generatePlatformIcon('notarealplatform', size);
    expect(imageData).toBeDefined();
    expect(imageData.width).toBe(size);
    expect(imageData.height).toBe(size);
    expect(imageData.data).toBeInstanceOf(Uint8ClampedArray);
  });

  // Optionally, test that the background color is correct for a known platform
  it('should have the correct background color for WordPress', async () => {
    const imageData = await generatePlatformIcon('wordpress', size);
    const [r, g, b] = imageData.data;
    // #27ae60 = rgb(39, 174, 96)
    expect(r).toBe(39);
    expect(g).toBe(174);
    expect(b).toBe(96);
  });
}); 