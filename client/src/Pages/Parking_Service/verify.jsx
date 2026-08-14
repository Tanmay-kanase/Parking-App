import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import axios from "../../config/axiosInstance";

const successAudio = new Audio(
  "https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3",
);
const errorAudio = new Audio(
  "https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3",
);

const Verify = () => {
  const [scanned, setScanned] = useState(false);
  const [result, setResult] = useState(null);
  const [cameras, setCameras] = useState([]);
  const [currentCamIndex, setCurrentCamIndex] = useState(0);

  const navigate = useNavigate();
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);
  const scannedRef = useRef(false); // <-- source of truth for the callback

  useEffect(() => {
    let isMounted = true;
    html5QrCodeRef.current = new Html5Qrcode("reader");
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (isMounted && devices?.length) {
          setCameras(devices);
          startScanner(devices[0].id);
        }
      })
      .catch((err) => console.error("Camera list error:", err));
    return () => {
      isMounted = false;
      stopScanner();
    };
  }, []);

  const startScanner = (cameraId) => {
    html5QrCodeRef.current
      .start(
        cameraId,
        { fps: 10, qrbox: 250 },
        async (data) => {
          if (data && !scannedRef.current) {
            scannedRef.current = true;
            setScanned(true);
            stopScanner();
            handleScan(data.trim());
          }
        },
        (err) => {
          console.warn("QR scan error:", err);
        },
      )
      .catch((err) => console.error("Start error:", err));
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current?.isScanning) {
      await html5QrCodeRef.current
        .stop()
        .catch((err) => console.error("Stop error:", err));
    }
  };

  const switchCamera = async () => {
    if (cameras.length > 1) {
      await stopScanner();
      const nextIndex = (currentCamIndex + 1) % cameras.length;
      setCurrentCamIndex(nextIndex);
      startScanner(cameras[nextIndex].id);
    }
  };

  const resetScan = async () => {
    scannedRef.current = false; // reset BEFORE starting scanner again
    setScanned(false);
    setResult(null);
    await stopScanner();
    startScanner(cameras[currentCamIndex]?.id);
  };

  const handleScan = async (data) => {
    const bookingId = data.trim();

    try {
      const response = await axios.post(`/api/verify/${bookingId}`);
      const verification = response.data;

      if (
        verification.status === "ACTIVE" ||
        verification.status === "COMPLETED"
      ) {
        successAudio.play();
      } else {
        errorAudio.play();
      }

      setResult({
        bookingId,
        message: verification.message,
        status: verification.status,
      });
    } catch (error) {
      console.error(error);
      errorAudio.play();
      setResult({
        bookingId,
        message: "Verification failed.",
        status: "ERROR",
      });
    }
  };

  return (
    <div className="min-h-screen inset-0 z-50 bg-white/30 dark:bg-black/40 backdrop-blur-md text-gray-900 dark:text-gray-100 flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold mb-6">Scan QR Code to Verify Slot</h2>

      {!result && (
        <>
          <div className="border-4 border-blue-400 rounded-lg overflow-hidden">
            <div
              id="reader"
              ref={scannerRef}
              className="w-72 h-72 border-4 border-blue-400 rounded-lg overflow-hidden"
            />
          </div>

          {cameras.length > 1 && (
            <button
              onClick={switchCamera}
              className="mt-4 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Switch Camera
            </button>
          )}
        </>
      )}

      {result && (
        <div className="fixed inset-0 bg-white/40 dark:bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-sm text-center">
            <h3
              className={`text-2xl font-bold mb-4 ${
                result.status === "ACTIVE"
                  ? "text-green-500"
                  : result.status === "COMPLETED"
                    ? "text-blue-500"
                    : result.status === "EXPIRED"
                      ? "text-red-500"
                      : "text-yellow-500"
              }`}
            >
              {result.status === "ACTIVE" && "🚗 Entry Approved"}
              {result.status === "COMPLETED" && "👋 Exit Recorded"}
              {result.status === "EXPIRED" && "⏰ Booking Expired"}
              {result.status === "BOOKED" && "⌛ Too Early"}
              {result.status === "ERROR" && "❌ Verification Failed"}
            </h3>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
              {result.message}
            </p>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Booking ID:
              <span className="font-semibold ml-1">{result.bookingId}</span>
            </p>

            {result.status === "ACTIVE" && (
              <div className="w-full h-24 bg-gray-200 dark:bg-gray-700 border-t-4 border-gray-300 dark:border-gray-600 rounded-md overflow-hidden shadow-md mt-4">
                <div className="h-full bg-green-600 animate-slide-up-gate flex justify-center items-center">
                  <span className="text-white text-xl font-semibold animate-pulse">
                    ✅ Gate Opening...
                  </span>
                </div>
              </div>
            )}

            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={() => navigate("/")}
                className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
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
