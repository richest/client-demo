# Hearth Catalog

Hearth is a production-ready conversion of the provided HTML prototype into a scalable, high-performance Next.js 15 application. The visual language, interaction model, and product-browsing flow stay faithful to the prototype while the underlying architecture is rebuilt for maintainability, performance, accessibility, and interview-level code quality.

## High-Performance, API-First Architecture

Hearth transitions from client-side state manipulation to a robust, scalable **API-First Architecture**. Instead of loading the entire product catalog into the client's memory, all search indexing, relevance scoring, facet generation, sorting, and pagination are handled dynamically on the server via Next.js API Routes.

### Key Architectural Pillars:
1. **Server-Side Pagination**: Slices product results on the server (9 items per page) to keep the client DOM footprint small and load times instant.
2. **Debounced Filters & Search**: State changes in search input (300ms) and category/brand/price filters (250ms) are debounced on the client before querying the API, preventing request spam and layout thrashing.
3. **HTTP Edge Caching**: Response payloads from the `/api/products` endpoint include cache-control headers (`s-maxage=60, stale-while-revalidate=600`) to enable Edge/CDN caching and deliver sub-millisecond response times for hot queries.
4. **Resilient Data Pipelines**: Product data is fetched and normalized from the remote source. A local fallback dataset is maintained to ensure graceful degradation if the upstream feed becomes unavailable.

---

## Overview & Features

This project focuses on a polished search and discovery experience for a large product catalog:

- **Search UX**:
  - Instant search input feedback
  - Debounced backend querying (300ms delay)
  - Autocomplete search suggestions (Recent searches & matching products/brands/categories)
  - Search term match highlighting
  - Keyboard shortcut (`/` to focus search, `Esc` to close suggestions, `Arrows` + `Enter` to navigate suggestions)
  - Recent searches persisted via `localStorage`
- **Product Filtering & Sorting**:
  - Quick category selection chips
  - Collapsible, sticky sidebar with multi-select checkboxes for Categories and Brands
  - Responsive price range slider (dynamically capped to the highest price in the dataset)
  - In-stock availability filter
  - Multiple sorting options: Relevance, Price (Asc/Desc), Rating (Desc), and Newest
  - Active filter chips with single-click removal and "Clear All" capability
- **Product Discovery & Interaction**:
  - Responsive Product Grid with skeleton loaders during transition states
  - Wishlist persistence in `localStorage` with header counter
  - Detailed product viewing via a fully accessible, responsive product details modal (`ProductModal`)
  - Auto-scroll-to-top on search query, pagination, or filter changes
  - **URL Query Parameter Synchronization**: Filter values, search queries, sorting preferences, and page indices are dynamically synced to the browser address bar, making searches fully shareable and bookmarkable, with full browser back/forward navigation support.

---

## Tech Stack

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript** (Strict Mode)
- **Tailwind CSS 4**
- **No UI component libraries** (pure Tailwind & custom React components)

---

## Setup & Running

```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Build the production bundle
npm run build

# Start the production server
npm run start

# Type-check TypeScript code
npm run type-check
```

Once running, open [http://localhost:3000](http://localhost:3000).

---

## Search & Relevance Strategy

The search implementation is designed for maximum quality and relevance:
- **Search Scope**: Queries span title, brand, category, and tags.
- **Relevance Scoring**: Server-side relevance scoring uses a weighted mapping:
  - Title prefix matches: `+10`
  - Title contains matches: `+6`
  - Brand contains matches: `+4`
  - Category contains matches: `+3`
  - Tag contains matches: `+2`
  - General text matches: `+1`
- **Suggestions Engine**:
  - When empty: Displays recent searches and popular categories.
  - When typing: Matches up to 4 relevant products and up to 2 categories/brands as supplemental suggestions.

---

## Directory Structure & Architecture Decisions

The codebase is organized into modules with clean separation of concerns:

*   **`app/page.tsx`**: Renders the shell and mounts the main client dashboard component.
*   **`app/api/products/route.ts`**: The core backend controller. Performs search ranking, category/brand facet counting, price cap computation, filtering, and server-side pagination. Appends Cache-Control headers for Edge caching.
*   **`components/`**: Modular presentational units:
    *   `ProductDiscovery.tsx`: Main page layout coordinating the search state and views.
    *   `SearchBar.tsx` & `SearchSuggestions.tsx`: Handles input focus, keybinds, and autocomplete items.
    *   `SidebarFilters.tsx`: Collapsible accordion filters (desktop sidebar and mobile sliding drawer).
    *   `ProductModal.tsx`: Accessible detailed viewing modal.
    *   `PaginationControls.tsx`: Standard page numbers and page change controls.
    *   `ProductCard.tsx` & `ProductGrid.tsx`: Render layouts for search items.
*   **`hooks/useSearch.ts`**: Central frontend state machine. Manages search queries, selected filters, pagination indices, mobile sidebar visibility, and local storage (wishlist/recent searches). Handles debouncing logic for all API inputs.
*   **`lib/normalizeProducts.ts`**: Handles server-side fetching of remote datasets and sanitizes inconsistent formatting safely.
*   **`lib/search.ts`**: Pure helper functions for search indexing, score computation, pagination, highlighting, and active filter formatting.
*   **`types/product.ts`**: Static TypeScript interfaces defining Products, Filters, Suggestions, and Sorting contracts.

---

## Performance Optimizations

- **`useMemo` Memoization**: Avoids expensive calculations on the client:
  - Facet rendering
  - Wishlist set membership
  - Popular category calculation
- **`useDeferredValue`**: Prevents user typing lag by deferring low-priority rendering of the product list during rapid keyboard inputs.
- **Client-Side Debouncing**: Combines `useDebounce` with state setters. Only issues API requests when the user pauses typing or dragging sliders.
- **`React.memo`**: Applied to `<ProductCard />` to prevent unnecessary re-renders of offscreen or unchanged cards.
- **Rendering & Images**:
  - Native lazy loading (`loading="lazy"`) for remote images.
  - CSS `content-visibility: auto` on product cards to allow browsers to skip layout and rendering computations for off-screen items.

---

## Accessibility

- Semantic HTML5 landmark structure (`<header>`, `<main>`, `<section>`, `<aside>`, `<article>`).
- Keyboard navigable search suggestions and product details modal.
- Native focus ring support (`focus-visible:ring`).
- Explicit ARIA attributes on dynamic elements (combobox listbox, details modal, close actions).
- Mobile filter drawer with full scroll locks.

---

## Future Improvements

- Integrate search analytics to track top searches, zero-result terms, and clicked suggestions.
- Improve ranking with token-based frequency indexing (e.g., TF-IDF style) and typo tolerance.
- Implement virtualization for extremely large visible grid structures.
- Add fully automated test coverage for normalization, ranking, and suggestions behavior.

