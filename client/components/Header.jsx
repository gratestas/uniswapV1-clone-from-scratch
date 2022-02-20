import { useEffect, useState, useContext } from 'react'
import { FiArrowUpRight } from 'react-icons/fi'
import { AiOutlineDown } from 'react-icons/ai'
import { HiOutlineDotsVertical } from 'react-icons/hi'
import ethLogo from '../assets/eth.png'
import Image from 'next/image'

import { TransactionContext } from '../context/TransactionContext'

const navItems = ['Swap', 'Pool', 'Vote', 'Charts']
const styles = {
  wrapper: `flex justify-between items-center w-screen px-6 mt-4`,
  headerLogo: `flex w-1/4 items-center font-semibold`,
  nav: `flex flex-1 items-center justify-center`,
  navItemsContainer: `flex bg-[#191B1F] rounded-3xl `,
  navItem: `flex items-center px-4 py-1 m-1 text-large font-semibold text-[0.9rem] cursor-pointer rounded-3xl `,
  activeNavItem: `bg-[#20242A]`,
  buttonContainer: `flex w-1/3 justify-end items-center`,
  button: `flex items-center mx-2 rounded-2xl bg-[#191B1F] text-[0.9rem] font-semibold cursor-pointer`,
  buttonPadding: `p-1`,
  buttonIconContainer: `flex items-center justify-center w-8 h-8`,
  buttonTextContainer: `flex items-center h-8 px-2`,
  buttonHighlight: `flex items-center justify-center h-full text-[#4F90EA] bg-[#172A42] border border-[#163256] hover:border-[#234169]  rounded-2xl`,
}

const Header = () => {
  const [activeNav, setActiveNav] = useState('Swap')
  const { currentAccount, connectWallet } = useContext(TransactionContext)
  const [userName, setUserName] = useState()

  useEffect(() => {
    if (!currentAccount) return
    setUserName(`${currentAccount.slice(0, 6)}...${currentAccount.slice(38)}`)
  }, [currentAccount])
  console.log(currentAccount, connectWallet)

  return (
    <header className={styles.wrapper}>
      <div className={styles.headerLogo}>Muuswap</div>
      <div className={styles.nav}>
        <div className={styles.navItemsContainer}>
          {navItems.map((item, index) => (
            <div
              key={index}
              className={`${styles.navItem} ${
                activeNav === item && styles.activeNavItem
              }`}
              onClick={() => setActiveNav(item)}
            >
              {item}
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
