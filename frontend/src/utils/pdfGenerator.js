import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import pwLogo from '../assets/pw.png'; 
import paidStamp from '../assets/paid.png';   

const COLORS = {
  primary: '#0ea5e9',
  slate900: '#0f172a',
  slate500: '#64748b',
  slate100: '#f1f5f9',
  gold: '#fbbf24'
};

const generateStandardPDF = (options) => {
  const { title, subtitle, documentNo, date, sections, isPaid, footerNote } = options;
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;

  // === Header ===
  // Background Header Bar (Modern Gradient Feel)
  doc.setFillColor(COLORS.slate900);
  doc.rect(0, 0, pageWidth, 45, 'F');
  
  // Decorative Accent Line
  doc.setFillColor(COLORS.primary);
  doc.rect(0, 45, pageWidth, 2, 'F');

  // Logo & Branding
  doc.addImage(pwLogo, 'PNG', margin, 12, 18, 18);
  doc.setFontSize(22);
  doc.setTextColor('#ffffff');
  doc.setFont('helvetica', 'bold');
  doc.text('PropertyWave', margin + 25, 23);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(COLORS.primary);
  doc.text('PREMIUM REAL ESTATE SOLUTIONS', margin + 25, 29);

  // Document Title (Right Aligned in Header)
  doc.setFontSize(16);
  doc.setTextColor('#ffffff');
  doc.setFont('helvetica', 'bold');
  doc.text(title.toUpperCase(), pageWidth - margin, 25, { align: 'right' });

  // === Metadata (Under Header) ===
  let currentY = 65;
  
  doc.setFontSize(10);
  doc.setTextColor(COLORS.slate500);
  doc.setFont('helvetica', 'bold');
  doc.text('REF NO:', margin, currentY);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(COLORS.slate900);
  doc.text(documentNo, margin + 25, currentY);

  doc.setTextColor(COLORS.slate500);
  doc.setFont('helvetica', 'bold');
  doc.text('DATE:', pageWidth - margin - 50, currentY);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(COLORS.slate900);
  doc.text(date || new Date().toLocaleDateString(), pageWidth - margin, currentY, { align: 'right' });

  currentY += 15;

  // Subtitle / Intro
  if (subtitle) {
    doc.setFontSize(12);
    doc.setTextColor(COLORS.slate900);
    doc.setFont('helvetica', 'bold');
    doc.text(subtitle, margin, currentY);
    currentY += 8;
    
    doc.setDrawColor(COLORS.slate100);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 10;
  }

  // === Content Sections ===
  sections.forEach((section) => {
    // Section Title
    doc.setFillColor(COLORS.slate100);
    doc.roundedRect(margin, currentY, pageWidth - margin * 2, 10, 1, 1, 'F');
    doc.setFontSize(10);
    doc.setTextColor(COLORS.slate900);
    doc.setFont('helvetica', 'bold');
    doc.text(section.title.toUpperCase(), margin + 5, currentY + 6.5);
    
    currentY += 14;

    // Section Table
    autoTable(doc, {
      startY: currentY,
      body: section.data,
      theme: 'plain',
      styles: { 
        fontSize: 10, 
        cellPadding: 4,
        textColor: COLORS.slate900,
        font: 'helvetica'
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 55, textColor: COLORS.slate500 },
        1: { cellWidth: 'auto' }
      },
      margin: { left: margin + 2 },
      tableWidth: pageWidth - margin * 2 - 4
    });

    currentY = doc.lastAutoTable.finalY + 15;
  });

  // === Paid Stamp ===
  if (isPaid) {
    const stampWidth = 45;
    const stampHeight = 22;
    doc.addImage(paidStamp, 'PNG', pageWidth - margin - stampWidth - 10, currentY - 5, stampWidth, stampHeight);
  }

  // === Footer (Mimics Navbar/Footer) ===
  const footerY = pageHeight - 35;
  
  // Footer Decorative Bar
  doc.setFillColor(COLORS.slate900);
  doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');
  doc.setFillColor(COLORS.primary);
  doc.rect(0, pageHeight - 17, pageWidth, 2, 'F');

  doc.setDrawColor(COLORS.slate100);
  doc.line(margin, footerY, pageWidth - margin, footerY);
  
  doc.setFontSize(9);
  doc.setTextColor(COLORS.slate500);
  doc.setFont('helvetica', 'italic');
  doc.text(footerNote || 'This is a computer-generated document. Secure Digital Verification.', margin, pageHeight - 25);
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor('#ffffff');
  doc.text('PropertyWave Management © 2024', margin, pageHeight - 6);
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Page 1 of 1`, pageWidth - margin, pageHeight - 6, { align: 'right' });

  return doc;
};

// Specialized generator for Payment Receipts
const generatePaymentHistoryPDF = (payment, user) => {
  return generateStandardPDF({
    title: 'Transaction Statement',
    subtitle: `Payment execution for: ${payment.propertyId?.title || 'N/A'}`,
    documentNo: payment._id.toUpperCase(),
    date: new Date(payment.createdAt).toLocaleDateString(),
    isPaid: payment.status === 'completed',
    sections: [
      {
        title: 'Asset Specifications',
        data: [
          ['Property Title', payment.propertyId?.title || 'N/A'],
          ['Location / Region', payment.propertyId?.location || 'N/A'],
          ['Asset Classification', payment.propertyId?.type || 'N/A'],
          ['Spatial Metrics', `${payment.propertyId?.area || 'N/A'} SQFT`],
          ['Executive Contact', payment.propertyId?.phone || 'N/A']
        ]
      },
      {
        title: 'Financial Parameters',
        data: [
          ['Transaction Amount', `৳${payment.amount}`],
          ['Currency Class', 'BDT (Bangladesh Taka)'],
          ['Payment Protocol', 'Wallet Coin Nexus'],
          ['Authorization Status', payment.status.toUpperCase()]
        ]
      },
      {
        title: 'Entity Profile',
        data: [
          ['Legal Name', user.name],
          ['Digital Identity', user.email],
          ['System Role', user.role.toUpperCase()]
        ]
      }
    ]
  });
};

// Specialized generator for Asset Approvals (Landlord & Tenant)
const generateApprovalNoticePDF = (request) => {
  return generateStandardPDF({
    title: 'Asset Authorization',
    subtitle: 'Certificate of Residency Approval',
    documentNo: request._id.toUpperCase(),
    date: new Date(request.createdAt).toLocaleDateString(),
    footerNote: 'This authorization confirms the preliminary verification of the residency request.',
    sections: [
      {
        title: 'Authorized Asset',
        data: [
          ['Property Title', request.propertyId?.title || 'N/A'],
          ['Location', request.propertyId?.location || 'N/A'],
          ['Physical Address', request.propertyId?.address || 'N/A'],
          ['Specifications', `${request.propertyId?.rooms}R • ${request.propertyId?.bathrooms}B • ${request.propertyId?.area}SQFT`]
        ]
      },
      {
        title: 'Applicant Narrative',
        data: [
          ['Tenant Identity', request.tenantName],
          ['Digital Address', request.tenantEmail],
          ['Contact Line', request.tenantPhone]
        ]
      },
      {
        title: 'Financial Obligations',
        data: [
          ['Monthly Yield', `৳${request.propertyId?.price}`],
          ['Advance Lock', `৳${request.propertyId?.advance}`],
          ['Billing Cycle', request.propertyId?.rentType || 'Monthly']
        ]
      }
    ]
  });
};

export { generatePaymentHistoryPDF, generateApprovalNoticePDF };
