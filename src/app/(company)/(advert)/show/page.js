"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
import { useGlobalState } from "../../../../store/global";
import Loading from "../../../../components/loading";

export default function Apply() {
  const { token, setIsLoading, isLoading } = useGlobalState();
  const [adverts, setAdverts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (token) {
      fetchAdverts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchAdverts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/adverts/own`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.response) {
        setAdverts(data.adverts);
      } else {
        setAdverts([]);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching adverts:", error);
      setIsLoading(false);
    }
  };

  const handleViewAdvert = (id) => {
    router.push(`/advert/${id}`);
  };

  const handleViewApplicants = (id) => {
    router.push(`/advert/${id}/application`);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="w-screen flex justify-center items-start h-screen py-20 bg-info">
      <div className="overflow-x-auto">
        <h1 className="text-2xl font-bold mb-6">İlanları Görüntüle</h1>
        {isLoading ? (
          <p>Loading...</p>
        ) : adverts.length === 0 ? (
          <p>No adverts available.</p>
        ) : (
          <table className="table table-zebra bg-primary">
            {/* head */}
            <thead>
              <tr>
                <th>#</th>
                <th>İlanın İsmi</th>
                <th>İlanı Görüntüle</th>
                <th>İlana Başvuranlar</th>
              </tr>
            </thead>
            <tbody>
              {adverts.map((advert, index) => (
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
    </div>
  );
}
