import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NavLink from "./components/NavLink";
import "./globals.css";

import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Referencing https://tailwindui.com/components/application-ui/page-examples/home-screens for page layout */}
        <aside className='sidebar fixed h-screen w-[200px] grid grid-cols-[auto] grid-rows-[32px_auto] p-4 bg-gray-100'>
          <div className='logo h-8'>
            <img src='https://framerusercontent.com/images/ckLUHCX8ufVdgo9og3bEXtVegdk.png?scale-down-to=512' width={130} height={32} alt='Intrinsic' />
          </div>
          <nav className="flex items-center justify-between flex-wrap p-4">
            <ul role='list'>
              <li>
                <ul role='list'>
                  <li><NavLink href='/policy'>Policy</NavLink></li>
                  <li><NavLink href='/golden-dataset'>Golden Dataset</NavLink></li>
                  <li><NavLink href='/evaluation'>Evaluation</NavLink></li>
                  <li><NavLink href='/deployment'>Deployment</NavLink></li>
                </ul>
              </li>
            </ul>
          </nav>
        </aside>
        <main className='main-content pl-[200px]'>
          <div className='p-6'>
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
