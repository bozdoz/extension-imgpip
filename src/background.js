const $ = typeof chrome === "undefined" ? browser : chrome;

$.contextMenus.create({
  id: "imgpip",
  title: $.i18n.getMessage("menu_title"),
  contexts: ["all"],
});

$.contextMenus.onClicked.addListener((_info, tab) => {
  $.tabs.sendMessage(tab.id, {});
});

// service worker can't send array buffer; needs base64
function arrayBufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

$.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  fetch(request)
    .then((response) => response.blob())
    .then((blob) => {
      blob.arrayBuffer().then((buffer) => {
        const base64 = arrayBufferToBase64(buffer);
        sendResponse({
          buffer: base64,
          type: blob.type,
        });
      });
    })
    .catch((error) => {
      console.error("Fetch error:", error);
      sendResponse(null);
    });

  // return true marks this as async
  return true;
});
