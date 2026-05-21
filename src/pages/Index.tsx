
import React from 'react';
import AppLayout from '@/components/AppLayout';
import { AppProvider } from '@/contexts/AppContext';

const Index: React.FC = () => {
  return (
    <AppProvider>
      <AppLayout />
    </AppProvider>
  );
};

export default Index;
echo "// touch to trigger deploy" >> src/pages/NotFound.tsx
git add src/pages/NotFound.tsx
git commit -m "Trigger Vercel redeploy for NotFound"
git push
