import { Link } from "wouter";
import { Facebook, Twitter, Github, Dribbble, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-dark text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="font-sans font-bold text-2xl text-white mb-4">Build<span className="text-primary">Club</span></div>
            <p className="text-gray-400 mb-6 max-w-md">A community of curious minds building the future with AI, one meetup at a time.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-6 h-6" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-6 h-6" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="w-6 h-6" />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Dribbble className="w-6 h-6" />
                <span className="sr-only">Dribbble</span>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Links</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => {
                    document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }} 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    document.querySelector('#roles')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }} 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Who We Are
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    document.querySelector('#events')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }} 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Events
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    document.querySelector('#join')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }} 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Join Us
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                <span className="text-gray-400">hello@buildclub.ai</span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                <span className="text-gray-400">San Francisco, CA</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} BuildClub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
