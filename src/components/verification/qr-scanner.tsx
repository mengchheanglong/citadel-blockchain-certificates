'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import jsQR from 'jsqr';
import {
  Camera,
  Upload,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  X,
  FlipHorizontal,
  Loader2,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface QrScannerProps {
  onScanSuccess: (certificateId: string) => void;
  onClose: () => void;
  className?: string;
}

type ScanMode = 'camera' | 'file';
type CameraState = 'idle' | 'starting' | 'running' | 'error';

/**
 * Extracts a certificate ID from a scanned QR payload, verification URL,
 * or raw identifier string.
 */
export function parseCertificateId(raw: string): string {
  let value = raw.trim();

  if (value.includes('/verify/')) {
    value = value.split('/verify/').pop()!.split(/[?#]/)[0];
  } else if (/^https?:\/\//i.test(value)) {
    try {
      const segments = new URL(value).pathname.split('/').filter(Boolean);
      if (segments.length > 0) value = segments[segments.length - 1];
    } catch {
      /* Not a valid URL — fall through with the raw value */
    }
  }

  return decodeURIComponent(value).trim();
}

/**
 * Decodes QR code from a canvas element using jsQR.
 */
function decodeCanvas(canvas: HTMLCanvasElement): string | null {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const code = jsQR(imgData.data, canvas.width, canvas.height, {
    inversionAttempts: 'attemptBoth',
  });
  return code ? code.data : null;
}

/**
 * Multi-pass image scanner using jsQR to handle full-page certificates,
 * small crops, and various quadrants.
 */
function scanImageWithJsQR(img: HTMLImageElement): string | null {
  const w = img.naturalWidth || img.width;
  const h = img.naturalHeight || img.height;

  // Pass 1: Full native image
  const fullCanvas = document.createElement('canvas');
  fullCanvas.width = w;
  fullCanvas.height = h;
  const fullCtx = fullCanvas.getContext('2d', { willReadFrequently: true });
  if (fullCtx) {
    fullCtx.drawImage(img, 0, 0);
    const res = decodeCanvas(fullCanvas);
    if (res) return res;
  }

  // Pass 2: Upscaled (if small crop snippet like 65x65)
  if (w < 220 || h < 220) {
    const upCanvas = document.createElement('canvas');
    const scale = Math.max(2, Math.floor(320 / Math.max(w, h)));
    upCanvas.width = w * scale;
    upCanvas.height = h * scale;
    const upCtx = upCanvas.getContext('2d', { willReadFrequently: true });
    if (upCtx) {
      upCtx.imageSmoothingEnabled = false;
      upCtx.drawImage(img, 0, 0, w * scale, h * scale);
      const res = decodeCanvas(upCanvas);
      if (res) return res;
    }
  }

  // Pass 3: Bottom-right quadrant (Citadel certificate standard QR location)
  const cropW = Math.floor(w * 0.45);
  const cropH = Math.floor(h * 0.45);
  const brCanvas = document.createElement('canvas');
  brCanvas.width = cropW;
  brCanvas.height = cropH;
  const brCtx = brCanvas.getContext('2d', { willReadFrequently: true });
  if (brCtx) {
    brCtx.drawImage(img, w - cropW, h - cropH, cropW, cropH, 0, 0, cropW, cropH);
    const res = decodeCanvas(brCanvas);
    if (res) return res;
  }

  // Pass 4: Bottom-left quadrant
  const blCanvas = document.createElement('canvas');
  blCanvas.width = cropW;
  blCanvas.height = cropH;
  const blCtx = blCanvas.getContext('2d', { willReadFrequently: true });
  if (blCtx) {
    blCtx.drawImage(img, 0, h - cropH, cropW, cropH, 0, 0, cropW, cropH);
    const res = decodeCanvas(blCanvas);
    if (res) return res;
  }

  // Pass 5: Center region
  const centerCanvas = document.createElement('canvas');
  centerCanvas.width = cropW;
  centerCanvas.height = cropH;
  const centerCtx = centerCanvas.getContext('2d', { willReadFrequently: true });
  if (centerCtx) {
    centerCtx.drawImage(
      img,
      Math.floor((w - cropW) / 2),
      Math.floor((h - cropH) / 2),
      cropW,
      cropH,
      0,
      0,
      cropW,
      cropH
    );
    const res = decodeCanvas(centerCanvas);
    if (res) return res;
  }

  return null;
}

export function QrScanner({ onScanSuccess, onClose, className }: QrScannerProps) {
  const [mode, setMode] = useState<ScanMode>('camera');
  const [cameraState, setCameraState] = useState<CameraState>('idle');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameras, setCameras] = useState<Array<{ id: string; label: string }>>([]);
  const [selectedCameraIndex, setSelectedCameraIndex] = useState(0);

  const [isFileDecoding, setIsFileDecoding] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [detectedId, setDetectedId] = useState<string | null>(null);

  const cameraScannerRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isStoppingRef = useRef(false);

  /**
   * Safely stop the camera scanner instance and free media streams.
   */
  const stopCameraScanner = useCallback(async () => {
    if (cameraScannerRef.current && !isStoppingRef.current) {
      isStoppingRef.current = true;
      try {
        if (cameraScannerRef.current.isScanning) {
          await cameraScannerRef.current.stop();
        }
        cameraScannerRef.current.clear();
      } catch (err) {
        console.warn('Error while stopping camera scanner:', err);
      } finally {
        cameraScannerRef.current = null;
        isStoppingRef.current = false;
        setCameraState('idle');
      }
    }
  }, []);

  /**
   * Callback fired when a QR code payload or Certificate ID is detected.
   */
  const handleDecodedText = useCallback(
    async (decodedText: string) => {
      const id = parseCertificateId(decodedText);
      if (!id) {
        setFileError('The document was read, but does not contain a valid certificate ID.');
        return;
      }

      setDetectedId(id);
      await stopCameraScanner();

      // Short delay so the user sees the visual confirmation
      setTimeout(() => {
        onScanSuccess(id);
      }, 450);
    },
    [onScanSuccess, stopCameraScanner]
  );

  /**
   * Initializes and starts the camera stream in the #qr-camera-stream viewport.
   */
  const startCameraScanner = useCallback(
    async (targetCameraIndex?: number) => {
      await stopCameraScanner();

      setCameraState('starting');
      setCameraError(null);

      // Give React DOM a moment to mount #qr-camera-stream
      await new Promise((resolve) => setTimeout(resolve, 80));

      const streamElement = document.getElementById('qr-camera-stream');
      if (!streamElement) {
        setCameraState('error');
        setCameraError('Camera viewport container not ready.');
        return;
      }

      try {
        const scanner = new Html5Qrcode('qr-camera-stream', false);
        cameraScannerRef.current = scanner;

        // Query available video devices
        let availableDevices: Array<{ id: string; label: string }> = [];
        try {
          const devices = await Html5Qrcode.getCameras();
          if (devices && devices.length > 0) {
            availableDevices = devices.map((d) => ({
              id: d.id,
              label: d.label || `Camera ${d.id.slice(0, 5)}`,
            }));
            setCameras(availableDevices);
          }
        } catch {
          /* In some browsers, camera labels require active permission first */
        }

        const cameraConfig = {
          fps: 12,
          qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
            const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
            const edge = Math.max(180, Math.floor(minEdge * 0.72));
            return { width: edge, height: edge };
          },
          aspectRatio: 1.0,
        };

        const idx = targetCameraIndex ?? selectedCameraIndex;
        if (availableDevices.length > 0 && availableDevices[idx]) {
          await scanner.start(
            availableDevices[idx].id,
            cameraConfig,
            (decodedText) => handleDecodedText(decodedText),
            () => {}
          );
        } else {
          try {
            await scanner.start(
              { facingMode: 'environment' },
              cameraConfig,
              (decodedText) => handleDecodedText(decodedText),
              () => {}
            );
          } catch (envError) {
            console.info('Environment facing camera failed, falling back to user camera:', envError);
            await scanner.start(
              { facingMode: 'user' },
              cameraConfig,
              (decodedText) => handleDecodedText(decodedText),
              () => {}
            );
          }
        }

        setCameraState('running');

        try {
          const updatedDevices = await Html5Qrcode.getCameras();
          if (updatedDevices && updatedDevices.length > 0) {
            setCameras(
              updatedDevices.map((d) => ({
                id: d.id,
                label: d.label || `Camera ${d.id.slice(0, 5)}`,
              }))
            );
          }
        } catch {
          // ignore
        }
      } catch (err: unknown) {
        console.error('Failed to start camera:', err);
        setCameraState('error');

        const message = String((err as { message?: string })?.message || err);
        if (/notallowed|permission|denied/i.test(message)) {
          setCameraError(
            'Camera access was denied. Please allow camera permissions in your browser address bar to scan.'
          );
        } else if (/notfound|device|no camera/i.test(message)) {
          setCameraError(
            'No camera device detected on this system. You can upload a certificate image or PDF instead.'
          );
        } else if (/insecure|secure context/i.test(message)) {
          setCameraError('Camera access requires an HTTPS connection or localhost.');
        } else {
          setCameraError(
            'Unable to start the camera feed. Please check permissions or upload a certificate file.'
          );
        }
      }
    },
    [handleDecodedText, selectedCameraIndex, stopCameraScanner]
  );

  /** Switch between available camera devices */
  const handleSwitchCamera = async () => {
    if (cameras.length <= 1) return;
    const nextIndex = (selectedCameraIndex + 1) % cameras.length;
    setSelectedCameraIndex(nextIndex);
    await startCameraScanner(nextIndex);
  };

  /** Mode switcher */
  const handleSelectMode = async (newMode: ScanMode) => {
    if (newMode === mode) return;
    setMode(newMode);
    setFileError(null);
    setCameraError(null);

    if (newMode === 'file') {
      await stopCameraScanner();
    } else {
      await startCameraScanner();
    }
  };

  /**
   * Processes an uploaded certificate file (PDF, PNG, JPG, WEBP).
   */
  const processUploadedFile = async (file: File) => {
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const isPdf = file.type === 'application/pdf' || fileName.endsWith('.pdf');
    const isImage = file.type.startsWith('image/') || /\.(png|jpe?g|webp|bmp|gif)$/i.test(fileName);

    if (!isPdf && !isImage) {
      setFileError('Please select a certificate PDF or image file (.pdf, .png, .jpg, .webp).');
      return;
    }

    setIsFileDecoding(true);
    setFileError(null);

    // 1. Handle PDF Files
    if (isPdf) {
      try {
        // Fast client pass: scan raw buffer for Certificate ID
        const arrayBuffer = await file.arrayBuffer();
        const latin1 = new TextDecoder('latin1').decode(arrayBuffer);
        const match =
          latin1.match(/CERT-\d{4}-[A-Za-z0-9]+/i) ||
          latin1.match(/\/verify\/([A-Za-z0-9_-]+)/i);

        if (match) {
          await handleDecodedText(match[1] || match[0]);
          return;
        }

        // Server pass: handles compressed streams and PDF decompression
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch('/api/verify/scan-file', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        if (data.success && data.certificateId) {
          await handleDecodedText(data.certificateId);
          return;
        } else if (data.error) {
          setFileError(data.error);
          return;
        }
      } catch (err) {
        console.warn('PDF scan failure:', err);
      }

      setFileError(
        'No certificate ID or QR code could be detected in this PDF. Please verify the document or enter the ID manually.'
      );
      setIsFileDecoding(false);
      return;
    }

    // 2. Handle Image Files with multi-pass jsQR scanner
    try {
      const objectUrl = URL.createObjectURL(file);
      const img = new Image();

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image.'));
        img.src = objectUrl;
      });

      const decodedText = scanImageWithJsQR(img);
      URL.revokeObjectURL(objectUrl);

      if (decodedText) {
        await handleDecodedText(decodedText);
        return;
      }

      // Secondary fallback: Html5Qrcode file scan
      try {
        const processorElement = document.getElementById('qr-file-processor');
        if (processorElement) {
          const fileScanner = new Html5Qrcode('qr-file-processor', false);
          try {
            const fallbackText = await fileScanner.scanFile(file, false);
            if (fallbackText) {
              await handleDecodedText(fallbackText);
              return;
            }
          } finally {
            fileScanner.clear();
          }
        }
      } catch {
        // Continue to server fallback
      }

      // Tertiary fallback: Server file parser
      try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch('/api/verify/scan-file', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        if (data.success && data.certificateId) {
          await handleDecodedText(data.certificateId);
          return;
        }
      } catch {
        // ignore
      }

      setFileError(
        'No QR code could be detected in this image. Make sure the code is in clear focus and well-lit, or enter the ID manually.'
      );
    } catch (err) {
      console.warn('Image QR decode failed:', err);
      setFileError(
        'Unable to process this image. Make sure it is a valid picture, or enter the ID manually.'
      );
    } finally {
      setIsFileDecoding(false);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processUploadedFile(file);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processUploadedFile(file);
      e.target.value = '';
    }
  };

  // Mount effect: start camera on open if mode is camera
  useEffect(() => {
    if (mode === 'camera') {
      startCameraScanner();
    }
    return () => {
      stopCameraScanner();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-line bg-surface p-4 shadow-sm sm:p-5',
        className
      )}
    >
      {/* Header with Title and Close button */}
      <div className="flex items-center justify-between pb-3 border-b border-line">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-soft text-brand-strong">
            {mode === 'camera' ? (
              <Camera className="h-4 w-4" aria-hidden />
            ) : (
              <Upload className="h-4 w-4" aria-hidden />
            )}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-ink">
              {mode === 'camera' ? 'Camera scanner' : 'Upload certificate file'}
            </h3>
            <p className="text-2xs text-ink-muted">
              {mode === 'camera'
                ? 'Scan the physical or digital QR code'
                : 'Upload certificate PDF, screenshot, or QR image'}
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={async () => {
            await stopCameraScanner();
            onClose();
          }}
          aria-label="Close scanner"
        >
          <X className="h-4 w-4" aria-hidden />
        </Button>
      </div>

      {/* Mode Selector Tabs */}
      <div className="mt-3 flex items-center justify-center">
        <div className="inline-flex rounded-lg border border-line bg-surface-muted p-0.5">
          <button
            type="button"
            onClick={() => handleSelectMode('camera')}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
              mode === 'camera'
                ? 'bg-surface text-ink shadow-xs'
                : 'text-ink-muted hover:text-ink'
            )}
          >
            <Camera className="h-3.5 w-3.5" aria-hidden />
            Live camera
          </button>
          <button
            type="button"
            onClick={() => handleSelectMode('file')}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
              mode === 'file'
                ? 'bg-surface text-ink shadow-xs'
                : 'text-ink-muted hover:text-ink'
            )}
          >
            <Upload className="h-3.5 w-3.5" aria-hidden />
            Upload PDF or image
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {detectedId && (
        <div className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-success-line bg-success-soft p-3 text-xs font-medium text-success-fg animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
          <span>
            Certificate detected: <strong>{detectedId}</strong>. Loading record...
          </span>
        </div>
      )}

      {/* Mode 1: Live Camera Scanner */}
      {mode === 'camera' && !detectedId && (
        <div className="mt-4 space-y-3">
          <div className="relative aspect-square w-full max-w-[340px] mx-auto overflow-hidden rounded-xl border border-line bg-surface-sunken">
            <div
              id="qr-camera-stream"
              className={cn(
                'h-full w-full overflow-hidden [&_video]:h-full [&_video]:w-full [&_video]:object-cover',
                cameraState !== 'running' && 'hidden'
              )}
            />

            {/* Viewfinder Overlay */}
            {cameraState === 'running' && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="relative h-56 w-56">
                  <div className="absolute top-0 left-0 h-6 w-6 border-t-2 border-l-2 border-brand" />
                  <div className="absolute top-0 right-0 h-6 w-6 border-t-2 border-r-2 border-brand" />
                  <div className="absolute bottom-0 left-0 h-6 w-6 border-b-2 border-l-2 border-brand" />
                  <div className="absolute bottom-0 right-0 h-6 w-6 border-b-2 border-r-2 border-brand" />
                  <div className="absolute inset-x-2 top-0 h-0.5 bg-brand shadow-[0_0_8px_rgba(200,16,46,0.8)] animate-pulse" />
                </div>
              </div>
            )}

            {/* Starting Camera State */}
            {cameraState === 'starting' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 p-4 text-center">
                <Loader2 className="h-6 w-6 animate-spin text-brand" />
                <p className="text-xs font-medium text-ink">Starting camera stream...</p>
                <p className="text-2xs text-ink-muted">
                  Please grant camera permission if prompted by your browser.
                </p>
              </div>
            )}

            {/* Camera Error State */}
            {cameraState === 'error' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-5 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-danger-soft text-danger-fg">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-ink">Camera unavailable</p>
                  <p className="text-2xs leading-relaxed text-ink-muted">
                    {cameraError || 'Unable to access your video stream.'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="default"
                    onClick={() => handleSelectMode('file')}
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Upload PDF or image
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => startCameraScanner()}
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Retry
                  </Button>
                </div>
              </div>
            )}
          </div>

          {cameraState === 'running' && (
            <div className="flex items-center justify-between text-xs text-ink-muted px-1">
              <span>Align the QR code inside the frame</span>
              {cameras.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleSwitchCamera}
                  className="h-7 text-2xs"
                >
                  <FlipHorizontal className="h-3.5 w-3.5" />
                  Switch camera ({selectedCameraIndex + 1}/{cameras.length})
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Mode 2: File Upload / Drag & Drop (Supports PDF, PNG, JPG, WEBP) */}
      {mode === 'file' && !detectedId && (
        <div className="mt-4 space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf,application/pdf"
            onChange={handleFileChange}
            className="hidden"
            id="qr-file-input"
          />

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'group relative flex aspect-square w-full max-w-[340px] mx-auto cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-6 text-center transition-all',
              isDragOver
                ? 'border-brand bg-brand-soft/30'
                : 'border-line hover:border-line-strong hover:bg-surface-muted/50 bg-surface'
            )}
          >
            {isFileDecoding ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-brand" />
                <p className="text-xs font-medium text-ink">Analyzing certificate document...</p>
                <p className="text-2xs text-ink-muted">Checking QR code and credential signatures</p>
              </div>
            ) : (
              <>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-muted text-ink-secondary group-hover:scale-105 group-hover:text-brand transition-transform">
                  <FileText className="h-6 w-6" aria-hidden />
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-semibold text-ink">
                    Drop certificate PDF or image here
                  </p>
                  <p className="text-2xs text-ink-muted">
                    or click to browse from your computer
                  </p>
                </div>

                <p className="text-3xs uppercase tracking-wider text-ink-subtle">
                  Supports PDF, PNG, JPG, JPEG, WEBP
                </p>

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="mt-1 h-7 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  Browse files
                </Button>
              </>
            )}
          </div>

          {fileError && (
            <div className="flex items-start gap-2 rounded-lg border border-danger-line bg-danger-soft p-3 text-xs text-danger-fg">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-danger" />
              <div className="space-y-1 flex-1">
                <p className="font-medium">{fileError}</p>
                <div className="flex gap-2 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-6 text-2xs"
                    onClick={() => handleSelectMode('camera')}
                  >
                    Try camera instead
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hidden processing container for Html5Qrcode fallback */}
      <div
        id="qr-file-processor"
        className="pointer-events-none fixed -left-[9999px] -top-[9999px] h-48 w-48 opacity-0"
        aria-hidden="true"
      />
    </div>
  );
}
