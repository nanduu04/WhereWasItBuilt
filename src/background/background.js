// Store the latest detection result for each tab
const tabResults = new Map();

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'PLATFORM_DETECTED' && sender.tab) {
    tabResults.set(sender.tab.id, message.payload);
    updateExtensionIcon(sender.tab.id, message.payload);
  }
});

// Update the extension icon based on the detected platform
function updateExtensionIcon(tabId, result) {
  const iconPath = getIconPath(result.platform, result.confidence);
  chrome.action.setIcon({
    tabId: tabId,
    path: iconPath
  });
}

// Get the appropriate icon path based on platform and confidence
function getIconPath(platform, confidence) {
  const basePath = '../assets/';
  const confidenceLevel = confidence > 0.8 ? 'high' : confidence > 0.5 ? 'medium' : 'low';
  
  return {
    16: `${basePath}${platform}_${confidenceLevel}_16.png`,
    48: `${basePath}${platform}_${confidenceLevel}_48.png`,
    128: `${basePath}${platform}_${confidenceLevel}_128.png`
  };
}

// Clean up tab data when tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  tabResults.delete(tabId);
}); 