export type QrResult = {
  error?: string;
  value?: string;
};

export function generateQrValue(
  firstName: string,
  lastName: string,
  age: string
): QrResult {
  const parsedAge = Number(age);

  if (!firstName || !lastName || isNaN(parsedAge) || parsedAge <= 0) {
    return { error: "Complete All Fields" };
  }

  if (
    !firstName.trim() ||
    !lastName.trim() ||
    firstName.includes(" ") ||
    lastName.includes(" ")
  ) {
    return { error: "Invalid input, try again" };
  }

  return {
    value: `000001DonGym${firstName}${lastName}${age}`,
  };
}