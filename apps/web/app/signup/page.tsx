"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState, useEffect } from "react";

import axios from "axios";
import { Pencil, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import Logo from "@/modules/home/logo";

export default function SignUpPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    photo: "",
  });

  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080";
    const ws = new WebSocket(wsUrl);
    ws.onopen = () => ws.close();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.email || !formData.password || !formData.name) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(`/api/signup`, {
        name: formData.name.trim(),
        password: formData.password,
        photo: formData.photo.trim() || undefined,
        email: formData.email.trim().toLowerCase(),
      });

      if (response.data.success) {
        setSuccess("Account created successfully! Redirecting to sign in...");
        setTimeout(() => {
          router.push("/signin");
        }, 1500);
      } else {
        setError(response.data.message || "Failed to create account");
      }
    } catch (error: any) {
      console.error("Signup error:", error);

      if (error.response?.status === 400) {
        setError(error.response.data.message || "Invalid input. Please check your details.");
      } else if (error.response?.status === 409) {
        setError("An account with this email already exists.");
      } else if (error.response?.status >= 500) {
        setError("Server error. Please try again later.");
      } else if (error.code === "NETWORK_ERROR" || !error.response) {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gray-50 px-4 py-10 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <div
        className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.06]"
        style={{
          backgroundImage: `linear-gradient(#999 1px, transparent 1px), linear-gradient(90deg, #999 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-gray-50/50 to-gray-50 dark:via-gray-950/50 dark:to-gray-950"></div>

      <div className="relative z-10 w-full max-w-lg space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900">
            <Logo />
          </span>
          CollabDraw
        </Link>

        <Card className="border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <CardHeader className="space-y-1 text-left">
            <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Create your account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-600 dark:border-green-800 dark:bg-green-950 dark:text-green-400">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Ada Lovelace"
                  value={formData.name}
                  onChange={handleInputChange}
                  unstyled
                  className="w-full"
                  inputClassName="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-gray-600 dark:focus:ring-gray-700"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@company.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  unstyled
                  className="w-full"
                  inputClassName="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-gray-600 dark:focus:ring-gray-700"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimum 6 characters"
                    value={formData.password}
                    onChange={handleInputChange}
                    unstyled
                    className="w-full"
                    inputClassName="h-10 w-full rounded-md border border-gray-300 bg-white px-3 pr-12 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-gray-600 dark:focus:ring-gray-700"
                    required
                    minLength={6}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 h-8 -translate-y-1/2 px-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                    onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {formData.password && formData.password.length < 6 && (
                  <p className="text-xs text-red-500">Password must be at least 6 characters long</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="photo" className="text-gray-700 dark:text-gray-300">
                  Profile Photo URL (Optional)
                </Label>
                <Input
                  id="photo"
                  name="photo"
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  value={formData.photo}
                  onChange={handleInputChange}
                  unstyled
                  className="w-full"
                  inputClassName="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-gray-600 dark:focus:ring-gray-700"
                />
                {formData.photo && (
                  <div className="mt-2 flex justify-center">
                    <img
                      src={formData.photo}
                      alt="Profile preview"
                      className="h-14 w-14 rounded-full border border-gray-200 object-cover dark:border-gray-700"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                      onLoad={(e) => {
                        e.currentTarget.style.display = "block";
                      }}
                    />
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full rounded-md bg-gray-900 text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
                size="lg"
                disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>Already have an account?</span>
              <Link
                href="/signin"
                className="font-medium text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-400 dark:text-gray-500">
          By continuing you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
