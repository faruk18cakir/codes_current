"use client";

import React from "react";
import Loading from "../../../../components/loading";
import { useGlobalState } from "../../../../store/global";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const Application = () => {
  const { token, setIsLoading, isLoading } = useGlobalState();
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [modalAppId, setModalAppId] = useState(null);
  const [modalRating, setModalRating] = useState(0);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    fetchApplications();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/applications/own`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.response) {
        setApplications(data.applications);
      } else {
        setApplications([]);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching applications:", error);
      setIsLoading(false);
    }
  };

  const handleSaveRating = async (application) => {
    try {
      const payload = {
        score: parseInt(modalRating),
        comment: modalMessage,
        intern: application.intern?._id,
      };
      const response = await fetch(`${apiUrl}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Ensure token is correctly set and valid
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        setModalAppId(null);
      } else {
        console.error("Error saving rating:", await response.json());
      }
    } catch (error) {
      console.error("Error saving rating:", error);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <section className="w-screen flex justify-center pb-5 mt-72 sm:mt-20  bg-base-100">
      <div className="w-screen max-w-[1200px] px-10">
        <h1 className="text-2xl font-bold mb-4">Stajyerler</h1>
        {applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center">
            <div className="text-center text-3xl text-gray-500 mt-10">Kayıtlı Stajyer bulunamadı.!!!</div>
            <p className="text-center text-red-500 mt-4"> Önemly : İlan vermeden önce profilinizi oluşturun</p>
          </div>
        ) : (
          <>
            <table className="table table-zebra bg-base-200">
              <thead>
                <tr className="text-center">
                  <th>#</th>
                  <th>Stajyer İsmi</th>
                  <th>Stajyer Soysismi</th>
                  <th>İlan İsmi</th>
                  <th>Değerlendirmede</th>
                </tr>
              </thead>
              <tbody>
                {applications
                  .filter((app) => app.status === "accepted")
                  .map((application, index) => (
                    <tr key={application._id} className="text-center">
                      <th>{index + 1}</th>
                      <td className="capitalize font-bold text-xl">{application.intern.firstName}</td>
                      <td className="capitalize font-bold text-xl">{application.intern.lastName}</td>
                      <td className="capitalize font-bold text-xl">{application.advert.company.companyName}</td>
                      <td>
                        <button
                          onClick={() => setModalAppId(application._id)}
                          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50">
                          Değerlendirmede
                        </button>
                        {modalAppId === application._id && (
                          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                            <div className="bg-white p-8 rounded-lg">
                              <h2 className="text-2xl font-bold mb-4">Değerlendirme</h2>
                              <textarea
                                className="w-full p-2 border border-gray-300 rounded-md mb-4"
                                rows="4"
                                value={modalMessage}
                                onChange={(e) => setModalMessage(e.target.value)}
                                placeholder="Değerlendirme"
                              />
                              <select
                                className="w-full p-2 border border-gray-300 rounded-md mb-4"
                                value={modalRating}
                                onChange={(e) => setModalRating(e.target.value)}>
                                <option value="">Pounla</option>
                                {Array.from({ length: 5 }, (_, i) => (
                                  <option key={i + 1} value={i + 1}>
                                    {i + 1}
                                  </option>
                                ))}
                              </select>
                              <div className="flex justify-end">
                                <button
                                  onClick={() => setModalAppId(null)}
                                  className="px-4 py-2 bg-white text-black rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 mr-2">
                                  Geri
                                </button>
                                <button
                                  onClick={() => handleSaveRating(application)}
                                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50">
                                  Kaydet
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </section>
  );
};

export default Application;
