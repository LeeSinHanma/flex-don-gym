/**
 * Email Preset Handler
 * Manages email presets for QR code emails
 */

export interface EmailPreset {
  subject: string;
  bodyTemplate: string;
}

const STORAGE_KEY = "email_preset";

const DEFAULT_PRESET: EmailPreset = {
  subject: "DONDON'S FITNESS GYM QR Code",
  bodyTemplate: [
    "Hi {memberName},",
    "",
    "Attached is your QR code for gym access.",
    "",
    "If the attachment does not open, please save the image and keep it available on your device.",
  ].join("\n"),
};

/**
 * Get the current email preset from localStorage, or return default
 */
export const getEmailPreset = (): EmailPreset => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to parse email preset:", error);
  }
  return DEFAULT_PRESET;
};

/**
 * Save email preset to localStorage
 */
export const saveEmailPreset = (preset: EmailPreset): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preset));
  } catch (error) {
    console.error("Failed to save email preset:", error);
  }
};

/**
 * Reset to default email preset
 */
export const resetEmailPreset = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

/**
 * Format email body with member name
 */
export const formatEmailBody = (template: string, memberName: string): string => {
  return template.replace("{memberName}", memberName || "Member");
};
