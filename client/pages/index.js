import Head from 'next/head'
import Main from '../components/Main.jsx'

const Home = () => {
  return (
    <div>
      <Head>
        <title>Muuswap: Decentralized Exchange</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Main />
    </div>
  )
}

export default Home
