import { ReactNode } from "react";

import type { Metadata } from "next";
import { inter } from "@/configs/font.config";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Groceries",
  description: "Gerenciador de lista de compras",
  authors: [
    {
      name: "Gabriel Cavalcante de Jesus Oliveira",
      url: "https://links-zol.vercel.app",
    },
  ],
};

function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-br" className={`${inter.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

RootLayout.displayName = "RootLayout";

export default RootLayout;
