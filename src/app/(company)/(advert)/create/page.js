"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGlobalState } from "../../../../store/global";
import Loading from "../../../../components/loading";
import Toast from "../../../../components/toast";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Advert() {
  const { isLoggedIn, isLoading } = useGlobalState();

  const [formData, setFormData] = useState({
    title: "",
    field: "",
    requirements: "",
    foreignLanguages: "",
    department: "",
  });

  const [toastMessage, setToastMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/");
    }
  }, [token, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleRequirementsChange = (e) => {
    const requirements = e.target.value;
    setFormData((prevState) => ({
      ...prevState,
      requirements,
    }));
  };

  const handleForeignLanguagesChange = (e) => {
    const foreignLanguages = e.target.value;
    setFormData((prevState) => ({
      ...prevState,
      foreignLanguages,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: formData.title,
      field: formData.field,
      requirements: formData.requirements,
      foreignLanguages: formData.foreignLanguages,
      department: formData.department,
    };
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/adverts/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        setToastMessage("Advert created successfully");
        setTimeout(() => {
          setToastMessage("");
          setLoading(false);
          setFormData({
            title: "",
            field: "",
            requirements: "",
            foreignLanguages: "",
            department: "",
          });
        }, 3000);
      } else {
        const data = await response.json();
        console.log(data);
        setToastMessage("Error creating advert");
        setTimeout(() => {
          setToastMessage("");
          setLoading(false);
        }, 3000);
      }
    } catch (error) {
      setToastMessage("Error creating advert");
      setTimeout(() => {
        setToastMessage("");
        setLoading(false);
      }, 3000);
    }
  };

  if (!isLoggedIn || isLoading) {
    return <Loading />;
  }

  return (
    <section className="w-screen flex justify-center items-start h-screen py-20 bg-base-100">
      <form
        className="flex flex-col w-screen h-fit justify-center items-center bg-base-100 pb-20 gap-2"
        onSubmit={handleSubmit}>
        <div className="w-full max-w-md p-6 bg-base-200 rounded-lg h-fit">
          <h1 className="text-2xl font-bold mb-6">Advert Information</h1>
          <label className="label mb-2 text-neutral-content">Title:</label>
          <input
            type="text"
            className="input input-bordered input-primary input-sm w-full bg-transparent text-neutral-content"
            placeholder="Title"
            required
            name="title"
            onChange={handleChange}
            value={formData.title}
          />
          <label className="label mb-2 text-neutral-content flex justify-start">
            <span className="text-error">*</span>Field:
          </label>
          <input
            type="text"
            className="input input-bordered input-primary input-sm w-full bg-transparent text-neutral-content"
            placeholder="Field"
            required
            name="field"
            onChange={handleChange}
            value={formData.field}
          />
          <label className="label mb-2 text-neutral-content flex justify-start">
            <span className="text-error">*</span>Requirements:
          </label>
          <textarea
            className="textarea textarea-bordered textarea-primary textarea-sm w-full bg-transparent text-neutral-content leading-tight p-4"
            placeholder="Add requirements"
            required
            name="requirements"
            onChange={handleRequirementsChange}
            value={formData.requirements}
          />
          <label className="label mb-2 text-neutral-content flex justify-start">
            <span className="text-error">*</span>Foreign Languages:
          </label>
          <textarea
            className="textarea textarea-bordered textarea-primary textarea-sm w-full bg-transparent text-neutral-content leading-tight p-4"
            placeholder="Add foreign languages"
            required
            name="foreignLanguages"
            onChange={handleForeignLanguagesChange}
            value={formData.foreignLanguages}
          />
          <label className="label mb-2 text-neutral-content">Department:</label>
          <input
            type="text"
            className="input input-bordered input-primary input-sm w-full bg-transparent text-neutral-content"
            placeholder="Department"
            required
            name="department"
            onChange={handleChange}
            value={formData.department}
          />
          <button type="submit" className="btn btn-primary mt-4 w-full" disabled={isLoading}>
            {loading ? <span className="loading loading-ring loading-sm"></span> : "Create"}
          </button>
        </div>
      </form>
      {toastMessage && <Toast message={toastMessage} />}
    </section>
  );
}
