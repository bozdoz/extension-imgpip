browser.contextMenus.create({
  id: "imgpip",
  // TODO: get title from locales
  title: "Image Picture-in-Picture",
  contexts: ["all"],
});

browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "imgpip") {
    browser.tabs.sendMessage(tab.id, {});
  }
});

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  fetch(request)
    .then((response) => response.blob())
    .then(sendResponse);

  return true;
});
