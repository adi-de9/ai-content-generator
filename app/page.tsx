"use client";
import { useState, useEffect } from "react";
import { Sparkles, ArrowRight, Play, Wand2, Rocket } from "lucide-react";
import { templates, features } from "@/utils/landingPageConstant";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";

export default function AwesomeLandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [dots, setDots] = useState<
    { left: string; top: string; delay: string; duration: string }[]
  >([]);
  const { isSignedIn } = useAuth();

  useEffect(() => {
    setIsVisible(true);
    const handleMouseMove = (e: any) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Cycle through features
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 6);
    }, 3000);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const generated = Array.from({ length: 50 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 3}s`,
      duration: `${2 + Math.random() * 3}s`,
    }));
    setDots(generated);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-indigo-900/20" />
      <div
        className="fixed inset-0 opacity-30"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(147, 51, 234, 0.15), transparent 40%)`,
        }}
      />

      {/* Animated particles */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {dots.map((dot, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: dot.left,
              top: dot.top,
              animationDelay: dot.delay,
              animationDuration: dot.duration,
            }}
          >
            <div className="h-1 w-1 animate-ping rounded-full bg-purple-400" />
          </div>
        ))}
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href={"/"} className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-xl font-bold text-transparent">
                Content Genie
              </span>
            </Link>
            <div className="hidden space-x-8 md:flex">
              {["Home", "Templates", "Why Choose us"].map((item) => (
                <Link
                  key={item}
                  href={"#" + item.toLowerCase().replace(/\s/g, "")}
                  className="transition-colors duration-300 hover:text-purple-400"
                >
                  {item}
                </Link>
              ))}
            </div>
            <Link
              href={isSignedIn ? "/dashboard" : "/sign-in"}
              className="transform rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2 font-semibold transition-all duration-300 hover:scale-105 hover:from-purple-700 hover:to-pink-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center pt-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div
            className={`duration-1500 transform transition-all ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
          >
            <div className="mb-8 inline-flex items-center rounded-full border border-purple-500/30 bg-gradient-to-r from-purple-600/20 to-pink-600/20 px-6 py-3 backdrop-blur-sm">
              <Rocket className="mr-2 h-5 w-5 text-purple-400" />
              <span className="text-sm font-medium">
                🚀 Now with Gemini-2.5 Turbo Technology
              </span>
            </div>

            <h1 className="mb-8 text-6xl font-black leading-tight md:text-8xl">
              <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text pr-2 text-transparent">
                Create
              </span>
              {/* <br /> */}
              <span className="animate-pulse bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                Mind-Blowing
              </span>
              <br />
              <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Content
              </span>
            </h1>

            <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-gray-300 md:text-2xl">
              Transform your ideas into viral content with our revolutionary AI
              engine.
              <span className="font-semibold text-purple-400">
                {" "}
                10x faster, 100% unique, infinitely creative.
              </span>
            </p>

            <div className="mb-16 flex flex-col items-center justify-center gap-6 sm:flex-row">
              <Link
                href={isSignedIn ? "/dashboard" : "/sign-in"}
                className="group transform rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-lg font-bold transition-all duration-300 hover:scale-105 hover:from-purple-700 hover:to-pink-700 hover:shadow-2xl hover:shadow-purple-500/25"
              >
                Start Creating Magic
                <ArrowRight className="ml-2 inline-block h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href={isSignedIn ? "/dashboard" : "/sign-in"}
                className="group flex items-center space-x-3 rounded-full border border-white/20 px-8 py-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
              >
                <Play className="h-5 w-5 text-purple-400" />
                <span>Watch Demo</span>
              </Link>

            
            </div>

          
          </div>
        <Image
          src={"/dashboard.png"}
          alt="banner-image"
          className="z-10 mt-10 rounded-2xl border border-cyan-800/20 shadow-xl md:shadow-2xl"
          width={1200}
          height={598}
        />
        </div>

        {/* Floating Elements */}
        <div className="animation-delay-1000 absolute left-10 top-1/4 animate-bounce">
          <div className="flex h-16 w-16 rotate-12 transform items-center justify-center rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500">
            <Sparkles className="h-8 w-8" />
          </div>
        </div>
        <div className="animation-delay-2000 absolute right-10 top-1/3 animate-bounce">
          <div className="flex h-12 w-12 -rotate-12 transform items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500">
            <Wand2 className="h-6 w-6" />
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section id="templates" className="relative py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-20 text-center">
            <h2 className="mb-6 text-5xl font-bold md:text-6xl">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Content Templates
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-300">
              Choose from our arsenal of AI-powered templates designed to
              dominate every platform
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template, i) => (
              <Link
                key={i}
                href={template.link || "/dashboard"}
                className={`group relative transform cursor-pointer overflow-hidden rounded-3xl border border-white/10 p-8 backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:border-white/20 ${
                  activeFeature === i ? "scale-105 border-purple-500/50" : ""
                }`}
                onMouseEnter={() => setActiveFeature(i)}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${template.color} opacity-10 transition-opacity duration-500 group-hover:opacity-20`}
                />
                <div className="relative z-10">
                  <div
                    className={`h-16 w-16 bg-gradient-to-br ${template.color} mb-6 flex items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110`}
                  >
                    <template.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="mb-4 text-2xl font-bold transition-colors group-hover:text-purple-300">
                    {template.title}
                  </h3>
                  <p className="text-gray-400 transition-colors group-hover:text-gray-300">
                    AI-powered templates that create{" "}
                    {template.title.toLowerCase()} that convert and engage
                  </p>
                </div>
                <div className="absolute bottom-4 right-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <ArrowRight className="h-6 w-6 text-purple-400" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="whychooseus" className="relative py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-20 text-center">
            <h2 className="mb-6 text-5xl font-bold md:text-6xl">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Why Choose Us?
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-300">
              Experience the future of content creation with features that blow
              your mind
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {features.map((feature, i) => (
              <div key={i} className="group text-center">
                <div
                  className={`mx-auto mb-8 h-24 w-24 bg-gradient-to-br ${feature.gradient} flex items-center justify-center rounded-3xl transition-all duration-500 group-hover:rotate-6 group-hover:scale-110`}
                >
                  <feature.icon className="h-12 w-12 text-white" />
                </div>
                <h3 className="mb-6 text-3xl font-bold transition-colors group-hover:text-purple-300">
                  {feature.title}
                </h3>
                <p className="text-lg leading-relaxed text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="relative overflow-hidden rounded-3xl border border-white/20 p-16 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-pink-900/30" />
            <div className="relative z-10">
              <h2 className="mb-8 text-5xl font-bold md:text-6xl">
                <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  Ready to Go Viral?
                </span>
              </h2>
              <p className="mx-auto mb-12 max-w-2xl text-xl text-gray-300">
                Join over 100,000+ creators who are already dominating their
                markets with AI-powered content
              </p>

              <div className="mx-auto flex max-w-md flex-col justify-center gap-4 sm:flex-row">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-white placeholder-gray-400 backdrop-blur-sm transition-colors focus:border-purple-500 focus:outline-none"
                />
                <button className="transform whitespace-nowrap rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 font-bold transition-all duration-300 hover:scale-105 hover:from-purple-700 hover:to-pink-700">
                  Start Free →
                </button>
              </div>

              <p className="mt-4 text-sm text-gray-400">
                ✨ No credit card required • 🚀 7-day free trial • 💯 Cancel
                anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <Link
              href={"/"}
              className="mb-4 flex items-center space-x-2 md:mb-0"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-xl font-bold text-transparent">
                Content Genie
              </span>
            </Link>
            <div className="flex space-x-8 text-gray-400">
              {["Home", "Templates", "Why Choose us"].map((item) => (
                <Link
                  key={item}
                  href={"#" + item.toLowerCase().replace(/\s/g, "")}
                  className="cursor-pointer transition-colors hover:text-purple-400"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-8 text-center text-gray-500">
            © 2025 Content Genie. All rights reserved. Made with ❤️ for
            creators.
          </div>
        </div>
      </footer>
    </div>
  );
}
