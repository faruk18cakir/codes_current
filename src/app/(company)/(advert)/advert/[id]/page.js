"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function AdvertDetail() {
  const { id } = useParams();
  const [advert, setAdvert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formValues, setFormValues] = useState({
    title: "",
    field: "",
    requirements: "",
    foreignLanguages: "",
    department: "",
  });
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/");
    } else {
      fetchAdvertDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, router]);

  const fetchAdvertDetail = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/adverts/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.response) {
        setAdvert(data.advert);
        setFormValues({
          title: data.advert.title,
          field: data.advert.field,
          requirements: data.advert.requirements,
          foreignLanguages: data.advert.foreignLanguages,
          department: data.advert.department,
        });
      } else {
        setAdvert(null);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching advert detail:", error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/adverts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formValues.title,
          field: formValues.field,
          requirements: formValues.requirements,
          foreignLanguages: formValues.foreignLanguages,
          department: formValues.department,
        }),
      });
      const data = await response.json();
      if (data.response) {
        setAdvert(data.advert);
        setEditMode(false);
      } else {
        console.error("Error updating advert:", data.message);
      }
    } catch (error) {
      console.error("Error updating advert:", error);
    }
  };

  if (loading) {
    return <p>Yükleniyor...</p>;
  }

  if (!advert) {
    return <p>İlan bulunamadı.</p>;
  }

  return (
    <section className="w-screen flex justify-center items-start mt-72 sm:mt-20 bg-base-100">
      <div className="bg-base-200 rounded-lg flex flex-col gap-4">
        {editMode ? (
          <div className="flex flex-col w-screen max-w-[550px] justify-center items-center bg-base-200 pb-2 gap-2">
            <div className="w-full max-w-md p-6 bg-base-100 rounded-lg h-fit">
              <h1 className="text-2xl font-bold mb-6">Staj İlanı Bilgileri</h1>
              <label className="label mb-2 ">Stajın İsmi:</label>
              <input
                type="text"
                className="input input-bordered input-primary input-sm w-full bg-transparent "
                placeholder="Title"
                required
                name="title"
                value={formValues.title}
                onChange={handleInputChange}
              />
              <label className="label mb-2  flex justify-start">
                <span className="text-error">*</span>Alan:
              </label>
              <input
                type="text"
                className="input input-bordered input-primary input-sm w-full bg-transparent "
                placeholder="Field"
                required
                name="field"
                value={formValues.field}
                onChange={handleInputChange}
              />
              <label className="label mb-2  flex justify-start">
                <span className="text-error">*</span>Stajyerden Beklenenler:
              </label>
              <textarea
                className="textarea textarea-bordered textarea-primary textarea-md h-56 w-full bg-transparent  leading-tight p-4"
                placeholder="Add requirements"
                required
                name="requirements"
                value={formValues.requirements}
                onChange={handleInputChange}
              />
              <label className="label mb-2  flex justify-start">
                <span className="text-error">*</span>İstenilen Yabancı Dil:
              </label>
              <textarea
                className="textarea textarea-bordered textarea-primary textarea-md w-full bg-transparent  leading-tight p-4"
                placeholder="Add foreign languages"
                required
                name="foreignLanguages"
                value={formValues.foreignLanguages}
                onChange={handleInputChange}
              />
              <label className="label mb-2 ">İstenilen Bölüm:</label>
              <input
                type="text"
                className="input input-bordered input-primary input-sm w-full bg-transparent "
                placeholder="Department"
                required
                name="department"
                value={formValues.department}
                onChange={handleInputChange}
              />
              <div className="flex justify-between w-full mt-10">
                <button
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                  onClick={handleUpdate}>
                  Güncelle
                </button>
                <button
                  href="/show"
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50">
                  Geri
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-md p-6 bg-base-100 rounded-lg h-fit">
            <h1 className="text-2xl font-bold mb-4">{advert.title}</h1>
            <p>
              <strong>Alan:</strong> {advert.field}
            </p>
            <p>
              <strong>İstenilen Bölüm:</strong> {advert.department}
            </p>
            <p>
              <strong>Stajyerden Beklenenler:</strong> {advert.requirements}
            </p>
            <p>
              <strong>İstenilen Yabancı Dil:</strong> {advert.foreignLanguages}
            </p>
            <p>
              <strong>Oluşturulma Tarihi:</strong> {new Date(advert.createdAt).toLocaleDateString("tr-TR")}
            </p>
            <p>
              <strong>Güncellenme Tarihi:</strong> {new Date(advert.updatedAt).toLocaleDateString("tr-TR")}
            </p>
            <div className="flex justify-between mt-5 max-h-10">
              <button
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                onClick={() => setEditMode(true)}>
                Düzenle
              </button>
              <button
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                onClick={() => router.back()}>
                Geri
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
