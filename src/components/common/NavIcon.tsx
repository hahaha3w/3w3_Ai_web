import { useTokenStore } from "@/store/token"
import { Icon } from "@iconify-icon/react/dist/iconify.js"

interface NavIconProps {
  icon: string, // 改为接收iconify图标名称
  iconText: string,
  onClick: () => void
}

export default function NavIcon({icon, iconText, onClick}: NavIconProps) {
  const {clearToken} = useTokenStore()
  return (
    <div className='col-center flex-col cursor-pointer' onClick={onClick}>
      <Icon icon={icon} width="24" height="24" />
      <p className='text-sm'>{iconText}</p>
    </div>
  )
}
