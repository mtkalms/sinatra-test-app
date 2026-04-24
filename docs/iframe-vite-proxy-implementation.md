# iframe + Vite Reverse Proxy: Implementation Outline

Concrete changes required to migrate from the current fetch + `dangerouslySetInnerHTML` pattern to the iframe + same-origin proxy approach.

---

## Change 1 — `vite.config.ts`: add the proxy

The tricky part is that `/blogs` is used by both React (client-side routes) and Sinatra (JSON API + HTML views). The `bypass` option solves this using the browser's `Sec-Fetch-Dest` header, which distinguishes a top-level browser navigation (`document`) from an iframe load (`iframe`) and a `fetch()` call (`empty`):

```ts
server: {
  proxy: {
    '/blogs': {
      target: 'http://localhost:4567',
      bypass(req) {
        // Top-level navigation (user typing URL / refreshing) → serve React SPA
        if (req.headers['sec-fetch-dest'] === 'document') {
          return '/index.html'
        }
        // iframe loads and fetch() calls → proxy to Sinatra
      },
    },
    '/posts': {
      target: 'http://localhost:4567',
      bypass(req) {
        if (req.headers['sec-fetch-dest'] === 'document') {
          return '/index.html'
        }
      },
    },
  },
  // existing watch config...
}
```

This means:
- Browser navigates to `/blogs/1/view` → `Sec-Fetch-Dest: document` → React SPA loads → React Router takes over
- `<iframe src="/blogs/1/view">` → `Sec-Fetch-Dest: iframe` → proxied to Sinatra → HTML rendered in frame
- `fetch('/blogs')` → `Sec-Fetch-Dest: empty` → proxied to Sinatra → JSON

---

## Change 2 — `src/pages/sinatra.tsx`: fetch + inject → iframe

```tsx
// BEFORE: ~40 lines, DOMPurify, string rewriting, dangerouslySetInnerHTML
// AFTER:

import { useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { Gem } from "lucide-react";
import { Container } from "semantic-ui-react";

export default function SinatraPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleLoad = () => {
    const iframePath = iframeRef.current?.contentWindow?.location.pathname;
    if (iframePath && iframePath !== location.pathname) {
      navigate(iframePath, { replace: true }); // sync React Router when iframe navigates
    }
  };

  return (
    <div>
      <div className="flex gap-2 bg-red-500 p-2 align-middle text-white">
        <Gem width={15} /> Ruby + Sinatra
      </div>
      <Container>
        <iframe
          ref={iframeRef}
          src={location.pathname}
          onLoad={handleLoad}
          style={{ width: "100%", border: "none", minHeight: "500px" }}
        />
      </Container>
    </div>
  );
}
```

`src/hooks/useSinatra.tsx` and the `dompurify` import can be deleted entirely.

---

## Change 3 — relative URLs across all API calls

Every `http://localhost:4567` prefix in the React fetch calls becomes a relative path, since the proxy makes them the same origin:

| File | Before | After |
|---|---|---|
| `src/layout.tsx` | `http://localhost:4567/blogs` | `/blogs` |
| `src/pages/blog-list.tsx` | `http://localhost:4567/blogs` | `/blogs` |
| `src/pages/blog.tsx` | `http://localhost:4567/blogs/${id}` | `/blogs/${id}` |
| `src/pages/blog.tsx` | `http://localhost:4567/blogs/${id}/posts` | `/blogs/${id}/posts` |

---

## No changes needed

| File | Why |
|---|---|
| `app.rb` | `set :protection, except: :frame_options` already present |
| `views/*.erb` | Absolute paths (`/blogs/new`, `action="/blogs"`) resolve naturally on same origin |
| `controllers/` | The referrer-based redirect constructs the full URL from the request referrer. With same-origin, the referrer is `localhost:5173`, so redirects land back on Vite, which the proxy routes to Sinatra for the iframe. Works as-is. |
| `src/App.tsx` | Route structure unchanged — `/*` still catches all Sinatra paths |

---

## What disappears

| Removed | Reason |
|---|---|
| `DOMPurify` | No injected HTML to sanitize |
| `replaceAll('action="', ...)` | Forms are same-origin, no rewriting needed |
| `replaceAll("dark-mode", ...)` | Dark mode injection into HTML string is gone |
| `src/hooks/useSinatra.tsx` | Deleted — iframe replaces the fetch entirely |
| All `http://localhost:4567` hardcoded URLs | Gone — all paths are now relative |

---

## One remaining challenge: dark mode

Currently `sanitize()` swaps the `dark-mode` class to `inverted` for Semantic UI. Inside a same-origin iframe the iframe's DOM is accessible from React, but manipulating it directly after each load is fragile.

The lightest fix without touching individual views: add a **Sinatra layout file** that reads a `?theme=dark` query parameter and conditionally adds a class to the body. React then appends `?theme=${mode}` when setting the iframe `src`:

```tsx
src={`${location.pathname}?theme=${mode}`}
```

```erb
<%# views/layout.erb %>
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="/semantic.min.css">
  </head>
  <body class="<%= params[:theme] == 'dark' ? 'inverted' : '' %>">
    <%= yield %>
  </body>
</html>
```

This is the one minimal Sinatra addition the approach benefits from — a single shared layout file, with no changes to any individual view.
