import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quality Control | Jewelry ERP',
  description: 'Quality control and inspection management for jewelry manufacturing',
};

export default function QualityLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="quality-module">
      {children}
    </div>
  );
}
