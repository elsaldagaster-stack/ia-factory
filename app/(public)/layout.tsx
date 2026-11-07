import React from 'react';

export default function PublicLayout({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      {children}
    </div>
  );
}
