import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import styles from './styles'

const navItems = [
  { title: 'swap', link: '/' },
  { title: 'liquidity', link: '/liquidity' },
  { title: 'pools', link: '/pools' },
  { title: 'transactions', link: '/transactions' },
]

const NavList = ({ currentAccount }) => {
  const [activeNav, setActiveNav] = useState('Swap')
  const router = useRouter()

  useEffect(() => {
    const path = router.asPath.substring(1)
    setActiveNav(path)
  }, [])
  return (
    <div className={styles.container}>
      {navItems.map((item) => (
        <div
          key={item.title}
          className={`${styles.navItem} ${
            activeNav === item.title && styles.activeNavItem
          }`}
        >
          <Link
            href={
              item.title === 'transactions'
                ? `${item.link}/${currentAccount}`
                : item.link
            }
          >
            <a onClick={() => setActiveNav(item.title)}>{item.title}</a>
          </Link>
        </div>
      ))}
    </div>
  )
}

export default NavList
