import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getFactoryContract } from '../../smart_contract/lib/contractFunctions'
import { getSigner } from '../../smart_contract/lib/utils'
import { getAllPoolsData } from '../../smart_contract/lib/liquidity'

import PoolTable from '../../components/PoolTable'
let eth
if (typeof window !== 'undefined') {
  eth = window.ethereum
}

const styles = {}
const Pools = () => {
  const [address, setAddress] = useState('')
  const [factoryAddress, setFactoryAddress] = useState('')
  const [exchangeAddress, setExchangeAddress] = useState('')
  const [factory, setFactory] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [allPoolsData, setAllPoolsData] = useState()

  const handleOnChange = (e) => {
    e.preventDefault()
    setAddress(e.target.value)
    console.log({ factoryAddress })
    console.log({ factory })
  }

  const createPool = async () => {
    console.log('creating pool')
    let _exchangeAddress
    try {
      if (await factory.doesExchangeExist(address)) {
        console.log(
          'exchange already exists. fetching the exchange at provided address'
        )
        _exchangeAddress = await factory.callStatic.getExchange(address)
      } else {
        console.log('no such exchange. creating new one')
        let exchange = await factory.createExchange(address)
        _exchangeAddress = exchange.value.toString()
        console.log({ _exchangeAddress })
      }
      console.log({ _exchangeAddress })
      setExchangeAddress(_exchangeAddress)
    } catch (error) {
      console.log(error.message)
      setErrorMessage(error.data.message)
    }
  }

  useEffect(async () => {
    const signer = getSigner(eth)
    const _factory = getFactoryContract(signer)
    const _factoryAddress = _factory.address
    setFactoryAddress(_factoryAddress)
    setFactory(_factory)
    const _allPoolsData = await getAllPoolsData()
    setAllPoolsData(_allPoolsData)
  }, [])
  return (
    <div className="flex flex-col items-center space-y-5">
      <div className="flex w-full justify-end">
        <div className=" divide-x rounded-md bg-[#191B1F] py-2 px-4 font-medium tracking-wide text-[#f0a912] hover:bg-[#113f83] hover:text-white">
          <Link href="liquidityPool">
            <a>new pool</a>
          </Link>
        </div>
      </div>
      <PoolTable poolsData={allPoolsData} />

      <h1>Create a new pool</h1>
      <input
        type="text"
        value={address}
        placeholder="enter an token address"
        className="rounded-md border border-[#20242A] bg-[#20242A] p-3 hover:border-[#41444F]"
        onChange={(e) => handleOnChange(e)}
      />
      <button className="rounded-md border py-1 px-2" onClick={createPool}>
        Create
      </button>
      {!!errorMessage && (
        <div
          className="mb-4 w-full rounded-lg bg-red-100 p-4 text-sm text-red-700 dark:bg-red-200 dark:text-red-800"
          role="alert"
        >
          <span className="font-medium">Danger alert!</span>
          {errorMessage}
        </div>
      )}
      <br />
      {address && (
        <div className="flex flex-col space-y-2">
          <div>token address: {address}</div>
          <div>factory address: {factoryAddress}</div>
          <div>exchange address: {exchangeAddress}</div>
        </div>
      )}
    </div>
  )
}

export default Pools
