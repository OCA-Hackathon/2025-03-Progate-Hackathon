import Menu from "@/app/components/navigation/menu/Menu";

export default function Header() {
    return (
        <header className="w-full h-16 bg-primary text-white flex items-center justify-between px-6 shadow-md relative">
            <h1 className="text-lg font-bold">RaidersALG</h1>
            <Menu/>
        </header>
    );
}
