import { Suspense, lazy, ReactNode } from "react";

/**
 * Lazy-load chart components
 * Usage: <LazyChart component={BarChart} data={data} />
 */

interface LazyChartProps {
  component: React.LazyExoticComponent<React.ComponentType<any>>;
  data: any;
  [key: string]: any;
}

const ChartFallback = () => (
  <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
    <p className="text-gray-600">Loading chart...</p>
  </div>
);

export const LazyChart = ({
  component: ChartComponent,
  data,
  ...props
}: LazyChartProps) => {
  return (
    <Suspense fallback={<ChartFallback />}>
      <ChartComponent data={data} {...props} />
    </Suspense>
  );
};