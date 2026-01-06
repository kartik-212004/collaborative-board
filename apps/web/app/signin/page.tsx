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
            <CardTitle className="text-2xl font-semibold text-white">Welcome back</CardTitle>
            <CardDescription className="text-white/70">Sign in to continue.</CardDescription>
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
                  className="h-8 rounded-md border border-white/20 bg-white px-2 text-black placeholder:text-neutral-500 focus:border-white/40 focus:ring-2 focus:ring-white/30"
                  required
                  disabled={isLoading}
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
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="h-8 rounded-md border border-white/20 bg-white px-2 pr-12 text-black placeholder:text-neutral-500 focus:border-white/40 focus:ring-2 focus:ring-white/30"
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 h-8 -translate-y-1/2 px-2 text-black/60 hover:bg-black/5"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-white/70">
                <Button
                  type="button"
                  variant="link"
                  className="p-0 text-white/80 hover:text-white"
                  onClick={() => setError("Forgot password feature coming soon!")}
                  disabled={isLoading}>
                  Forgot password?
                </Button>
              </div>

              <Button
                type="submit"
                className="w-full rounded-md bg-white text-black hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
                size="lg"
                disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="flex items-center justify-between text-sm text-white/70">
              <span>{"Don't have an account?"}</span>
              <Link href="/signup" className="font-medium text-white hover:text-white/80">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-white/50">Need help? Contact Support.</p>
      </div>
    </div>
  );
}
