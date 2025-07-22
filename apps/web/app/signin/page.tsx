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
      const response = await axios.post(`${process.env.NEXT_PUBLIC_HTTP_BACKEND_URL}/signin`, {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      if (response.data.success) {
        console.log(response);
        login(response.data.data.token, {
          email: response.data.data.email,
          name: response.data.data.name,
          id: response.data.data.id,
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
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="mb-6 inline-flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
              <Pencil className="h-4 w-4 text-black" />
            </div>
            <span className="text-xl font-bold text-white">WhiteBoard</span>
          </Link>
        </div>

        <Card className="border-white/20 bg-black">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">Welcome back</CardTitle>
            <CardDescription className="text-white/70">Sign in to your WhiteBoard account</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 rounded-md border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 rounded-md border border-green-500/20 bg-green-500/10 p-3 text-sm text-green-400">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:border-white"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
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
                    className="border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:border-white"
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}>
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-white/50" />
                    ) : (
                      <Eye className="h-4 w-4 text-white/50" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="link"
                  className="p-0 text-sm text-white hover:text-white/80"
                  onClick={() => setError("Forgot password feature coming soon!")}>
                  Forgot password?
                </Button>
              </div>

              <Button
                type="submit"
                className="w-full bg-white text-black hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
                size="lg"
                disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-white/70">{"Don't have an account? "}</span>
              <Link href="/signup" className="font-medium text-white hover:text-white/80 hover:underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="mt-4 text-center text-xs text-white/50">
          Need help?{" "}
          <Link href="#" className="underline hover:text-white/70">
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  );
}
