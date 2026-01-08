"use client";

/**
 * ================================
 * 🔁 CLERK (DESATIVADO TEMPORARIAMENTE)
 * Quando voltar a usar Clerk:
 * 1) Descomente os imports abaixo
 * 2) Comente a lógica de auth local
 * ================================
 */

// import { UserButton } from "@clerk/nextjs";
// import { currentUser } from "@clerk/nextjs/server";

import Image from "next/image";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const Navbar = () => {
  const [user, setUser] = useState<{ firstName: string; role: string } | null>(null);

  useEffect(() => {
    /**
     * 🔐 AUTH LOCAL
     * Lê o cookie de sessão criado no login local
     */
    const session = Cookies.get("session");
    if (session) {
      try {
        const parsed = JSON.parse(session);
        setUser({
          firstName: parsed.username ?? "Usuário",
          role: parsed.role ?? "guest",
        });
      } catch (err) {
        console.error("Erro ao ler cookie de sessão:", err);
      }
    }

    /**
     * 🔁 CLERK (DESATIVADO)
     * Caso queira voltar ao Clerk:
     * const user = await currentUser();
     * setUser({
     *   firstName: user?.firstName ?? "Usuário",
     *   role: user?.publicMetadata?.role ?? "guest",
     * });
     */
  }, []);

  return (
    <div className="flex items-center justify-between p-4">
      {/* SEARCH BAR */}
      <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
        <Image src="/search.png" alt="" width={14} height={14} />
        <input
          type="text"
          placeholder="Pesquisar..."
          className="w-[200px] p-2 bg-transparent outline-none"
        />
      </div>

      {/* ICONS AND USER */}
      <div className="flex items-center gap-6 justify-end w-full">
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
          <Image src="/message.png" alt="" width={20} height={20} />
        </div>
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
          <Image src="/announcement.png" alt="" width={20} height={20} />
          <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">
            1
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-xs leading-3 font-medium">{user?.firstName}</span>
          <span className="text-[10px] text-gray-500 text-right">{user?.role}</span>
        </div>

        {/* 🔁 CLERK UserButton (DESATIVADO) */}
        {/* <UserButton /> */}
      </div>
    </div>
  );
};

export default Navbar;
