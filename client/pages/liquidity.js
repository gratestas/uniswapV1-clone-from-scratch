import { useContext, useState, useEffect } from 'react'
import CurrencyListModal from '../components/CurrencyListModal'
import CurrencySelectButton from '../components/CurrencySelectButton'
import LiquidityPosition from '../components/Liquidity/LiquidityPosition'
import { TransactionContext } from '../context/TransactionContext'
import { WalletContext } from '../context/WalletContext'
import { getLPTokensAndPoolShare } from '../smart_contract/lib/liquidity'
import {
  addLiquidity,
  getExchange,
} from '../smart_contract/lib/contractFunctions'
import {
  fromWei,
  getBalance,
  getSigner,
  toWei,
  formatPrecision,
} from '../smart_contract/lib/utils'

const styles = {
  wrapper: `flex flex-col `,
  container: `bg-[#191B1F] w-[40rem] rounded-2xl p-4`,
  header: `px-2 mb-6 flex items-center justify-center font-medium text-xl pb-2 border-b border-gray-800`,
  fieldTitle: `text-sm tracking-wide`,
  liquidityContainer: `py-4 flex justify-between border-t border-gray-800`,
  reserves: `flex flex-col items-end mr-4 text-sm font-medium tracking-wide`,
  inputContainer: `bg-[#20242A] my-3 rounded-2xl p-6 text-3xl  border border-[#20242A] hover:border-[#41444F]  flex justify-between`,
  input: `bg-transparent placeholder:text-[#B2B9D2] outline-none mb-6 w-full text-2xl`,
  confirmButton: `bg-[#2172E5] my-4 rounded-2xl py-6 px-8 text-xl font-semibold flex items-center justify-center cursor-pointer border border-[#2172E5] hover:border-[#234169]`,
}

const LiquidityPool = () => {
  const { factory, tokenPair, setTokenPair } = useContext(TransactionContext)
  const { currentAccount } = useContext(WalletContext)
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [tokenReserve, setTokenReserve] = useState()
  const [ethReserve, setEthReserve] = useState()
  const [LPtokens, setLPtokens] = useState(null)
  const [poolShare, setPoolShare] = useState(0)
  console.log(' currentAccount', currentAccount)

  const fetchLPTokensAndPoolShare = async (tokenAddress, currentAccount) => {
    const [LP_tokens, poolShare] = await getLPTokensAndPoolShare(
      tokenAddress,
      currentAccount
    )
    setLPtokens(LP_tokens)
    setPoolShare(poolShare)
  }

  const handleSubmit = async () => {
    const signer = getSigner(window.ethereum)
    try {
      if (!(await factory.doesExchangeExist(tokenPair.in.address))) {
        console.log(
          'there is no exchange registered by provided address. creating new exchange...'
        )
        await createExchange(tokenPair.in.address, signer)
      }
    } catch (error) {
      console.log(error.message)
    }
    await addLiquidity(
      tokenPair.in.address,
      toWei(Number(input)),
      toWei(Number(output)),
      signer
    )

    await fetchLPTokensAndPoolShare(tokenPair.in.address, currentAccount)

    console.log('your share in pool:', poolShare)
  }

  useEffect(async () => {
    if (!tokenPair.in) return

    const signer = getSigner(window.ethereum)
    const exchange = await getExchange(tokenPair.in.address, signer)

    const tokenReserve = await exchange.getReserve()
    const formattedTokenReserve = formatPrecision(fromWei(tokenReserve), 6)
    setTokenReserve(formattedTokenReserve)

    const ethRerserve = await getBalance(exchange.address)
    const formattedEthReserve = formatPrecision(fromWei(ethRerserve), 4)
    setEthReserve(formattedEthReserve)

    await fetchLPTokensAndPoolShare(tokenPair.in.address, currentAccount)
  }, [tokenPair.in.address, currentAccount])

  //useEffect(() => {
  //  setTokenPair({ in: '', out: '' })
  //}, [])
  return (
    <div className={styles.wrapper}>
      <CurrencyListModal />
      <div className={styles.container}>
        <div className={styles.header}>Add Liquidity</div>
        <div>
          <div className={styles.fieldTitle}>Deposit Amount</div>
          <div className={styles.inputContainer}>
            <input
              type="number"
              value={input}
              className={styles.input}
              placeholder="0.0"
              pattern="^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$"
              onChange={(e) => {
                setInput(e.target.value)
              }}
            />
            <CurrencySelectButton selectedToken={tokenPair.in} tradeSide="in" />
          </div>
          <div className={styles.inputContainer}>
            <input
              type="number"
              className={styles.input}
              value={output}
              placeholder="0.0"
              pattern="^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$"
              onChange={(e) => setOutput(e.target.value)}
            />
            <CurrencySelectButton
              selectedToken={tokenPair.out}
              tradeSide="out"
              disabled
            />
          </div>
          <div className={styles.liquidityContainer}>
            <div className={styles.fieldTitle}>Pool Liquidity</div>
            <div className={styles.reserves}>
              <div className="mb-1 tracking-wider">
                {tokenReserve} &nbsp; {tokenPair.in.symbol}
              </div>
              <div className="tracking-wider">{ethReserve} &nbsp; ETH</div>
            </div>
          </div>
          <div
            className={styles.confirmButton}
            onClick={(e) => handleSubmit(e)}
          >
            Supply
          </div>
        </div>
      </div>
      <LiquidityPosition
        token={tokenPair.in}
        LPtokens={LPtokens}
        poolShare={poolShare}
      />
    </div>
  )
}

export default LiquidityPool
