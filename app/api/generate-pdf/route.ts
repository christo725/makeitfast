import { NextRequest, NextResponse } from 'next/server';
import jsPDF from 'jspdf';

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();

    const doc = new jsPDF();

    let yPosition = 20;
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);
    const lineHeight = 7;

    // Add title
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Make It Fast Summary', margin, yPosition);
    yPosition += 10;

    // Add export date and time
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const now = new Date();
    const dateTimeString = now.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    doc.text(`Exported: ${dateTimeString}`, margin, yPosition);
    yPosition += 15;

    // Parse content sections
    const sections = content.split('\n\n');

    for (const section of sections) {
      if (!section.trim()) continue;

      const lines = section.split('\n');
      const sectionTitle = lines[0];

      // Check if we need a new page
      if (yPosition + 20 > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }

      // Determine if this is a section header
      if (sectionTitle.endsWith(':') && !sectionTitle.startsWith('•')) {
        // Section header
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(sectionTitle, margin, yPosition);
        yPosition += 10;

        // Section content
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');

        for (let i = 1; i < lines.length; i++) {
          const line = lines[i];

          // Check if we need a new page
          if (yPosition + lineHeight > pageHeight - margin) {
            doc.addPage();
            yPosition = margin;
          }

          if (line.startsWith('• ')) {
            // Bullet point
            const bulletText = line.substring(2);
            const wrappedLines = doc.splitTextToSize(bulletText, maxWidth - 10);

            // Draw bullet
            doc.circle(margin + 2, yPosition - 2, 1, 'F');

            // Draw text with proper wrapping
            wrappedLines.forEach((wrappedLine: string) => {
              if (yPosition + lineHeight > pageHeight - margin) {
                doc.addPage();
                yPosition = margin;
              }
              doc.text(wrappedLine, margin + 8, yPosition);
              yPosition += lineHeight;
            });

            yPosition += 2; // Extra space after bullet
          } else {
            // Regular text
            const wrappedLines = doc.splitTextToSize(line, maxWidth);
            wrappedLines.forEach((wrappedLine: string) => {
              if (yPosition + lineHeight > pageHeight - margin) {
                doc.addPage();
                yPosition = margin;
              }
              doc.text(wrappedLine, margin, yPosition);
              yPosition += lineHeight;
            });
          }
        }
      } else {
        // Regular paragraph
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        const wrappedLines = doc.splitTextToSize(section, maxWidth);

        wrappedLines.forEach((wrappedLine: string) => {
          if (yPosition + lineHeight > pageHeight - margin) {
            doc.addPage();
            yPosition = margin;
          }
          doc.text(wrappedLine, margin, yPosition);
          yPosition += lineHeight;
        });
      }

      yPosition += 8; // Space between sections
    }

    // Generate PDF as buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="make-it-fast-summary.pdf"',
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}