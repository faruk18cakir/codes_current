"use client";

import React from "react";
import Loading from "../../../../../../components/loading";
import { useGlobalState } from "../../../../../../store/global";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const Application = () => {
  const { token, setIsLoading, isLoading } = useGlobalState();
  const router = useRouter();
  const { id } = useParams();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchApplications();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/applications/advert/${id}`, {
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

  const handelAcceptApplication = async (applicationId) => {
    try {
      const response = await fetch(`${apiUrl}/api/applications/accept/${applicationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        await fetchApplications();
        router.back();
      } else {
        console.error("Error accepting application:", await response.json());
      }
    } catch (error) {
      console.error("Error accepting application:", error);
    }
  };

  const handelRejectApplication = async (applicationId) => {
    try {
      const response = await fetch(`${apiUrl}/api/applications/reject/${applicationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        await fetchApplications();
        router.back();
      } else {
        console.error("Error rejecting application:", await response.json());
      }
    } catch (error) {
      console.error("Error rejecting application:", error);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <section className="w-screen flex justify-center pb-5 mt-72 sm:mt-20  bg-base-100">
      <div className="w-screen max-w-[1200px] px-1 sm:px-10">
        <h1 className="text-2xl font-bold mb-4">İlana Başvuranlar</h1>

        <div className="overflow-x-auto">
          <table className="table-auto w-full bg-base-200 rounded-lg">
            <thead>
              <tr className="bg-base-300 text-left">
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Adayın İsmi</th>
                <th className="px-4 py-2">Adayın Soysismi</th>
                <th className="px-4 py-2">Adayın Eşlelme Skoru</th>
                <th className="px-4 py-2">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {applications
                .filter((app) => app.status === "pending")
                .map((application, index) => (
                  <tr key={application._id} className="bg-base-100 border-b border-base-300 text-left">
                    <th className="px-4 py-2">{index + 1}</th>
                    <td className="px-4 py-2 font-bold text-primary">{application.intern.firstName}</td>
                    <td className="px-4 py-2 font-bold text-primary">{application.intern.lastName}</td>
                    <td className="px-4 py-2 capitalize font-bold text-xl">{application.score}</td>
                    <td className="px-4 py-2 flex flex-col justify-start items-start gap-1">
                      <button
                        onClick={() => handelAcceptApplication(application._id)}
                        className="min-w-[100px] px-4 py-1 bg-success text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50">
                        kabul Et
                      </button>
                      <button
                        onClick={() => handelRejectApplication(application._id)}
                        className="min-w-[100px] px-4 py-1 bg-warning text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50">
                        Reddet
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <button className="px-4 py-1 rounded-md bg-primary text-primary-content mt-5" onClick={() => router.back()}>
          Geri
        </button>
      </div>
    </section>
  );
};

export default Application;
