import Image from "next/image";

export default function Logo() {
  return <Image className="rounded-sm" src={"/logo.png"} alt="Logo" height={30} width={30} />;
}
