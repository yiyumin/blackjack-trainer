import '../styles/globals.css';
import type { AppProps } from 'next/app';

import { SupabaseProvider } from '../contexts/SupabaseProvider';
import { SettingsProvider } from '../contexts/SettingsProvider';
import Layout from '../components/Layout';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SupabaseProvider>
      <SettingsProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SettingsProvider>
    </SupabaseProvider>
  );
}

export default MyApp;
