import React, { useState, useEffect } from 'react';
import QrBarcodeScanner from 'react-qr-barcode-scanner';

const BarcodeScanner = () => {
  const [scannedData, setScannedData] = useState('');
  const [isCameraAccessible, setIsCameraAccessible] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);

  const handleScan = (data) => {
    if (data) {
      setScannedData(data);
    }
  };

  useEffect(() => {
    // Request camera access when the component mounts
    requestCameraAccess();
  }, []);

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
        {scannedData && (
          <div>
            <p>Scanned Data:</p>
            <pre>{scannedData}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default BarcodeScanner;
