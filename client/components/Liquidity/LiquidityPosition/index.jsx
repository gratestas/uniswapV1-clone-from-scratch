import Image from 'next/image'
import { styles } from './styles'
import ethLogo from '../../../assets/eth.png'
import { formatPrecision } from '../../../smart_contract/lib/utils'

const LuqiudityPosition = ({ token, LPtokens, poolShare }) => {
  return (
    <div className={`${styles.container} mt-10`}>
      <div className={styles.header}>Your Liquidity</div>
      {LPtokens ? (
        <div className="my-3 flex justify-between rounded-2xl border border-[#20242A]  bg-[#20242A] p-6 text-lg">
          <div className="flex w-full items-center">
            <div className="relative flex w-16">
              <div className="h-8 w-8">
                <Image src={token.icon} alt={token.symbol} fill="contain" />
              </div>
              <div className="absolute left-5 h-8 w-8">
                <Image src={ethLogo} alt="ETH" fill="contain" />
              </div>
            </div>
            <div className="mr-14 tracking-wider">{token.symbol}-ETH</div>
            <div className="font-medium tracking-wider">
              {formatPrecision(LPtokens, 5)}
            </div>
            <div className=" ml-4 rounded-lg border border-[#20242A] bg-[#50515265] py-1 px-2 text-sm font-semibold tracking-wider ">
              {formatPrecision(poolShare, 3)}%
            </div>
            <div className={styles.share}>share</div>
          </div>
          <div>
            <button className="rounded-lg bg-[#0e3f85] px-2 py-1 text-sm hover:bg-[#185dbe]">
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div className="text-md flex w-full justify-center py-3 tracking-wider text-[#3079df]">
          You have no position yet!
        </div>
      )}
    </div>
  )
}

export default LuqiudityPosition
