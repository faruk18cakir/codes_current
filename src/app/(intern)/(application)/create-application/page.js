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
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      fetchApplications();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, router, token]);

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

  const handleApply = async (advertId) => {
    try {
      const response = await fetch(`${apiUrl}/api/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ advert: advertId }),
      });
      if (response.ok) {
        fetchApplications(); // Refresh applications to disable the button
      } else {
        console.error("Error applying for advert", await response.json());
      }
    } catch (error) {
      console.error("Error applying for advert", error);
    }
  };

  const hasApplied = (advertId) => {
    return applications.some((application) => application.advert && application.advert._id === advertId);
  };

  if (isLoading || !isLoggedIn) {
    return <Loading />;
  }

  return (
    <section className="w-screen flex justify-center py-20 bg-base-100 h-full">
      <div className="w-screen max-w-[1200px] px-10">
        <h1 className="text-2xl font-bold mb-4">Başvurularım</h1>
        {applications.length === 0 ? (
          <div className="text-center text-3xl text-gray-500 mt-20">Henüz başvuru yapılmadı!!!</div>
        ) : (
          <table className="table-auto w-full bg-base-200 rounded-lg">
            <thead>
              <tr>
                <th className="px-4 py-2">İlanın İsmi</th>
                <th className="px-4 py-2">Eşleşme Skoru</th>
                <th className="px-4 py-2">İncele</th>
              </tr>
            </thead>
            <tbody>
              {applications
                .filter((app) => app.status === "pending")
                .map((application, index) => (
                  <tr key={application._id} className="bg-base-100 border-b border-base-300 text-center">
                    <td className="px-4 py-2 font-bold text-info">
                      {application.advert ? application.advert.title : "N/A"}
                    </td>
                    <td className="px-4 py-2">{application.__v}</td>
                    <td className="px-4 py-2">
                      <button className="btn btn-primary" onClick={() => handleModalOpen(application)}>
                        İncele
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-11/12 md:w-1/2 relative">
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
              <h2 className="text-2xl font-bold text-gray-800 mb-2">İlan Detayları</h2>
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
                    <strong>Requirements:</strong> {modalContent.requirements}
                  </p>
                  <p>
                    <strong>Foreign Languages:</strong> {modalContent.foreignLanguages}
                  </p>
                  <p>
                    <strong>Department:</strong> {modalContent.department}
                  </p>
                </>
              )}
            </div>
            <div className="flex justify-end mt-6 gap-4">
              <button
                className={`px-4 py-2 ${
                  hasApplied(modalContent._id) ? "bg-accent" : "bg-primary"
                }  text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50`}
                onClick={() => handleApply(modalContent._id)}
                disabled={hasApplied(modalContent._id)}>
                {hasApplied(modalContent._id) ? "Başvuru Yapıldı" : "Başvuru yap"}
              </button>
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

