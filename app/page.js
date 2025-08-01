import React from "react";
import Image from "next/image";
// import { Button } from "@/components/ui/button";
import { Button } from "../components/ui/button"; // adjust based on depth
import { UserButton } from "@clerk/nextjs";


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-6 bg-gray-100">
      <h1 className="text-3xl font-bold">Welcome to StudyXpert</h1>
      <Button variant="default" size="lg">
        Get Started
      </Button>
      <UserButton/>
    </main>
  );
}
