# Connect tamayo.co to Netlify

1. Extract `output/tamayo-netlify.zip`. Upload the extracted folder containing `index.html` through Netlify's manual deployment interface. No build command is required.
2. In the deployed project's Domain management, add `tamayo.co` as a custom production domain. Netlify adds `www.tamayo.co` as well. Set `tamayo.co` as the primary domain to match this site's canonical URLs.
3. Use external DNS. Current DNS checks on October 1, 2026 show IONOS nameservers, so edit the records in IONOS rather than Namecheap's Advanced DNS screen.
4. In Netlify, open Pending DNS verification for the exact records required by your project. For the standard Netlify network, use an A record at `@` pointing to `75.2.60.5`, and a CNAME at `www` pointing to your project's actual `*.netlify.app` hostname. Replace conflicting website records at these two hosts, including any old IPv6 AAAA record directing traffic to IONOS. Preserve all Private Email MX and email authentication records.
5. After DNS propagation, check HTTPS in Netlify Domain management. Netlify automatically provisions and renews a free Let's Encrypt certificate once DNS validation succeeds.

No nameserver switch is required when using external DNS. Registration remains at Namecheap, DNS remains at IONOS, and mail remains at Private Email. If you later cancel IONOS, move DNS to another provider and recreate all records before its DNS service ends.

Netlify reads `_headers` for cache and security headers, handles HTTPS automatically, and does not use Apache `.htaccess`. The Netlify upload archive excludes `.htaccess`, unused assets, and local audit reports.

## Activate the contact form

Before deploying this update, open the project's Forms page and select Enable form detection. Redeploy the extracted upload package, including `thanks.html`. Confirm that a form named `contact` appears in Netlify. It uses Netlify spam filtering plus a hidden `bot-field` honeypot.

In the project's form notification settings, add an email notification for `contact` to your Private Email inbox. The destination is kept in Netlify settings, not in public HTML. Send a test message from the live site, confirm that it appears under verified submissions, and confirm the notification arrives. The local Python preview cannot receive submissions; its submit handler explains this instead of claiming success. This form also requires Netlify when hosting elsewhere, so the IONOS upload package is no longer a functional form deployment.

The original downloadable resume is unchanged and may still expose your address. The form removes the address from the HTML only. Periodically review and delete old submissions you no longer need in Netlify.

Sources:
- https://docs.netlify.com/manage/domains/configure-domains/configure-external-dns/
- https://docs.netlify.com/manage/domains/secure-domains-with-https/https-ssl/
- https://docs.netlify.com/manage/routing/headers/
- https://docs.netlify.com/manage/forms/setup/
- https://docs.netlify.com/manage/forms/spam-filters/
- https://docs.netlify.com/manage/forms/notifications/
