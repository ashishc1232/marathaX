import { Helmet } from '@dr.pogodin/react-helmet';
import { type ReactElement } from 'react';
import { ScrollRestoration } from 'react-router';

import HomepageSameAsJsonLd from '@/components/HomepageSameAsJsonLd';
import Website from '@/layouts/Website';

/**
 * Root layout — MARATHAX pages include their own MarathaxLayout (header + footer).
 * This wrapper provides the base HTML shell and site-wide defaults only.
 */
interface RootLayoutProps {
  children: ReactElement;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <Website>
      <Helmet>
        <title>MARATHAX — India's Fittest Challenge</title>
        <meta name="description" content="MARATHAX — India's premier military-style fitness challenge. 6 running sections. 6 workout stations. ₹3,00,000+ prize pool. 10 January 2027." />
      </Helmet>
      <HomepageSameAsJsonLd />
      <ScrollRestoration />
      {children}
    </Website>
  );
}
