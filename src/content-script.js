(() => {
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
  browser.runtime.onMessage.addListener(handleContextMenu);

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
   * get image the hard way (background script calls fetch)
   * 
   * @param {string} src 
   * @returns Promise<string>
   */
  async function getImgSrc(src) {
    /** @type Blob */
    const blob = await browser.runtime.sendMessage(src);
    
    return URL.createObjectURL(blob);
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
