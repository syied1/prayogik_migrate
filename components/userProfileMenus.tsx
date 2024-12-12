// @ts-nocheck

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";

import { signOut } from "next-auth/react";

export default function UserProfileMenus({ session }) {
  return (
    <Menubar className="border-none">
      <MenubarMenu>
        <MenubarTrigger className="cursor-pointer ring-0 text-base hover:bg-transparent gap-2">
          <div className="border border-teal-200 bg-teal-50 rounded-full w-8 h-8 flex items-center justify-center text-sm uppercase text-teal-800">
            <span>{session?.user?.name[0]}</span>
          </div>
          {session?.user?.name}
        </MenubarTrigger>
        <MenubarContent className="mr-2 min-w-[140px]">
          <MenubarItem className="cursor-pointer" onClick={() => signOut()}>
            Logout
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
