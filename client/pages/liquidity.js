import { useContext, useState, useEffect } from 'react'

// componetns
import CurrencyListModal from '../components/CurrencyListModal'
import CurrencySelectButton from '../components/CurrencySelectButton'
import LiquidityPosition from '../components/Liquidity/LiquidityPosition'
import CreateExchangeModal from '../components/Liquidity/CreateExchangeModal'
import TransactionModal from '../components/shared/TransactionModal'

//context
import { TransactionContext } from '../context/TransactionContext'
import { WalletContext } from '../context/WalletContext'

// libs & utils
import { getLPTokensAndPoolShare } from '../smart_contract/lib/liquidity'
import {
  addLiquidity,
  getExchange,
  getTokenDecimal,
  removeLiquidity,
} from '../smart_contract/lib/contractFunctions'
import {
  fromWei,
  getEthBalance,
  getSigner,
  formatPrecision,
  formatUnits,
  parseUnits,
} from '../smart_contract/lib/utils'
import styles from '../styles/liquidity'

const LiquidityPool = () => {
  const { factory, tokenPair, setTokenPair, setIsActive } =
    useContext(TransactionContext)
  const { currentAccount } = useContext(WalletContext)
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [tokenReserve, setTokenReserve] = useState('')
  const [ethReserve, setEthReserve] = useState('')
  const [LPtokens, setLPTokens] = useState(0)
  const [poolShare, setPoolShare] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const fetchLPTokensAndPoolShare = async (tokenAddress, currentAccount) => {
    const [LP_tokens, poolShare] = await getLPTokensAndPoolShare(
      tokenAddress,
      currentAccount
    )
    setLPTokens(LP_tokens)
    setPoolShare(poolShare)
  }

  const addLiquidityHandler = async () => {
    // toggles transaction modal and overlay states
    setIsOpen(true)
    setIsLoading(true)
    setIsActive(true)
    setMessage('Adding liquidity...')

    // sends liquidity transaction to the exchange contract
    const signer = getSigner(window.ethereum)
    const decimals = await getTokenDecimal(tokenPair.in.address, signer)

    await addLiquidity(
      tokenPair.in.address,
      parseUnits(Number(input), decimals),
      parseUnits(Number(output), decimals),
      signer
    )

    // toggles transaction modal and overlay states
    setMessage('Liquidity has been added successfully')
    setIsLoading(false)
    setTimeout(() => {
      setIsOpen(false)
      setIsActive(false)
    }, 2000)

    await fetchLPTokensAndPoolShare(tokenPair.in.address, currentAccount)
  }

  const removeLuqidityHandler = async () => {
    if (!LPtokens) return
    const signer = getSigner()
    const decimals = await getTokenDecimal(tokenPair.in.address, signer)

    await removeLiquidity(
      tokenPair.in.address,
      parseUnits(LPtokens, decimals),
      signer
    )
    await fetchLPTokensAndPoolShare(tokenPair.in.address, currentAccount)
  }

  const onInputChange = (e) => {
    e.preventDefault()
    setInput(e.target.value)
  }
  const onOutputChange = (e) => {
    e.preventDefault()
    setOutput(e.target.value)
  }

  /* 
   this hook fetches reserves, LP tokens and pool share from the exchange contract  
   on every time connected account or selected token change 
  */
  useEffect(async () => {
    if (!tokenPair.in || tokenPair.in.symbol === 'ETH') return
    if (await factory.doesExchangeExist(tokenPair.in.address)) {
      const signer = getSigner(window.ethereum)
      const exchange = await getExchange(tokenPair.in.address, signer)

      const decimals = await getTokenDecimal(tokenPair.in.address, signer)
      const tokenReserve = await exchange.getReserve()
      const formattedTokenReserve = formatPrecision(
        formatUnits(tokenReserve, decimals),
        2
      )
      setTokenReserve(formattedTokenReserve)

      const ethRerserve = await getEthBalance(exchange.address)
      const formattedEthReserve = formatPrecision(fromWei(ethRerserve), 2)
      setEthReserve(formattedEthReserve)

      await fetchLPTokensAndPoolShare(tokenPair.in.address, currentAccount)
    } else {
      setLPTokens(0)
      setTokenReserve('')
      setEthReserve('')
    }
  }, [tokenPair.in, currentAccount])

  /*
    Resets token pair on the first page render
  */
  useEffect(() => {
    setTokenPair(() => ({ in: '', out: '' }))
    setIsActive(false)
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>Add Liquidity</div>
        <div>
          <div className={styles.fieldTitle}>Deposit Amount</div>
          <Input
            value={input}
            onChange={onInputChange}
            token={tokenPair.in}
            tradeSide="in"
          />
          <Input
            value={output}
            onChange={onOutputChange}
            token={tokenPair.out}
            tradeSide="out"
            disabled
          />
          <div className={styles.liquidityContainer}>
            <div className={styles.fieldTitle}>Pool Liquidity</div>
            {tokenPair.in.address && (
              <div className={styles.reservesContainer}>
                <div className={styles.reserve}>
                  {tokenReserve} &nbsp; {tokenPair.in.symbol}
                </div>
                <div className={styles.reserve}>{ethReserve} &nbsp; ETH</div>
              </div>
            )}
          </div>
          <div className={styles.confirmButton} onClick={addLiquidityHandler}>
            Supply
          </div>
        </div>
      </div>
      <LiquidityPosition
        token={tokenPair.in}
        LPtokens={LPtokens}
        poolShare={poolShare}
        removeLuqidityHandler={removeLuqidityHandler}
      />

      {/*  Conditional components */}
      <CurrencyListModal />
      <TransactionModal
        isOpen={isOpen}
        isLoading={isLoading}
        message={message}
      />
      <CreateExchangeModal />
    </div>
  )
}

export default LiquidityPool

const Input = ({ value, onChange, token, tradeSide, disabled = false }) => {
  return (
    <div className={styles.inputContainer}>
      <input
        type="number"
        value={value}
        className={styles.input}
        placeholder="0.0"
        pattern="^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$"
        onChange={onChange}
      />
      <CurrencySelectButton
        selectedToken={token}
        tradeSide={tradeSide}
        disabled={disabled}
      />
    </div>
  )
}
