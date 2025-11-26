"use client";
import React, { JSX } from "react";
import Link from "next/link";
import {
  Home,
  History,
  Settings2,
  ReceiptIndianRupee,
  LucideIcon,
  MailCheck,
} from "lucide-react";

import Image from "next/image";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { useAppSelector } from "@/app/hooks";
import { RootState } from "@/redux/store";

const UsageTrack = dynamic(() => import("./UsageTrack"));

interface NavItem {
  link: string;
  text: string;
  icon: LucideIcon;
  total?: number;
}

function SideNav(): JSX.Element {
  const pathname = usePathname();
  const { isSiderBarOpen } = useAppSelector(
    (state: RootState) => state.SideBarSlice,
  );

  const Navtext: NavItem[] = [
    {
      link: "/dashboard",
      text: "Home",
      icon: Home,
    },
    //     {
    //   link: "/dashboard/emailer",
    //   text: "Emailer",
    //   icon: MailCheck,
    // },
    {
      link: "/dashboard/history",
      text: "History",
      icon: History,
      total: 7,
    },
    {
      link: "/dashboard/billing",
      text: "Billing",
      icon: ReceiptIndianRupee,
    },
    {
      link: "/dashboard/settings",
      text: "Settings",
      icon: Settings2,
    },
  ];

  return (
    <div
      className={`hidden border-r bg-muted/40 bg-white transition-all duration-300 dark:bg-secondary md:block ${
        isSiderBarOpen ? "md:w-[70px]" : "md:w-[220px] lg:w-[280px]"
      }`}
    >
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center justify-between border-b px-4 lg:h-[60px] lg:px-6">
          <Link
            href="/"
            className={`flex items-center gap-2 font-semibold ${
              isSiderBarOpen ? "w-full justify-center" : ""
            }`}
          >
            <Image
              src="/logo.svg"
              alt="logo"
              height={100}
              width={100}
              className="h-10 w-10"
            />
            {!isSiderBarOpen && <span>Ai Generator</span>}
          </Link>
        </div>

        {/* sidenav links */}
        <div className="flex-1">
          <nav className="grid items-start gap-y-1 px-2 text-sm font-medium lg:px-4">
            {Navtext.map((text: NavItem, index: number) => (
              <Link
                key={index}
                href={`${text.link}`}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary dark:text-white ${
                  pathname === text.link ? "activeNavText" : "navText"
                } ${isSiderBarOpen ? "justify-center" : ""}`}
                title={isSiderBarOpen ? text.text : ""}
              >
                <text.icon className="h-5 w-5" />
                {!isSiderBarOpen && <h2>{text.text}</h2>}
              </Link>
            ))}
          </nav>
        </div>

        {!isSiderBarOpen && <UsageTrack />}
      </div>
    </div>
  );
}

export default SideNav;
