import React from 'react';
import { PageBanner } from '@/components/design/PageBanner';

export function PageHeader({ title, description, actions, children, visual, badge }) {
  return (
    <PageBanner
      title={title}
      description={description}
      action={actions || children}
      visual={visual}
      badge={badge}
    />
  );
}

export default PageHeader;
