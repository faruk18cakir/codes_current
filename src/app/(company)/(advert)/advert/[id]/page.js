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
      // router.push("/");
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
          requirements: data.advert.requirements.join(", "),
          foreignLanguages: data.advert.foreignLanguages.join(", "),
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
          requirements: formValues.requirements.split(",").map((req) => req.trim()),
          foreignLanguages: formValues.foreignLanguages.split(",").map((lang) => lang.trim()),
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
    return <p>Loading...</p>;
  }

  if (!advert) {
    return <p>Advert not found.</p>;
  }

  return (
    <section className="w-screen flex justify-center items-start h-screen py-20 bg-base-100">
      <div className="max-w-md p-6 bg-base-200 rounded-lg flex flex-col gap-4">
        {editMode ? (
          <>
            <input
              type="text"
              name="title"
              value={formValues.title}
              onChange={handleInputChange}
              className="input input-bordered"
              placeholder="Title"
            />
            <input
              type="text"
              name="field"
              value={formValues.field}
              onChange={handleInputChange}
              className="input input-bordered"
              placeholder="Field"
            />
            <input
              type="text"
              name="department"
              value={formValues.department}
              onChange={handleInputChange}
              className="input input-bordered"
              placeholder="Department"
            />
            <input
              type="text"
              name="requirements"
              value={formValues.requirements}
              onChange={handleInputChange}
              className="input input-bordered"
              placeholder="Requirements (comma separated)"
            />
            <input
              type="text"
              name="foreignLanguages"
              value={formValues.foreignLanguages}
              onChange={handleInputChange}
              className="input input-bordered"
              placeholder="Foreign Languages (comma separated)"
            />
            <button className="btn btn-success" onClick={handleUpdate}>
              Güncelle
            </button>
            <button className="btn btn-secondary" onClick={() => setEditMode(false)}>
              İptal
            </button>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4">{advert.title}</h1>
            <p>
              <strong>Field:</strong> {advert.field}
            </p>
            <p>
              <strong>Department:</strong> {advert.department}
            </p>
            <p>
              <strong>Requirements:</strong> {advert.requirements.join(", ")}
            </p>
            <p>
              <strong>Foreign Languages:</strong> {advert.foreignLanguages.join(", ")}
            </p>
            <p>
              <strong>Oluşturulma Tarihi:</strong> {new Date(advert.createdAt).toLocaleDateString("tr-TR")}
            </p>
            <p>
              <strong>Güncellenme Tarihi:</strong> {new Date(advert.updatedAt).toLocaleDateString("tr-TR")}
            </p>
            <button className="btn btn-primary" onClick={() => setEditMode(true)}>
              Düzenle
            </button>
          </>
        )}
        <Link href="/show">
          <button className="btn btn-primary mt-4">Geri</button>
        </Link>
      </div>
    </section>
  );
}
