import { Link } from "wouter";
import {
  Facebook,
  Twitter,
  Github,
  Dribbble,
  Mail,
  MapPin,
  MessageCircle,
  Instagram,
} from "lucide-react";
import logoPath from "../assets/logo-light.png";

export default function Footer() {
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    Instagram: Instagram,
    Facebook: Facebook,
    Twitter: Twitter,
    Github: Github,
  };

  return (
    <footer className="relative bg-[var(--color-blue)] text-white py-16 overflow-hidden">
      <div className="absolute -left-10 bottom-20 w-32 h-32 bg-white/10 rounded-full"></div>
      <div className="absolute right-20 top-10 w-36 h-36 bg-white/10 rounded-3xl rotate-12"></div>
      <div className="absolute right-1/4 bottom-1/3 w-20 h-20 bg-white/10 rounded-full"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="mb-5">
              <img
                src={logoPath}
                alt="BuildClub Logo"
                className="h-16 w-auto"
              />
            </div>
            <p className="text-white/80 mb-6 max-w-md text-lg">
              A fun community of creative minds building the future with AI, one
              meetup at a time!
            </p>
            <div className="flex space-x-3">
              {[
                {
                  name: "Instagram",
                  url: "https://instagram.com/joinbuidclub",
                },
                { name: "Facebook", url: "https://facebook.com/joinbuildclub" },
                { name: "Twitter", url: "https://twitter.com/joinbuildclub" },
                { name: "Github", url: "https://github.com/joinbuildclub" },
              ].map((social, i) => {
                const Icon = icons[social.name];
                return (
                  <a
                    key={i}
                    target="_blank"
                    href={social.url}
                    className="bg-white/20 p-2.5 rounded-full hover:bg-white/30 transition-colors"
                    style={{ boxShadow: "0 4px 0 0 rgba(0,0,0,0.1)" }}
                  >
                    <Icon className="w-5 h-5 text-white" />
                    <span className="sr-only">{social.name}</span>
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-5">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { id: "#about", label: "About" },
                { id: "#roles", label: "Who We Are" },
                { id: "#events", label: "Events" },
                { id: "#join", label: "Join Us" },
              ].map((link, i) => (
                <li key={i}>
                  <button
                    onClick={() => {
                      document.querySelector(link.id)?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }}
                    className="text-white/80 hover:text-white transition-colors flex items-center"
                  >
                    <div className="w-1.5 h-1.5 bg-[var(--color-yellow)] rounded-full mr-2"></div>
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-5">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="clay-shape bg-[var(--color-red)] p-2 mr-3">
                  <Mail className="h-4 w-4 text-white" />
                </div>
                <span className="text-white/90 pt-1">join@buildclub.io</span>
              </li>
              <li className="flex items-start">
                <div className="clay-shape bg-[var(--color-green)] p-2 mr-3">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                <span className="text-white/90 pt-1">Providence, RI</span>
              </li>
              <li className="flex items-start">
                <div className="clay-shape bg-[var(--color-yellow)] p-2 mr-3">
                  <MessageCircle className="h-4 w-4 text-white" />
                </div>
                <span className="text-white/90 pt-1">Let's chat!</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/20 text-center text-white/70">
          <p>
            &copy; {new Date().getFullYear()} BuildClub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
