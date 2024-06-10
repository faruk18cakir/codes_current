"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HiPlus } from "react-icons/hi";
import { useGlobalState } from "../../../../store/global";
import Loading from "../../../../components/loading";
import Toast from "../../../../components/toast";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Advert() {
  const { isLoggedIn, isLoading } = useGlobalState();
  const [inputRequirement, setInputRequirement] = useState("");
  const [inputForeignLanguage, setInputForeignLanguage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    field: "",
    requirements: [],
    foreignLanguages: [],
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

  const handleAddRequirement = () => {
    if (inputRequirement.trim()) {
      setFormData((prevState) => ({
        ...prevState,
        requirements: [...prevState.requirements, inputRequirement.trim()],
      }));
      setInputRequirement("");
    }
  };

  const handleRemoveRequirement = (requirement) => {
    setFormData((prevState) => ({
      ...prevState,
      requirements: prevState.requirements.filter((r) => r !== requirement),
    }));
  };

  const handleAddForeignLanguage = () => {
    if (inputForeignLanguage.trim()) {
      setFormData((prevState) => ({
        ...prevState,
        foreignLanguages: [...prevState.foreignLanguages, inputForeignLanguage.trim()],
      }));
      setInputForeignLanguage("");
    }
  };

  const handleRemoveForeignLanguage = (language) => {
    setFormData((prevState) => ({
      ...prevState,
      foreignLanguages: prevState.foreignLanguages.filter((l) => l !== language),
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
            requirements: [],
            foreignLanguages: [],
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
        className="flex flex-col w-screen h-fit justify-center items-center bg-base-100 md:flex-row md:items-start md:space-x-6 pb-20 gap-2"
        onSubmit={handleSubmit}>
        <div className="w-full max-w-md p-6 bg-base-200 md:w-1/2 rounded-lg h-fit">
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
          <div className="flex items-center mb-2">
            <input
              type="text"
              className="input input-bordered input-primary input-sm w-full bg-transparent text-neutral-content mr-2"
              placeholder="Add a requirement"
              value={inputRequirement}
              onChange={(e) => setInputRequirement(e.target.value)}
            />
            <button type="button" className="btn btn-primary btn-sm" onClick={handleAddRequirement}>
              <HiPlus aria-hidden="true" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {formData.requirements.map((requirement) => (
              <div key={requirement} className="badge badge-ghost">
                {requirement}
                <button
                  type="button"
                  onClick={() => handleRemoveRequirement(requirement)}
                  className="btn btn-xs btn-ghost ml-1">
                  &#x2715;
                </button>
              </div>
            ))}
          </div>
          <label className="label mb-2 text-neutral-content flex justify-start">
            <span className="text-error">*</span>Foreign Languages:
          </label>
          <div className="flex items-center mb-2">
            <input
              type="text"
              className="input input-bordered input-primary input-sm w-full bg-transparent text-neutral-content mr-2"
              placeholder="Add a foreign language"
              value={inputForeignLanguage}
              onChange={(e) => setInputForeignLanguage(e.target.value)}
            />
            <button type="button" className="btn btn-primary btn-sm" onClick={handleAddForeignLanguage}>
              <HiPlus aria-hidden="true" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {formData.foreignLanguages.map((language) => (
              <div key={language} className="badge badge-ghost">
                {language}
                <button
                  type="button"
                  onClick={() => handleRemoveForeignLanguage(language)}
                  className="btn btn-xs btn-ghost ml-1">
                  &#x2715;
                </button>
              </div>
            ))}
          </div>
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
