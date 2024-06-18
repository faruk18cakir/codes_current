"use client";

import { Inter } from "next/font/google";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { GlobalStateProvider } from "../store/global";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

import "./globals.css";

function RootLayout({ children }) {
  const router = useRouter();
  const [storedToken, setStoredToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setStoredToken(token);
    if (!token) {
      router.push("/login");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storedToken]); // Add storedToken to the dependency array

  return (
    <html lang="en" data-theme="nord">
      <body className={`min-h-screen flex flex-col ${inter.className}`}>
        <GlobalStateProvider>
          <Navbar />
          <main className={`flex-grow`}>{children}</main>
          <Footer />
        </GlobalStateProvider>
      </body>
    </html>
  );
}

export default RootLayout;
