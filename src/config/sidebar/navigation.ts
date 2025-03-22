import { Home, Settings, Trophy, Crosshair, Flag, Terminal } from "lucide-react";

export const menuItems = [
  { name: "Home", icon: Home, path: "/home", otherSite: false },
  { name: "Problems", icon: Crosshair, path: "/problems", otherSite: false },
  { name: "Contests", icon: Flag, path: "/contests", otherSite: false },
  { name: "Code", icon: Terminal, path: "http://35.87.199.99:8080/?folder=/home/coder/project", otherSite: true },
  { name: "Ranking", icon: Trophy, path: "/ranking", otherSite: false },
  { name: "Settings", icon: Settings, path: "/settings", otherSite: false },
];