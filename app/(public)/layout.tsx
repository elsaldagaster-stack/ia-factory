import React from 'react';

export default function PublicLayout({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <div className="page page-center" style={{ alignItems: 'center' }}>
      {children}
    </div>
  );
}
