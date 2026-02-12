# Image Assets

Replace the SVG placeholders in `index.html` with real images for production use.

## Recommended Images

| Section | File | Suggested Content | Recommended Size |
|---------|------|-------------------|-----------------|
| Hero | `hero-bg.jpg` | Construction site or renovation in progress | 1920x1080 |
| About | `about-team.jpg` | Team photo or project walkthrough | 800x600 |
| Portfolio | `project-1.jpg` | Kitchen remodel (before/after) | 800x600 |
| Portfolio | `project-2.jpg` | Bathroom renovation | 800x600 |
| Portfolio | `project-3.jpg` | Home addition | 800x600 |
| Portfolio | `project-4.jpg` | Commercial build-out | 800x600 |
| Portfolio | `project-5.jpg` | Industrial kitchen | 800x600 |
| Portfolio | `project-6.jpg` | Master bathroom | 800x600 |

## Image Sources (Royalty-Free)

- [Unsplash](https://unsplash.com/s/photos/construction)
- [Pexels](https://pexels.com/search/renovation/)
- [Pixabay](https://pixabay.com/images/search/construction/)

## To Replace Placeholders

1. Add your images to this directory
2. In `index.html`, replace `<div class="portfolio__image-placeholder">` SVGs with `<img>` tags
3. Use `data-src` attribute for lazy loading: `<img data-src="images/project-1.jpg" alt="...">`
