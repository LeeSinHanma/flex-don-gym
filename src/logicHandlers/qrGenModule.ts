export type QrInput = {
  firstName: string;
  lastName: string;
  age: string | number;
};

export type QrResult =
  | { ok: true; value: string }
  | { ok: false; error: string };

export function generateGymQr(input: QrInput): QrResult {
  const firstName = (input.firstName ?? "").trim();
  const lastName = (input.lastName ?? "").trim();
  const ageNum = Number(input.age);

  // required fields
  if (!firstName || !lastName || !input.age || ageNum <= 0) {
    return { ok: false, error: "Complete All Fields" };
  }

  // no spaces inside names (like "Ken Ken")
  if (firstName.includes(" ") || lastName.includes(" ")) {
    return { ok: false, error: "Invalid input, try again" };
  }

  const formatted = `000001DonGym${firstName}${lastName}${ageNum}`;
  return { ok: true, value: formatted };
}