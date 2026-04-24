# Reverse Proxy + iframe Architecture

Alternative approach to serving legacy Sinatra views through the React frontend, replacing the current fetch + `dangerouslySetInnerHTML` pattern.

## Core idea

Instead of fetching Sinatra HTML as a string and injecting it, `SinatraPage` renders an `<iframe>` pointing to the Sinatra route. The browser loads the Sinatra page natively — forms, links, and scripts work without any rewriting.

A proxy puts React and Sinatra on the same origin, which solves CORS and enables URL synchronisation from the React side.

---

## Layer 1 — The proxy

### Development

Vite's built-in `server.proxy` forwards Sinatra-specific paths to port 4567. Add to `vite.config.ts` alongside the existing `watch-sinatra-views` plugin:

```ts
server: {
  proxy: {
    '/blogs/view': 'http://localhost:4567',
    '/blogs/new':  'http://localhost:4567',
    '/posts':      'http://localhost:4567',
    // any other route Sinatra owns
  }
}
```

### Production

nginx or Caddy does the same at the edge — one domain, two upstream services:

```
/blogs/view  →  sinatra:4567
/blogs/new   →  sinatra:4567
/*           →  react:5173
```

Both servers stay completely independent. The proxy is purely infrastructure.

---

## Layer 2 — `SinatraPage` becomes a frame

The React component shrinks from ~40 lines to ~10. No `DOMPurify`, no `replaceAll`, no dark-mode class injection:

```tsx
export default function SinatraPage() {
  const location = useLocation();

  return (
    <iframe
      src={location.pathname}  // same origin — proxy handles routing
      style={{ width: '100%', border: 'none' }}
    />
  );
}
```

`useSinatra.tsx` can be deleted entirely.

---

## Layer 3 — URL sync

When a user clicks a link inside the iframe (e.g. `/blogs/view` → `/blogs/1/view`), the iframe navigates internally but React's address bar doesn't move. The back button breaks and deep-linking stops working.

With a shared origin, React can read `iframe.contentWindow.location` directly. Listening to the iframe's `load` event is enough:

```tsx
const iframeRef = useRef<HTMLIFrameElement>(null);
const navigate = useNavigate();

const handleLoad = () => {
  const iframePath = iframeRef.current?.contentWindow?.location.pathname;
  if (iframePath && iframePath !== location.pathname) {
    navigate(iframePath, { replace: true });
  }
};

return (
  <iframe
    ref={iframeRef}
    src={location.pathname}
    onLoad={handleLoad}
    style={{ width: '100%', border: 'none' }}
  />
);
```

No Sinatra changes required — same-origin access does the work.

---

## Impact on the existing codebase

| File | Change | Reason |
|---|---|---|
| `vite.config.ts` | Add `server.proxy` routes | Core of the approach |
| `src/pages/sinatra.tsx` | Replace fetch + inject with `<iframe>` | 40 lines → 10 lines |
| `src/hooks/useSinatra.tsx` | Delete | No longer needed |
| `app.rb` | None | `set :protection, except: :frame_options` already present |
| `views/*.erb` | None | Absolute paths resolve correctly on same origin |
| Sinatra layout | None | URL sync handled from the React side |

---

## Why this codebase is already well-positioned

1. **`set :protection, except: :frame_options`** is already in `app.rb` — Sinatra won't block being framed.

2. **ERB views use absolute paths** (`href="/blogs/new"`, `action="/blogs"`) — these resolve correctly once both servers share an origin. No link rewriting needed.

3. **The referrer-based redirect in `blogs_controller.rb`** was a workaround for cross-origin form submissions. With same-origin that workaround becomes unnecessary.

4. **`App.tsx`'s catch-all `<Route path="/*">`** already routes unknown paths to `SinatraPage` — the routing logic doesn't change.

5. **Vite already watches `../views/**`** — the relationship between the two servers is already acknowledged in the config.

---

## Remaining challenges

### iframe height
The frame needs to be sized to its content. This requires either a `ResizeObserver` on the iframe body (same-origin, so accessible) or a `postMessage` from within the frame. Without a Sinatra layout, the `ResizeObserver` approach is the cleaner option:

```ts
const observer = new ResizeObserver(() => {
  const height = iframeRef.current?.contentDocument?.body.scrollHeight;
  if (height) iframeRef.current.style.height = `${height}px`;
});
observer.observe(iframeRef.current.contentDocument.body);
```

### Dark mode
Currently `SinatraPage` injects an `"inverted"` class for dark mode. In an iframe you can't manipulate the frame's DOM directly (well, you can with same-origin, but it's fragile). The cleanest solution is a **minimal Sinatra change**: a shared layout that reads a `?theme=dark` query parameter and applies the appropriate class. React passes the current theme as a URL param when setting the iframe `src`.

### Auth / cookies
If Sinatra uses session cookies, `SameSite=Lax` browser defaults may block them when the cookies are set inside an iframe. Not an issue for this app currently, but worth knowing if sessions are introduced later.
