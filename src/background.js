browser.contextMenus.create({
  id: "imgpip",
  title: "Image Picture-in-Picture",
  contexts: ["all"],
});

browser.contextMenus.onClicked.addListener((info, tab) => {
  console.log("fired");
  if (info.menuItemId === "imgpip") {
    browser.tabs.sendMessage(tab.id, {});
  }
});
