import Image from "next/image";
import Link from "next/link";

const CenterLayout = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-full max-w-2xl h-100 bg-white rounded-lg border-2 border-dashed border-gray-200 shadow-lg p-8 flex items-center justify-center">

        <div className="inner-content flex flex-col ">
            <Image src="/exit.svg"  alt="exit_icon" width={32} height={32}/>
            <div>
                <div>Drag & drop a file <Link href="">Browse file</Link></div>
                <div>JPG, PNG or GIF - Max file size 5MB</div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default CenterLayout;
