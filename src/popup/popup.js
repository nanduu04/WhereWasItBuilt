document.addEventListener('DOMContentLoaded', () => {
  const platformName = document.getElementById('platformName');
  const confidenceLevel = document.getElementById('confidenceLevel');
  const confidenceText = document.getElementById('confidenceText');
  const detectionMethods = document.getElementById('detectionMethods');

  // Show loading state
  platformName.textContent = 'Detecting platform...';
  confidenceLevel.style.width = '0%';
  confidenceText.textContent = 'Confidence: 0%';
  detectionMethods.innerHTML = '';

  // Get the current tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    if (!currentTab) {
      showError('No active tab found');
      return;
    }

    // Request platform information from the content script
    chrome.tabs.sendMessage(currentTab.id, { action: 'detectPlatform' }, (response) => {
      if (chrome.runtime.lastError) {
        showError('Unable to detect platform. Please refresh the page.');
        return;
      }

      if (!response) {
        showError('No response from page. Please refresh the page.');
        return;
      }

      updateUI(response);
    });
  });
});

function updateUI(result) {
  const platformName = document.getElementById('platformName');
  const confidenceLevel = document.getElementById('confidenceLevel');
  const confidenceText = document.getElementById('confidenceText');
  const detectionMethods = document.getElementById('detectionMethods');

  // Update platform name
  platformName.textContent = formatPlatformName(result.platform);

  // Update confidence level
  const confidencePercentage = Math.round(result.confidence * 100);
  confidenceLevel.style.width = `${confidencePercentage}%`;
  confidenceText.textContent = `Confidence: ${confidencePercentage}%`;

  // Update detection methods
  if (result.details && result.details[result.platform]) {
    const methods = result.details[result.platform].methods;
    if (methods && methods.length > 0) {
      detectionMethods.innerHTML = methods
        .map(method => `<div class="method-item">${formatMethodName(method)}</div>`)
        .join('');
    } else {
      detectionMethods.innerHTML = '<div class="method-item">No specific detection methods found</div>';
    }
  } else {
    detectionMethods.innerHTML = '<div class="method-item">No platform detected</div>';
  }
}

function showError(message) {
  const platformName = document.getElementById('platformName');
  const confidenceLevel = document.getElementById('confidenceLevel');
  const confidenceText = document.getElementById('confidenceText');
  const detectionMethods = document.getElementById('detectionMethods');

  platformName.textContent = 'Error';
  confidenceLevel.style.width = '0%';
  confidenceText.textContent = 'Confidence: 0%';
  detectionMethods.innerHTML = `<div class="error">${message}</div>`;
}

function formatPlatformName(platform) {
  if (!platform) return 'Unknown';
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