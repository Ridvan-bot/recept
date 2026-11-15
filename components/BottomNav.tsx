"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/", label: "Recept" },
  { href: "/forslag", label: "Förslag" },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="nav" aria-label="Huvudmeny">
      {ITEMS.map((item) => {
        const current =
          item.href === "/"
            ? pathname === "/"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link key={item.href} href={item.href} aria-current={current ? "page" : undefined}>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
