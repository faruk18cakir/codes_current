import Link from "next/link";
import React from "react";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-base-200 ">
      <div className="text-center max-w-72 bg-base-100 p-10 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">404 Hata</h1>
        <p className="text-base-content mb-6"> Aradığınız sayfa bulunamadı!</p>
        <Link href={"/"} className="btn btn-primary w-full">
          Ana sayfa
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
