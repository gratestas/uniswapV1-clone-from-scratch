import Link from 'next/link'
import { useEffect, useState, useContext } from 'react'
import { AiOutlineDown } from 'react-icons/ai'
import { HiOutlineDotsVertical } from 'react-icons/hi'
import ethLogo from '../../assets/eth.png'
import Image from 'next/image'
import { styles } from './styles'
import { WalletContext } from '../../context/WalletContext'
const navItems = [
  { title: 'Swap', link: '/' },
  { title: 'Liquidity', link: '/liquidity' },
  { title: 'Pools', link: '/pools' },
  { title: 'Charts', link: '/' },
]

const Header = () => {
  const { currentAccount, connectWallet } = useContext(WalletContext)
  const [activeNav, setActiveNav] = useState('Swap')
  const [userName, setUserName] = useState()

  useEffect(() => {
    if (!currentAccount) return
    console.log('header:current account', currentAccount)
    setUserName(`${currentAccount.slice(0, 6)}...${currentAccount.slice(38)}`)
  }, [currentAccount])

  return (
    <header className={styles.wrapper}>
      <div className={styles.headerLogo}>Muuswap</div>
      <div className={styles.nav}>
        <div className={styles.navItemsContainer}>
          {navItems.map((item, index) => (
            <div
              key={index}
              className={`${styles.navItem} ${
                activeNav === item.title && styles.activeNavItem
              }`}
            >
              <Link href={item.link}>
                <a onClick={() => setActiveNav(item.title)}>{item.title}</a>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <div className={`${styles.buttonContainer}`}>
        <div className={`${styles.button} ${styles.buttonPadding}`}>
          <div className={styles.buttonIconContainer}>
            <Image src={ethLogo} alt="eth logo" height={20} width={20} />
          </div>

          <p>Ethereum</p>

          <div className={styles.buttonIconContainer}>
            <AiOutlineDown />
          </div>
        </div>
        {currentAccount ? (
          <div className={`${styles.button} ${styles.buttonPadding}`}>
            <div className={styles.buttonTextContainer}>{userName}</div>
          </div>
        ) : (
          <div
            className={`${styles.button} ${styles.buttonPadding}`}
            onClick={() => connectWallet()}
          >
            <div
              className={`${styles.buttonHighlight} ${styles.buttonPadding}`}
            >
              Connect Wallet
            </div>
          </div>
        )}

        <div className={`${styles.button} ${styles.buttonPadding}`}>
          <div className={`${styles.buttonIconContainer} mx-1`}>
            <HiOutlineDotsVertical />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
