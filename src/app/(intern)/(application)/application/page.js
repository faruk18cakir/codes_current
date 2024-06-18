"use client";

import { useGlobalState } from "../../../../store/global";
import Loading from "../../../../components/loading";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function UserApplications() {
  const { isLoading, isLoggedIn, token } = useGlobalState();
  const [applications, setApplications] = useState([]);
  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  const fetchApplications = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${apiUrl}/api/applications/own`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications);
      } else {
        console.error("Error fetching applications", await response.json());
      }
    } catch (error) {
      console.error("Error fetching applications", error);
    }
  };

  const fetchAdvertDetail = async (advertId) => {
    if (!token) return;
    try {
      const response = await fetch(`${apiUrl}/api/adverts/${advertId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        return data.advert;
      } else {
        console.error("Error fetching advert detail", await response.json());
        return null;
      }
    } catch (error) {
      console.error("Error fetching advert detail", error);
      return null;
    }
  };

  const handleModalOpen = async (application) => {
    const data = await fetchAdvertDetail(application.advert._id);
    setModalContent(data);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  if (isLoading || !isLoggedIn) {
    return <Loading />;
  }

  return (
    <section className="w-screen flex justify-center pb-5 mt-72 sm:mt-20 bg-base-100">
      <div className="w-screen max-w-[1200px] px-1 sm:px-10">
        <h1 className="text-2xl font-bold mb-4">Staj Başvurularım</h1>
        {applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center">
            <div className="text-center text-3xl text-gray-500 mt-10">Bir aktif staj başvurusu bulunamadı!!!</div>
            <p className="text-center text-red-500 mt-4">Önemli: Başvuru yapmadan önce profilinizi oluşturun</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full bg-base-200 rounded-lg">
              <thead>
                <tr className="bg-base-300 text-left">
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Şirket İsmi</th>
                  <th className="px-4 py-2">İlanın İsmi</th>
                  <th className="px-4 py-2">Başvuru Durumu</th>
                  <th className="px-4 py-2">İncele</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((application, index) => (
                  <tr key={application._id} className="bg-base-100 border-b border-base-300 text-left">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2 font-bold text-primary">
                      {application.advert ? application.advert.company?.companyName : "N/A"}
                    </td>
                    <td className="px-4 py-2">{application.advert ? application.advert.title : "N/A"}</td>
                    <td
                      className={`px-4 py-2 ${
                        application.status === "pending"
                          ? "text-gray-500"
                          : application.status === "accepted"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}>
                      {application.status === "pending"
                        ? "Değerlendirmede"
                        : application.status === "accepted"
                        ? "Onaylandı"
                        : "Red oldu"}
                    </td>
                    <td className="px-4 py-2 h-2">
                      <button
                        className="px-4 py-1 rounded-md bg-primary text-primary-content"
                        onClick={() => handleModalOpen(application)}>
                        İncele
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-11/12 md:w-1/2 relative max-h-screen overflow-y-auto">
            <button
              onClick={handleModalClose}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 focus:outline-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex flex-col items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Başvuru Detayları</h2>
              <div className="w-16 h-1 bg-primary rounded-full mb-4"></div>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>
                <strong>Şirket İsmi:</strong> {modalContent ? modalContent.company?.companyName : "N/A"}
              </p>
              <p>
                <strong>İlanın İsmi:</strong> {modalContent ? modalContent.title : "N/A"}
              </p>
              <p>
                <strong>Başvuru Tarihi:</strong> {new Date(modalContent.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Son Güncelleme:</strong> {new Date(modalContent.updatedAt).toLocaleDateString()}
              </p>
              {modalContent.company && (
                <>
                  <p>
                    <strong>İstenilenler:</strong> {modalContent.requirements}
                  </p>
                  <p>
                    <strong>Yabancı Dil:</strong> {modalContent.foreignLanguages}
                  </p>
                  <p>
                    <strong>Bölüm:</strong> {modalContent.department}
                  </p>
                </>
              )}
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={handleModalClose}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50">
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
