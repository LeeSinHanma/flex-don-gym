import { Html5Qrcode } from "html5-qrcode";

let qrInstance: Html5Qrcode | null = null;

const REGION_ID = "qr-reader";

export async function startQrScanner(
  onSuccess: (text: string) => void,
  onError?: (err: string) => void
) {
  try {
    if (!qrInstance) {
      qrInstance = new Html5Qrcode(REGION_ID);
    }

    await qrInstance.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },
      (decodedText) => {
        if (!decodedText.startsWith("000001DonGym")) return;
        onSuccess(decodedText);
      },
      () => {}
    );
  } catch (e: any) {
    onError?.(e?.message || "Failed to start scanner");
  }
}

export async function stopQrScanner() {
  if (qrInstance) {
    try {
      await qrInstance.stop();
      await qrInstance.clear();
    } catch {}
  }
}