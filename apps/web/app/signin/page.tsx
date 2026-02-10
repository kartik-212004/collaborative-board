"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";

import axios from "axios";
import { Pencil, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAuth } from "@/hooks/use-auth";

import Logo from "@/modules/home/logo";

export default function SignInPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(`/api/signin`, {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      if (response.data.success) {
        console.log(response);
        login(response.data.data.token, {
          email: response.data.data.email,
          name: response.data.data.name,
          id: response.data.data.id,
          photo: response.data.data.photo,
        });

        setSuccess("Sign in successful! Redirecting...");

        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        setError(response.data.message || "Failed to sign in");
      }
    } catch (error: any) {
      console.error("Signin error:", error);

      if (error.response?.status === 401) {
        setError("Invalid email or password. Please check your credentials.");
      } else if (error.response?.status === 400) {
        setError(error.response.data.message || "Invalid input. Please check your details.");
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
              Welcome back
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Sign in to continue.
            </CardDescription>
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
                  disabled={isLoading}
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
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    unstyled
                    className="w-full"
                    inputClassName="h-10 w-full rounded-md border border-gray-300 bg-white px-3 pr-12 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-gray-600 dark:focus:ring-gray-700"
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 h-8 -translate-y-1/2 px-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <Button
                  type="button"
                  variant="link"
                  className="p-0 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                  onClick={() => setError("Forgot password feature coming soon!")}
                  disabled={isLoading}>
                  Forgot password?
                </Button>
              </div>

              <Button
                type="submit"
                className="w-full rounded-md bg-gray-900 text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
                size="lg"
                disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>{"Don't have an account?"}</span>
              <Link
                href="/signup"
                className="font-medium text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
