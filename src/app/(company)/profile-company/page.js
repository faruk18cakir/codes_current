"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Toast from "../../../components/toast";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
import { useGlobalState } from "../../../store/global";
import Loading from "../../../components/loading";

export default function Profile() {
  const { isLoggedIn, isLoading, token } = useGlobalState();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    companyName: "",
    address: "",
    sector: "",
    phoneNumber: "",
    faxNumber: "",
    about: "",
  });

  const [toastMessage, setToastMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!token) {
    router.push("/");
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/users/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setFormData({
            username: data.user?.username || "",
            email: data.user?.email || "",
            companyName: data.profile?.companyName || "",
            address: data.profile?.address || "",
            sector: data.profile?.sector || "",
            phoneNumber: data.profile?.phoneNumber || "",
            faxNumber: data.profile?.faxNumber || "",
            about: data.profile?.about || "",
          });
        } else {
          const data = await response.json();
          console.log("Error fetching profile", data);
        }
      } catch (error) {
        console.log("Error fetching profile", error);
      }
    };
    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mapping formData to the required JSON structure
    const payload = {
      companyName: formData.companyName,
      about: formData.about,
      phoneNumber: formData.phoneNumber,
      faxNumber: formData.faxNumber,
      address: formData.address,
      sector: formData.sector,
    };

    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/users/company-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const data = await response.json();
        setToastMessage("Profile updated successfully");
        setTimeout(() => {
          setToastMessage("");
          setLoading(false);
        }, 3000);
      } else {
        await response.json();
        setToastMessage("Error updating profile");
        setTimeout(() => {
          setToastMessage("");
          setLoading(false);
        }, 3000);
      }
    } catch (error) {
      setToastMessage("Error updating profile");
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
    <section className="w-screen flex justify-center items-start  mt-72 sm:mt-20  bg-base-100">
      <form
        className="flex flex-col w-screen h-fit justify-center items-center bg-base-100 md:flex-row md:items-start md:space-x-6 pb-2 gap-2"
        onSubmit={handleSubmit}>
        <div className="w-full max-w-md p-6 bg-base-200 md:w-1/2 rounded-lg h-fit">
          <h1 className="text-2xl font-bold mb-6">Profil Bilgileri</h1>
          <label className="label mb-2 ">Kullanıcı Adı:</label>
          <input
            type="text"
            className="input input-bordered input-primary input-sm w-full bg-transparent "
            placeholder="Username"
            disabled
            name="username"
            value={formData.username}
          />
          <label className="label mb-2 ">Email:</label>
          <input
            type="text"
            className="input input-bordered input-primary input-sm w-full bg-transparent "
            placeholder="Email"
            disabled
            name="email"
            value={formData.email}
          />
          <label className="label mb-2 ">Şirket İsmi:</label>
          <input
            type="text"
            className="input input-bordered input-primary input-sm w-full bg-transparent "
            placeholder="Company Name"
            required
            name="companyName"
            onChange={handleChange}
            value={formData.companyName}
          />
          <label className="label mb-2 ">Adres:</label>
          <input
            type="text"
            className="input input-bordered input-primary input-sm w-full bg-transparent "
            placeholder="Address"
            name="address"
            onChange={handleChange}
            value={formData.address}
          />
          <label className="label mb-2 ">Sektör:</label>
          <input
            type="text"
            className="input input-bordered input-primary input-sm w-full bg-transparent "
            placeholder="Sector"
            name="sector"
            onChange={handleChange}
            value={formData.sector}
          />
          <label className="label mb-2 ">Telefon:</label>
          <input
            type="text"
            className="input input-bordered input-primary input-sm w-full bg-transparent "
            placeholder="Phone"
            name="phoneNumber"
            onChange={handleChange}
            value={formData.phoneNumber}
          />
          <label className="label mb-2 ">Fax:</label>
          <input
            type="text"
            className="input input-bordered input-primary input-sm w-full bg-transparent "
            placeholder="Fax"
            name="faxNumber"
            onChange={handleChange}
            value={formData.faxNumber}
          />
          <label className="label mb-2 ">Hakkında:</label>
          <textarea
            className="textarea textarea-bordered textarea-primary textarea-sm w-full bg-transparent "
            placeholder="About"
            name="about"
            onChange={handleChange}
            value={formData.about}></textarea>
          <button type="submit" className="btn btn-primary w-full mt-10">
            {loading ? <span className="loading loading-ring loading-sm"></span> : "Profili Kaydet"}
          </button>
        </div>
      </form>
      {toastMessage && <Toast message={toastMessage} />}
    </section>
  );
}
