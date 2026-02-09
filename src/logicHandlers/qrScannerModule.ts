// src/logicHandlers/qrScannerModule.ts
import { Html5Qrcode } from "html5-qrcode";

let qr: Html5Qrcode | null = null;
let isStarting = false;

export async function startQrScanner(
  onScan: (decodedText: string) => void,
  onError?: (err: string) => void
) {
  // Prevent double-start in React strict mode / rerenders
  if (qr || isStarting) return;
  isStarting = true;

  try {
    const elementId = "qr-reader";

    qr = new Html5Qrcode(elementId);

    await qr.start(
      { facingMode: "environment" }, // back camera if available
      { fps: 10, qrbox: 250 },
      (decodedText) => {
        onScan(decodedText);
        stopQrScanner();
      },
      (errorMessage) => {
        // This fires a lot while scanning; usually ignore
        onError?.(errorMessage);
      }
    );
  } catch (e: any) {
    onError?.(e?.message ?? String(e));
    // if start fails, clear instance so you can retry
    qr = null;
  } finally {
    isStarting = false;
  }
}

export async function stopQrScanner() {
  if (!qr) return;

  try {
    await qr.stop();
  } catch {
    // ignore stop errors (not started, already stopped)
  }

  try {
    await qr.clear();
  } catch {
    // ignore clear errors
  }

  qr = null;
}