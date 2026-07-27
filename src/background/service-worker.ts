chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.info('ApplyBank installed — India pack ready.')
  }
})
