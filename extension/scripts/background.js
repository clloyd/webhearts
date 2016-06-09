let iconType = undefined;

chrome.browserAction.setPopup({
  popup: "popup.html"
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
  if (request.newActiveIcon) {
    iconType = request.newActiveIcon;
    updateIcon();

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {iconType: iconType});
    });
  }
});


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.triggerActiveRefresh) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {iconType: iconType});
    });
  }
});

function updateIcon() {
  const path = iconType ? "images/heart_128.png" : "images/heart_128_off.png";

  chrome.browserAction.setIcon({
    path: path
  });
}
