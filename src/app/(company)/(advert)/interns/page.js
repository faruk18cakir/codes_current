"use client";

import { useEffect, useState } from "react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
import { useGlobalState } from "../../../../store/global";
import Loading from "../../../../components/loading";

export default function Apply() {
  const { token, setIsLoading, isLoading } = useGlobalState();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    if (token) {
      fetchApplications();
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

  const handleViewAdvert = (id) => {
    router.push(`/applications/${id}`);
  };

  const handleViewApplicants = (id) => {
    router.push(`/applications/${id}/applicants`);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <section className="w-screen flex justify-center items-start h-screen py-20 bg-info">
      <div className="overflow-x-auto">
        <h1 className="text-2xl font-bold mb-6">İlana Başvuranlar</h1>
        {isLoading ? (
          <p>Loading...</p>
        ) : applications.length === 0 ? (
          <p>No applications available.</p>
        ) : (
          <table className="table table-zebra bg-primary">
            {/* head */}
            <thead>
              <tr>
                <th>#</th>
                <th>Adayın İsmi</th>
                <th>Adayın Soysismi</th>
                <th>Adayın Eşleşme Skoru</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((advert, index) => (
                <tr key={advert._id}>
                  <th>{index + 1}</th>
                  <td className="capitalize font-bold text-xl">{advert.title}</td>
                  <td>
                    <button onClick={() => handleViewAdvert(advert._id)} className="btn btn-info">
                      İlanı Görüntüle
                    </button>
                  </td>
                  <td>
                    <button onClick={() => handleViewApplicants(advert._id)} className="btn btn-success">
                      İlana Başvuranlar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
