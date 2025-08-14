(() => {
  const $ = typeof chrome === "undefined" ? browser : chrome;

  /** last target of a contextMenu */
  let lastTarget = null;

  document.addEventListener(
    "contextmenu",
    (event) => {
      lastTarget = event.target;
    },
    true
  );

  // listen for message from background script (context menu clicked)
  $.runtime.onMessage.addListener(handleContextMenu);

  function handleContextMenu() {
    // check the parent's children for an img (instagram hack)
    /** @type HTMLImageElement */
    const img = lastTarget.parentNode.querySelector("img");

    if (!img) {
      return;
    }

    // removes any blocking div (instagram hack)
    if (!lastTarget.contains(img)) {
      lastTarget.parentNode.removeChild(lastTarget);
    }

    img2Pip(img);
  }

  /**
   * Converts a base64 string to an ArrayBuffer
   * @param {string} base64
   * @returns {ArrayBuffer}
   */
  function base64ToArrayBuffer(base64) {
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  /**
   * get image the hard way (background script calls fetch)
   *
   * @param {string} src
   * @returns Promise<string>
   */
  async function getImgSrc(src) {
    const response = await $.runtime.sendMessage(src);

    if (!response || !response.buffer) {
      console.log("[IMGPIP] Could not get response", response);
      return;
    }

    const arrayBuffer = base64ToArrayBuffer(response.buffer);
    return URL.createObjectURL(
      new Blob([arrayBuffer], { type: response.type })
    );
  }

  /**
   * Converts an image into a canvas, then streams the canvas into a video
   * @param {HtmlImageElement} img
   */
  async function img2Pip(img) {
    const canvas = document.createElement("canvas");
    const video = document.createElement("video");

    // get the real image dimensions by loading a new image from src
    const tempImg = new Image();

    tempImg.onload = () => {
      canvas.height = tempImg.height;
      canvas.width = tempImg.width;

      canvas.getContext("2d").drawImage(tempImg, 0, 0);

      // set image properties on video element
      for (const { name, value } of img.attributes) {
        video.setAttribute(name, value);
      }

      video.height = img.height;
      video.width = img.width;

      // stream canvas to video
      video.srcObject = canvas.captureStream();

      // chrome needs autoplay set to true (maybe?)
      video.autoplay = true;

      // replace img with video (firefox doesn't support PiP methods)
      img.parentNode.replaceChild(video, img);

      // try opening immediately
      video.addEventListener("canplay", () => {
        if ("requestPictureInPicture" in video) {
          video.requestPictureInPicture();
        }
      });
    };

    tempImg.src = await getImgSrc(img.src);
  }
})();
