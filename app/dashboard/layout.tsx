"use client";
import { Suspense, useState } from "react";
import HeaderNav from "./_components/HeaderNav";
import SideNav from "./_components/SideNav";
import Loading from "./loading";

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full overflow-y-hidden bg-gray-200 dark:bg-gray-900 md:h-screen">
      <SideNav />
      <div className="flex flex-1 flex-col">
        <HeaderNav />
        <div className="overflow-y-scroll [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </div>
      </div>
    </div>
  );
}
