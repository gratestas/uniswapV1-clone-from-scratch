import { TransactionProvider } from '../context/TransactionContext'
import { WalletProvider } from '../context/WalletContext'
import Layout from '../components/shared/Layout'

import '../styles/globals.css'
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>My App</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" key="font" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
          key="font"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </Head>
      <WalletProvider>
        <TransactionProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </TransactionProvider>
      </WalletProvider>
    </div>
  )
}

export default MyApp
