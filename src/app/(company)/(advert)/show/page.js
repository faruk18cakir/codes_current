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
    fetchAdverts();

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

  const fetchApplications = async (advertId) => {
    try {
      const response = await fetch(`${apiUrl}/api/applications/advert/${advertId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
    return null;
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
    <section className="w-screen flex justify-center pb-5 mt-72 sm:mt-20  bg-base-100">
      <div className="w-screen max-w-[1200px] px-1 sm:px-10">
        <h1 className="text-2xl font-bold mb-4">İlanları Görüntüle</h1>
        {adverts.length === 0 ? (
          <div className="flex flex-col items-center justify-center">
            <div className="text-center text-3xl text-gray-500 mt-10">Kayıtlı İlan bulunamadı.!!!</div>
            <p className="text-center text-red-500 mt-4"> Önemli : İlan vermeden önce profilinizi oluşturun</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full bg-base-200 rounded-lg">
              <thead>
                <tr className="bg-base-300 text-left">
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">İlanın İsmi</th>
                  <th className="px-4 py-2">İlanı Görüntüle</th>
                  <th className="px-4 py-2">İlana Başvuranlar</th>
                </tr>
              </thead>
              <tbody>
                {adverts.map((advert, index) => (
                  <tr key={advert._id} className="bg-base-100 border-b border-base-300 text-left">
                    <th className="px-4 py-2">{index + 1}</th>
                    <td className="px-4 py-2 font-bold text-primary">{advert.title}</td>
                    <td className="px-4 py-2 h-2">
                      <button
                        onClick={() => handleViewAdvert(advert._id)}
                        className="px-4 py-1 rounded-md bg-primary text-primary-content ">
                        İlanı Görüntüle
                      </button>
                    </td>
                    <td className="px-4 py-2 h-10">
                      {fetchApplications(advert._id).then((data) => {
                        if (data) {
                          return (
                            data.applications.length > 0 &&
                            data.applications.filter((app) => app.status === "pending").length > 0 && (
                              <div>
                                <button
                                  onClick={() => handleViewApplicants(advert._id)}
                                  className="px-4 py-1 rounded-md bg-primary text-primary-content ">
                                  İlana Başvuranlar
                                </button>
                                <span className="rounded-full px-3 bg-warning">
                                  {data.applications.filter((app) => app.status === "pending").length}
                                </span>
                              </div>
                            )
                          );
                        }
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
