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
  const { id } = useParams();
  const [applications, setApplications] = useState([]);
  const [modalAppId, setModalAppId] = useState(null);

  useEffect(() => {
    if (token) {
      fetchApplications();
    } else {
      router.push("/login");
    }
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

  return (
    <div className="w-screen flex justify-center items-start py-20 bg-base-100">
      <div className="overflow-x-auto">
        <h1 className="text-2xl font-bold mb-6">Stajyerler</h1>
        {isLoading ? (
          <Loading />
        ) : applications.length === 0 ? (
          <>
            {" "}
            <p>Stajyer bulunamadı.</p>{" "}
            <button
              className="px-4 mt-5 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              onClick={() => router.back()}>
              Geri
            </button>
          </>
        ) : (
          <>
            {" "}
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
                                placeholder="Değerlendirme" />
                              <select className="w-full p-2 border border-gray-300 rounded-md mb-4">
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
                                  onClick={() => handleSaveRating(application._id)}
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
    </div>
  );
};

export default Application;
