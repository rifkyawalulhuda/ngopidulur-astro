# Project Structure

```
├── frosti.config.yaml        # Main site configuration (metadata, menus, user info, themes)
├── astro.config.mjs          # Astro framework configuration (integrations, plugins)
├── biome.json                # Biome linter/formatter config
├── postcss.config.mjs        # PostCSS (Tailwind + autoprefixer)
├── ec.config.mjs             # Expressive Code config
├── public/                   # Static assets served as-is
│   ├── admin/                # Decap CMS (Netlify CMS) admin panel
│   ├── image/                # Static images referenced in content
│   ├── favicon.ico
│   ├── logo.png
│   └── profile.png
├── src/
│   ├── config.ts             # Reads frosti.config.yaml, exports site constants + t() helper
│   ├── content.config.ts     # Astro content collection definitions (blog schema)
│   ├── content/
│   │   └── blog/             # Blog posts (*.md / *.mdx)
│   ├── components/
│   │   ├── *.astro           # Top-level layout components (Header, Footer, Navbar, Sidebar, etc.)
│   │   ├── mdx/              # MDX-specific components (alerts, collapse, cards, timeline, etc.)
│   │   ├── sidebar/          # Sidebar sub-components (Profile, Search, TOC, Toolbar)
│   │   ├── temple/           # Template/partial components
│   │   └── widgets/          # Reusable widget components
│   ├── i18n/
│   │   └── translations.yaml # UI string translations keyed by language code
│   ├── integration/
│   │   └── updateConfig.ts   # Custom Astro integration for config updates
│   ├── interface/
│   │   ├── data.ts           # Data type interfaces
│   │   └── site.ts           # Site config type interfaces
│   ├── layouts/
│   │   └── BaseLayout.astro  # Root layout wrapper
│   ├── pages/
│   │   ├── index.astro       # Home page
│   │   ├── about.astro       # About page
│   │   ├── project.astro     # Project showcase
│   │   ├── friend.astro      # Friend links
│   │   ├── 404.astro         # Not found page
│   │   ├── admin.astro       # CMS admin redirect
│   │   ├── robots.txt.ts     # Dynamic robots.txt
│   │   ├── rss.xml.ts        # RSS feed generation
│   │   ├── blog/
│   │   │   ├── [...page].astro      # Paginated blog listing
│   │   │   ├── [...slug].astro      # Individual blog post
│   │   │   ├── archives.astro       # Blog archives
│   │   │   ├── categories.astro     # Category listing
│   │   │   ├── tags.astro           # Tag listing
│   │   │   ├── search.astro         # Search page (Pagefind UI)
│   │   │   ├── category/[category]/ # Posts filtered by category
│   │   │   └── tag/[tag]/           # Posts filtered by tag
│   │   └── og/              # OG image generation endpoints
│   ├── plugins/
│   │   └── remark-reading-time.ts  # Custom remark plugin for reading time
│   ├── styles/
│   │   ├── global.scss       # Global styles
│   │   └── waline.scss       # Waline comment system styles
│   └── utils/
│       ├── blogUtils.ts      # Blog post helpers (sorting, filtering)
│       ├── dayjs.ts          # dayjs instance configuration
│       └── paginationUtils.ts # Pagination logic
└── docs/                     # Project documentation and assets
```

## Key Conventions

- **Configuration**: Site-wide settings live in `frosti.config.yaml`, not hardcoded. Access them via exports from `src/config.ts`.
- **Content**: Blog posts go in `src/content/blog/` as `.md` or `.mdx` files with required frontmatter (title, description, pubDate).
- **Components**: Astro components (`.astro`) are the primary UI building blocks. MDX components are in `src/components/mdx/`.
- **Routing**: File-based routing in `src/pages/`. Dynamic routes use `[param]` and `[...rest]` patterns.
- **Types**: TypeScript interfaces for data shapes live in `src/interface/`.
- **Path aliases**: `@interfaces` maps to `src/interface/` (used in imports like `@interfaces/site`).
- **Styling**: Use Tailwind utility classes + DaisyUI components. Custom SCSS only in `src/styles/`.
- **Static assets**: Place in `public/` for direct URL access (e.g., `/image/photo.jpg`).
