import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    // Base classes for light mode, dark: classes for dark mode
    <footer className="bg-gray-50 text-gray-700 py-10 dark:bg-gray-900 dark:text-gray-300">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Logo & About */}
          <div>
            <h2 className="text-2xl font-bold text-blue-600 dark:text-yellow-400">
              ParkEase
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Making parking stress-free with smart, secure, and seamless
              solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Quick Links
            </h3>
            <ul className="mt-2 space-y-2">
              <li>
                <a
                  href="#"
                  className="hover:text-blue-600 dark:hover:text-yellow-400 transition"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-600 dark:hover:text-yellow-400 transition"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-600 dark:hover:text-yellow-400 transition"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-600 dark:hover:text-yellow-400 transition"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Follow Us
            </h3>
            <div className="flex justify-center md:justify-start gap-4 mt-2">
              <a
                href="#"
                className="text-gray-600 hover:text-blue-600 dark:text-yellow-400 dark:hover:text-white transition"
              >
                <Facebook size={24} />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-blue-600 dark:text-yellow-400 dark:hover:text-white transition"
              >
                <Twitter size={24} />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-blue-600 dark:text-yellow-400 dark:hover:text-white transition"
              >
                <Instagram size={24} />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-blue-600 dark:text-yellow-400 dark:hover:text-white transition"
              >
                <Linkedin size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 border-t border-gray-200 pt-4 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
          © {new Date().getFullYear()} ParkEasy. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
