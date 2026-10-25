# BrandFlow Tech Pvt. Ltd. — Static Website

A plain static website: HTML, CSS and JavaScript only. No backend, no paid libraries, no build step.
It can be hosted for free on GitHub Pages or Cloudflare Pages.

## Files

```
index.html            the whole website (all 9 sections)
style.css             all styles (colours are set at the top, under :root)
script.js             mobile menu, KPI tracking, manual buttons, contact form
favicon.ico
assets/
  brandflow-logo.png  full logo
  brandflow-mark.png  logo mark
  favicon-32.png, apple-touch-icon.png
  fonts/              Mukta + JetBrains Mono (free, SIL Open Font License, self-hosted)
  video/              mero-hisab-tutorial.mp4 (~3 min, 12 MB) + poster image
                      (preload="none": no video data downloads until the visitor presses play)
README.md             this file
```

---

## 1. Test the website on Windows

### Option A — just open it (quickest)
1. Unzip `brandflow-website.zip` (right-click → **Extract All…**).
2. Open the extracted folder and double-click **index.html**.
   It opens in Chrome/Edge. Everything works except that some browsers are stricter
   with fonts on local files — Option B is closer to the real hosted site.

### Option B — run a small local server (recommended)
**With Python** (install free from https://www.python.org — tick "Add Python to PATH"):
1. Open the extracted folder in File Explorer.
2. Click the address bar, type `cmd`, press **Enter**. A black window opens in that folder.
3. Type:
   ```
   python -m http.server 8000
   ```
4. Open **http://localhost:8000** in Chrome or Edge.
5. To stop: go back to the black window and press **Ctrl + C**.

**With VS Code** (free): install the **Live Server** extension, open the folder,
right-click `index.html` → **Open with Live Server**.

### Check mobile and tablet views
In Chrome or Edge press **F12**, then **Ctrl + Shift + M** (device toolbar).
Choose sizes such as 390 × 844 (mobile), 768 × 1024 (tablet), 1366 × 768 (laptop).

### See KPI events while testing
With F12 open, click the **Console** tab. Every tracked click prints a line like
`[KPI] manual_view goldshop`. (Turn this off with `KPI_DEBUG = false` in `script.js`.)

---

## 2. Things to fill in later (placeholders)

| What | Where | How |
|---|---|---|
| Mero Hisab manual PDF | `index.html`, card `id="manual-mero-hisab"` | Put the PDF address in **both** buttons' `data-manual-url=""` |
| GoldShop manual PDF | `index.html`, card `id="manual-goldshop"` | Same as above |
| Website address | `index.html` `<head>`: `[WEBSITE_URL]` (canonical + og:url) | Replace with the final address |
| Share image | `index.html` `<head>`: `[OG_IMAGE_URL]` | A 1200 × 630 image, full URL |
| Analytics | `index.html` `<head>`, "ANALYTICS PLACEHOLDER" comment | Paste your Google Analytics 4 snippet |
| Contact form service | `script.js`, `FORM_ENDPOINT` | See section 3 |

**Manual PDFs:** easiest is to put the two PDF files in a folder `docs/` next to `index.html`
and use e.g. `data-manual-url="docs/mero-hisab-user-manual.pdf"`.
While `data-manual-url` is empty, the buttons stay on the page and show a
"छिट्टै उपलब्ध हुनेछ" note — they never open a fake link.

---

## 3. Make the contact form send messages

Right now the form is **not connected** to any sending service. When a visitor presses
Submit, it does **not** pretend the message was sent. It clearly says
"अनलाइन फारम अहिले सक्रिय छैन — तपाईंको सन्देश पठाइएको छैन" and offers two working options:
open their email app with the message already filled in (to brandflowpvtltd@gmail.com), or call 9855065390.

To receive messages directly in your inbox, connect a free form service:

### Option 1 — Formspree (free plan)
1. Sign up at https://formspree.io with brandflowpvtltd@gmail.com and create a form.
2. Copy the form address, e.g. `https://formspree.io/f/abcdwxyz`.
3. In `script.js` set:
   ```js
   var FORM_ENDPOINT = "https://formspree.io/f/abcdwxyz";
   ```
4. Upload the site, send a test message, and confirm the email in Formspree.

### Option 2 — Web3Forms (free plan)
1. Go to https://web3forms.com, enter brandflowpvtltd@gmail.com, and get an Access Key.
2. In `script.js` set:
   ```js
   var FORM_ENDPOINT = "https://api.web3forms.com/submit";
   var WEB3FORMS_ACCESS_KEY = "your-access-key";
   ```

After connecting, the success message ("धन्यवाद! तपाईंको सन्देश प्राप्त भयो।") is shown **only**
when the service confirms it received the message. If sending fails, the visitor is told and
offered email/phone instead. A hidden spam-trap field is already included.

*(Check each service's current free-plan limits before choosing.)*

---

## 4. KPI tracking

Every trackable link/button carries a `data-kpi` label. `script.js` sends each one to
Google Analytics 4 / Google Tag Manager (once you add the snippet) as an event:

| KPI | Event name | Details |
|---|---|---|
| Product page visits | `product_page_visit` | `mero_hisab` / `goldshop` — on clicks, and when a visitor stays on a product section 1.5 s |
| Mero Hisab manual views | `manual_view` | `mero_hisab` (+ `manual_download`) |
| GoldShop manual views | `manual_view` | `goldshop` (+ `manual_download`) |
| Demo requests | `demo_request` | `mero_hisab` / `goldshop`, and on successful form send |
| Contact inquiries | `contact_inquiry` | `pricing`, `form_submit_success`, `form_submit_not_connected`, `form_submit_error` |
| Phone clicks | `phone_click` | |
| Email clicks | `email_click` | `support` for the secondary address |
| Product interest | `product_interest` | `mero_hisab_app` / `goldshop_app` (App खोल्नुहोस्) and the product chosen in the form |
| Video tutorial (extra) | `video_view`, `video_play`, `video_chapter`, `video_complete` | Mero Hisab tutorial: link clicks, first play, chapter jumps, watched to the end |

---

## 5. Free hosting (when you are ready — not done yet)

- **GitHub Pages:** create a repository, upload all files (keep the folder structure),
  then Settings → Pages → Deploy from branch → `main` / root.
- **Cloudflare Pages:** Create project → Direct Upload → drag the whole folder.

No build command or settings are needed. The 12 MB video is well within GitHub Pages and Cloudflare Pages file limits. Update `[WEBSITE_URL]` once you know the address.

---

## 6. Facts used on the site (from the supplied documents)

- BrandFlow Tech Pvt. Ltd. · भरतपुर महानगरपालिका–१२, चितवन · संस्थापक: ईश्वरचन्द्र पौड्याल
- Phone 9855065390 · Main email brandflowpvtltd@gmail.com · Support email brandflowaiml@gmail.com
- Mero Hisab app: https://merohisab.duckdns.org/ (opens in a new tab)
- Nepal GoldShop app: https://goldshop-erp-2cwhxi7s7a-el.a.run.app/ (opens in a new tab; login details come from the shop's Owner/SuperAdmin, as the manual says)
- Mero Hisab video tutorial (supplied video), with chapter buttons
- 14 official company objectives, and only features described in the two user manuals.
- No pricing, statistics, testimonials or customer logos are shown.
