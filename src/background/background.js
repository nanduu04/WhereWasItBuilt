import { generatePlatformIcon } from '../utils/icon-generator.js';

// Store the latest detection result for each tab
const tabResults = new Map();

// Helper to send a message to the content script and get the detected platform
function detectPlatformInTab(tabId) {
  return new Promise((resolve) => {
    chrome.tabs.sendMessage(tabId, { action: 'detectPlatform' }, (response) => {
      if (chrome.runtime.lastError || !response) {
        console.log('Detection failed:', chrome.runtime.lastError);
        resolve({ platform: 'unknown', confidence: 0 });
      } else {
        console.log('Detection result:', response);
        resolve(response);
      }
    });
  });
}

// Helper to update the icon for a tab
async function updateTabIcon(tabId) {
  try {
    const result = await detectPlatformInTab(tabId);
    console.log('Updating icon for tab', tabId, 'with result:', result);
    
    // Get the platform with highest confidence
    const platform = result.platform || 'unknown';
    const imageData = await generatePlatformIcon(platform, 32);
    
    chrome.action.setIcon({ imageData, tabId });
    tabResults.set(tabId, result);
  } catch (error) {
    console.error('Error updating icon:', error);
  }
}

// Listen for tab activation (switch)
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  await updateTabIcon(activeInfo.tabId);
});

// Listen for tab updates (navigation, refresh)
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    await updateTabIcon(tabId);
  }
});

// Optionally, update icon for the current tab on extension load
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (tabs[0]) updateTabIcon(tabs[0].id);
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'PLATFORM_DETECTED' && sender.tab) {
    console.log('Received platform detection:', message.payload);
    tabResults.set(sender.tab.id, message.payload);
    updateTabIcon(sender.tab.id);
  }
});

// Clean up tab data when tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  tabResults.delete(tabId);
}); 