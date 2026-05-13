/* global __webpack_public_path__ */

/**
 * Dynamically set the webpack public path based on the script tag that loaded this bundle.
 *
 * In development, the HTML template loads bundle.js from webpack-dev-server on a dynamic host/port
 * (e.g., http://<request.host>:8080/bundle.js). This module extracts that origin and sets it as
 * the webpack runtime's base URL for subsequent resource requests (HMR, lazy chunks, etc.).
 *
 * Why this is necessary:
 * - Without this, webpack HMR and dynamic imports follow a hard-coded or default origin, which can
 *   fail when the container is accessed from different hostnames (e.g., localhost vs. container IP,
 *   or under WSL with mirrored networking where external and internal names differ).
 * - By making the bundle self-locating, all follow-up requests stay consistent with the origin that
 *   served the initial bundle, avoiding network origin mismatches across dev-server and Sinatra.
 */

if (typeof document !== 'undefined') {
    const scripts = document.getElementsByTagName('script');
    const currentScript = document.currentScript || scripts[scripts.length - 1];

    if (currentScript && currentScript.src) {
        __webpack_public_path__ = currentScript.src.replace(/\/[^/]*$/, '/');
    }
}