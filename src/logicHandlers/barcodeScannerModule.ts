import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";

let barcodeScanner: Html5Qrcode | null = null;
let isStartingBarcode = false;
let isHandlingBarcodeScan = false;

const BARCODE_FORMATS: Html5QrcodeSupportedFormats[] = [
  Html5QrcodeSupportedFormats.CODE_128,
  Html5QrcodeSupportedFormats.CODE_39,
  Html5QrcodeSupportedFormats.EAN_13,
  Html5QrcodeSupportedFormats.EAN_8,
  Html5QrcodeSupportedFormats.UPC_A,
  Html5QrcodeSupportedFormats.UPC_E,
];

export async function startBarcodeScanner(
  elementId: string,
  onScan: (decodedText: string) => void | Promise<void>,
  onError?: (err: string) => void,
  stopAfterScan: boolean = false,
) {
  if (barcodeScanner || isStartingBarcode) return;
  isStartingBarcode = true;

  try {
    barcodeScanner = new Html5Qrcode(elementId, {
      verbose: false,
      formatsToSupport: BARCODE_FORMATS,
    });

    isHandlingBarcodeScan = false;

    await barcodeScanner.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      async (decodedText) => {
        if (isHandlingBarcodeScan) return;
        isHandlingBarcodeScan = true;

        try {
          await Promise.resolve(onScan(decodedText));
        } catch (e: any) {
          onError?.(e?.message ?? String(e));
        } finally {
          if (stopAfterScan) {
            await stopBarcodeScanner();
          } else {
            setTimeout(() => {
              isHandlingBarcodeScan = false;
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
    barcodeScanner = null;
  } finally {
    isStartingBarcode = false;
  }
}

export async function stopBarcodeScanner() {
  if (!barcodeScanner) return;

  try {
    await barcodeScanner.stop();
  } catch {}

  try {
    await barcodeScanner.clear();
  } catch {}

  barcodeScanner = null;
  isHandlingBarcodeScan = false;
}