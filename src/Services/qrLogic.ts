// QR Code Logic - Generation and Decoding
export interface MemberQRData {
  memberId: string;
  memberName: string;
  membershipType: string;
  expiryDate: string;
  generatedAt: string;
}

export interface QRDecodeResult {
  success: boolean;
  data?: MemberQRData;
  error?: string;
}

/**
 * Generate QR code data string from member info
 */
export const generateQRData = (memberData: {
  memberId: string;
  memberName: string;
  membershipType: string;
  expiryDate: string;
}): string => {
  const qrData: MemberQRData = {
    ...memberData,
    generatedAt: new Date().toISOString(),
  };

  return JSON.stringify(qrData);
};

/**
 * Decode QR code string to member data
 */
export const decodeQRData = (qrString: string): QRDecodeResult => {
  try {
    const data = JSON.parse(qrString) as MemberQRData;

    // Validate required fields
    if (!data.memberId || !data.memberName || !data.expiryDate) {
      return {
        success: false,
        error: 'Invalid QR code format - missing required fields',
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('QR decode error:', error);
    return {
      success: false,
      error: 'Failed to decode QR code',
    };
  }
};

/**
 * Check if member's QR code is still valid
 */
export const isQRValid = (qrData: MemberQRData): boolean => {
  try {
    const expiryDate = new Date(qrData.expiryDate);
    const now = new Date();
    return expiryDate > now;
  } catch (error) {
    console.error('QR validation error:', error);
    return false;
  }
};

/**
 * Get membership status from QR data
 */
export const getMembershipStatus = (qrData: MemberQRData): 'active' | 'expired' | 'expiring-soon' => {
  try {
    const expiryDate = new Date(qrData.expiryDate);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) {
      return 'expired';
    } else if (daysUntilExpiry <= 7) {
      return 'expiring-soon';
    } else {
      return 'active';
    }
  } catch (error) {
    console.error('Status check error:', error);
    return 'expired';
  }
};

/**
 * Format QR data for display
 */
export const formatQRDataForDisplay = (qrData: MemberQRData) => {
  const status = getMembershipStatus(qrData);
  const expiryDate = new Date(qrData.expiryDate);

  return {
    memberId: qrData.memberId,
    memberName: qrData.memberName,
    membershipType: qrData.membershipType,
    expiryDate: expiryDate.toLocaleDateString(),
    status,
    isValid: isQRValid(qrData),
  };
};
