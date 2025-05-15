document.addEventListener('DOMContentLoaded', () => {
  const platformName = document.getElementById('platformName');
  const confidenceLevel = document.getElementById('confidenceLevel');
  const detectionMethods = document.getElementById('detectionMethods');

  // Get the current tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];

    // Request platform information from the content script
    chrome.tabs.sendMessage(currentTab.id, { type: 'GET_PLATFORM_INFO' }, (response) => {
      if (chrome.runtime.lastError) {
        showError('Unable to detect platform. Please refresh the page.');
        return;
      }

      updateUI(response);
    });
  });
});

function updateUI(result) {
  const platformName = document.getElementById('platformName');
  const confidenceLevel = document.getElementById('confidenceLevel');
  const detectionMethods = document.getElementById('detectionMethods');

  // Update platform name
  platformName.textContent = formatPlatformName(result.platform);

  // Update confidence level
  const confidencePercentage = Math.round(result.confidence * 100);
  confidenceLevel.style.width = `${confidencePercentage}%`;

  // Update detection methods
  if (result.details && result.details[result.platform]) {
    const methods = result.details[result.platform].methods;
    detectionMethods.innerHTML = methods
      .map(method => `<div class="method-item">${formatMethodName(method)}</div>`)
      .join('');
  }
}

function formatPlatformName(platform) {
  return platform
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatMethodName(method) {
  return method
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function showError(message) {
  const app = document.getElementById('app');
  app.innerHTML = `<div class="error">${message}</div>`;
} 