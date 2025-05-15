import { detectPlatform } from '../utils/platform-detection.js';

// Run detection when the page is fully loaded
window.addEventListener('load', () => {
  const result = detectPlatform();
  
  // Send the detection result to the background script
  chrome.runtime.sendMessage({
    type: 'PLATFORM_DETECTED',
    payload: result
  });
});

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_PLATFORM_INFO') {
    const result = detectPlatform();
    sendResponse(result);
  }
  return true; // Keep the message channel open for async response
}); 