import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";

let qrScanner: Html5Qrcode | null = null;
let isStartingQr = false;
let isHandlingQrScan = false;

const QR_FORMATS: Html5QrcodeSupportedFormats[] = [
  Html5QrcodeSupportedFormats.QR_CODE,
];

export async function startQrScanner(
  elementId: string,
  onScan: (decodedText: string) => void | Promise<void>,
  onError?: (err: string) => void,
  stopAfterScan: boolean = false,
) {
  if (qrScanner || isStartingQr) return;
  isStartingQr = true;

  try {
    qrScanner = new Html5Qrcode(elementId, {
      verbose: false,
      formatsToSupport: QR_FORMATS,
    });

    isHandlingQrScan = false;

    await qrScanner.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      async (decodedText) => {
        if (isHandlingQrScan) return;
        isHandlingQrScan = true;

        try {
          await Promise.resolve(onScan(decodedText));
        } catch (e: any) {
          onError?.(e?.message ?? String(e));
        } finally {
          if (stopAfterScan) {
            await stopQrScanner();
          } else {
            setTimeout(() => {
              isHandlingQrScan = false;
            }, 1500);
          }
        }
      },
      () => {
        // ignore scan noise
      },
    );
  } catch (e: any) {
    onError?.(e?.message ?? String(e));
    qrScanner = null;
  } finally {
    isStartingQr = false;
  }
}

export async function stopQrScanner() {
  if (!qrScanner) return;

  try {
    await qrScanner.stop();
  } catch {}

  try {
    await qrScanner.clear();
  } catch {}

  qrScanner = null;
  isHandlingQrScan = false;
}