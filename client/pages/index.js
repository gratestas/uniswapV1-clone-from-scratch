import Head from 'next/head'

import Header from '../components/Header.jsx'
import Main from '../components/Main.jsx'

const styles = {
  wrapper: `h-screen max-h-screen h-min-screen w-screen bg-[#2D242F] text-white select-none flex flex-col justify-between`,
}

const Home = () => {
  return (
    <div>
      <Head>
        <title>Muuswap: Decentralized Exchange</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.wrapper}>
        <Header />
        <Main />
        <h2>footer</h2>
      </main>
    </div>
  )
}

export default Home
