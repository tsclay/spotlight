import Link from "next/link"

export default function Nav() {
    const links = [
        {
            href: '/snippets',
            name: 'Snippets'
        },
        {
            href: '/you',
            name: 'Account'
        }
    ]
    return (
        <nav className="bg-blue-300 p-4 flex justify-end gap-1">
            {links.map(l => (
                <Link key={l.href} href={l.href}>{l.name}</Link>
            ))}
        </nav>
    )
}