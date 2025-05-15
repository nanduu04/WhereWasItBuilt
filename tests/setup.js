// Mock Chrome API
global.chrome = {
  runtime: {
    sendMessage: jest.fn(),
    onMessage: {
      addListener: jest.fn()
    }
  },
  tabs: {
    query: jest.fn(),
    sendMessage: jest.fn()
  },
  action: {
    setIcon: jest.fn()
  }
};

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    href: 'https://example.com'
  },
  writable: true
}); 