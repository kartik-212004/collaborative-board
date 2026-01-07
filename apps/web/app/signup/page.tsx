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
    const wsUrl = `ws://localhost:${process.env.NEXT_PUBLIC_WEBSOCKET_PORT || 8080}`;
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
    <div className="bg-background flex min-h-screen items-center justify-center px-4 py-10 text-white">
      <div className="w-full max-w-lg space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-sm font-medium text-white/80">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black">
            <Pencil className="h-4 w-4" />
          </span>
          WhiteBoard
        </Link>

        <Card className="border-white/10 bg-white/5 backdrop-blur">
          <CardHeader className="space-y-1 text-left">
            <CardTitle className="text-2xl font-semibold text-white">Create your account</CardTitle>
            <CardDescription className="text-white/70">A simple start—just your basics.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {error && (
              <div className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-md border border-green-500/30 bg-green-500/10 px-3 py-2 text-sm text-green-200">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white/90">
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
                  inputClassName="h-10 w-full rounded-md border border-black/10 bg-white px-3 text-black shadow-sm placeholder:text-neutral-500 focus:border-black/30 focus:outline-none focus:ring-2 focus:ring-black/10"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/90">
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
                  inputClassName="h-10 w-full rounded-md border border-black/10 bg-white px-3 text-black shadow-sm placeholder:text-neutral-500 focus:border-black/30 focus:outline-none focus:ring-2 focus:ring-black/10"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white/90">
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
                    inputClassName="h-10 w-full rounded-md border border-black/10 bg-white px-3 pr-12 text-black shadow-sm placeholder:text-neutral-500 focus:border-black/30 focus:outline-none focus:ring-2 focus:ring-black/10"
                    required
                    minLength={6}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 h-8 -translate-y-1/2 px-2 text-black/60 hover:bg-black/5"
                    onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {formData.password && formData.password.length < 6 && (
                  <p className="text-xs text-red-300">Password must be at least 6 characters long</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="photo" className="text-white/90">
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
                  inputClassName="h-10 w-full rounded-md border border-black/10 bg-white px-3 text-black shadow-sm placeholder:text-neutral-500 focus:border-black/30 focus:outline-none focus:ring-2 focus:ring-black/10"
                />
                {formData.photo && (
                  <div className="mt-2 flex justify-center">
                    <img
                      src={formData.photo}
                      alt="Profile preview"
                      className="h-14 w-14 rounded-full border border-white/20 object-cover"
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
                className="w-full rounded-md bg-white text-black hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
                size="lg"
                disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="flex items-center justify-between text-sm text-white/70">
              <span>Already have an account?</span>
              <Link href="/signin" className="font-medium text-white hover:text-white/80">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-white/50">
          By continuing you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
