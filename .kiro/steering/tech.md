# Tech Stack

## Core Framework
- **Astro 6** — static site generator (output: static)
- **TypeScript** — type checking via `astro check`

## Styling
- **Tailwind CSS 3** with `@tailwindcss/typography` plugin
- **DaisyUI 4** — component library on top of Tailwind
- **SCSS** (sass-embedded) — custom styles in `src/styles/`
- **PostCSS** with autoprefixer

## Content & Markdown
- **Astro MDX** — MDX support for blog posts
- **Astro Content Collections** — blog posts defined in `src/content/blog/`
- **remark-math + rehype-katex** — math rendering
- **astro-expressive-code** — code block styling (theme: github-dark)
- **rehype-external-links** — external link handling

## Search
- **Pagefind** — client-side static search index (built post-build)

## Icons
- **astro-icon / astro-iconify** with Iconify JSON icon sets (lucide, material-symbols, mdi, ri, simple-icons, tabler, logos)

## Utilities
- **dayjs** — date formatting
- **sharp** — image processing
- **satori** — OG image generation
- **medium-zoom** — image zoom
- **slugify** — URL slug generation
- **octokit** — GitHub API (for repository cards)
- **@notionhq/client** — Notion integration

## Page Transitions
- **@swup/astro + astro-vtbot** — view transitions

## Build & Optimization
- **@playform/compress** — HTML/CSS/JS compression
- **@rollup/plugin-terser** — JS minification

## Linting & Formatting
- **Biome** — linter and formatter (replaces ESLint + Prettier for JS/TS)
  - Indent: spaces
  - Quotes: double
  - Organizes imports automatically
- **Prettier** with `prettier-plugin-astro` — for `.astro` files

## Common Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Type-check, build site, generate Pagefind index |
| `pnpm preview` | Preview production build locally |
| `pnpm check` | Run Astro type checking |
| `pnpm lint` | Biome check + auto-fix on `./src` |
| `pnpm format` | Biome format + write on `./src` |
| `pnpm biome:check` | Biome check without auto-fix |
| `pnpm check-all` | Astro check + Biome check combined |
| `pnpm search:index` | Build site and copy Pagefind index to public |

## Package Manager
- **pnpm** (lockfile: `pnpm-lock.yaml`)
