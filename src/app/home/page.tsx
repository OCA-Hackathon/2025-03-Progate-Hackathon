import Contents from "@/feature/home/components/Contents";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Home',
};

export default function Home() {
  return (
    <Contents/>
  );
}