"use client";

import { useState, useEffect } from "react";

import Toast from "../../../components/toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useGlobalState } from "../../../store/global";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function LoginCompany() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const { setIsLoading, isLoading, setToken, setIsLoggedIn, setUserType } = useGlobalState();
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    const response = await fetch(`${apiUrl}/api/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (response.ok) {
      setToastMessage("Başarıyla giriş yaptınız!");
      const data = await response.json();
      const token = data.accessToken;
      setTimeout(() => {
        setToastMessage("");
        setIsLoading(false);
        localStorage.setItem("token", token);
        setIsLoggedIn(true);
        setUserType(data.role);
        setToken(token);
        if(data.role === "company"){
          router.replace("/profile-company");
        } else {
           router.replace("/application");
        }
       
      }, 3000);
    } else {
      const data = await response.json();
      setToastMessage(data.message);
      setTimeout(() => {
        setToastMessage("");
        setIsLoading(false);
      }, 3000);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/");
    }
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-neutral-focus">
      <div className="card shadow-xl w-96 bg-base-100">
        <div className="card-body p-6">
          <h1 className="text-3xl text-center font-bold mb-2">Hoş Geldin!</h1>
          <p className="text-base-content text-center mb-4">Inanılmaz bir deneyim yaşamak için lütfen giriş yap.</p>
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label mb-2 text-neutral-content">Kullanıcı Adı</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input input-bordered input-primary input-sm w-full bg-transparent text-neutral-content"
                placeholder="Kullanıcı Adı"
                required
              />
            </div>
            <div className="form-control mt-2">
              <label className="label mb-2 text-neutral-content">Şifre</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered input-primary input-sm w-full bg-transparent text-neutral-content"
                placeholder="Şifre"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-sm w-full mt-4" disabled={isLoading}>
              {isLoading ? <span className="loading loading-ring loading-sm"></span> : "Giriş Yap"}
            </button>{" "}
          </form>
          <p className="mt-4 text-center">
            Hala aramıza katılmadın mı?{" "}
            <Link href="/register" className="text-primary-content font-bold hover:underline">
              Hemen Üye Ol!
            </Link>
          </p>
        </div>
      </div>
      {toastMessage && <Toast message={toastMessage} />}
    </div>
  );
}
