"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import moment from "moment";
import { HiPlus } from "react-icons/hi";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
import { HiX } from "react-icons/hi";
import { useGlobalState } from "../../../store/global";
import Loading from "../../../components/loading";
import Toast from "../../../components/toast";

const languages = ["İngilizce", "Almanca", "Fransızca", "Arapça", "Rusça"];
const languageLevels = ["A1", "A2", "B1", "B2", "C1", "C2"];
const skillLevels = ["Başlangıç Seviye", "Orta Seviye", "İleri Seviye"];

languages.forEach((language) => {
  languageLevels[language] =
    Object.keys(languageLevels)[Math.floor(Math.random() * Object.keys(languageLevels).length)];
});
export default function Profile() {
  const { isLoggedIn, isLoading } = useGlobalState();
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [selectedSkillLevel, setSelectedSkillLevel] = useState("");
  const [newHobby, setNewHobby] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    birthDate: "",
    phone: "",
    address: "",
    university: "",
    department: "",
    class: "",
    gpa: "",
    experience: "",
    desiredField: "",
    skills: [],
    foreignLanguages: [],
    communicationSkills: "",
    teamwork: "",
    analyticalSkills: "",
    hobbies: [],
  });

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  const fetchProfile = async () => {
    if (!token) return;
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
          firstName: data.profile?.firstName || "",
          lastName: data.profile?.lastName || "",
          birthDate: data.profile?.birthDate || "",
          phone: data.profile?.phoneNumber || "",
          address: data.profile?.address || "",
          university: data.profile?.university || "",
          department: data.profile?.department || "",
          class: data.profile?.class || "",
          gpa: data.profile?.average ? data.profile.average.toString() : "",
          experience: data.profile?.workExperience || "",
          desiredField: data.profile?.desiredField || "",
          skills: data.profile?.skills || [],
          foreignLanguages: data.profile?.languages || [],
          teamwork: data.profile?.teamWorkSkill || "",
          communicationSkills: data.profile?.communicationSkill || "",
          analyticalSkills: data.profile?.analyticalSkill || "",
          hobbies: data.profile?.hobbies || [],
        });
      } else {
        const data = await response.json();
        console.log("Error fetching profile", data);
      }
    } catch (error) {
      console.log("Error fetching profile", error);
    }
  };

  const handleSkillChange = (e) => {
    setNewSkill(e.target.value);
  };

  const handleSkillLevelChange = (e) => {
    setSelectedSkillLevel(e.target.value);
  };

  const handleAddSkill = () => {
    if (newSkill && selectedSkillLevel) {
      const newSkillWithLevel = `${newSkill} (${selectedSkillLevel})`;
      setFormData((prevFormData) => ({
        ...prevFormData,
        skills: [...(prevFormData.skills || []), newSkillWithLevel],
      }));
      setNewSkill(""); // Reset input
      setSelectedSkillLevel(""); // Reset level
    } else {
      setToastMessage("Lütfen beceri ve seviye girin.");
      setTimeout(() => {
        setToastMessage("");
      }, 3000);
    }
  };

  const handleRemoveSkill = (index) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      skills: prevFormData.skills.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mapping formData to the required JSON structure
    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phoneNumber: formData.phone,
      birthDate: formData.birthDate,
      address: formData.address,
      university: formData.university,
      department: formData.department,
      class: formData.class,
      average: parseFloat(formData.gpa), // assuming GPA is a string, converting to float
      workExperience: formData.experience,
      desiredField: formData.desiredField,
      skills: formData.skills,
      languages: formData.foreignLanguages,
      teamWorkSkill: formData.teamwork,
      communicationSkill: formData.communicationSkills,
      analyticalSkill: formData.analyticalSkills,
      hobbies: formData.hobbies,
    };

    try {
      const response = await fetch(`${apiUrl}/api/users/intern-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const data = await response.json();

        setToastMessage("Profile updated successfully.");
        setTimeout(() => {
          setToastMessage("");
        }, 3000);
      } else {
        console.log("Error updating profile", data);
        setToastMessage("Error updating profile.");
        setTimeout(() => {
          setToastMessage("");
        }, 3000);
      }
    } catch (error) {
      setToastMessage("Error updating profile.");
      setTimeout(() => {
        setToastMessage("");
      }, 3000);
    }
  };

  const handleLanguageChange = (e) => {
    const language = e.target.value;
    setSelectedLanguage(language);
    setSelectedLevel(""); // Reset level when language changes
  };

  const handleLevelChange = (e) => {
    const level = e.target.value;
    setSelectedLevel(level);
  };

  const handleAddLanguage = () => {
    if (selectedLanguage && selectedLevel) {
      const newLanguage = `${selectedLanguage} (${selectedLevel})`;
      setFormData((prevFormData) => ({
        ...prevFormData,
        foreignLanguages: [...prevFormData.foreignLanguages, newLanguage],
      }));
      // Reset selections
      setSelectedLanguage("");
      setSelectedLevel("");
    } else {
      setToastMessage("Her ikisini de seçmelisiniz dil ve seviye.");
      setTimeout(() => {
        setToastMessage("");
      }, 3000);
    }
  };

  const handleRemoveLanguage = (index) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      foreignLanguages: prevFormData.foreignLanguages.filter((_, i) => i !== index),
    }));
  };

  const handleHobbiesChange = (e) => {
    setNewHobby(e.target.value);
  };

  const handleAddHobby = () => {
    if (newHobby) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        hobbies: [...(prevFormData.hobbies || []), newHobby],
      }));
      setNewHobby(""); // Reset input
    }
  };

  const handleRemoveHobby = (index) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      hobbies: prevFormData.hobbies.filter((_, i) => i !== index),
    }));
  };
  if (!isLoggedIn || isLoading) {
    return <Loading />;
  }

const handleChange = (e, field) => {
  const { value } = e.target;
  setFormData((formData) => ({
    ...formData,
    [field]: value,
  }));
};

  return (
    <section className="w-screen flex justify-center items-start  mt-72 sm:mt-20  bg-base-100">
      <form
        className="flex flex-col w-screen h-fit justify-center items-center bg-base-100 md:flex-row md:items-start md:space-x-6 gap-2"
        onSubmit={handleSubmit}>
        <div className="w-full max-w-md p-6 bg-base-200 md:w-1/2 rounded-lg h-fit">
          <h1 className="text-2xl font-bold mb-6">Profil Bilgileri</h1>
          <label className="label ">
            Kullanıcı Adı : <strong>{formData.username}</strong>
          </label>
          <label className="label ">
            E-posta : <strong>{formData.email}</strong>
          </label>
          <label className="label flex justify-between text-error">
            Ad:
            <input
              type="text"
              className="input input-bordered ml-2 input-primary input-sm w-1/2 bg-transparent "
              placeholder={formData.firstName || "Ad"}
              required
              name="firstName"
              onChange={(e) => handleChange(e, "firstName")}
              value={formData.firstName}
            />
          </label>
          <label className="label flex justify-between text-error">
            Soyad:
            <input
              type="text"
              className="input input-bordered  input-primary input-sm w-1/2 bg-transparent "
              placeholder={formData.lastName || "Soyad"}
              required
              name="lastName"
              onChange={(e) => handleChange(e, "lastName")}
              value={formData.lastName}
            />
          </label>
          <label className="label  ">
            Doğum Tarihi:
            <input
              type="date"
              className="input input-bordered input-primary input-sm w-1/2 bg-transparent"
              placeholder="mm/dd/yyyy"
              name="birthday"
              onChange={(e) => handleChange(e, "birthDate")}
              value={formData.birthDate ? formData.birthDate : ""}
            />
          </label>
          <label className="label ">
            Telefon:
            <input
              type="text"
              className="input input-bordered input-primary input-sm w-1/2  bg-transparent "
              placeholder="Telefon"
              name="phone"
              onChange={(e) => handleChange(e, "phone")}
              value={formData.phone}
            />
          </label>
          <label className="label ">
            Adres:
            <input
              type="text"
              className="input input-bordered input-primary input-sm w-1/2  bg-transparent "
              placeholder="Adres"
              name="address"
              onChange={(e) => handleChange(e, "address")}
              value={formData.address}
            />
          </label>
          <label className="label flex justify-between text-error">
            Üniversite:
            <input
              type="text"
              className="input input-bordered input-primary input-sm w-1/2 bg-transparent "
              placeholder="Üniversite"
              required
              name="university"
              onChange={(e) => handleChange(e, "university")}
              value={formData.university}
            />
          </label>
          <label className="label flex justify-between text-error">
            Bölüm:
            <input
              type="text"
              className="input input-bordered input-primary input-sm w-1/2 bg-transparent "
              placeholder="Bölüm"
              required
              name="department"
              onChange={(e) => handleChange(e, "department")}
              value={formData.department}
            />{" "}
          </label>
        </div>
        <div className="w-full max-w-md p-6 bg-base-200 md:w-1/2 h-fit rounded-lg">
          <label className="label flex justify-between text-error">
            Sınıf:
            <input
              type="text"
              className="input input-bordered input-primary input-sm w-1/2  bg-transparent "
              placeholder="Sınıf"
              required
              name="class"
              onChange={(e) => handleChange(e, "class")}
              value={formData.class}
            />
          </label>

          <label className="label flex justify-between text-error">
            GPA:
            <input
              type="text"
              className="input input-bordered input-primary input-sm w-1/2  bg-transparent "
              placeholder="GPA"
              required
              name="gpa"
              onChange={(e) => handleChange(e, "gpa")}
              value={formData.gpa}
            />
          </label>

          <label className="label ">
            Deneyim:
            <input
              type="text"
              className="input input-bordered input-primary input-sm w-1/2 bg-transparent "
              placeholder="Deneyim"
              name="experience"
              onChange={(e) => handleChange(e, "experience")}
              value={formData.experience}
            />
          </label>

          <label className="label flex justify-between text-error">
           Çalışmak İstenilen Alan:
            <input
              type="text"
              className="input input-bordered input-primary input-sm w-1/2  bg-transparent "
              placeholder="İstenilen Alan"
              required
              name="desiredField"
              onChange={(e) => handleChange(e, "desiredField")}
              value={formData.desiredField}
            />{" "}
          </label>

          <div className="flex flex-wrap gap-2 bg-slate-100 my-2 pt-2 rounded-md">
            <label className="label w-full flex justify-between text-error">
              Yetenekler:
              <div className="flex gap-2 w-full justify-end ">
                <input
                  type="text"
                  className="input input-bordered input-primary input-sm w-1/2 bg-transparent "
                  placeholder="Yetenek"
                  name="skills"
                  onChange={handleSkillChange}
                  value={newSkill}
                />
                {newSkill && (
                  <>
                    <select
                      className="select select-bordered select-primary select-sm w-1/4 bg-transparent "
                      required
                      name="skillLevel"
                      onChange={handleSkillLevelChange}
                      value={selectedSkillLevel}>
                      <option value="" disabled className="text-gray-200">
                        Seç
                      </option>
                      {skillLevels.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </>
                )}
                <div className="relative inline-block ml-2 align-middle select-none">
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="inline-flex bg-info items-center justify-center py-1 my-1 px-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-500"
                    id="menu-button"
                    aria-expanded="true"
                    aria-haspopup="true">
                    <HiPlus aria-hidden="true" />
                  </button>
                </div>
              </div>
            </label>
            <ul className="list-disc list-inside mt-1 w-full">
              {Array.isArray(formData.skills) &&
                formData.skills.map((skill, index) => (
                  <li key={index} className="flex justify-between w-full items-center bg-slate-200 p-2 rounded-md">
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(index)}
                      className="inline-flex bg-error items-center justify-center py-1 my-1 px-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-500">
                      <HiX aria-hidden="true" />
                    </button>
                  </li>
                ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-2 bg-slate-100 my-2 pt-2 rounded-md">
            <label className="label w-full flex justify-between text-error">
              Yabancı Dil:
              <div className="flex gap-2 w-fit justify-end">
                <select
                  className="select select-bordered select-primary select-sm w-1/2 bg-transparent "
                  name="foreignLanguages"
                  onChange={handleLanguageChange}
                  value={selectedLanguage}>
                  <option value="" disabled className="text-gray-200">
                    Seç
                  </option>
                  {languages.map((language) => (
                    <option key={language} value={language}>
                      {language}
                    </option>
                  ))}
                </select>
                {selectedLanguage && (
                  <>
                    <select
                      className="select select-bordered select-primary select-sm w-1/3 bg-transparent "
                      required
                      name="languageLevel"
                      onChange={handleLevelChange}
                      value={selectedLevel}>
                      <option value="" disabled className="text-gray-200">
                        Seç
                      </option>
                      {languageLevels.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </>
                )}{" "}
                <div className="relative inline-block ml-2 align-middle select-none">
                  <button
                    type="button"
                    onClick={handleAddLanguage}
                    className="inline-flex bg-info items-center justify-center py-1 my-1 px-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-500"
                    id="menu-button"
                    aria-expanded="true"
                    aria-haspopup="true">
                    <HiPlus aria-hidden="true" />
                  </button>
                </div>
              </div>
            </label>
            <ul className="list-disc list-inside mt-1 w-full">
              {Array.isArray(formData.foreignLanguages) &&
                formData.foreignLanguages.map((language, index) => (
                  <li key={index} className="flex justify-between w-full items-center bg-slate-200 p-2 rounded-md">
                    {language}
                    <button
                      type="button"
                      onClick={() => handleRemoveLanguage(index)}
                      className="inline-flex bg-error items-center justify-center py-1 my-1 px-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-500">
                      <HiX aria-hidden="true" />
                    </button>
                  </li>
                ))}
            </ul>
          </div>

          <label className="label flex justify-between text-error">
            Takım Çalışması Becerisi:
            <select
              className="select select-bordered select-primary select-sm w-1/2 bg-transparent "
              required
              name="teamwork"
              onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
              value={formData.teamwork}>
              <option value="" disabled className="text-gray-200">
                Lütfen seçin
              </option>
              <option value="Medium">Orta</option>
              <option value="Good">İyi</option>
              <option value="Very Good">Çok İyi</option>
            </select>{" "}
          </label>

          <label className="label flex justify-between text-error">
            İletişim Becerisi:
            <select
              className="select select-bordered select-primary select-sm w-1/2 bg-transparent "
              required
              name="communicationSkills"
              onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
              value={formData.communicationSkills}>
              <option value="" disabled className="text-gray-200">
                Lütfen seçin
              </option>
              <option value="Medium">Orta</option>
              <option value="Good">İyi</option>
              <option value="Very Good">Çok İyi</option>
            </select>
          </label>

          <label className="label flex justify-between text-error">
            Analitik Beceri:
            <select
              className="select select-bordered select-primary select-sm w-1/2 bg-transparent "
              required
              name="analyticalSkills"
              onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
              value={formData.analyticalSkills}>
              <option value="" disabled className="text-gray-200">
                Lütfen seçin
              </option>
              <option value="Medium">Orta</option>
              <option value="Good">İyi</option>
              <option value="Very Good">Çok İyi</option>
            </select>
          </label>

          <div className="flex flex-wrap gap-2  bg-slate-100 my-2 pt-2 rounded-md">
            <label className="label flex justify-between w-full">
              Hobiler:
              <div className="flex gap-2 mb-2 justify-end">
                <input
                  type="text"
                  className="input input-bordered input-primary input-sm w-1/2 bg-transparent "
                  placeholder="Hobbies"
                  name="newHobby"
                  onChange={handleHobbiesChange}
                  value={newHobby}
                />
                <button
                  type="button"
                  onClick={handleAddHobby}
                  className="inline-flex bg-info items-center justify-center py-1 my-1 px-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-500">
                  <HiPlus aria-hidden="true" />
                </button>
              </div>
            </label>
            <ul className="list-disc list-inside mt-1 w-full">
              {Array.isArray(formData.hobbies) &&
                formData.hobbies.map((hobby, index) => (
                  <li key={index} className="flex justify-between w-full items-center bg-slate-200 p-2 rounded-md">
                    {hobby}
                    <button
                      type="button"
                      onClick={() => handleRemoveHobby(index)}
                      className="inline-flex bg-error items-center justify-center py-1 my-1 px-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-500">
                      <HiX aria-hidden="true" />
                    </button>
                  </li>
                ))}
            </ul>
          </div>

          <button type="submit" className="btn btn-primary w-full mt-10">
            Profili Kaydet
          </button>
        </div>
      </form>
      {toastMessage && <Toast message={toastMessage} />}
    </section>
  );
}
