import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useTranslation } from "react-i18next";
import {
  loginSchema,
  type LoginFormInputs,
} from "../schemas/loginPageValidation";
import { useDirection } from "../hooks/useDirection";
import { useNavigate } from "react-router-dom";

import { useUserProfileStore } from "../stores/useUserStore";
import apiClient from "../lib/api";

interface Shop {
  logo: string;
  shop_name: string;
}

function LoginPage() {
  const { t, i18n } = useTranslation();
  const [shop, setShop] = useState<Shop | undefined>({
    logo: "/images/loddingImage.jpg",
    shop_name: "EasyShop",
  });
  apiClient.get<Shop>("/core/settings/logo").then((res) => {
    setShop(res.data);
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const [message, setMessage] = useState({
    text: "",
    type: "",
    visible: false,
  });

  // Helper function to show messages
  const showMessage = (text: string, type = "success", duration = 1500) => {
    setMessage({ text, type, visible: true });
    setTimeout(() => {
      setMessage({ text: "", type: "", visible: false });
    }, duration);
  };
  useDirection();
  const navigate = useNavigate();
  const { login } = useUserProfileStore();
  const onSubmit = async (data: LoginFormInputs) => {
    try {
      // const res = await apiClient.post("/accounts/auth/login/", data);
      await login(data);
      showMessage("Login successful!", "success", 1000);
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (e) {
      showMessage(
        "Login failed. Please check your credentials.",
        "error",
        3000
      );
      reset();
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans bg-gradient-to-br from-blue-400 to-green-400 relative overflow-hidden">
      {/* Background circles for visual flair */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-1/4 left-1/3 w-56 h-56 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 bg-white/20 backdrop-blur-lg border border-white/30 p-8 rounded-3xl shadow-2xl w-full max-w-md ">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8">
          {/* Using a placeholder image for the logo. Replace with your actual logo. */}
          <img
            src={shop?.logo}
            alt="EasyShop"
            className="w-40 h-40 rounded-full object-cover shadow-lg mb-4 transform transition-transform duration-300 hover:rotate-3"
          />

          <h2 className="text-2xl font-extrabold text-white text-center drop-shadow-md">
            {t("welcome")}{" "}
            <span className="text-blue-500">{shop?.shop_name}</span>
          </h2>
          <p className="mt-2 text-md text-gray-100 text-center">
            {t("signinto")}
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-semibold text-white mb-1"
            >
              {t("Username")}
            </label>
            <input
              id="username"
              type="text"
              {...register("username")}
              className={`mt-1 block w-full px-4 py-2 bg-white/70 border ${
                errors.username ? "border-red-400" : "border-white/30"
              } rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-200 ease-in-out placeholder-gray-600 text-gray-800`}
              placeholder={t("Enter your username")}
              aria-invalid={errors.username ? "true" : "false"}
              aria-describedby="username-error"
            />
            {errors.username && (
              <p id="username-error" className="mt-2 text-sm text-red-300">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-white mb-1"
            >
              {t("Password")}
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              className={`mt-1 block w-full px-4 py-2 bg-white/70 border ${
                errors.password ? "border-red-400" : "border-white/30"
              } rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-200 ease-in-out placeholder-gray-600 text-gray-800`}
              placeholder={t("Enter your password")}
              aria-invalid={errors.password ? "true" : "false"}
              aria-describedby="password-error"
            />
            {errors.password && (
              <p id="password-error" className="mt-2 text-sm text-red-300">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-lg font-bold text-white bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? t("Logging in...") : t("Login")}
            </button>
          </div>
        </form>

        <div className="grid grid-cols-3 mt-6 text-center gap-3">
          <button
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 transition-colors duration-200"
            onClick={() => {
              document.documentElement.dir = "ltr";
              i18n.changeLanguage("en");
            }}
          >
            English
          </button>
          <button
            className="w-full py-2 px-4 bg-purple-500 text-white rounded-md shadow-sm hover:bg-purple-600 transition-colors duration-200"
            onClick={() => {
              document.documentElement.dir = "rtl";
              i18n.changeLanguage("da");
            }}
          >
            فارسی
          </button>
          <button
            className="w-full py-2 px-4 bg-green-500 text-white rounded-md shadow-sm hover:bg-green-600 transition-colors duration-200"
            onClick={() => {
              document.documentElement.dir = "rtl";
              i18n.changeLanguage("pa");
            }}
          >
            پشتو
          </button>
        </div>
      </div>

      {/* Message Box for notifications */}
      <div
        className={`fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-xl text-white transition-all duration-500 ease-in-out z-50 ${
          // Added z-50 to ensure it's on top
          message.visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-full pointer-events-none"
        } ${message.type === "success" ? "bg-green-500" : "bg-red-500"}`}
      >
        {message.text}
      </div>

      {/* Tailwind CSS Animation Keyframes */}
      <style>{`
        @keyframes blob {
          0% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0, 0) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

export default LoginPage;
