import { useEffect, useState, useRef } from "react";
import { Modal } from "./Modals";
import { Button } from "./Button";
import {
  startBarcodeScanner,
  stopBarcodeScanner,
} from "../../logicHandlers/barcodeScannerModule";
import scanSound from "../../resource/scanSound.mp3";

interface BarcodeScanModalProps {
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  onScanned: (value: string) => void;
}

const BarcodeScanModal: React.FC<BarcodeScanModalProps> = ({
  isOpen,
  title = "Scan Barcode",
  onClose,
  onScanned,
}) => {
  const [scanError, setScanError] = useState("");
  const [isStarting, setIsStarting] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(scanSound);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    let mounted = true;

    const startScanner = async () => {
      setScanError("");
      setIsStarting(true);

      setTimeout(async () => {
        if (!mounted) return;

        try {
          await startBarcodeScanner(
            "barcode-scan-modal-reader",
            async (decodedText: string) => {

              // 🔊 play sound
              try {
                audioRef.current?.play();
              } catch (e) {
                console.warn("Sound play failed:", e);
              }

              onScanned(decodedText);
              await stopBarcodeScanner();
              onClose();
            },
            (err: string) => {
              setScanError(err || "Scanning failed.");
            },
            true
          );
        } catch (error: any) {
          setScanError(error?.message || "Failed to start scanner.");
        } finally {
          if (mounted) {
            setIsStarting(false);
          }
        }
      }, 100);
    };

    startScanner();

    return () => {
      mounted = false;
      stopBarcodeScanner();
    };
  }, [isOpen, onClose, onScanned]);

  const handleClose = async () => {
    await stopBarcodeScanner();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      showCloseButton={false}
      className="confirm-modals"
    >
      <div className="barcode-modal-content">
        <div id="barcode-scan-modal-reader" className="barcode-modal-reader" />

        {isStarting && <p className="barcode-scan-text">Starting scanner...</p>}

        {scanError && <p className="barcode-scan-error">{scanError}</p>}

        <div className="barcode-modal-actions">
          <Button
            type="button"
            className="btn-modal btn-submit-modal"
            onClick={handleClose}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default BarcodeScanModal;