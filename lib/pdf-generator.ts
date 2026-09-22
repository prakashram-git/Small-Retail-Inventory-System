import jsPDF from 'jspdf';

interface ReportData {
  title: string;
  dateRange: string;
  generatedDate: string;
  brandName: string;
  shopLocation: string;
  metrics: {
    totalInventoryValue: string;
    totalSales: string;
    totalSalesUnits: number;
    lowStockCount: number;
    turnoverRatio: number;
  };
  sections: {
    name: string;
    data: { label: string; value: string }[];
  }[];
}

export const generateReportPDF = (reportData: ReportData) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  let yPosition = 15;
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;

  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(reportData.title, margin, yPosition);
  yPosition += 10;

  // Company Info
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`${reportData.brandName} - ${reportData.shopLocation}`, margin, yPosition);
  yPosition += 5;
  doc.text(`Generated: ${reportData.generatedDate}`, margin, yPosition);
  doc.text(`Period: ${reportData.dateRange}`, pageWidth - margin - 50, yPosition);
  yPosition += 10;

  // Metrics Summary
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Key Metrics', margin, yPosition);
  yPosition += 7;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const metricsData = [
    ['Total Inventory Value', reportData.metrics.totalInventoryValue],
    ['Total Sales', reportData.metrics.totalSales],
    ['Sales Units', reportData.metrics.totalSalesUnits.toString()],
    ['Low Stock Items', reportData.metrics.lowStockCount.toString()],
    ['Turnover Ratio', reportData.metrics.turnoverRatio.toFixed(2) + 'x'],
  ];

  let metricY = yPosition;
  metricsData.forEach(([label, value]) => {
    doc.text(label + ':', margin, metricY);
    doc.setFont('helvetica', 'bold');
    doc.text(value, pageWidth - margin - 40, metricY);
    doc.setFont('helvetica', 'normal');
    metricY += 6;
  });
  yPosition = metricY + 5;

  // Report Sections
  reportData.sections.forEach((section) => {
    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 15;
    }

    // Section Title
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(section.name, margin, yPosition);
    yPosition += 6;

    // Section Data
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    section.data.forEach(({ label, value }) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 15;
      }
      doc.text(`${label}:`, margin + 2, yPosition);
      doc.setFont('helvetica', 'bold');
      doc.text(value, margin + 60, yPosition);
      doc.setFont('helvetica', 'normal');
      yPosition += 5;
    });

    yPosition += 4;
  });

  // Footer
  const pageCount = doc.internal.pages.length - 1;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  // Generate filename
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `Report_${timestamp}.pdf`;

  doc.save(filename);
};
