import Link from "next/link";
import { useRouter } from "next/router";
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
    }
  ];
  const router = useRouter()

  const handleToggleAside = (e: SyntheticEvent) => {
    const aside = (e.currentTarget as HTMLButtonElement).nextElementSibling;
    aside?.classList.toggle("nav-show");
  }

  const handleLogout = async (e: SyntheticEvent) => {
    e.preventDefault()
    const {method, action} = e.target as HTMLFormElement
    const response = await fetch(action, {
      method
    })
    console.log('logout ', response)
    if (response.ok) {
      router.push('/')
    }
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
        <form action="/api/auth/logout" method="POST" onSubmit={handleLogout}>
          <button type="submit">Logout</button>
        </form>
      </aside>
    </>
  );
}
