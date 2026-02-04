"use client";

import { useAuthStore } from "@/lib/store";
import { LogOut, User } from "lucide-react";
import Link from "next/link";

export function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();

  return (
    <header className="text-center text-white mb-8 px-3">
      <h1 className="text-3xl sm:text-4xl font-bold mb-2 drop-shadow-lg">
        🎓 고등 입시 도우미
      </h1>
      <p className="text-lg opacity-90">
        목표 대학 기반 맞춤 입시 관리 시스템
      </p>
      
      {isAuthenticated && user && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
            <User size={18} />
            <span>{user.name}</span>
            {user.school && <span className="opacity-75">| {user.school}</span>}
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-colors"
          >
            <LogOut size={18} />
            로그아웃
          </button>
        </div>
      )}
    </header>
  );
}
