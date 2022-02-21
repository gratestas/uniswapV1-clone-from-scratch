import '../styles/globals.css'
import { TransactionProvider } from '../context/TransactionContext'
import Layout from '../components/shared/Layout'

function MyApp({ Component, pageProps }) {
  return (
    <TransactionProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </TransactionProvider>
  )
}

export default MyApp
