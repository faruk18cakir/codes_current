"use client";

import React from "react";
import Loading from "../../../../components/loading";
import { useGlobalState } from "../../../../store/global";
import { useEffect, useState } from "react";
import Toast from "../../../../components/toast";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const Application = () => {
  const { userID, token, setIsLoading, isLoading } = useGlobalState();

  const [applications, setApplications] = useState([]);
  const [modalAppId, setModalAppId] = useState(null);
  const [modalRating, setModalRating] = useState(0);
  const [modalMessage, setModalMessage] = useState("");

  const [modalShowCommentId, setModalShowCommentId] = useState(null);
  const [modalShowComment, setModalShowComment] = useState("");
  const [modalShowCommentRating, setModalShowCommentRating] = useState(null);

  const [modalShowCommentIdIntern, setModalShowCommentIdIntern] = useState(null);
  const [modalShowCommentIntern, setModalShowCommentIntern] = useState("");
  const [modalShowCommentRatingIntern, setModalShowCommentRatingIntern] = useState(null);

  const [toastMessage, setToastMessage] = useState("");
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchApplications();
    fetchReviewsAdvert();
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

  const fetchReviewsAdvert = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/reviews/adverts/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data) {
        setReviews(data.reviews);
      } else {
        setReviews([]);
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
        advert: application.advert?._id,
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
        setToastMessage("Pualama başarıyla kaydedildi");
        resetModalForm();
        fetchReviewsAdvert();
        setTimeout(() => {
          setToastMessage("");
        }, 3000);
      } else {
        const data = await response.json();
        setToastMessage(data.message);
        setTimeout(() => {
          setToastMessage("");
        }, 3000);
      }
    } catch (error) {
      setToastMessage("Pualama kaydinda hata oluştu");
      setTimeout(() => {
        setToastMessage("");
      }, 3000);
    }
  };

  const resetModalForm = () => {
    setModalAppId(null);
    setModalRating(0);
    setModalMessage("");
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <section className="w-screen flex justify-center pb-5 mt-72 sm:mt-20  bg-base-100">
      <div className="w-screen max-w-[1200px] px-1 sm:px-10">
        <h1 className="text-2xl font-bold mb-4">Stajyerler</h1>
        {applications.filter((application) => application.status === "accepted")
          .length === 0 ? (
          <div className="flex flex-col items-center justify-center">
            <div className="text-center text-3xl text-gray-500 mt-10">Kayıtlı Stajyer bulunamadı.!!!</div>
            <p className="text-center text-red-500 mt-4"> Önemli : İlan vermeden önce profilinizi oluşturun</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full bg-base-200 rounded-lg">
              <thead>
                <tr className="bg-base-300 text-left">
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Stajyer İsmi</th>
                  <th className="px-4 py-2">Stajyer Soysismi</th>
                  <th className="px-4 py-2">İlan İsmi</th>
                  <th className="px-4 py-2">Değerlendirme</th>
                  <th className="px-4 py-2">Stajyer Görüşü</th>
                </tr>
              </thead>
              <tbody>
                {applications
                  .filter((app) => app.status === "accepted")
                  .map((application, index) => (
                    <tr
                      key={index}
                      className={`border-b border-base-300 text-left ${
                        application.status === "accepted" ? "bg-green-100" : "bg-orange-100"
                      }`}>
                      <th className="px-4 py-2">{index + 1}</th>
                      <td className={`px-4 py-2 font-bold text-primary`}>{application.intern.firstName}</td>
                      <td className={`px-4 py-2 font-bold text-primary `}>{application.intern.lastName}</td>
                      <td className="px-4 py-2 font-bold text-primary">{application.advert.title}</td>
                      <td className="px-4 py-2 h-2">
                        {reviews?.find(
                          (item) =>
                            item.advert === application.advert._id &&
                            item.reviewer === "company" &&
                            item.intern._id === application.intern._id
                        ) ? (
                          <div
                            className=" text-success hover:text-primary hover:cursor-pointer"
                            onClick={() => {
                              setModalShowCommentId(application._id);
                              // Get comment and rating from reviews
                              const review = reviews?.find(
                                (item) =>
                                  item.advert === application.advert._id &&
                                  item.reviewer === "company" &&
                                  item.intern._id === application.intern._id
                              );
                              setModalShowComment(review?.comment || "");
                              setModalShowCommentRating(review?.score || 0);
                            }}>
                            Değerlendirildi
                          </div>
                        ) : (
                          <button
                            onClick={() => setModalAppId(application._id)}
                            className="px-4 py-1 rounded-md bg-primary text-primary-content ">
                            Değerlendir
                          </button>
                        )}
                      </td>
                      <td className="px-4 py-2 h-2">
                        {reviews?.find(
                          (item) =>
                            item.advert === application.advert._id &&
                            item.reviewer === "intern" &&
                            item.intern._id === application.intern._id
                        ) ? (
                          <div
                            className=" text-success hover:text-primary hover:cursor-pointer"
                            onClick={() => {
                              setModalShowCommentIdIntern(application._id);
                              // Get comment and rating from reviews
                              const review = reviews?.find(
                                (item) =>
                                  item.advert === application.advert._id &&
                                  item.reviewer === "intern" &&
                                  item.intern._id === application.intern._id
                              );
                              setModalShowCommentIntern(review?.comment || "");
                              setModalShowCommentRatingIntern(review?.score || 0);
                            }}>
                            puanlandı
                          </div>
                        ) : (
                          <div className=" text-accent">puanlandmadı</div>
                        )}
                        {modalAppId === application._id && (
                          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                            <div className="bg-white p-8 rounded-lg">
                              <h2 className="text-2xl font-bold mb-4">Puanlama</h2>
                              <p className="capitalize font-bold text-xl p-2">{application.advert.title}</p>
                              <textarea
                                className="w-full p-2 border border-gray-300 rounded-md mb-4"
                                rows="4"
                                value={modalMessage}
                                required
                                onChange={(e) => setModalMessage(e.target.value)}
                                placeholder="Değerlendirme"
                              />
                              <select
                                className="w-full p-2 border border-gray-300 rounded-md mb-4"
                                onChange={(e) => setModalRating(e.target.value)}>
                                <option value="">Puanla</option>
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
                      {modalShowCommentId === application._id && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ">
                          <div className="bg-white p-8 rounded-lg text-left min-w-[350px] max-w-96 max-h-96 ">
                            <h2 className="text-2xl font-bold mb-4">Puanlama</h2>
                            <p className="capitalize font-bold text-xl p-2">{application.advert.title}</p>
                            <p className="capitalize font-bold text-md p-2">Mesaj : {modalShowComment}</p>
                            <p className="capitalize font-bold text-xl  p-2">
                              Yıldız :{" "}
                              {Array.from({ length: modalShowCommentRating }, () => (
                                <span className="text-yellow-500 mr-1" key={Math.random()}>
                                  ★
                                </span>
                              ))}
                            </p>
                            <div className="flex justify-end items-end">
                              <button
                                onClick={() => setModalShowCommentId(null)}
                                className="px-4 max-h-10 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50">
                                Geri
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                      {modalShowCommentIdIntern === application._id && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ">
                          <div className="bg-white p-8 rounded-lg text-left min-w-[350px] max-w-96 max-h-96 ">
                            <h2 className="text-2xl font-bold mb-4">Puanlama</h2>
                            <p className="capitalize font-bold text-xl p-2">{application.advert.title}</p>
                            <p className="capitalize font-bold text-md p-2">Mesaj : {modalShowCommentIntern}</p>
                            <p className="capitalize font-bold text-xl  p-2">
                              Yıldız :{" "}
                              {Array.from({ length: modalShowCommentRatingIntern }, () => (
                                <span className="text-yellow-500 mr-1" key={Math.random()}>
                                  ★
                                </span>
                              ))}
                            </p>
                            <div className="flex justify-end items-end">
                              <button
                                onClick={() => setModalShowCommentIdIntern(null)}
                                className="px-4 max-h-10 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50">
                                Geri
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {toastMessage && <Toast message={toastMessage} />}
    </section>
  );
};

export default Application;
