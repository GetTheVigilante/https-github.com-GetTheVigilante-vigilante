/**
 * Lazy-load recharts to reduce initial bundle
 * Only import when charts are actually needed on a page
 */

export const loadRecharts = async () => {
  // Dynamically import the entire recharts library
  return import("recharts");
};

/**
 * Usage in a component:
 *
 * import { Suspense, lazy } from 'react';
 * const ChartComponent = lazy(() =>
 *   loadRecharts().then(() => import('./ChartComponent'))
 * );
 *
 * // In JSX:
 * <Suspense fallback={<div>Loading chart...</div>}>
 *   <ChartComponent />
 * </Suspense>
 */