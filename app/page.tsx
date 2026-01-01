"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { Sparkles, ArrowRight, Play, Rocket, X } from "lucide-react";
import { templates, features } from "@/utils/landingPageConstant";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export default function AwesomeLandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  
  // GSAP refs
  const heroRef = useRef<HTMLDivElement>(null);
  const templatesRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const { isSignedIn } = useAuth();

  // YouTube video ID - 9:16 vertical video
  const youtubeVideoId = "l4GRpuxfNnk";

  useEffect(() => {
    setIsVisible(true);

    // Cycle through features
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 6);
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Close modal on ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isVideoOpen) {
        setIsVideoOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVideoOpen]);

  const handleFeatureHover = useCallback((index: number) => {
    setActiveFeature(index);
  }, []);

  // GSAP Animations
  useGSAP(() => {
    const ctx = gsap.context(() => {

      // Navigation animation
      gsap.to(navRef.current, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        delay: 0.1,
        clearProps: "all",
      });

      // Hero section animations
      if (heroRef.current) {
        const heroElements = heroRef.current.querySelectorAll(".hero-content > *");
        gsap.to(heroElements, {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: "power3.out",
          delay: 0.3,
          clearProps: "all",
        });

        // Dashboard image animation
        gsap.to(".dashboard-image", {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.5,
          ease: "power3.out",
          clearProps: "all",
          scrollTrigger: {
            trigger: ".dashboard-image",
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        });
      }

      // Templates section animations
      if (templatesRef.current) {
        const templateCards = templatesRef.current.querySelectorAll(".template-card");
        gsap.to(templateCards, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          clearProps: "all",
          scrollTrigger: {
            trigger: templatesRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        });

        // Section title animation
        gsap.to(templatesRef.current.querySelector(".section-title"), {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          clearProps: "all",
          scrollTrigger: {
            trigger: templatesRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      }

      // Features section animations
      if (featuresRef.current) {
        const featureItems = featuresRef.current.querySelectorAll(".feature-item");
        gsap.to(featureItems, {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.2,
          ease: "power2.out",
          clearProps: "all",
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        });

        // Section title animation
        gsap.to(featuresRef.current.querySelector(".section-title"), {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          clearProps: "all",
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      }

      // CTA section animations
      if (ctaRef.current) {
        gsap.to(ctaRef.current.querySelector(".cta-content"), {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: "back.out(1.7)",
          clearProps: "all",
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        });
      }
    });

    return () => ctx.revert(); // Cleanup
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-indigo-900/20" />

      {/* Navigation */}
      <nav ref={navRef} style={{ opacity: 0, transform: 'translateY(-100px)' }} className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/20 backdrop-blur-xl">
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
              prefetch={true}
              className="transform rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2 font-semibold transition-all duration-300 hover:scale-105 hover:from-purple-700 hover:to-pink-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative flex min-h-screen items-center justify-center pt-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="hero-content">
            <div className="mb-8 inline-flex items-center rounded-full border border-purple-500/30 bg-gradient-to-r from-purple-600/20 to-pink-600/20 px-6 py-3 backdrop-blur-sm" style={{ opacity: 0, transform: 'translateY(80px)' }}>
              <Rocket className="mr-2 h-5 w-5 text-purple-400" />
              <span className="text-sm font-medium">
                🚀 Now with Gemini-2.5 Turbo Technology
              </span>
            </div>

            <h1 className="mb-8 text-6xl font-black leading-tight md:text-8xl" style={{ opacity: 0, transform: 'translateY(80px)' }}>
              <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text pr-2 text-transparent">
                Create
              </span>
              <span className="animate-pulse bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                Mind-Blowing
              </span>
              <br />
              <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Content
              </span>
            </h1>

            <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-gray-300 md:text-2xl" style={{ opacity: 0, transform: 'translateY(80px)' }}>
              Transform your ideas into viral content with our revolutionary AI
              engine.
              <span className="font-semibold text-purple-400">
                {" "}
                10x faster, 100% unique, infinitely creative.
              </span>
            </p>

            <div className="mb-10 flex flex-col items-center justify-center gap-6 sm:flex-row" style={{ opacity: 0, transform: 'translateY(80px)' }}>
              <Link
                href={isSignedIn ? "/dashboard" : "/sign-in"}
                prefetch={true}
                className="group transform rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-lg font-bold transition-all duration-300 hover:scale-105 hover:from-purple-700 hover:to-pink-700 hover:shadow-2xl hover:shadow-purple-500/25"
              >
                Start Creating Magic
                <ArrowRight className="ml-2 inline-block h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <button
                onClick={() => setIsVideoOpen(true)}
                className="group flex items-center space-x-3 rounded-full border border-white/20 px-8 py-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
              >
                <Play className="h-5 w-5 text-purple-400" />
                <span>Watch Demo</span>
              </button>
            </div>
          </div>
          <Image
            src={"/dashboard.png"}
            alt="Dashboard preview showing AI content generation interface"
            className="dashboard-image z-10 mt-10 rounded-2xl border border-cyan-800/20 shadow-xl md:shadow-2xl"
            style={{ opacity: 0, transform: 'translateY(100px) scale(0.9)' }}
            width={1200}
            height={598}
            priority
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
          />
        </div>
      </section>

      {/* Templates Section */}
      <section ref={templatesRef} id="templates" className="relative py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="section-title mb-20 text-center" style={{ opacity: 0, transform: 'translateY(50px)' }}>
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
                prefetch={true}
                style={{ opacity: 0, transform: 'translateY(60px)' }}
                className={`template-card group relative transform cursor-pointer overflow-hidden rounded-3xl border border-white/10 p-8 backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:border-white/20 ${
                  activeFeature === i ? "scale-105 border-purple-500/50" : ""
                }`}
                onMouseEnter={() => handleFeatureHover(i)}
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
      <section ref={featuresRef} id="whychooseus" className="relative py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="section-title mb-20 text-center" style={{ opacity: 0, transform: 'translateY(50px)' }}>
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
              <div key={i} className="feature-item group text-center" style={{ opacity: 0, transform: 'translateY(60px)' }}>
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
      <section ref={ctaRef} className="relative py-32">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="cta-content relative overflow-hidden rounded-3xl border border-white/20 p-16 backdrop-blur-sm" style={{ opacity: 0, transform: 'scale(0.9)' }}>
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

              <Link
                href={isSignedIn ? "/dashboard" : "/sign-in"}
                prefetch={true}
                className="inline-block transform rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 px-12 py-4 text-lg font-bold transition-all duration-300 hover:scale-105 hover:from-purple-700 hover:to-pink-700"
              >
                Start Free →
              </Link>

              <p className="mt-6 text-sm text-gray-400">
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

      {/* Video Popup Modal */}
      {isVideoOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl duration-300 animate-in fade-in"
          onClick={() => setIsVideoOpen(false)}
        >
          <div
            className="relative w-full max-w-3xl px-4 duration-500 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsVideoOpen(false)}
              className="group absolute -top-14 right-4 z-10 rounded-full border border-white/20 bg-gradient-to-br from-purple-600/20 to-pink-600/20 p-3 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-white/40 hover:from-purple-600/30 hover:to-pink-600/30 hover:shadow-lg hover:shadow-purple-500/50"
              aria-label="Close video"
            >
              <X className="h-6 w-6 text-white transition-transform group-hover:rotate-90" />
            </button>

            {/* Video Container with gradient border */}
            <div className="relative rounded-3xl bg-gradient-to-br from-purple-600 via-pink-600 to-indigo-600 p-1 shadow-2xl shadow-purple-500/30">
              <div className="relative overflow-hidden rounded-[1.25rem] bg-black">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 opacity-20 blur-xl" />

                {/* Video with 16:9 aspect ratio */}
                <div className="relative" style={{ paddingBottom: "56.25%" }}>
                  <iframe
                    className="absolute inset-0 h-full w-full rounded-[1.25rem]"
                    src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=0&rel=0&modestbranding=1`}
                    title="Demo Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>

            {/* Instruction text */}
            <p className="mt-6 text-center text-sm text-gray-400 duration-700 animate-in slide-in-from-bottom-4">
              Press{" "}
              <kbd className="rounded border border-white/20 bg-white/10 px-2 py-1 text-xs font-semibold text-white">
                ESC
              </kbd>{" "}
              or click outside to close
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
