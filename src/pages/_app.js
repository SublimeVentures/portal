import '@/styles/globals.scss'
import Layout from '@/components/Layout/Layout';

export default function App({ Component, pageProps }) {
    const renderWithLayout =
        Component.getLayout ||
        function (page) {
            return <Layout>{page}</Layout>;
        };

  return renderWithLayout(
      <Component {...pageProps} />
  );
}
