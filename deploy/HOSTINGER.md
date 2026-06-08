# Deploy to Hostinger (shared hosting)

This site is exported as **static HTML** for Apache `public_html`. Node.js is **not** required on the server.

## Why the site looked broken

Hostinger File Manager often **fails to create subfolders** when extracting Windows zips (paths like `images\file.webp` become broken filenames on Linux). The HTML uploads but **`nxt/`** (CSS/JS) and **`images/`** do not — so the page has no styles.

The build now uses **Linux-safe zip paths** and includes a **PHP extract script** that creates folders correctly on the server.

---

## 1. Build on your PC

```bash
npm run build:hostinger
```

Outputs:

| File | Purpose |
|------|---------|
| `deploy/logixalab-hostinger.zip` | Full site (upload this) |
| `deploy/logixalab-hostinger-YYYY-MM-DD.zip` | Dated backup copy |

The terminal prints a **deploy key** and extract URL — save it.

---

## 2. Upload to Hostinger (recommended: PHP extract)

1. **hPanel → File Manager → `public_html`**
2. **Delete** old site files (or move to a backup folder). Keep nothing that conflicts with the new deploy.
3. Upload these **3 files** to `public_html`:
   - `logixalab-hostinger.zip` (from `deploy/`)
   - `deploy-extract.php` (from `out/` after build, or extract from zip’s root after a test)
   - `DEPLOY-KEY.txt` (from `out/` after build — contains the secret key)

   **Easier:** upload only `logixalab-hostinger.zip`, extract it on your PC, then upload `deploy-extract.php` and `DEPLOY-KEY.txt` from the extracted `out/` folder.

4. Open in your browser (use the key from `DEPLOY-KEY.txt`):

   ```
   https://logixalab.com/deploy-extract.php?key=YOUR_KEY_HERE
   ```

5. You should see:

   ```
   [ok] index.html
   [ok] nxt/static/chunks
   [ok] images/background.webp
   [ok] .htaccess
   ```

6. Visit **https://logixalab.com** and hard-refresh (**Ctrl+Shift+R**).

7. **Delete** from `public_html` (security):
   - `deploy-extract.php`
   - `DEPLOY-KEY.txt`
   - `logixalab-hostinger.zip`

---

## 3. Alternative: FTP / FileZilla

If you use **FTP** or **FileZilla**, you can upload the **contents** of the local `out/` folder directly into `public_html` (preserve the `nxt/` and `images/` folders). This avoids zip extraction issues.

---

## 4. SSL

1. hPanel → **SSL** → enable free SSL.
2. Edit `.htaccess` and **uncomment** the HTTPS redirect block.

---

## 5. Contact form

The static site posts to **`/contact.php`**.

Optional on server: copy `contact-config.sample.php` → `contact-config.php` and set your inbox.

---

## Verify deploy is correct

In File Manager, confirm these exist under `public_html`:

```
public_html/
  index.html
  .htaccess
  nxt/static/chunks/    ← many .js and .css files
  images/               ← .webp, .png files
  contact.php
```

Open in browser:

- `https://logixalab.com/nxt/static/chunks/` — should **404** or list forbidden (not show the homepage)
- `https://logixalab.com/images/background.webp` — should show/download the image

If `index.html` references `/nxt/` but the `nxt` folder is missing, the site will look unstyled.

---

## Updating the site

1. `npm run build:hostinger`
2. Repeat upload + extract (or FTP upload `out/` contents)
3. Hard-refresh browser; purge Hostinger cache in hPanel if enabled

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Plain HTML, no layout | `nxt/` folder missing — re-run PHP extract or FTP upload |
| **Styles worked briefly, then broke again** | **Mixed deploy** — `index.html` is stale but `nxt/` is new. Git auto-deploy may be overwriting `index.html`. Disable Git deploy or fix build command (see below). |
| **index uses `/_next/` but server has `nxt/`** | Upload **full** zip again — never upload only the `nxt/` folder |
| Broken logo/images | `images/` folder missing — same as above |
| Old styles after update | Hard refresh; clear Hostinger cache |
| Extract script 403 | Use exact key from `DEPLOY-KEY.txt` |
| Contact form fails | Configure `contact-config.php`; check PHP mail in hPanel |

### Check deploy health

After upload, open:

```
https://logixalab.com/health.php
```

It should say `RESULT: OK`. If it says `/_next/` is referenced, `index.html` is wrong.

Locally you can also run:

```bash
npm run verify:live
```

---

## Hostinger Git auto-deploy (optional)

If you want `git push` to update the site, configure hPanel → **Git** like this:

| Setting | Value |
|---------|--------|
| Build command | `npm run build` *(locked in hPanel — OK)* |
| Output directory | `out` *(preferred)* or `.next` *(also works)* |

You do **not** need to change the build command in hPanel. This repo’s `npm run build` already runs the static Hostinger export (`out/` + `nxt/`).

If the output directory is also locked to `.next`, that is fine — the build copies the static site into `.next/` automatically.

**VPS / Node deploy** uses `npm run build:server` instead (see `deploy/deploy.sh`).

If Git was previously connected with the wrong build, it can keep pushing a broken `index.html` while you manually upload `nxt/`. Either fix the Git settings above or **disconnect Git deploy** and use manual zip upload only.
