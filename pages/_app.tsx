import '../styles/globals.css';
import type { AppProps } from 'next/app';

import { SettingsProvider } from '../contexts/SettingsProvider';
import Layout from '../components/Layout';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SettingsProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SettingsProvider>
  );
}

export default MyApp;
