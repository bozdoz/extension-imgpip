# imgpip

<img src="https://raw.githubusercontent.com/bozdoz/extension-imgpip/main/src/images/imgpip-icon.svg?token=GHSAT0AAAAAACGEGOUMSV643NIJNPVYHHO4ZHAF5TQ" alt="IMGPIP Icon" width="200" />

Make images work in Picture-in-Picture

### Issues

- Image downloading needs CORS (crossOrigin anonymous)
- content-script can't fetch images; need to fetch and send blob by messaging background script
- can't get permissions on all sites unless we use Manifest v2

### Manifest Issues

#### Getting Key/ID

https://stackoverflow.com/a/46739698/488784

```bash
# generate pem:

openssl genrsa 2048 | openssl pkcs8 -topk8 -nocrypt -out key.pem

# Key:

openssl rsa -in key.pem -pubout -outform DER | openssl base64 -A

# Extension ID:

openssl rsa -in key.pem -pubout -outform DER | shasum -a 256 | head -c32 | tr 0-9a-f a-p
```

#### Deploy script (maybe)

https://github.com/gorhill/uBlock/blob/master/.github/workflows/main.yml


### References

Original CodePen: https://codepen.io/bozdoz/pen/WNaXdRm
