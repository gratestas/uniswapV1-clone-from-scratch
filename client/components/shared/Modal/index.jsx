import Overlay from "../Overlay"

const styles = {
    wrapper: `absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 flex p-12  h-96 w-[35rem] flex-col justify-between items-center rounded-2xl bg-[#191B1F] text-center`,
  }
 const Modal = ({children}) => {
  return (
    <div>
        <div className={styles.wrapper}>
            {children}
        </div>
        <Overlay />
    </div>
  )
}
export default Modal