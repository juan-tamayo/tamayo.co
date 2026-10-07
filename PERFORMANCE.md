# SEO and performance verification

Tested October 1, 2026 with Lighthouse against `http://127.0.0.1:8087/`, using a clean headless Chrome session and Lighthouse's default simulated mobile throttling. Production canonical URLs remain `https://tamayo.co/`.

## Baseline and changes

| Category | Baseline mobile | Optimized mobile | Optimized desktop |
| --- | ---: | ---: | ---: |
| Performance | 98 | 100 | 100 |
| Accessibility | 96 | 100 | 100 |
| Best practices | 100 | 100 | 100 |
| SEO | 100 | 100 | 100 |

| Change | Evidence | Outcome |
| --- | --- | --- |
| Subset and compress fonts to WOFF2; preload both weights | Combined font size fell from about 136 KB to 22 KB | Kept; mobile performance reached 100 |
| Deliver logo as WebP with a small navigation variant | Hero logo fell from about 38 KB to 11 KB; navigation logo is 1.4 KB | Kept; less network transfer |
| Keep contact heading at full opacity during scroll animation | Baseline contrast audit failed on the translucent heading | Kept; accessibility reached 100 |
| Add canonical metadata, social previews, profile structured data, robots and sitemap | Structured data parses; Lighthouse SEO checks pass | Kept for discovery and sharing; no ranking guarantee |

Optimized mobile metrics: FCP 1.0 seconds; LCP 1.7 seconds; total blocking time 0 milliseconds; cumulative layout shift 0; speed index 2.5 seconds. These are lab metrics; this run does not measure real-user INP.

## Hosting verification

The local preview does not support Apache cache or compression settings. `.htaccess` includes those settings for IONOS hosting, but their effect must be verified after upload. A read-only HTTPS request to `https://tamayo.co/` failed with a TLS handshake error during this task, so the production site could not be audited.

After uploading the archive and activating SSL:

1. Confirm the homepage, sitemap, robots file, and assets return HTTP 200 over HTTPS.
2. Confirm CSS, scripts, fonts, and images have the configured cache headers and text responses are compressed.
3. Run PageSpeed Insights for both mobile and desktop at `https://pagespeed.web.dev/`. Hosting latency, certificates, network variability, and future changes can affect the score.
4. Verify the domain in Google Search Console and submit `https://tamayo.co/sitemap.xml`; validate structured data in Google's Rich Results Test.

## Repeatable local checks

```sh
npx --yes lighthouse http://127.0.0.1:8087/ --chrome-flags='--headless --no-sandbox' --output=html --output=json --output-path=/tmp/tamayo-mobile --quiet
npx --yes lighthouse http://127.0.0.1:8087/ --preset=desktop --chrome-flags='--headless --no-sandbox' --output=html --output=json --output-path=/tmp/tamayo-desktop --quiet
```

Retest these four score categories after changing fonts, above-the-fold assets, motion, or hosting. Do not introduce audit-specific behavior: visitors and Lighthouse receive the same page.
