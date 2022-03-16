import { useContext, useEffect, useState } from 'react'
import { TransactionContext } from '../../../context/TransactionContext'
import { createExchange } from '../../../smart_contract/lib/contractFunctions'
import { getSigner } from '../../../smart_contract/lib/utils'
import TransactionModal from '../../shared/TransactionModal'

import styles from './styles'

const CreateExchangeModal = () => {
  const {
    factory,
    tokenPair,
    setIsActive,
    doesExchangeExist,
    setDoesExchangeExist,
  } = useContext(TransactionContext)
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState(
    'There is no exchange registered at the provided address'
  )

  const createExchangeHandler = async () => {
    const signer = getSigner(window.ethereum)
    setMessage('Creating a new exchange...')
    setIsOpen(true)
    setIsLoading(true)
    try {
      await createExchange(tokenPair.in.address, signer)
    } catch (error) {
      console.log(error.message)
      setDoesExchangeExist(true)
      setIsActive(false)
    }
    setMessage('Exchange has been created successfully!')
    setIsLoading(false)
    setTimeout(() => {
      // close transaction modal and global overlay components
      setDoesExchangeExist(true)
      setIsActive(false)
    }, 2000)
  }

  /*
    this hook, on the first render, makse sure that the global overlay component is disabled,
    which is controlled through the transaction context 
  */
  useEffect(() => {
    setIsActive(false)
  }, [])

  /*
    this hook checks wether exchange of provided token address exists or not.
    If exchange does not exist, then it triggers modal to enable a user to create it.
  */
  useEffect(async () => {
    if (!tokenPair.in || tokenPair.in.symbol === 'ETH') return
    const isExist = await factory.doesExchangeExist(tokenPair.in.address)
    setDoesExchangeExist(isExist)
    if (!isExist) setIsActive(true)
  }, [tokenPair.in.address])

  return (
    <>
      {!doesExchangeExist && tokenPair.in && (
        <>
          {!isLoading && (
            <div className={styles.wrapper}>
              <div className="mt-16 mb-10">{message}</div>
              <div
                className={styles.confirmButton}
                onClick={createExchangeHandler}
              >
                Create
              </div>
            </div>
          )}
          <TransactionModal
            isOpen={isOpen}
            isLoading={isLoading}
            message={message}
          />
        </>
      )}
    </>
  )
}

export default CreateExchangeModal
