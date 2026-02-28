import { Html5Qrcode } from "html5-qrcode";

let qr: Html5Qrcode | null = null;
let isStarting = false;
let isHandlingScan = false;

export async function startQrScanner(
  onScan: (decodedText: string) => void,
  onError?: (err: string) => void,
) {
  if (qr || isStarting) return;
  isStarting = true;

  try {
    const elementId = "qr-reader";
    qr = new Html5Qrcode(elementId);
    isHandlingScan = false;

    await qr.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      async (decodedText) => {
        if (isHandlingScan) return;
        isHandlingScan = true;

        try {
          onScan(decodedText);
        } catch (e: any) {
          onError?.(e?.message ?? String(e));
        } finally {
          await stopQrScanner(); // stop after first scan
        }
      },
      (errorMessage) => {
        onError?.(errorMessage);
      },
    );
  } catch (e: any) {
    onError?.(e?.message ?? String(e));
    qr = null;
  } finally {
    isStarting = false;
  }
}

export async function stopQrScanner() {
  if (!qr) return;

  try {
    await qr.stop();
  } catch {}

  try {
    await qr.clear();
  } catch {}

  qr = null;
  isHandlingScan = false;
}
