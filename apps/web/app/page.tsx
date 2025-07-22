import Link from "next/link";

import { ArrowRight, Users, Zap, Share2 } from "lucide-react";

import AuthButton from "@/components/AuthButton";
import { Demo } from "@/components/Demo";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
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
            <AuthButton
              size="lg"
              className="bg-white px-8 text-lg text-black transition-colors hover:bg-gray-100">
              Start Drawing Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </AuthButton>
            <Link href="#demo">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 bg-transparent px-8 text-lg text-white transition-colors hover:border-white/50 hover:bg-white/10 hover:text-white">
                Watch Demo
              </Button>
            </Link>
          </div>

          <Demo />
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
          <AuthButton
            size="lg"
            className="bg-black px-8 text-lg text-white transition-colors hover:bg-gray-800">
            Try It Free
          </AuthButton>
        </div>
      </section>

      <section className="bg-white/5 px-4 py-20">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-4xl font-bold text-white">Ready to start creating?</h2>
          <p className="mb-8 text-xl text-white/80">
            Join thousands of teams already using WhiteBoard to bring their ideas to life.
          </p>
          <AuthButton
            size="lg"
            className="bg-white px-8 text-lg text-black transition-colors hover:bg-gray-100">
            Get Started for Free
            <ArrowRight className="ml-2 h-4 w-4" />
          </AuthButton>
        </div>
      </section>
      <Footer />
    </div>
  );
}
