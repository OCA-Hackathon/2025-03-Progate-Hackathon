"use client";
import { useEffect, useState } from "react";
import "@/app/infrastructure/auth/amplify.config";
import VerifyToken from "@/app/home/components/VerifyToken";


export default function Contents() {
//   const [username, setUsername] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchUsername = async () => {
//       const user = await getCurrentUser();
//       setUsername(user?.username || "Guest");
//     };

//     fetchUsername();
//   }, []);

  return (
    <div>
      <VerifyToken />
      <p>Welcome to the home page.</p>
    </div>
  );
}
