"use client";

import React from "react";
import Loading from "../../../components/loading";
import { useGlobalState } from "../../../store/global";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Toast from "../../../components/toast";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const Application = () => {
  const { token, setIsLoading, isLoading, isLoggedIn } = useGlobalState();

  const [applications, setApplications] = useState([]);
  const [modalAppId, setModalAppId] = useState(null);
  const [modalRating, setModalRating] = useState(null);
  const [modalMessage, setModalMessage] = useState("");

  const [modalShowCommentId, setModalShowCommentId] = useState(null);
  const [modalShowComment, setModalShowComment] = useState("");
  const [modalShowCommentRating, setModalShowCommentRating] = useState(null);

  const [toastMessage, setToastMessage] = useState("");
  const [reviews, setReviews] = useState([]);

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
        const userId = data.applications[0]?.intern._id;
        fetchReviewsAdvert(userId);
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
        setToastMessage("Puanlama başarıyla kaydedildi");
        //resetModalForm();
        //fetchReviewsAdvert();
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
      setToastMessage("Puanlama kaydinda hata oluştu");
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

  if (isLoading || !isLoggedIn) {
    return <Loading />;
  }

  return (
    <section className="w-screen flex justify-center pb-5 mt-72 sm:mt-20  bg-base-100">
      <div className="w-screen max-w-[1200px] px-1 sm:px-10">
        <h1 className="text-2xl font-bold mb-4">Kayıtlı Staj</h1>
        {applications.filter((app) => app.status === "accepted" || app.status === "rejected").length === 0 ? (
          <div className="flex flex-col items-center justify-center">
            <div className="text-center text-3xl text-gray-500 mt-10">Kayıtlı Staj bulunamadı.!!!</div>
            <p className="text-center text-red-500 mt-4"> Önemli : Başvuru yapmadan önce profilinizi oluşturun</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full bg-base-200 rounded-lg">
              <thead>
                <tr className="bg-base-300 text-left">
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Stajın İsmi</th>
                  <th className="px-4 py-2">Şirketin Görüşü</th>
                  <th className="px-4 py-2">Değerlendir</th>
                </tr>
              </thead>
              <tbody>
                {applications
                  .filter((app) => app.status === "accepted" || app.status === "rejected")
                  .map((application, index) => (
                    <tr key={application._id} className="bg-base-100 border-b border-base-300 text-left">
                      <th className="px-4 py-2">{index + 1}</th>
                      <td className="px-4 py-2 font-bold text-primary">{application.advert.title}</td>
                      <td className={`px-4 py-2 `}>
                        {reviews?.find(
                          (item) =>
                            item.advert === application.advert._id &&
                            item.reviewer === "company" &&
                            item.intern._id === application.intern._id
                        ) && (
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
                            className=" text-accent hover:text-primary hover:cursor-pointer"
                            onClick={() => {
                              setModalShowCommentId(application._id);
                              // Get comment and rating from reviews
                              const review = reviews?.find(
                                (item) =>
                                  item.advert === application.advert._id &&
                                  item.reviewer === "intern" &&
                                  item.intern._id === application.intern._id
                              );
                              setModalShowComment(review?.comment || "");
                              setModalShowCommentRating(review?.score || 0);
                            }}>
                            Zaten puanlandı
                          </div>
                        ) : (
                          <button
                            onClick={() => setModalAppId(application._id)}
                            className="px-4 py-1 rounded-md bg-primary text-primary-content ">
                            Puanlama
                          </button>
                        )}

                        {modalAppId === application._id && (
                          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                            <div className="bg-white p-8 rounded-lg">
                              <h2 className="text-2xl font-bold mb-4">Puanlama</h2>
                              <p className="capitalize font-bold text-xl p-2">{application.advert.title}</p>
                              <form>
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
                              </form>
                            </div>
                          </div>
                        )}
                        {modalShowCommentId === application._id && (
                          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ">
                            <div className="bg-white p-8 rounded-lg text-left min-w-[350px] max-w-96 max-h-96 ">
                              <h2 className="text-2xl font-bold mb-4">Puanlama</h2>
                              <p className="capitalize font-bold text-xl p-2">{application.advert.title}</p>
                              <p className="capitalize font-bold text-md p-2">Mesaj : {modalShowComment}</p>
                              <p className="capitalize font-bold text-xl  p-2">
                                Yıldız :{" "}
                                {Array.from({ length: modalShowCommentRating }, () => (
                                  <span className="text-yellow-500 mr-1" key={modalShowCommentRating}>
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
                      </td>
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

// const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// export default function Home() {

//   const [adverts, setAdverts] = useState([]);
//   const [applications, setApplications] = useState([]);
//   const [modalContent, setModalContent] = useState({ show: false, title: "", content: "" });

//   const router = useRouter();

//   const fetchAdverts = async () => {
//     if (!token) return;
//     try {
//       const response = await fetch(`${apiUrl}/api/adverts`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       if (response.ok) {
//         const data = await response.json();
//         setAdverts(data.adverts);
//       } else {
//         console.error("Error fetching adverts", await response.json());
//       }
//     } catch (error) {
//       console.error("Error fetching adverts", error);
//     }
//   };

//   const fetchApplications = async () => {
//     if (!token) return;
//     try {
//       const response = await fetch(`${apiUrl}/api/applications/own`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       if (response.ok) {
//         const data = await response.json();
//         setApplications(data.applications);
//       } else {
//         console.error("Error fetching applications", await response.json());
//       }
//     } catch (error) {
//       console.error("Error fetching applications", error);
//     }
//   };

//   const handleModal = (title, content) => {
//     setModalContent({ show: true, title, content });
//   };

//   const closeModal = () => {
//     setModalContent({ show: false, title: "", content: "" });
//   };

//   const handleApply = async (advertId) => {
//     try {
//       const response = await fetch(`${apiUrl}/api/applications`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ advert: advertId }),
//       });
//       if (response.ok) {
//         fetchApplications(); // Refresh applications to disable the button
//       } else {
//         console.error("Error applying for advert", await response.json());
//       }
//     } catch (error) {
//       console.error("Error applying for advert", error);
//     }
//   };

//   const hasApplied = (advertId) => {
//     return applications.some((application) => application.advert && application.advert._id === advertId);
//   };

//   if (isLoading || !isLoggedIn) {
//     return <Loading />;
//   }

//   return (
//     <section className="w-screen flex justify-center py-20 bg-base-100 h-full">
//       <div className="w-screen grid grid-cols-1 gap-4 lg:grid-cols-3 px-10 max-w-[1200px]">
//         {adverts.map((item) => (
//           <div key={item._id} className="card shadow-xl w-full bg-primary h-fit">
//             <div className="card-body">
//               <h2 className="card-title text-accent-content">{item.title}</h2>
//               <span className="font-bold flex justify-between items-end">
//                 {item.field}
//                 <i className="font-normal text-xs pl-2 text-primary-content">{item.department}</i>
//               </span>

//               {item.requirements && (
//                 <button onClick={() => handleModal("Info Requirements", item.requirements)} className="btn btn-info">
//                   Info Requirements
//                 </button>
//               )}
//               {item.foreignLanguages && (
//                 <button
//                   onClick={() => handleModal("Foreign Languages", item.foreignLanguages)}
//                   className="btn btn-info">
//                   Foreign Languages
//                 </button>
//               )}
//               <button className="btn btn-success" onClick={() => handleApply(item._id)} disabled={hasApplied(item._id)}>
//                 {hasApplied(item._id) ? "Başvuru Yapıldı" : "Başvuru yap"}
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//       <Modal show={modalContent.show} onClose={closeModal}>
//         <Modal.Title>{modalContent.title}</Modal.Title>
//         <Modal.Content>{modalContent.content}</Modal.Content>
//       </Modal>
//     </section>
//   );
// }

// // Modal component
// const Modal = ({ show, onClose, children }) => {
//   const handleKeyDown = (event) => {
//     if (event.key === "Escape") {
//       onClose();
//     }
//   };

//   useEffect(() => {
//     document.body.style.overflow = show ? "hidden" : "auto";

//     return () => {
//       document.body.style.overflow = "auto";
//     };
//   }, [show]);

//   return show ? (
//     <div className="fixed inset-0 flex items-center justify-center z-50" onKeyDown={handleKeyDown} tabIndex={-1}>
//       <div className="bg-white p-4 rounded shadow-lg">
//         {children}
//         <button className="mt-4 text-blue-500" onClick={onClose}>
//           Tamam
//         </button>
//       </div>
//     </div>
//   ) : null;
// };

// // eslint-disable-next-line react/display-name
// Modal.Title = ({ children }) => <h2 className="text-2xl font-bold mb-2">{children}</h2>;
// // eslint-disable-next-line react/display-name
// Modal.Content = ({ children }) => (
//   <ul className="mb-4 list-disc list-inside">
//     {children}
//   </ul>
// );
// // eslint-disable-next-line react/display-name
// Modal.Action = ({ onClick, passive, children }) => (
//   <button
//     className={`${passive ? "text-gray-500" : "text-blue-500"} text-sm font-bold uppercase hover:underline`}
//     onClick={onClick}>
//     {children}
//   </button>
// );
