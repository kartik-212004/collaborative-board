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
      const response = await axios.post(`${process.env.NEXT_PUBLIC_HTTP_BACKEND_URL}/signup`, {
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
            <CardTitle className="text-2xl font-bold text-white">Create your account</CardTitle>
            <CardDescription className="text-white/70">
              Join thousands of teams collaborating on WhiteBoard
            </CardDescription>
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
                <Label htmlFor="name" className="text-white">
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:border-white"
                  required
                />
              </div>

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
                    placeholder="Create a strong password (min. 6 characters)"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:border-white"
                    required
                    minLength={6}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-white/50" />
                    ) : (
                      <Eye className="h-4 w-4 text-white/50" />
                    )}
                  </Button>
                </div>
                {formData.password && formData.password.length < 6 && (
                  <p className="text-xs text-red-400">Password must be at least 6 characters long</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="photo" className="text-white">
                  Profile Photo URL (Optional)
                </Label>
                <Input
                  id="photo"
                  name="photo"
                  type="url"
                  placeholder="Enter photo URL (e.g., https://example.com/photo.jpg)"
                  value={formData.photo}
                  onChange={handleInputChange}
                  className="border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:border-white"
                />
                {formData.photo && (
                  <div className="mt-2 flex justify-center">
                    <img
                      src={formData.photo}
                      alt="Profile preview"
                      className="h-20 w-20 rounded-full border-2 border-white/20 object-cover"
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
                className="w-full bg-white text-black hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
                size="lg"
                disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-white/70">Already have an account? </span>
              <Link href="/signin" className="font-medium text-white hover:text-white/80 hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="mt-4 text-center text-xs text-white/50">
          By creating an account, you agree to our{" "}
          <Link href="#" className="underline hover:text-white/70">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="#" className="underline hover:text-white/70">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
