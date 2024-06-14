"use client";

import Link from "next/link";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useGlobalState } from "../store/global";
import { AiOutlineLogout } from "react-icons/ai";

const Navbar = () => {
  const { userType, setIsLoggedIn } = useGlobalState();
  const router = useRouter();
  const currentPage = usePathname().split("/")[1];

  const onLogoutHandler = () => {
    localStorage.removeItem("token");
    router.push("/");
    setIsLoggedIn(false);
    window.location.reload();
  };

  if (!userType) {
    return null;
  }

  return (
    <div className="navbar bg-secondary fixed top-0 left-0 w-full z-10">
      {userType === "intern" ? (
        <div className="navbar-start flex justify-between items-center w-full flex-col sm:flex-row">
          <div className="flex flex-col sm:flex-row">
            <Link
              href="/application"
              className={`btn align-middle ${currentPage === "application" ? "btn-primary" : "btn-ghost"}`}>
              Staj Başvurularım
            </Link>
            <Link href="/intern" className={`btn ${currentPage === "intern" ? "btn-primary" : "btn-ghost"}`}>
              Kayıt Staj Programları
            </Link>
            <Link
              href="/create-application"
              className={`btn ${currentPage === "create-application" ? "btn-primary" : "btn-ghost"}`}>
              Başvuru Yap
            </Link>
          </div>
          <div className="flex items-center flex-col sm:flex-row">
            <Link href="/profile" className={`btn ${currentPage === "profile" ? "btn-primary" : "btn-ghost"}`}>
              Profilim
            </Link>
            <Link href="/" onClick={onLogoutHandler} className="btn btn-ghost">
              <AiOutlineLogout size={25} />
            </Link>
          </div>
        </div>
      ) : (
        <div className="navbar-start flex justify-between w-full flex-col sm:flex-row">
          <div className="flex flex-col sm:flex-row">
            <Link href="/create" className={`btn ${currentPage === "create" ? "btn-primary" : "btn-ghost"}`}>
              İlan Oluştur
            </Link>
            <Link
              href="/show"
              className={`btn ${currentPage === "show" || currentPage === "advert" ? "btn-primary" : "btn-ghost"}`}>
              İlanları Görüntüle
            </Link>
            <Link href="/interns" className={`btn ${currentPage === "interns" ? "btn-primary" : "btn-ghost"}`}>
              Stajyerler
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row">
            <Link
              href="/profile-company"
              className={`btn ${currentPage === "profile-company" ? "btn-primary" : "btn-ghost"}`}>
              Profil
            </Link>
            <Link href="/" onClick={onLogoutHandler} className="btn btn-ghost">
              <AiOutlineLogout size={25} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
