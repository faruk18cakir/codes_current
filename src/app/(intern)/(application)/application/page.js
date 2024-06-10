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

  const handleModalOpen = (application) => {
    setModalContent(application);
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
                <th className="px-4 py-2">Başvuru Durumu</th>
                <th className="px-4 py-2">İncele</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => (
                <tr key={application._id} className="bg-base-100 border-b border-base-300 text-center">
                  <td className="px-4 py-2">{application.advert ? application.advert.title : "N/A"}</td>
                  <td className="px-4 py-2">{application.status}</td>
                  <td className="px-4 py-2">
                    <button className="btn-info btn min-w-[100px]" onClick={() => handleModalOpen(application)}>
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
          <div className="bg-white p-4 rounded-lg shadow-lg w-11/12 md:w-1/2">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Başvuru Detayları</h2>
              <button onClick={handleModalClose} className="text-red-500">
                X
              </button>
            </div>
            <div className="mt-4">
              <p>
                <strong>Şirket İsmi:</strong> {modalContent.advert ? modalContent.advert.company : "N/A"}
              </p>
              <p>
                <strong>İlanın İsmi:</strong> {modalContent.advert ? modalContent.advert.title : "N/A"}
              </p>
              <p>
                <strong>Başvuru Durumu:</strong> {modalContent.status}
              </p>
              <p>
                <strong>Başvuru Tarihi:</strong> {new Date(modalContent.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Son Güncelleme:</strong> {new Date(modalContent.updatedAt).toLocaleDateString()}
              </p>
              {modalContent.advert && (
                <>
                  <p>
                    <strong>Requirements:</strong> {modalContent.advert.requirements.join(", ")}
                  </p>
                  <p>
                    <strong>Foreign Languages:</strong> {modalContent.advert.foreignLanguages.join(", ")}
                  </p>
                  <p>
                    <strong>Department:</strong> {modalContent.advert.department}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
