"use client";

import { appConfig } from "@/config/app.config";
import "@ant-design/v5-patch-for-react-19";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace(appConfig.initialRoute || "/login");
  }, []);

  return <></>;
}
