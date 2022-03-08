import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getAllPoolsData } from '../../smart_contract/lib/liquidity'

import PoolTable from '../../components/PoolTable'

const styles = {}
const Pools = () => {
  const [allPoolsData, setAllPoolsData] = useState()

  useEffect(async () => {
    const _allPoolsData = await getAllPoolsData()
    setAllPoolsData(_allPoolsData)
  }, [])
  return (
    <div className="flex flex-col items-center space-y-5">
      <div className="flex w-full justify-end">
        <div className=" divide-x rounded-md bg-[#191B1F] py-2 px-4 font-medium tracking-wide text-[#f0a912] hover:bg-[#113f83] hover:text-white">
          <Link href="liquidity">
            <a>new pool</a>
          </Link>
        </div>
      </div>
      <PoolTable poolsData={allPoolsData} />
    </div>
  )
}

export default Pools
