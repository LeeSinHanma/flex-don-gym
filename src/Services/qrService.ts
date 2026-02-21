// QR Service - API calls for QR code management
import { MemberQRData } from './qrLogic';

export interface QRCheckInResult {
  success: boolean;
  memberId?: string;
  memberName?: string;
  timestamp?: string;
  message?: string;
}

/**
 * QR Service for managing member check-ins and QR codes
 */
class QRService {
  private apiUrl = 'http://localhost:3000/api'; // Replace with actual API URL

  /**
   * Record member check-in via QR scan
   */
  async checkIn(qrData: MemberQRData): Promise<QRCheckInResult> {
    try {
      // Mock API call - replace with actual fetch
      // const response = await fetch(`${this.apiUrl}/checkin`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(qrData),
      // });
      // const data = await response.json();

      // Mock implementation
      const timestamp = new Date().toISOString();
      
      // Store check-in locally
      const checkIns = this.getCheckIns();
      checkIns.push({
        ...qrData,
        checkInTime: timestamp,
      });
      localStorage.setItem('flexdon_checkins', JSON.stringify(checkIns));

      return {
        success: true,
        memberId: qrData.memberId,
        memberName: qrData.memberName,
        timestamp,
        message: 'Check-in successful',
      };
    } catch (error) {
      console.error('Check-in error:', error);
      return {
        success: false,
        message: 'Failed to record check-in',
      };
    }
  }

  /**
   * Get check-in history
   */
  getCheckIns(): any[] {
    try {
      const stored = localStorage.getItem('flexdon_checkins');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading check-ins:', error);
      return [];
    }
  }

  /**
   * Get today's check-ins
   */
  getTodayCheckIns(): any[] {
    const allCheckIns = this.getCheckIns();
    const today = new Date().toDateString();

    return allCheckIns.filter((checkIn) => {
      const checkInDate = new Date(checkIn.checkInTime).toDateString();
      return checkInDate === today;
    });
  }

  /**
   * Get check-in count for a specific member
   */
  getMemberCheckInCount(memberId: string, days: number = 30): number {
    const allCheckIns = this.getCheckIns();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return allCheckIns.filter((checkIn) => {
      const checkInDate = new Date(checkIn.checkInTime);
      return checkIn.memberId === memberId && checkInDate >= cutoffDate;
    }).length;
  }

  /**
   * Generate QR code for member
   */
  async generateMemberQR(memberId: string): Promise<{ success: boolean; qrData?: string }> {
    try {
      // Mock API call - replace with actual fetch
      // const response = await fetch(`${this.apiUrl}/members/${memberId}/qr`, {
      //   method: 'GET',
      // });
      // const data = await response.json();

      // Mock implementation
      return {
        success: true,
        qrData: JSON.stringify({
          memberId,
          generatedAt: new Date().toISOString(),
        }),
      };
    } catch (error) {
      console.error('QR generation error:', error);
      return {
        success: false,
      };
    }
  }

  /**
   * Clear all check-in history (admin only)
   */
  clearCheckIns(): void {
    localStorage.removeItem('flexdon_checkins');
  }
}

export default new QRService();
