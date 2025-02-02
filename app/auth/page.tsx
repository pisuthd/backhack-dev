"use client";

import { useAuthCallback } from "@mysten/enoki/react";
import { useEffect } from "react";
import Loading from "@/components/Loading"; 

export default function Page() {
   

  const { handled } = useAuthCallback(); // This hook will handle the callback from the authentication provider

  useEffect(() => { 
    // if (handled) {
    //   router.push("/");
    // }
  }, [handled]);

  return <Loading />;
}