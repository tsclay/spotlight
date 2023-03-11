import Link from "next/link";
import { SyntheticEvent } from "react";

export default function Nav() {
  const links = [
    {
      href: "/snippets",
      name: "Snippets",
    },
    {
      href: "/you",
      name: "Account",
    },
  ];

  const handleToggleAside = (e: SyntheticEvent) => {
    const aside = (e.currentTarget as HTMLButtonElement).nextElementSibling;
    aside?.classList.toggle("nav-show");
  }

  return (
    <>
      <button
        className="fixed bottom-1 left-1 z-50 text-xl bg-blue-300 border-black rounded-full p-2"
        onClick={handleToggleAside}
      >
        ⬅️
      </button>
      <aside className="nav-hide fixed left-0 z-40 flex h-full flex-col justify-start gap-1 bg-blue-300 p-4">
        {links.map((l) => (
          <Link key={l.href} href={l.href}>
            {l.name}
          </Link>
        ))}
      </aside>
    </>
  );
}
