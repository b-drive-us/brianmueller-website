# Real-device verification checklist

Everything in `verification.md` was measured in **headless Chromium 141 only**. WebKit and Firefox
are not available in the environment this work was done in. That leaves a real gap: Safari on
iPhone is where most of Brian's readers will land when they tap a link in an email, and it is the
one engine nothing here has touched.

This is the short list that closes that gap. It is written to be done in about twenty minutes on
two devices, without any tooling.

**Test against:** https://brianmueller.org (staging — `noindex`, not in search results)

Before starting, on each device, **turn the system theme to light**, and be ready to switch it to
dark partway through. iOS: Settings → Display & Brightness. Android: Settings → Display.

---

## A. iPhone, Safari — the important one

| # | Do this | Expect |
|---|---|---|
| A1 | Open the home page. Don't scroll yet. | Header is two rows: **BrianMueller** with the theme button beside it, links underneath. Nothing is cut off at the right edge except possibly Contact on a very small phone, which should look faded rather than chopped. |
| A2 | Scroll down. | The header **scrolls away** and does not stay pinned. |
| A3 | Turn the phone sideways. | Layout reflows, nothing overlaps, no sideways scrolling of the page itself. |
| A4 | Tap the theme button. | Page goes dark immediately. Button now reads **Light**. |
| A5 | Tap through to Poems, then Books, then back with the browser's back gesture. | Dark theme holds on every page and after going back. Never a white flash on load. |
| A6 | While still in dark, switch the **system** theme to light in Settings, then return to Safari. | The site **stays dark**. An explicit choice must beat the system setting. |
| A7 | Tap the theme button again to return to light, then close Safari completely and reopen the site. | Comes back light. |
| A8 | Open a poem. Read a long one to the end. | Turned lines **hang** — a line too long for the screen wraps and its continuation is indented *further* than the line start, never less. This is the single most likely thing to look wrong on an engine nothing has tested. |
| A9 | Open the Retreat page. Tap **Registration** in the hero. | Jumps to the registration section and lands with the heading just under the top of the screen — not hidden behind anything, not halfway down. |
| A10 | Open each of the six FAQ items. | All six open and close. Text stays inside the screen; no sideways scrolling. |
| A11 | Settings → Accessibility → Display & Text Size → **Larger Text**, push it near maximum. Reload the site. | Text grows. Nothing is clipped, no text sits on top of other text, the page still scrolls only up and down. |
| A12 | Put that back, then Settings → Accessibility → Motion → **Reduce Motion** on. Reload. | Nothing animates or slides. |
| A13 | On the home page, look at the big photograph behind the headline. | Sharp, not blurry or blocky. If it looks soft, say so — that is a judgement call I could not make for you. |

## B. Android phone, Chrome — second priority

Repeat **A1, A2, A4, A5, A8, A9** only. Android Chrome shares an engine with what was tested, so
this is a sanity check that real hardware matches emulation, not a fresh investigation.

One extra:

| # | Do this | Expect |
|---|---|---|
| B1 | On the home page, pinch to zoom in, then out. | Zoom works and is not blocked. |

## C. Desktop, Safari or Firefox — whichever is not Chrome

| # | Do this | Expect |
|---|---|---|
| C1 | Open the home page in a normal window. | Header is a single row, pinned to the top as you scroll. |
| C2 | Press **Tab** repeatedly from the top of the page. | First press reveals a **Skip to content** link. Every link and button then shows a clear focus ring as you move through. Nothing is skipped and nothing is invisible while focused. |
| C3 | Zoom the browser to **400%** (Cmd/Ctrl + several times). | Page reflows to a single column. No sideways scrollbar on the page. |
| C4 | Open a book page and a poem page at 400%. | Same — readable, single column, no horizontal scrolling. |
| C5 | Toggle the theme, then reload. | Choice sticks. |

---

## What to send back

For anything that fails, this is all that's needed:

1. Which line above (A8, C3, and so on).
2. Device and browser — "iPhone 14, Safari" is enough.
3. A screenshot.

**Do not spend time on:** anything that looks merely different from a desktop, page weight or
loading speed (the lab numbers cover that and real speed depends on the network you happen to be
on), or spelling and content, which were checked in Prompts 02 and 05.

## Still not covered by anything, here or on a device

- A real screen reader (VoiceOver, NVDA). The structure is correct — landmarks, one `h1` per page,
  no missing `alt` — but structure being correct is not the same as it sounding right.
- Field performance. There is no Chrome UX Report data for this site and there cannot be until it
  is indexed and has traffic. Worth checking once, a month after cutover.
- Older Safari. The theme system, the narrow-screen header and the nav fade all use CSS that is
  well supported now but not in Safari 14 and earlier.
