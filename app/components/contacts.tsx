const LINKS = [
  { label: "блог", href: "/blog" },
  { label: "telegram", href: "https://t.me/mypchikov" },
  { label: "github", href: "https://github.com/mypchikov" },
  { label: "mail", href: "mailto:me@murchikov.com" },
];

export default function Contacts() {
  return (
    <nav className="flex flex-wrap gap-x-3 gap-y-1 text-sm">
      {LINKS.map((link) => (
        <a
          key={link.href}
          href={link.href}
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:opacity-70"
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}