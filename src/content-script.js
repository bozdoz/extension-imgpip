(() => {
  let elem = null;

  document.addEventListener(
    "contextmenu",
    function (event) {
      elem = event.target;
    },
    true
  );

  browser.runtime.onMessage.addListener(() => imgPiP(elem));

  async function imgPiP(target) {
    // check the parent's children for an img (instagram hack)
    /** @type HTMLImageElement */
    const img = target.parentNode.querySelector("img");
  
    if (!img) {
      return;
    }

    // get image the hard way (background script calls fetch)
    /** @type Blob */
    const blob = await browser.runtime.sendMessage(img.src);
    const objectUrl = URL.createObjectURL(blob);

    const canvas = document.createElement("canvas");
    const video = document.createElement("video");
  
    // get the real image dimensions by loading a new image from src
    const tempImg = new Image();
  
    tempImg.onload = () => {
      canvas.height = tempImg.height;
      canvas.width = tempImg.width;

      canvas.getContext("2d").drawImage(tempImg, 0, 0);
  
      // set image properties on video element
      for (let i = 0; i < img.attributes.length; i++) {
        const attrib = img.attributes[i];
        // TODO: fix deprecated `specified`
        if (attrib.specified) {
          video.setAttribute(attrib.name, attrib.value);
        }
      }
      video.height = img.height;
      video.width = img.width;
  
      // stream canvas to video
      video.srcObject = canvas.captureStream();
  
      // chrome needs autoplay set to true (maybe?)
      video.autoplay = true;
  
      // replace img with video (firefox doesn't support PiP methods)
      img.parentNode.replaceChild(video, img);

      // removes any blocking div (instagram hack)
      if (!target.contains(img)) {
        target.parentNode.removeChild(target);
      }
  
      // try opening immediately
      video.addEventListener("canplay", () => {
        if ("requestPictureInPicture" in video) {
          video.requestPictureInPicture();
        }
      });
    };

    tempImg.src = objectUrl;
  }  
})();
