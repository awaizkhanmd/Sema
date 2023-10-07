import React, { useState, useEffect } from 'react';
import QrBarcodeScanner from 'react-qr-barcode-scanner';

const BarcodeScanner = () => {
  const [scannedData, setScannedData] = useState('');
  const [isCameraAccessible, setIsCameraAccessible] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [barcodeDetected, setBarcodeDetected] = useState(false);

  const handleScan = (data) => {
    if (data) {
      setScannedData(data);
      setBarcodeDetected(true); // Barcode detected, show modal
    }
  };

  useEffect(() => {
    // Request camera access when the component mounts
    requestCameraAccess();
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
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setIsCameraAccessible(true);
      setCameraStream(stream); // Store the camera stream in state
    } catch (error) {
      console.error('Camera access error:', error);
    }
  };

  return (
    <div>
      <h2>QR Code and Barcode Scanner</h2>
      {isCameraAccessible ? (
        <div className="scanner-container">
          {/* Display the camera feed in a video element */}
          <video
            ref={(video) => {
              if (video && cameraStream) {
                video.srcObject = cameraStream;
                video.play();
              }
            }}
          ></video>
          <QrBarcodeScanner onScan={handleScan} />
        </div>
      ) : (
        <div>
          <p>Camera access is required to scan QR codes and barcodes.</p>
          <button onClick={requestCameraAccess}>Request Camera Access</button>
        </div>
      )}
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
