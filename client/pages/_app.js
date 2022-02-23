import { TransactionProvider } from '../context/TransactionContext'
import { WalletProvider } from '../context/WalletContext'
import Layout from '../components/shared/Layout'

import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <WalletProvider>
      <TransactionProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </TransactionProvider>
    </WalletProvider>
  )
}

export default MyApp
