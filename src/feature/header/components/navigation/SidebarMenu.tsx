import { useRouter } from "next/navigation";
import { menuItems } from "@/config/sidebar/navigation";
export default function SidebarMenu({setIsOpen}:{setIsOpen:(isOpen:boolean)=>void}) {
  const router = useRouter();
  const handleGoMenu = (path: string) => {
    router.push(path);
    setIsOpen(false);
  };
  return (
    <>
      {menuItems.map(({ name, icon: Icon, path, otherSite }) =>
        otherSite ? (
          <a
            key={name}
            href={path}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center space-x-3 w-5/6 p-3 hover:bg-primary rounded-lg transition"
          >
            <Icon size={24} />
            <span className="transition-all bg-gradient-to-r bg-clip-text from-white to-white text-transparent group-hover:from-purple-400 group-hover:to-blue-500">
              {name}
            </span>
          </a>
        ) : (
          <button
            key={name}
            onClick={() => handleGoMenu(path)}
            className="group flex items-center space-x-3 w-5/6 p-3 hover:bg-primary rounded-lg transition"
          >
            <Icon size={24} />
            <span className="transition-all bg-gradient-to-r bg-clip-text from-white to-white text-transparent group-hover:from-purple-400 group-hover:to-blue-500">
              {name}
            </span>
          </button>
        )
      )}
    </>
  )
}