import { useState } from "react";
import axios from "axios";
import { QRCode } from "react-qr-code";
import * as QRCodeGenerator from "qrcode";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [qrImage, setQrImage] = useState("");
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 to-slate-800 text-white">

      {/* 🔝 Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 bg-slate-900 shadow-md">
        <h1 className="text-xl font-bold">🔗 Shortify</h1>
        <a
          href="https://github.com/your-repo"
          target="_blank"
          className="text-sm hover:text-indigo-400"
        >
          GitHub
        </a>
      </nav>

      {/* 🔥 Main Content */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-2xl">

          <h2 className="text-3xl font-bold text-center mb-6">
            URL Shortener
          </h2>

          {/* Input */}
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Paste your long URL here..."
              className="p-3 rounded-lg text-black outline-none"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />

            <button
              onClick={handleShorten}
              disabled={loading}
              className="bg-indigo-500 hover:bg-indigo-600 transition p-3 rounded-lg font-semibold"
            >
              {loading ? "Generating..." : "Shorten URL"}
            </button>
          </div>

          {/* Result */}
          {shortUrl && (
            <div className="mt-6 text-center">

              <p className="mb-2 text-gray-300">Your short link:</p>

              <a
                href={shortUrl}
                target="_blank"
                className="text-indigo-400 break-all"
              >
                {shortUrl}
              </a>

              <button
                onClick={handleCopy}
                className={`mt-3 w-full p-2 rounded-lg ${
                  copied ? "bg-green-500" : "bg-slate-700"
                }`}
              >
                {copied ? "Copied!" : "Copy"}
              </button>

              {/* QR */}
              <div className="bg-white p-4 rounded-lg mt-6 inline-block">
                <QRCode value={shortUrl} size={180} />
              </div>

              {/* Download */}
              {qrImage && (
                <a
                  download="qr-code.png"
                  href={qrImage}
                  className="block mt-4 bg-emerald-500 hover:bg-emerald-600 p-2 rounded-lg"
                >
                  Download QR Code
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 🔻 Footer */}
      <footer className="text-center py-4 text-sm text-gray-400 bg-slate-900">
        © 2026 Shortify | Built with MERN 🚀
      </footer>
    </div>
  );
}

export default App;