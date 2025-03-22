import { useRouter } from "next/navigation";
import { menuItems } from "@/config/navigation";
export default function SidebarMenu(){
  const router = useRouter();
  console.log(menuItems);
  return (
    <>
      {menuItems.map(({ name, icon: Icon, path }) => (
        <button
          key={name}
          onClick={() => {
            router.push(path);
          }}
          className="group flex items-center space-x-3 w-5/6 p-3 hover:bg-primary rounded-lg transition"
        >
          <Icon size={24} />
          <span className="transition-all bg-gradient-to-r bg-clip-text from-white to-white text-transparent group-hover:from-purple-400 group-hover:to-blue-500">
            {name}
          </span>
        </button>
      ))}
    </>
  )
}