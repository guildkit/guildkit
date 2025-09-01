"use client";

import Image from "next/image";
import { Button, Link } from "@/components/generic/ButtonLink.tsx";
import { signOut } from "@/lib/auth/client.ts";
import type { ReactElement } from "react";

export const Sidebar = (): ReactElement => (
  <aside className="flex flex-col items-center w-fit h-full bg-white text-gray-600 shadow-[#e0e0e0_1.25rem_0_1rem_-1rem] sm:flex hidden">
    <ul className="w-full">
      <li className="flex justify-center items-center w-full h-16 px-4 py-2 hover:bg-pink-50 hover:w-full">
        <Link href="." className="w-fit h-fit cursor-pointer">
          <Image src="/vendor/tabler/inbox.svg" alt="Inbox" width={32} height={32} />
        </Link>
      </li>

      <li className="flex justify-center items-center w-full h-16 px-4 py-2 hover:bg-pink-50 hover:w-full">
        <Link href="." className="w-fit h-fit cursor-pointer">
          <Image src="/vendor/tabler/bookmark.svg" alt="Bookmarks" width={32} height={32} />
        </Link>
      </li>

      <li className="flex justify-center items-center w-full h-16 px-4 py-2 hover:bg-pink-50 hover:w-full">
        <Link href="." className="w-fit h-fit cursor-pointer">
          <Image src="/vendor/tabler/trash.svg" alt="Trash" width={32} height={32} />
        </Link>
      </li>

      <li className="flex justify-center items-center w-full h-16 px-4 py-2 hover:bg-pink-50 hover:w-full">
        <Link href="." className="w-fit h-fit cursor-pointer">
          <Image src="/vendor/tabler/shopping-cart.svg" alt="Cart" width={32} height={32} />
        </Link>
      </li>

      <li className="flex justify-center items-center w-full h-16 px-4 py-2 hover:bg-pink-50 hover:w-full">
        <Link href="." className="w-fit h-fit cursor-pointer">
          <Image src="/vendor/tabler/settings.svg" alt="Settings" width={32} height={32} />
        </Link>
      </li>

      <li className="flex justify-center items-center w-full h-16 px-4 py-2 hover:bg-pink-50 hover:w-full">
        <Link href="." className="w-fit h-fit cursor-pointer">
          <Image src="/vendor/tabler/bell.svg" alt="Notifications" width={32} height={32} />
        </Link>
      </li>

      <li className="flex justify-center items-center w-full h-16 px-4 py-2 hover:bg-pink-50 hover:w-full">
        <Button theme="linktext" className="w-fit h-fit cursor-pointer" onClick={() => void signOut()}>
          <Image src="/vendor/tabler/logout-2.svg" alt="Logout" width={32} height={32} />
        </Button>
      </li>
    </ul>
  </aside>
);
