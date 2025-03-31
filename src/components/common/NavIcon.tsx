import { useTokenStore } from "@/store/token"
import { Icon } from "@iconify-icon/react/dist/iconify.js"

interface NavIconProps {
  icon: string, // 改为接收iconify图标名称
  iconText: string,
  onClick: () => void,
  className?: string // 添加可选的className属性
}

export default function NavIcon({icon, iconText, onClick, className = ''}: NavIconProps) {
  const {clearToken} = useTokenStore()
  return (
    <div className={`col-center flex-col cursor-pointer ${className}`} onClick={onClick}>
      <Icon icon={icon} width="24" height="24" />
      <p className='text-sm'>{iconText}</p>
    </div>
  )
}
