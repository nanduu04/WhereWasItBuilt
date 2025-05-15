import { detectPlatform } from '../utils/platform-detection.js';

// Run detection when the page loads
function runDetection() {
  // Ensure we have access to the window object
  const result = detectPlatform(document);
  console.log('Platform detection result:', result);
  
  // Send the result to the background script
  chrome.runtime.sendMessage({
    type: 'PLATFORM_DETECTED',
    payload: result
  });
}

// Run detection when the page is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runDetection);
} else {
  runDetection();
}

// Also run detection when the page is fully loaded
window.addEventListener('load', runDetection);

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'detectPlatform') {
    const result = detectPlatform(document);
    console.log('Platform detection result (message):', result);
    sendResponse(result);
  }
  return true; // Keep the message channel open for async response
}); 