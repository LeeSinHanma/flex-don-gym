export type QrInput = {
  firstName: string;
  lastName: string;
  contactNumber?: string; // optional (since you have it)
};

export type QrResult =
  | { ok: true; value: string }
  | { ok: false; error: string };

export function generateGymQr(input: QrInput): QrResult {
  const firstName = (input.firstName ?? "").trim();
  const lastName = (input.lastName ?? "").trim();
  const contact = (input.contactNumber ?? "").trim();

  // required fields (match your MemberMenu)
  if (!firstName || !lastName) {
    return { ok: false, error: "Complete All Fields" };
  }

  // no spaces inside names (like "Ken Ken")
  if (firstName.includes(" ") || lastName.includes(" ")) {
    return { ok: false, error: "Invalid input, try again" };
  }

  // ✅ QR value format (simple + parseable)
  // if contact exists, include it so it's more unique
  const value = contact
    ? `${firstName}-${lastName}-${contact}`
    : `${firstName}-${lastName}`;

  return { ok: true, value };
}