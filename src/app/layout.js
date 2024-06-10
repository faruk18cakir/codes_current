"use client";

import { Inter } from "next/font/google";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { GlobalStateProvider } from "../store/global";

const inter = Inter({ subsets: ["latin"] });

import "./globals.css";

function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="pastel">
      <body className={`${inter.className}`}>
        <GlobalStateProvider>
          {children}
          <Navbar />
          <Footer />
        </GlobalStateProvider>
      </body>
    </html>
  );
}

export default RootLayout;
