import { css } from '@emotion/react'
import { MoonLoader } from 'react-spinners'

const style = {
  wrapper: `text-white h-full w-[30rem] flex flex-col justify-center items-center border border-[#3a3a3a] rounded-xl`,
  title: `font-semibold text-xl mb-12`,
}

const cssOverride = css`
  display: flex;
  margin: 0 auto;
  box-sizing: content-box;
  border-color: white;
`

const TransactionLoader = ({ message, isLoading }) => {
  return (
    <div className={style.wrapper}>
      <div className={style.title}>{message}</div>
      <MoonLoader
        color={'#4E96F1'}
        loading={isLoading}
        css={cssOverride}
        size={50}
      />
    </div>
  )
}

export default TransactionLoader
