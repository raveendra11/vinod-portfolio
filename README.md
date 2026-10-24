# Vinod Kumar Pujari — Portfolio

Personal portfolio site: plain HTML, CSS, and a little vanilla JS. There's no build step, so it can be hosted directly on GitHub Pages.

```
index.html                       ← the site
assets/css/style.css
assets/js/main.js
assets/favicon.svg
Vinod_Kumar_Pujari_Resume.pdf    ← linked from the "Download résumé" buttons
.nojekyll                        ← tells GitHub Pages to serve files as-is
```

## Preview locally

Open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

## Deploy to GitHub Pages

1. Create a repository on GitHub. Naming it `raveendra11.github.io` gives you the root URL `https://raveendra11.github.io/`. Any other name, e.g. `portfolio`, is served at `https://raveendra11.github.io/portfolio/`.
2. Push this folder:

   ```bash
   git init
   git add .
   git commit -m "Add portfolio site"
   git branch -M main
   git remote add origin https://github.com/raveendra11/<repo-name>.git
   git push -u origin main
   ```

3. On GitHub, open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then click **Save**.
4. After a minute or so, the site is live at the URL shown on that page.

### Optional: custom domain (vinod26.online)

On the same **Settings → Pages** screen, enter `vinod26.online` under **Custom domain** and enable **Enforce HTTPS**. Then, at your domain registrar, add the DNS records described in [GitHub's custom domain guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site):

- four `A` records for the apex domain
- a `CNAME` for `www` pointing to `raveendra11.github.io`

## Updating content

All text lives in `index.html`, so edit it directly. To update the résumé, replace `Vinod_Kumar_Pujari_Resume.pdf` and keep the same file name. If you rename it, update the links in `index.html` too.
