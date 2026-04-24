# Fetch + Inject + Proxy + Interception Architecture

A hybrid approach combining the current fetch + `dangerouslySetInnerHTML` pattern with a same-origin proxy and link/form interception — keeping Sinatra pages rendered inline while fixing its core limitations.

## Core idea

**Same-origin proxy** (removes CORS and fixes form actions) + **fetch + inject** (keeps inline rendering) + **link/form interception** (keeps SPA navigation).

---

## What the proxy buys you for inline rendering

The current approach manually patches `action=""` URLs because the form is on `localhost:5173` but posts to `localhost:4567`. With a proxy they share the same origin — form actions and links in the injected HTML just work. The `replaceAll('action="', 'action="http://localhost:4567')` line in `sanitize()` disappears entirely.

---

## The missing piece: interception

Without interception, clicking a link or submitting a form inside the injected HTML causes a **full page navigation**, blowing React away. Both need to be intercepted.

### Link clicks

```tsx
const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
  const anchor = (e.target as HTMLElement).closest('a');
  if (anchor?.href) {
    const url = new URL(anchor.href);
    if (url.origin === window.location.origin) {
      e.preventDefault();
      navigate(url.pathname); // React Router picks it up → fetches next Sinatra page
    }
  }
};
```

### Form submissions

```tsx
const handleSubmit = async (e: React.FormEvent<HTMLDivElement>) => {
  const form = (e.target as HTMLElement).closest('form');
  if (!form) return;
  e.preventDefault();

  const response = await fetch(form.action, {
    method: form.method,
    body: new FormData(form),
    redirect: 'follow',       // follow Sinatra's redirect automatically
  });

  navigate(new URL(response.url).pathname); // land on the redirect target
};
```

Sinatra processes the form and redirects (e.g. `POST /blogs` → `302 /blogs/1/view`). `fetch` follows it, returns the final URL, and React Router navigates there — triggering another fetch + inject of the next Sinatra page.

---

## What this actually is

This pattern has a name: it is exactly what **Hotwire Turbo Drive** does, and before that **pjax** (pushState + Ajax). Intercept navigation, fetch the new page's HTML, swap the body, update the URL. The difference here is React is driving it rather than a dedicated library.

---

## Comparison

| | Fetch + inject (current) | Fetch + inject + proxy + interception | iframe + proxy |
|---|---|---|---|
| Sinatra changes | None | None | None |
| Form action rewriting | ✅ Manual | ❌ Not needed | ❌ Not needed |
| Link interception | ❌ Full page reload | ✅ React Router | ✅ via `onLoad` |
| Scripts in views | ❌ Don't execute | ❌ Don't execute | ✅ Execute natively |
| Dark mode injection | ✅ via `replaceAll` | ✅ via DOM after inject | ⚠️ Needs layout or query param |
| iframe sizing | N/A | N/A | ⚠️ Needs ResizeObserver |
| React layout wraps content | ✅ | ✅ | ✅ |
| Complexity | Low | Medium | Medium |

The main remaining limitation of fetch + inject even with the proxy is that **`<script>` tags in Sinatra views don't execute** — `dangerouslySetInnerHTML` does not run scripts. If the views have any inline JS (Semantic UI dropdowns, form validation, etc.) the iframe approach is the only one that handles it natively.
