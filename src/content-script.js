(() => {
  console.log('connected');
  
  let elem = null;

  document.addEventListener(
    "contextmenu",
    function (event) {
      elem = event.target;
    },
    true
  );

  browser.runtime.onMessage.addListener(function (
    _request,
    _sender,
    _sendResponse
  ) {
    console.log({ elem });
    imgPiP(elem);
  });

  function imgPiP(target) {
    /* check the parent's children for an img (instagram hack) */
    const img = target.parentNode.querySelector("img");
  
    if (!img) {
      return;
    }
  
    /* get or create unique canvas and video elements */
    const canvas = document.createElement("canvas");
  
    /* get the real image dimensions by loading a new image from src */
    const tempImg = new Image();
  
    tempImg.crossOrigin = "";
    tempImg.onload = () => {
      canvas.height = tempImg.height;
      canvas.width = tempImg.width;
  
      /* draw image to context */
      canvas.getContext("2d").drawImage(tempImg, 0, 0);
  
      const video = document.createElement("video");
  
      /* set image properties on video element */
      for (let i = 0; i < img.attributes.length; i++) {
        const attrib = img.attributes[i];
        if (attrib.specified) {
          video.setAttribute(attrib.name, attrib.value);
        }
      }
      video.height = img.height;
      video.width = img.width;
  
      /* stream canvas to video */
      video.srcObject = canvas.captureStream();
  
      /* chrome needs autoplay set to true */
      video.autoplay = true;
  
      /* replace img with video (firefox doesn't support PiP methods) */
      img.parentNode.replaceChild(video, img);
      /* removes any blocking div (instagram hack) */
      if (!target.contains(img)) {
        target.parentNode.removeChild(target);
      }
  
      /* try opening immediately */
      video.addEventListener("canplay", (e) => {
        if ("requestPictureInPicture" in video) {
          video.requestPictureInPicture();
        }
      });
    };
  
    tempImg.src = img.src;
  }  
})();
