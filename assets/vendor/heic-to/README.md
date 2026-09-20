# heic-to

Vendored browser build of [heic-to 1.5.2](https://github.com/hoppergee/heic-to/tree/v1.5.2).
It is loaded lazily when the browser cannot decode an uploaded HEIC or HEIF
photo natively.

- Bundle: `heic-to-1.5.2.js`
- Upstream package: `heic-to@1.5.2`
- Upstream tarball SHA-256: `a301b46a2e5a2a050c44d7c1655d63b4c17415312ebcfa82920e950baffc5a7f`
- Bundle SHA-256: `976f23cac9d435e3c3d9d8757c3975d1f56ae995581461b3a8ace66e07e4640e`
- License: LGPL-3.0-or-later; see `LICENSE.md`
- Corresponding source: https://github.com/hoppergee/heic-to/tree/v1.5.2

The vendored file is the unmodified `dist/iife/heic-to.js` from the published
package. It includes libheif 1.22.2 and exposes the global `HeicTo` function.
