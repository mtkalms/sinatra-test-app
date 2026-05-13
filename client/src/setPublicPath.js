/* global __webpack_public_path__ */

if (typeof document !== 'undefined') {
    const scripts = document.getElementsByTagName('script');
    const currentScript = document.currentScript || scripts[scripts.length - 1];

    if (currentScript && currentScript.src) {
        __webpack_public_path__ = currentScript.src.replace(/\/[^/]*$/, '/');
    }
}