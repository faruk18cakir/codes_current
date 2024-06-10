"use client";

import { useGlobalState } from "../../../store/global";
import Loading from "../../../components/loading";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const { isLoading, isLoggedIn, token } = useGlobalState();
  const [adverts, setAdverts] = useState([]);
  const [applications, setApplications] = useState([]);
  const [modalContent, setModalContent] = useState({ show: false, title: "", content: "" });

  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      fetchAdverts();
      fetchApplications();
    }
  }, [isLoggedIn, router, token]);

  const fetchAdverts = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${apiUrl}/api/adverts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setAdverts(data.adverts);
      } else {
        console.error("Error fetching adverts", await response.json());
      }
    } catch (error) {
      console.error("Error fetching adverts", error);
    }
  };

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

  const handleModal = (title, content) => {
    setModalContent({ show: true, title, content });
  };

  const closeModal = () => {
    setModalContent({ show: false, title: "", content: "" });
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
      <div className="w-screen grid grid-cols-1 gap-4 lg:grid-cols-3 px-10 max-w-[1200px]">
        {adverts.map((item) => (
          <div key={item._id} className="card shadow-xl w-full bg-primary h-fit">
            <div className="card-body">
              <h2 className="card-title text-accent-content">{item.title}</h2>
              <span className="font-bold flex justify-between items-end">
                {item.field}
                <i className="font-normal text-xs pl-2 text-primary-content">{item.department}</i>
              </span>

              {item.requirements.length > 0 && (
                <button onClick={() => handleModal("Info Requirements", item.requirements)} className="btn btn-info">
                  Info Requirements
                </button>
              )}
              {item.foreignLanguages.length > 0 && (
                <button
                  onClick={() => handleModal("Foreign Languages", item.foreignLanguages)}
                  className="btn btn-info">
                  Foreign Languages
                </button>
              )}
              <button className="btn btn-success" onClick={() => handleApply(item._id)} disabled={hasApplied(item._id)}>
                {hasApplied(item._id) ? "Başvuru Yapıldı" : "Başvuru yap"}
              </button>
            </div>
          </div>
        ))}
      </div>
      <Modal show={modalContent.show} onClose={closeModal}>
        <Modal.Title>{modalContent.title}</Modal.Title>
        <Modal.Content>{modalContent.content}</Modal.Content>
      </Modal>
    </section>
  );
}

// Modal component
const Modal = ({ show, onClose, children }) => {
  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      onClose();
    }
  };

  useEffect(() => {
    document.body.style.overflow = show ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [show]);

  return show ? (
    <div className="fixed inset-0 flex items-center justify-center z-50" onKeyDown={handleKeyDown} tabIndex={-1}>
      <div className="bg-white p-4 rounded shadow-lg">
        {children}
        <button className="mt-4 text-blue-500" onClick={onClose}>
          Tamam
        </button>
      </div>
    </div>
  ) : null;
};

// eslint-disable-next-line react/display-name
Modal.Title = ({ children }) => <h2 className="text-2xl font-bold mb-2">{children}</h2>;
// eslint-disable-next-line react/display-name
Modal.Content = ({ children }) => (
  <ul className="mb-4 list-disc list-inside">
    {children.map((child, index) => (
      <li key={index}>{child}</li>
    ))}
  </ul>
);
// eslint-disable-next-line react/display-name
Modal.Action = ({ onClick, passive, children }) => (
  <button
    className={`${passive ? "text-gray-500" : "text-blue-500"} text-sm font-bold uppercase hover:underline`}
    onClick={onClick}>
    {children}
  </button>
);
