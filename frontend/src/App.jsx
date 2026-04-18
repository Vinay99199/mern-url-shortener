import { useState } from "react";
import axios from "axios";
import { QRCode } from "react-qr-code";
import * as QRCodeGenerator from "qrcode";
import { FaLink, FaSun, FaMoon, FaLinkedin, FaInstagram } from "react-icons/fa";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [qrImage, setQrImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const handleShorten = async () => {
    if (!url || loading) return;
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/shorter`, {
        originalUrl: url,
      });

      const newShortUrl = res.data.shortUrl;
      setShortUrl(newShortUrl);
      setCopied(false);

      const qr = await QRCodeGenerator.toDataURL(newShortUrl);
      setQrImage(qr);
    } catch (err) {
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`${darkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"} min-h-screen flex flex-col`}>

      {/* Navbar */}
      <nav className={`${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-200"} flex justify-between items-center px-8 py-4 border-b`}>
        <div className="flex items-center gap-2 text-xl font-bold">
          <div className={`${darkMode ? "bg-blue-600" : "bg-blue-500"} p-2 rounded-lg`}>
            <FaLink className="text-white" />
          </div>
          <span>Shortify</span>
        </div>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`${darkMode ? "bg-slate-800 hover:bg-slate-700" : "bg-gray-100 hover:bg-gray-200"} p-2 rounded-lg transition-colors`}
        >
          {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-slate-700" />}
        </button>
      </nav>

      {/* Main */}
      <div className="flex flex-1 items-center justify-center px-6 py-16">
        <div className={`${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-300"} w-full max-w-xl p-8 rounded-2xl border shadow-lg`}>

          <h2 className="text-3xl font-bold text-center mb-2">
            Shorten your URL
          </h2>
          <p className={`text-center text-sm mb-6 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
            Make your long links short and easy to share
          </p>

          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Paste your long URL here..."
              className={`p-3 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500 transition ${darkMode ? "bg-slate-700 border-slate-600 text-white placeholder-slate-500" : "bg-gray-50 border-gray-300 text-slate-900 placeholder-gray-500"}`}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />

            <button
              onClick={handleShorten}
              disabled={loading}
              className={`${darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} text-white p-3 rounded-lg font-semibold transition-colors disabled:opacity-50`}
            >
              {loading ? "Generating..." : "Shorten URL"}
            </button>
          </div>

          {shortUrl && (
            <div className="mt-8 text-center">
              <p className={`mb-2 text-sm font-medium ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                Your short link
              </p>

              <a
                href={shortUrl}
                target="_blank"
                className={`text-blue-500 hover:underline break-all text-lg font-medium ${darkMode ? "hover:text-blue-400" : "hover:text-blue-600"}`}
              >
                {shortUrl}
              </a>

              <button
                onClick={handleCopy}
                className={`mt-4 w-full p-2 rounded-lg font-semibold transition-all ${
                  copied 
                    ? "bg-green-600 text-white" 
                    : darkMode 
                    ? "bg-slate-700 hover:bg-slate-600 text-white" 
                    : "bg-gray-200 hover:bg-gray-300 text-slate-900"
                }`}
              >
                {copied ? "Copied!" : "Copy Link"}
              </button>

              <div className={`${darkMode ? "bg-slate-700 border-slate-600" : "bg-gray-100 border-gray-300"} p-4 rounded-lg mt-6 inline-block border`}>
                <QRCode value={shortUrl} size={160} />
              </div>

              {qrImage && (
                <a
                  download="qr-code.png"
                  href={qrImage}
                  className={`block mt-4 text-blue-500 hover:underline font-medium ${darkMode ? "hover:text-blue-400" : "hover:text-blue-600"}`}
                >
                  Download QR Code
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className={`${darkMode ? "bg-slate-900 text-slate-300 border-slate-800" : "bg-white text-slate-700 border-gray-200"} border-t py-10 mt-12`}>
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8 mb-8">

          <div>
            <h3 className="font-bold text-white dark:text-white mb-2">Shortify</h3>
            <p className="text-sm">
              Simple and secure URL shortening service for sharing links faster.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-white dark:text-white mb-3">Features</h3>
            <ul className="text-sm space-y-1">
              <li>Link Shortener</li>
              <li>QR Code Generator</li>
              <li>Easy Sharing</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white dark:text-white mb-3">Follow</h3>
            <div className="flex items-start gap-4 text-xl">
              <a 
                href="https://linkedin.com/in/yourprofile" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`cursor-pointer transition-colors ${darkMode ? "hover:text-blue-400" : "hover:text-blue-600"}`}
              >
                <FaLinkedin />
              </a>
              <a 
                href="https://instagram.com/yourprofile" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`cursor-pointer transition-colors ${darkMode ? "hover:text-pink-400" : "hover:text-pink-600"}`}
              >
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>

        <p className="text-center text-sm">
          © 2026 Shortify. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default App;