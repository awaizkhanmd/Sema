import React, { useState, useEffect, useRef } from 'react';
import QrBarcodeScanner from 'react-qr-barcode-scanner';
import './BarcodeScanner.css'; // Import your CSS file

const BarcodeScanner = () => {
  const [scannedData, setScannedData] = useState('');
  const [isCameraAccessible, setIsCameraAccessible] = useState(false);
  const [barcodeDetected, setBarcodeDetected] = useState(false);
  const [cameraRequested, setCameraRequested] = useState(false); // New state to track camera request
  const videoRef = useRef(null);
  const streamRef = useRef(null); // Store the camera stream reference

  const handleScan = (data) => {
    if (data) {
      setScannedData(data);
      setBarcodeDetected(true); // Barcode detected, show modal
    }
  };

  useEffect(() => {
    // Check for the device type (desktop or mobile)
    const isMobileDevice =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    if (!cameraRequested) {
      if (isMobileDevice) {
        // Mobile device detected, request the back camera
        requestCameraAccess({ facingMode: 'environment' });
      } else {
        // Desktop or non-mobile device, check for external scanner or ask for camera access
        checkForExternalScanner();
      }
      // Set the cameraRequested flag to true to avoid repeated requests
      setCameraRequested(true);
    }

    // Cleanup function to stop the camera stream when unmounting
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, [cameraRequested]);

  useEffect(() => {
    // Reset barcode detection after 10 seconds
    const resetBarcodeDetection = setTimeout(() => {
      setBarcodeDetected(false);
    }, 10000);

    return () => {
      clearTimeout(resetBarcodeDetection);
    };
  }, [barcodeDetected]);

  const checkForExternalScanner = () => {
    // TODO: Implement logic to check for external scanner here

    // For demonstration purposes, assume no external scanner is detected
    requestCameraAccess();
  };

  const requestCameraAccess = async (constraints = { video: true }) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setIsCameraAccessible(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // Store the camera stream reference
      streamRef.current = stream;

      // Focus on the video element to enable scanning
      if (videoRef.current && videoRef.current.focus) {
        videoRef.current.focus();
      }
    } catch (error) {
      console.error('Camera access error:', error);
    }
  };

  return (
    <div className="page-container">
      <div className="scanner-container">
        <div className={`scan-line ${barcodeDetected ? 'scanning' : ''}`} />
        {/* Display the camera feed in a video element */}
        <video
          ref={(el) => {
            videoRef.current = el;
          }}
          playsInline
          autoPlay
          muted
          focusable="true"
        />
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
