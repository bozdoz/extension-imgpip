browser.contextMenus.create({
  id: "imgpip",
  title: browser.i18n.getMessage("menu-title"),
  contexts: ["all"],
});

browser.contextMenus.onClicked.addListener((_info, tab) => {
  browser.tabs.sendMessage(tab.id, {});
});

browser.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  fetch(request)
    .then((response) => response.blob())
    .then(sendResponse);

  // return true marks this as async
  return true;
});
