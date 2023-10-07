import React, { useState, useEffect, useRef } from 'react';
import QrBarcodeScanner from 'react-qr-barcode-scanner';
import './BarcodeScanner.css'; // Import your CSS file

const BarcodeScanner = () => {
  const [scannedData, setScannedData] = useState('');
  const [isCameraAccessible, setIsCameraAccessible] = useState(false);
  const [barcodeDetected, setBarcodeDetected] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null); // Store the camera stream reference

  const handleScan = (data) => {
    if (data) {
      setScannedData(data);
      setBarcodeDetected(true); // Barcode detected, show modal
    }
  };

  useEffect(() => {
    // Request camera access when the component mounts
    requestCameraAccess();

    // Cleanup function to stop the camera stream when unmounting
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, []);

  useEffect(() => {
    // Reset barcode detection after 10 seconds
    const resetBarcodeDetection = setTimeout(() => {
      setBarcodeDetected(false);
    }, 10000);

    return () => {
      clearTimeout(resetBarcodeDetection);
    };
  }, [barcodeDetected]);

  const requestCameraAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }, // Request the back camera
      });
      setIsCameraAccessible(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // Store the camera stream reference
      streamRef.current = stream;
    } catch (error) {
      console.error('Camera access error:', error);
    }
  };

  return (
    <div className="page-container">
      <div className="scanner-container">
        <div className={`scan-line ${barcodeDetected ? 'scanning' : ''}`} />
        {/* Display the camera feed in a video element */}
        <video ref={videoRef} playsInline autoPlay muted />
        <QrBarcodeScanner onScan={handleScan} />
      </div>
      <div className="result-container">
        {barcodeDetected && (
          <div>
            <p>Barcode Detected:</p>
            <pre>{scannedData}</pre>
            {/* Display your modal here */}
          </div>
        )}
        {!barcodeDetected && <p>No barcode found after 10 seconds.</p>}
      </div>
    </div>
  );
};

export default BarcodeScanner;
