# Performance Optimization Guide

This document outlines the performance optimizations made to your Vite + React application.

## Changes Made

### 1. **Vite Configuration (`vite.config.ts`)**

#### Code Splitting
- Automatic vendor chunk creation for Radix UI, React Router, Supabase, Charts, and Markdown
- Separates large dependencies into individual chunks for parallel loading
- Reduces initial bundle size

#### Minification
- Terser minification enabled with:
  - Console.log removal in production
  - Debugger statements removal
  - Dead code elimination

#### CSS Optimization
- CSS code splitting enabled (`cssCodeSplit: true`)
- Each component's CSS loads only when needed

#### Bundle Analysis
- `vite-plugin-visualizer` enabled
- Run `npm run build:analyze` to see interactive bundle breakdown
- Helps identify which dependencies take the most space

### 2. **TypeScript Configuration (`tsconfig.json`)**

Tightened compiler options to catch unused code:
```json
{
  "noImplicitAny": true,           // Force explicit types
  "noUnusedParameters": true,      // Catch unused function parameters
  "noUnusedLocals": true,          // Catch unused variables
  "strictNullChecks": true,        // Strict null/undefined checking
  "strict": true                   // All strict options enabled
}
```

**Benefits:**
- TypeScript will catch dead code during development
- Prevents unused imports from shipping to production
- Better type safety overall

### 3. **Lazy Loading Utilities**

#### Supabase Client (`src/lib/supabase-client.ts`)
```typescript
import { getSupabaseClient } from '@/lib/supabase-client';

// In your component:
const supabase = getSupabaseClient();
```

**Why:** Supabase client loads only when first used, not on initial page load.

#### Markdown Parser (`src/lib/markdown.ts`)
```typescript
import { parseMarkdown } from '@/lib/markdown';

const html = await parseMarkdown(markdown);
```

**Why:** Marked + highlight.js (52KB combined) loads only when rendering markdown.

#### Recharts (`src/lib/recharts-loader.ts`)
```typescript
import { loadRecharts } from '@/lib/recharts-loader';

const ChartComponent = lazy(() =>
  loadRecharts().then(() => import('./MyChart'))
);
```

**Why:** Charts library (40-60KB) loads on-demand, not with initial bundle.

### 4. **Lazy Chart Component (`src/components/LazyChart.tsx`)**

Ready-to-use component for lazy-loading any chart:
```typescript
import { LazyChart } from '@/components/LazyChart';

<LazyChart 
  component={lazy(() => import('./BarChart'))} 
  data={data} 
/>
```

## Performance Checklist

### Before Deployment

- [ ] Run `npm run build:analyze` and review bundle
- [ ] Check that unused Radix UI components are removed
- [ ] Verify Recharts is only loaded on chart pages
- [ ] Remove markdown dependencies if not used
- [ ] Run `npm run type-check` - fix all TS errors
- [ ] Remove `visualizer` plugin before production build (optional)

### Measurements

Use Lighthouse in Chrome DevTools to measure:
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)
- Time to Interactive (TTI)

**Target metrics:**
- FCP: < 1.8s
- LCP: < 2.5s
- CLS: < 0.1

## Removing Unused Dependencies

Review your actual component usage:

```bash
# Audit unused Radix UI components
# Only import what you use:

# BEFORE (importing all):
import * from '@radix-ui/react-accordion';
import * from '@radix-ui/react-dialog';
// ... 16 more imports

# AFTER (import only what's used):
// Only import the components you actually use in your app
```

## Optional Removals

If you're **not** using these, remove them to save space:

### Remove Recharts (if no charts)
```bash
npm uninstall recharts
```

### Remove Markdown Libraries (if no markdown content)
```bash
npm uninstall marked highlight.js
```

### Remove unused Radix UI components
Review package.json and keep only what you use.

## Next Steps

1. Run `npm install` to install new dev dependencies (vite-plugin-visualizer, terser)
2. Run `npm run build:analyze` to see your bundle breakdown
3. Use the visualizer output to identify other large dependencies
4. Remove unused Radix UI components
5. Test the app thoroughly with `npm run dev`
6. Deploy with `npm run build`

## Resources

- [Vite Build Optimization](https://vitejs.dev/guide/build.html)
- [Code Splitting](https://vitejs.dev/guide/features.html#dynamic-import)
- [Web Vitals](https://web.dev/vitals/)
- [Bundle Analysis](https://github.com/btd/rollup-plugin-visualizer)
