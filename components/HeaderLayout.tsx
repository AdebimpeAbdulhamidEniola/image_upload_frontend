import Image from "next/image"
const HeaderLayout = () => {
  return (
    
    
    <div className="flex px-16 m-3 justify-between items-center">

    <span className="flex items-center justify-center gap-3">
      <Image src="/logo-small.svg" alt="logo-small" width={22} height={26} />
      <span className="font-bold  ">ImageUpload</span>
      </span>

      <Image src="/Moon_fill.svg" alt="moon_upload" width={28} height={28} />
    </div>
  )
}

export default HeaderLayout
