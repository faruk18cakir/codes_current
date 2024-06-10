"use client";

import { useState, useEffect } from "react";
import Toast from "../../../components/toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Register() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("intern");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await fetch("http://localhost:5010/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        role,
        username,
        password,
      }),
    });

    if (response.ok) {
      setToastMessage("Successfully registered !");
      setTimeout(() => {
        setToastMessage("");
        router.push("/login");
        setLoading(false);
      }, 3000);
    } else {
      const data = await response.json();
      setToastMessage(data.error);
      setTimeout(() => {
        setToastMessage("");
        setLoading(false);
      }, 3000);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-neutral-focus">
      <div className="card shadow-xl w-96 bg-base-100">
        <div className="card-body p-6">
          <h1 className="text-3xl text-center font-bold mb-2">Kayıt Ol</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label mb-2 text-neutral-content">Kullanıcı Adınız*</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input input-bordered input-primary input-sm w-full bg-transparent text-neutral-content"
                placeholder="Kullanıcı Adınız"
                required
              />
            </div>
            <div className="form-control mt-2">
              <label className="label mb-2 text-neutral-content">E-posta Adresiniz*</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered input-primary input-sm w-full bg-transparent text-neutral-content"
                placeholder="E-posta Adresiniz"
                required
              />
            </div>
            <div className="form-control mt-2">
              <label className="label mb-2 text-neutral-content">Kullanıcı Türü Seçiniz*</label>
              <select
                onChange={(e) => setRole(e.target.value)}
                className="select select-bordered select-primary select-sm w-full bg-transparent text-neutral-content"
                required>
                <option value="" disabled>
                  Lütfen Seçiniz
                </option>
                <option value="student">Öğrenci</option>
                <option value="company">Şirket</option>
              </select>
            </div>
            <div className="form-control mt-2">
              <label className="label mb-2 text-neutral-content">Şifrenizi Giriniz*</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered input-primary input-sm w-full bg-transparent text-neutral-content"
                placeholder="Şifrenizi Giriniz"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-sm w-full mt-4" disabled={loading}>
              {loading ? <span className="loading loading-ring loading-sm"></span> : "Kayıt Ol"}
            </button>
          </form>
          <p className="mt-4 text-center">
            Zaten üye misiniz?{" "}
            <Link href="/login" className="text-primary-content font-bold hover:underline">
              Giriş Yap
            </Link>
          </p>
        </div>
      </div>
      {toastMessage && <Toast message={toastMessage} />}
    </div>
  );
}
