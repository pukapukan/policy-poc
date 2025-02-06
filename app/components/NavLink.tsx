'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavLink (props: Readonly<{href: string, children: React.ReactNode}>) {
  const pathName = usePathname()
  const isActive = pathName.startsWith(props.href)
  return <Link href={props.href} className={isActive ? 'font-bold' : ''}>{props.children}</Link>
}