# QR Code Generator Component - User Guide

## Overview
A reusable QR code generator component that automatically creates QR codes for new members in both Admin and Employee interfaces. The QR codes contain encrypted member data that can be scanned for check-in verification.

---

## 🎯 Features

✅ **Automatic Generation** - QR code auto-generates when a new member is added  
✅ **Member Data Encoding** - Stores member ID, name, membership type, and expiry date  
✅ **Download Capability** - Download QR code as PNG image  
✅ **Share Functionality** - Share QR code via native share API  
✅ **Responsive Design** - Works on mobile and desktop  
✅ **Reusable** - Single component used across Admin and Employee pages

---

## 📦 Component Location

```
src/components/Reusable/QRCodeGenerator.tsx
src/components/Reusable/QRCodeGenerator.css
```

---

## 🔧 How It Works

### 1. **Data Encoding**
The component uses the `generateQRData` function from `src/Services/qrLogic.ts` to create a JSON string containing:
- Member ID
- Member Name
- Membership Type
- Expiry Date
- Generation Timestamp

### 2. **QR Code Generation**
Uses the `qrcode` library to convert the JSON string into a scannable QR code image.

### 3. **Display & Actions**
- Shows member information
- Displays generated QR code
- Provides download and share buttons

---

## 💻 Usage

### Admin Page (customers.tsx)

**When it triggers:**
- Automatically shows QR code modal after adding a new member
- Can be manually triggered by clicking "Generate QR" button on existing members

**Code Example:**
```tsx
import QRCodeGenerator from "../../components/Reusable/QRCodeGenerator";

// In your component
const [showQRModal, setShowQRModal] = useState(false);
const [selectedMember, setSelectedMember] = useState<Member | null>(null);

// After adding a new member
const handleSaveMember = () => {
  // ... member creation logic ...
  setMembers([...members, newMember]);
  setShowModal(false);
  
  // Auto-generate QR code for new member
  setSelectedMember(newMember);
  setShowQRModal(true);
};

// In your JSX
<QRCodeGenerator
  isOpen={showQRModal}
  onClose={() => setShowQRModal(false)}
  memberData={selectedMember ? {
    id: selectedMember.id,
    name: selectedMember.name,
    email: selectedMember.email,
    membershipType: selectedMember.membershipType,
    expiryDate: selectedMember.expiryDate,
    status: selectedMember.status,
  } : null}
/>
```

### Employee Page (Member.tsx)

**When it triggers:**
- Automatically shows QR code modal after registering a new member

**Code Example:**
```tsx
import QRCodeGenerator from "../../components/Reusable/QRCodeGenerator";

// In your component
const [showQRModal, setShowQRModal] = useState(false);
const [selectedMember, setSelectedMember] = useState<Member | null>(null);

// After adding a member
const handleAddMember = () => {
  // ... member creation logic ...
  setMembers((prev) => [newMember, ...prev]);
  setShowModal(false);
  
  // Auto-generate QR code for new member
  setSelectedMember(newMember);
  setShowQRModal(true);
};

// In your JSX
<QRCodeGenerator
  isOpen={showQRModal}
  onClose={() => setShowQRModal(false)}
  memberData={selectedMember ? {
    id: selectedMember.id,
    name: selectedMember.name,
    email: selectedMember.email,
    membershipType: selectedMember.membershipType,
    expiryDate: selectedMember.expiryDate,
    status: selectedMember.status,
  } : null}
/>
```

---

## 📋 Props Interface

```typescript
interface QRCodeGeneratorProps {
  isOpen: boolean;              // Controls modal visibility
  onClose: () => void;          // Callback when modal closes
  memberData: {                 // Member information for QR code
    id: number | string;
    name: string;
    email?: string;
    membershipType: string;
    expiryDate: string;
    status?: string;
  } | null;
}
```

---

## 🎨 QR Code Data Structure

The QR code contains JSON data in this format:

```json
{
  "memberId": "M001",
  "memberName": "John Doe",
  "membershipType": "Monthly",
  "expiryDate": "2024-12-31",
  "generatedAt": "2024-02-24T22:00:00.000Z"
}
```

This data can be scanned and decoded using the `decodeQRData` function from `src/Services/qrLogic.ts`.

---

## 📱 User Flow

### Admin Adding a Member:
1. Admin clicks "Add Member" button
2. Fills in member form (name, email, phone, membership type)
3. Clicks "Add Member" button
4. **QR Code modal automatically appears**
5. Admin can download or share the QR code
6. Admin closes modal when done

### Employee Registering a Member:
1. Employee clicks "Add Member" button
2. Fills in registration form
3. Clicks "Add Member" button
4. Success toast appears
5. **QR Code modal automatically appears**
6. Employee can download or share the QR code
7. Employee closes modal when done

---

## 🔄 Integration Points

### Pages Using QR Generator:
- ✅ `src/pages/AdminPage/customers.tsx` - Admin member management
- ✅ `src/pages/EmployeePage/Member.tsx` - Employee member registration

### Related Services:
- `src/Services/qrLogic.ts` - QR data encoding/decoding logic
- `qrcode` package - QR code image generation

---

## 🎯 Benefits

1. **Consistency** - Same QR generation logic across all pages
2. **User Experience** - Automatic QR code creation after member registration
3. **Convenience** - Download and share capabilities built-in
4. **Maintainability** - Single source of truth for QR generation
5. **Type Safety** - Full TypeScript support
6. **Mobile Friendly** - Responsive design works on all devices

---

## 🚀 Future Enhancements

Potential improvements:
- [ ] Print QR code functionality
- [ ] Bulk QR code generation for multiple members
- [ ] Custom QR code styling (colors, logos)
- [ ] Email QR code to member automatically
- [ ] QR code expiry/refresh mechanism
- [ ] Analytics tracking for QR code usage

---

## 🧪 Testing

To test the QR code generator:

1. **Admin Side:**
   - Go to Admin → Members
   - Click "Add Member"
   - Fill in the form and save
   - QR modal should appear automatically

2. **Employee Side:**
   - Go to Employee → Members
   - Click "Add Member"
   - Fill in the form and save
   - QR modal should appear automatically

3. **Verify QR Code:**
   - Download the QR code
   - Scan with a QR scanner app
   - Verify the JSON data is correct

---

## 📞 Support

For issues or questions about the QR code generator, check:
- Component file: `src/components/Reusable/QRCodeGenerator.tsx`
- QR logic: `src/Services/qrLogic.ts`
- Usage examples in this guide

---

**Created:** February 24, 2024  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
