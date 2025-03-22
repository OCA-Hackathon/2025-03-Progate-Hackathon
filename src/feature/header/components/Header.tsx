import ProfileMenu from "@/feature/header/components/navigation/ProfileMenu";
import SideBar from "@/feature/header/components/navigation/SideBar";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full h-16 bg-primary text-white flex items-center justify-between px-6 shadow-md relative">
      <div className="flex items-center gap-2 ml-3">
        <SideBar />
        <Link href="/home">
          <h1 className="text-2xl font-bold">
            <span className="font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
              RaidersALG
            </span>
          </h1>
        </Link>
      </div>
      <ProfileMenu />
    </header>
  );
}