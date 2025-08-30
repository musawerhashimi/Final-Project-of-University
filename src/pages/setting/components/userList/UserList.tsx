import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../../lib/api";
import { useLocationStore } from "../../../../stores/useLocationStore";
import { UserCard } from "./UserCard";
import { Modal } from "./Modal";
import { AddUserForm } from "./AddUserForm";
import RouteBox from "../../../../components/RouteBox";
import { useTranslation } from "react-i18next";

export type Location = {
  id: number;
  name: string;
  address: string;
};

export type BackendUser = {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  phone: string | null;
  email: string;
  role_name: string;
  avatar_url: string;
  location: number;
};

export type CreateUserPayload = {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  role_name: string;
  location_id: string;
  photo?: File;
};

const UserPlusIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...p}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <line x1="19" x2="19" y1="8" y2="14"></line>
    <line x1="22" x2="16" y1="11" y2="11"></line>
  </svg>
);

// ========= API HOOKS =========
const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await apiClient.get("/accounts/users");
      return response.data as BackendUser[];
    },
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: CreateUserPayload) => {
      const formData = new FormData();

      Object.entries(userData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === "photo" && value instanceof File) {
            formData.append("photo", value);
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      const response = await apiClient.post("/accounts/users/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data as BackendUser;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export default function UserList() {
  const { t } = useTranslation();
  const { data: users, isLoading, error } = useUsers();
  const locations = useLocationStore((s) => s.locations);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const getUserLocation = (locationId: number): Location | undefined => {
    return locations.find((loc) => loc.id === locationId);
  };
  const route = [
    { path: "/settings", name: t("Settings") },
    { path: "", name: t("Users") },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-primary-users flex items-center justify-center">
        <div className="text-text-primary-users text-lg">
          {t("Loading Users...")}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background-primary-users flex items-center justify-center">
        <div className="text-red-500 text-lg">{t("Error loading Users")}</div>
      </div>
    );
  }

  return (
    <>
      <RouteBox items={route} routlength={route.length} />
      <div className=" mt-[-15px] bg-add-purchase-bg min-h-screen text-text-primary-users ">
        <div className="container mx-auto p-6">
          <header className="bg-gradient-to-r from-green-500 via-teal-500 to-blue-500 p-3 rounded-t-xl flex justify-between items-center mb-2">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-700">
              {t("Users List")}
            </h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 font-semibold text-white bg-blue-500 rounded-lg shadow-sm hover:bg-accent-hover-users transition-colors"
            >
              <UserPlusIcon className="w-5 h-5" />
              <span className="hidden sm:inline">{t("Add New User")}</span>
            </button>
          </header>

          <main>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {users?.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  location={getUserLocation(user.location)}
                />
              ))}
            </div>
          </main>
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={t("Create a New User")}
        >
          <AddUserForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      </div>
    </>
  );
}
