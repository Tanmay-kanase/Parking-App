import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef } from "react";
import axios from "../../config/axiosInstance";

const Verify = () => {
  const [scanned, setScanned] = useState(false);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();
  const scannerRef = useRef(null);

  useEffect(() => {
    const html5QrCode = new Html5Qrcode("reader");

    Html5Qrcode.getCameras().then((devices) => {
      if (devices && devices.length) {
        html5QrCode.start(
          devices[0].id,
          { fps: 10, qrbox: 250 },
          async (data) => {
            if (data && !scanned) {
              setScanned(true);
              html5QrCode.stop(); // stop scanner
              handleScan(data.trim());
            }
          },
          (err) => {
            console.warn("QR scan error:", err);
          }
        );
      }
    });

    return () => {
      html5QrCode.stop().catch((err) => console.error("Stop error:", err));
    };
  }, []);

  const successSound = new Audio(
    "https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3"
  );
  const errorSound = new Audio(
    "https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3"
  );

  const handleScan = async (data) => {
    if (data && !scanned) {
      setScanned(true);
      const slotId = data.trim();

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/parking-slots/${slotId}`
        );
        const isValid = response.data;

        if (isValid) {
          successSound.play();
        } else {
          errorSound.play();
        }

        setResult({ isValid, slotId });
      } catch (error) {
        console.error("Error verifying slot:", error);
        errorSound.play();
        setResult({ isValid: false, slotId });
      }
    }
  };

  //   const handleError = (err) => {
  //     console.error(err);
  //   };

  const resetScan = () => {
    setScanned(false);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold mb-6">Scan QR Code to Verify Slot</h2>

      {!result && (
        <div className="border-4 border-blue-500 rounded-lg overflow-hidden">
          <div
            id="reader"
            ref={scannerRef}
            className="w-72 h-72 border-4 border-blue-500 rounded-lg overflow-hidden"
          />
        </div>
      )}

      {result && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm text-center">
            <h3
              className={`text-2xl font-bold mb-4 ${
                result.isValid ? "text-green-600" : "text-red-600"
              }`}
            >
              {result.isValid
                ? "✅ Green Signal - Valid Slot"
                : "❌ Red Signal - Invalid Slot"}
            </h3>
            <p className="mb-6 text-gray-700">
              Slot ID: <span className="font-semibold">{result.slotId}</span>
            </p>

            {result.isValid && (
              <div className="w-full h-24 bg-gray-300 border-t-4 border-gray-600 rounded-md overflow-hidden shadow-md mt-4">
                <div className="h-full bg-green-500 animate-slide-up-gate flex justify-center items-center">
                  <span className="text-white text-xl font-semibold animate-pulse">
                    ✅ Gate Opening...
                  </span>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={() => navigate("/")}
                className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
              >
                Exit
              </button>
              <button
                onClick={resetScan}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Verify Another
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Verify;
