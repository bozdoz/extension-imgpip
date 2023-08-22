# imgpip

<img src="https://raw.githubusercontent.com/bozdoz/extension-imgpip/main/src/images/imgpip-icon.svg?token=GHSAT0AAAAAACGEGOUMSV643NIJNPVYHHO4ZHAF5TQ" alt="IMGPIP Icon" width="200" />

Make images work in Picture-in-Picture

### Issues

- Image downloading needs CORS (crossOrigin anonymous)
- content-script can't fetch images; need to fetch and send blob by messaging background script
- can't get permissions on all sites unless we use Manifest v2 `"<all_urls>"` in permissions

#### Deploy script (maybe)

https://github.com/gorhill/uBlock/blob/master/.github/workflows/main.yml

### References

- Firefox Addon: https://addons.mozilla.org/en-US/firefox/addon/imgpip/
- Original CodePen: https://codepen.io/bozdoz/pen/WNaXdRm
