import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";

let qr: Html5Qrcode | null = null;
let isStarting = false;
let isHandlingScan = false;

export type ScanMode = "member" | "product";

const FORMATS: Record<ScanMode, Html5QrcodeSupportedFormats[]> = {
  member: [Html5QrcodeSupportedFormats.QR_CODE],
  product: [
    Html5QrcodeSupportedFormats.CODE_128,
    Html5QrcodeSupportedFormats.CODE_39,
    Html5QrcodeSupportedFormats.EAN_13,
    Html5QrcodeSupportedFormats.EAN_8,
    Html5QrcodeSupportedFormats.UPC_A,
    Html5QrcodeSupportedFormats.UPC_E,
  ],
};

export async function startQrScanner(
  mode: ScanMode,
  onScan: (decodedText: string) => void,
  onError?: (err: string) => void,
) {
  if (qr || isStarting) return;
  isStarting = true;

  try {
    const elementId = "qr-reader";

    // ✅ In your version, "verbose" is required by typings
    qr = new Html5Qrcode(elementId, {
      verbose: false,
      formatsToSupport: FORMATS[mode],
      // optional (if supported in your version):
      // useBarCodeDetectorIfSupported: true,
    });

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
      (errorMessage) => onError?.(errorMessage),
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
