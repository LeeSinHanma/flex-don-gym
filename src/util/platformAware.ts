import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";

export function getPlatformType(): "web" | "android" | "ios" | string {
  return Capacitor.getPlatform();
}

export function isWebPlatform(): boolean {
  return getPlatformType() === "web";
}

export function isNativePlatform(): boolean {
  return Capacitor.isNativePlatform();
}

export async function downloadOrShareImage(
  dataUrl: string,
  fileName: string,
  title = "QR Code",
  text = "QR Code Image",
) {
  const platform = getPlatformType();

  if (platform === "web") {
    const link = document.createElement("a");
    link.download = fileName;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  const base64Data = dataUrl.split(",")[1];

  const savedFile = await Filesystem.writeFile({
    path: fileName,
    data: base64Data,
    directory: Directory.Cache,
  });

  await Share.share({
    title,
    text,
    url: savedFile.uri,
    dialogTitle: "Save or share image",
  });
}
export {};