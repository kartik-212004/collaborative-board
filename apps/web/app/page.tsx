import Link from "next/link";

import { ArrowRight, Users, Zap, Share2, Pencil, Square, Type, LinkIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/20 bg-black">
        <div className="container mx-auto flex items-center justify-between px-4 py-2">
          <div className="flex items-center space-x-2">
            <div className="bg-wite flex h-8 w-8 items-center justify-center rounded-lg">
              <Pencil className="h-4 w-4 text-black" />
            </div>
            <span className="text-xl font-bold text-white">WhiteBoard</span>
          </div>

          <div className="flex items-center space-x-3">
            <Link href="/signin">
              <Button
                variant="ghost"
                className="text-white transition-colors hover:bg-white/10 hover:text-white">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-white text-black transition-colors hover:bg-gray-100">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge
            className="mb-6 border-white/20 bg-white/10 px-4 py-2 text-white transition-colors hover:bg-white/20"
            variant="secondary">
            <Zap className="mr-2 h-4 w-4" />
            Real-time Collaboration
          </Badge>
          <h1 className="mb-6 text-5xl font-bold text-white md:text-6xl">Sketch, Share, Collaborate</h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-white/80">
            The fastest way to bring your ideas to life. Create, edit, and share diagrams instantly with your
            team in a clean, browser-based whiteboard experience.
          </p>
          <div className="mb-12 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-white px-8 text-lg text-black transition-colors hover:bg-gray-100">
                Start Drawing Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#demo">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 bg-transparent px-8 text-lg text-white transition-colors hover:border-white/50 hover:bg-white/10">
                Watch Demo
              </Button>
            </Link>
          </div>

          {/* Hero Visual */}
          <div className="relative mx-auto max-w-5xl">
            <div className="relative overflow-hidden rounded-3xl border border-white/30 bg-gradient-to-br from-white/10 to-white/5 p-6 shadow-2xl backdrop-blur-sm">
              {/* Browser-like header */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex space-x-2">
                  <div className="h-3 w-3 rounded-full bg-red-400"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                  <div className="h-3 w-3 rounded-full bg-green-400"></div>
                </div>
                <div className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">whiteboard.app</div>
              </div>

              {/* Main canvas area */}
              <div className="relative overflow-hidden rounded-xl border border-white/20 bg-white p-4">
                <img
                  src="/draw.jpg"
                  alt="Whiteboard drawing example"
                  className="h-80 w-full rounded-lg object-cover shadow-lg"
                />

                {/* Overlay elements to simulate active whiteboard */}
                <div className="absolute bottom-4 left-4 flex space-x-2">
                  <div className="rounded-lg bg-blue-500 px-3 py-1 text-xs font-medium text-white shadow-lg">
                    Drawing Mode
                  </div>
                  <div className="rounded-lg bg-white/90 px-2 py-1 text-xs text-gray-700 shadow-lg">
                    3 users online
                  </div>
                </div>
              </div>

              {/* Floating collaboration indicators */}
              <div className="absolute right-6 top-20 flex -space-x-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-blue-500 text-sm font-bold text-white shadow-lg">
                  A
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-green-500 text-sm font-bold text-white shadow-lg">
                  B
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-purple-500 text-sm font-bold text-white shadow-lg">
                  C
                </div>
              </div>

              {/* Floating cursor indicators */}
              <div className="absolute left-1/3 top-1/2 h-4 w-4 rounded-full bg-blue-500 shadow-lg"></div>
              <div className="absolute right-1/4 top-3/4 h-4 w-4 rounded-full bg-green-500 shadow-lg"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-20 text-black">
        <div className="container mx-auto max-w-4xl text-center">
          <Users className="mx-auto mb-6 h-16 w-16" />
          <h2 className="mb-6 text-4xl font-bold">Real-time collaboration</h2>
          <p className="mb-8 text-xl opacity-80">
            See changes instantly as your team works together. No refresh needed, no delays, just seamless
            collaboration.
          </p>
          <div className="mb-8 flex flex-wrap justify-center gap-4">
            <Badge
              variant="secondary"
              className="border-black/20 bg-black/10 px-4 py-2 text-black transition-colors hover:bg-black/20">
              <Zap className="mr-2 h-4 w-4" />
              Instant Updates
            </Badge>
            <Badge
              variant="secondary"
              className="border-black/20 bg-black/10 px-4 py-2 text-black transition-colors hover:bg-black/20">
              <Share2 className="mr-2 h-4 w-4" />
              Easy Sharing
            </Badge>
            <Badge
              variant="secondary"
              className="border-black/20 bg-black/10 px-4 py-2 text-black transition-colors hover:bg-black/20">
              <Users className="mr-2 h-4 w-4" />
              Team Cursors
            </Badge>
          </div>
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-black px-8 text-lg text-white transition-colors hover:bg-gray-800">
              Try It Free
            </Button>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white/5 px-4 py-20">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-4xl font-bold text-white">Ready to start creating?</h2>
          <p className="mb-8 text-xl text-white/80">
            Join thousands of teams already using WhiteBoard to bring their ideas to life.
          </p>
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-white px-8 text-lg text-black transition-colors hover:bg-gray-100">
              Get Started for Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black px-4 py-12 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
                  <Pencil className="h-4 w-4 text-black" />
                </div>
                <span className="text-xl font-bold">WhiteBoard</span>
              </div>
              <p className="text-white/70">The fastest collaborative whiteboard for modern teams.</p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Product</h4>
              <ul className="space-y-2 text-white/70">
                <li>
                  <Link href="#" className="transition-colors hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-white">
                    Updates
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Company</h4>
              <ul className="space-y-2 text-white/70">
                <li>
                  <Link href="#" className="transition-colors hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-white">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Support</h4>
              <ul className="space-y-2 text-white/70">
                <li>
                  <Link href="#" className="transition-colors hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-white">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-white/10 pt-8 text-center text-white/70">
            <p>&copy; 2025 WhiteBoard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
