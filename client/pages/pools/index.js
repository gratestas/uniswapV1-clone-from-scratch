import { useEffect, useState } from 'react'
import { getAllPoolsData } from '../../smart_contract/lib/liquidity'

import PoolTable from '../../components/PoolTable'

const Pools = () => {
  const [allPoolsData, setAllPoolsData] = useState()

  useEffect(async () => {
    const _allPoolsData = await getAllPoolsData()
    setAllPoolsData(_allPoolsData)
  }, [])
  return (
    <div className="flex flex-col items-center">
      <PoolTable poolsData={allPoolsData} />
    </div>
  )
}

export default Pools
