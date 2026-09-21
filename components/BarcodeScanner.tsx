'use client';

import { useState, useRef, useEffect } from 'react';
import { X, AlertCircle, Loader } from 'lucide-react';
import { useInventoryStore } from '@/lib/store';
import { playAudio } from '@/lib/utils';

interface BarcodeScannerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BarcodeScanner({ isOpen, onClose }: BarcodeScannerProps) {
  const [mode, setMode] = useState<'camera' | 'manual'>('camera');
  const [manualSKU, setManualSKU] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [error, setError] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const products = useInventoryStore((state) => state.products);
  const addToast = useInventoryStore((state) => state.addToast);

  const startCamera = async () => {
    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      setError('Unable to access camera. Please use manual entry or check permissions.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    if (isOpen && mode === 'camera') {
      startCamera();
    }
    return () => stopCamera();
  }, [isOpen, mode]);

  const handleScanSuccess = (sku: string) => {
    const product = products.find((p) => p.sku === sku);
    if (product) {
      playAudio(800, 200);
      addToast(`Product found: ${product.name}`, 'success');
      setManualSKU('');
      onClose();
      // In a real app, this would open a movement entry form
    } else {
      playAudio(200, 400);
      addToast(`SKU not found: ${sku}`, 'error');
      setError(`Product with SKU "${sku}" not found in inventory.`);
    }
  };

  const handleManualEntry = () => {
    if (!manualSKU.trim()) {
      addToast('Please enter a SKU', 'error');
      return;
    }
    handleScanSuccess(manualSKU.toUpperCase());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <h2 className="text-sm sm:text-lg font-semibold text-gray-900">SKU Scanner</h2>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1 hover:bg-gray-200 rounded-lg transition"
          >
            <X className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600" />
          </button>
        </div>

        {/* Mode Tabs */}
        <div className="sticky top-12 sm:top-14 px-4 sm:px-6 py-2 sm:py-3 border-b border-gray-200 bg-white flex gap-2">
          <button
            onClick={() => setMode('camera')}
            className={`flex-1 px-3 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition ${
              mode === 'camera'
                ? 'bg-brand-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Camera
          </button>
          <button
            onClick={() => setMode('manual')}
            className={`flex-1 px-3 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition ${
              mode === 'manual'
                ? 'bg-brand-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Manual
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {mode === 'camera' ? (
            <div className="space-y-4">
              {/* Camera View */}
              <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
                {cameraActive ? (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    {/* Targeting Corners */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative w-64 h-40">
                        {/* Top Left */}
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-green-400" />
                        {/* Top Right */}
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-green-400" />
                        {/* Bottom Left */}
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-green-400" />
                        {/* Bottom Right */}
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-green-400" />
                        {/* Center Crosshair */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-1 h-8 bg-green-400 animate-pulse" />
                          <div className="h-1 w-8 bg-green-400 absolute animate-pulse" />
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                    <Loader className="w-8 h-8 text-gray-400 animate-spin" />
                    <p className="text-gray-400 text-sm">Initializing camera...</p>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-2 sm:p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-700">
                  Position barcode within the green frame. Supports Code128 and UPC formats.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
                  <AlertCircle className="w-3 sm:w-4 h-3 sm:h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-700">{error}</p>
                </div>
              )}

              {/* Fallback Text */}
              <div className="text-center">
                <p className="text-xs text-gray-600">Can't scan? Switch to manual entry</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {/* Manual SKU Input */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-2">
                  Enter SKU or Product Code
                </label>
                <input
                  type="text"
                  value={manualSKU}
                  onChange={(e) => setManualSKU(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleManualEntry()}
                  placeholder="e.g., CHOC-001"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  autoFocus
                />
              </div>

              {/* Product Suggestions */}
              {manualSKU && (
                <div className="space-y-1.5 sm:space-y-2">
                  <p className="text-xs font-semibold text-gray-700">Matching Products:</p>
                  <div className="space-y-1.5 sm:space-y-2 max-h-48 overflow-y-auto">
                    {products
                      .filter((p) => p.sku.toLowerCase().includes(manualSKU.toLowerCase()))
                      .map((product) => (
                        <button
                          key={product.id}
                          onClick={() => handleScanSuccess(product.sku)}
                          className="w-full p-1.5 sm:p-2 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                        >
                          <p className="text-xs sm:text-sm font-medium text-gray-900">{product.sku}</p>
                          <p className="text-xs text-gray-600">{product.name}</p>
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
                  <AlertCircle className="w-3 sm:w-4 h-3 sm:h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-700">{error}</p>
                </div>
              )}

              {/* Info Box */}
              <div className="p-2 sm:p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-700">
                  Type or paste the SKU and press Enter, or click on a suggested product.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {mode === 'manual' && (
          <div className="sticky bottom-0 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 bg-gray-50 flex gap-2 sm:gap-3">
            <button
              onClick={() => {
                stopCamera();
                onClose();
              }}
              className="flex-1 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleManualEntry}
              disabled={!manualSKU.trim()}
              className="flex-1 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-brand-primary text-white rounded-lg hover:bg-brand-dark transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
