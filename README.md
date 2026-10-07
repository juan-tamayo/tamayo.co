# Tamayo.co

For Netlify, extract and deploy `output/tamayo-netlify.zip`; see `NETLIFY.md` for the domain setup. This archive includes Netlify's `_headers` file and the transparent logo, and excludes Apache `.htaccess`. The IONOS archive below is retained as an alternative.

A standalone portfolio: HTML, CSS, JavaScript, and local assets. No installation or build step required.

Open `index.html` directly, or serve this folder with any static web server. Upload the contents of `output/tamayo-site.zip` to the document root for tamayo.co, including the hidden `.htaccess` file. The page is prepared for that domain but is not deployed by this checkout. Enable the IONOS SSL certificate before making the site public; `.htaccess` redirects the production domain to HTTPS.

Content is grounded exclusively in Juan's supplied resume. Work highlights are text-only; the supplied logo is the only displayed image. The downloadable resume is an unmodified copy of the supplied PDF. Images and fonts are hosted locally so visitors do not depend on external asset servers.

Includes responsive layouts, system-aware light/dark themes, keyboard focus styles, skip navigation, reduced-motion support, and a motion pause control. All content remains readable without JavaScript.

SEO includes a canonical URL, descriptive title and metadata, Open Graph and Twitter previews, `WebSite` / `ProfilePage` / `Person` structured data, `robots.txt`, and `sitemap.xml`. After deployment, verify `https://tamayo.co/` in Google Search Console and submit `https://tamayo.co/sitemap.xml`. Do not add a verification token until it is supplied by the domain owner.

Fonts are subsetted WOFF2 files and the displayed logo uses transparent WebP. Social previews use the transparent PNG. `.htaccess` enables compression where Apache supports it, seven-day asset caching, and revalidation of HTML. If an asset changes during that cache window, change its URL or clear the host's cache. The simple local Python preview does not process `.htaccess`; validate these headers on IONOS after upload.

Local Lighthouse measurements and their limits are recorded in `PERFORMANCE.md`; the HTML audit reports are in `output/` and excluded from the upload archive. A local score does not certify a live Google PageSpeed Insights score or search ranking.

Font: Space Grotesk, SIL Open Font License. Logo supplied by Juan. Legacy portfolio image files are unused.
