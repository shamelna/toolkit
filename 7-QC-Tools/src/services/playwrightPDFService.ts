// PDF Section types
export interface PDFSection {
  heading?: string;
  text?: string;
  stats?: Record<string, string | number>;
  table?: { headers: string[]; rows: (string | number)[][] };
  list?: string[];
}

async function captureElementAsBase64(elementId: string): Promise<string> {
  const element = document.getElementById(elementId);
  if (!element) throw new Error(`Element ${elementId} not found`);

  // Hide UI-only elements before capture
  const hidden = Array.from(element.querySelectorAll<HTMLElement>('[data-no-print]'));
  hidden.forEach(el => { el.style.visibility = 'hidden'; });

  const html2canvas = (await import('html2canvas')).default;
  const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });

  // Restore hidden elements
  hidden.forEach(el => { el.style.visibility = ''; });

  return canvas.toDataURL('image/png');
}

const MARGIN = 14;
const YELLOW: [number, number, number] = [255, 213, 89];
const DARK: [number, number, number] = [26, 26, 26];
const LIGHT: [number, number, number] = [245, 245, 245];

function drawPageHeader(pdf: any, toolName: string, date: string) {
  const W = pdf.internal.pageSize.getWidth();
  pdf.setFillColor(...DARK);
  pdf.rect(0, 0, W, 22, 'F');
  pdf.setFillColor(...YELLOW);
  pdf.rect(0, 22, W, 2.5, 'F');
  pdf.setTextColor(...YELLOW);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('KAIZEN ACADEMY', MARGIN, 9);
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(8.5);
  pdf.setFont('helvetica', 'normal');
  pdf.text(toolName, MARGIN, 16.5);
  pdf.setTextColor(160, 160, 160);
  pdf.setFontSize(8);
  pdf.text(date, W - MARGIN, 16.5, { align: 'right' });
}

function drawPageFooter(pdf: any, pageNum: number) {
  const W = pdf.internal.pageSize.getWidth();
  const H = pdf.internal.pageSize.getHeight();
  pdf.setDrawColor(220, 220, 220);
  pdf.setLineWidth(0.3);
  pdf.line(MARGIN, H - 10, W - MARGIN, H - 10);
  pdf.setFontSize(7.5);
  pdf.setTextColor(160, 160, 160);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Kaizen Academy Toolkit  ·  kaizenacademy.education', MARGIN, H - 5.5);
  pdf.text(`Page ${pageNum}`, W - MARGIN, H - 5.5, { align: 'right' });
}

async function buildRichPDF(reportData: any, chartImage: string | null, filename: string) {
  const { jsPDF } = await import('jspdf');
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = pdf.internal.pageSize.getWidth();
  const H = pdf.internal.pageSize.getHeight();
  const CONTENT_W = W - MARGIN * 2;

  let y = 0;
  let pageNum = 1;

  const newPage = () => {
    drawPageFooter(pdf, pageNum);
    pdf.addPage();
    pageNum++;
    drawPageHeader(pdf, reportData.toolName || '', reportData.date || '');
    y = 32;
  };

  const check = (needed: number) => {
    if (y + needed > H - 14) newPage();
  };

  const sectionBar = (title: string) => {
    check(10);
    pdf.setFillColor(...DARK);
    pdf.rect(MARGIN, y, CONTENT_W, 7.5, 'F');
    pdf.setFillColor(...YELLOW);
    pdf.rect(MARGIN, y, 3, 7.5, 'F');
    pdf.setFontSize(8.5);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...YELLOW);
    pdf.text(title.toUpperCase(), MARGIN + 6, y + 5.3);
    y += 10;
  };

  // ── Page 1 Header ──
  drawPageHeader(pdf, reportData.toolName || reportData.title || 'Report', reportData.date || new Date().toLocaleDateString());
  y = 30;

  // ── Report Title ──
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...DARK);
  pdf.text(reportData.title || 'Analysis Report', MARGIN, y);
  y += 3;
  pdf.setFillColor(...YELLOW);
  pdf.rect(MARGIN, y, CONTENT_W, 1, 'F');
  y += 6;

  // ── Executive Summary ──
  if (reportData.executive_summary) {
    pdf.setFontSize(8.5);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(70, 70, 70);
    const lines = pdf.splitTextToSize(reportData.executive_summary, CONTENT_W);
    check(lines.length * 4.5 + 4);
    pdf.text(lines, MARGIN, y);
    y += lines.length * 4.5 + 5;
  }

  // ── Chart Image ──
  if (chartImage) {
    const img = new Image();
    img.src = chartImage;
    await new Promise<void>(res => { img.onload = () => res(); img.onerror = () => res(); });
    const rawH = img.naturalHeight > 0 ? (img.naturalHeight * CONTENT_W) / img.naturalWidth : 70;
    const imgH = Math.min(rawH, 88);
    check(imgH + 6);
    // Light border box
    pdf.setDrawColor(220, 220, 220);
    pdf.setLineWidth(0.3);
    pdf.rect(MARGIN, y, CONTENT_W, imgH + 2, 'S');
    pdf.addImage(chartImage, 'PNG', MARGIN + 1, y + 1, CONTENT_W - 2, imgH);
    y += imgH + 5;
    if (reportData.chart_caption) {
      pdf.setFontSize(7.5);
      pdf.setTextColor(130, 130, 130);
      pdf.text(reportData.chart_caption, MARGIN, y);
      y += 5;
    }
  }

  // ── Sections ──
  const sections: PDFSection[] = reportData.data?.sections || [];
  for (const section of sections) {

    if (section.heading) sectionBar(section.heading);

    if (section.text) {
      pdf.setFontSize(8.5);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(60, 60, 60);
      const lines = pdf.splitTextToSize(section.text, CONTENT_W - 4);
      check(lines.length * 4.5 + 3);
      pdf.text(lines, MARGIN + 2, y);
      y += lines.length * 4.5 + 4;
    }

    if (section.stats) {
      const entries = Object.entries(section.stats);
      const colW = (CONTENT_W - 4) / 2;
      let col = 0;
      let rowStartY = y;

      for (const [key, val] of entries) {
        check(9);
        if (col === 0) rowStartY = y;
        const xOff = MARGIN + 2 + col * (colW + 4);

        pdf.setFillColor(...LIGHT);
        pdf.rect(xOff, rowStartY, colW, 8, 'F');
        pdf.setDrawColor(225, 225, 225);
        pdf.setLineWidth(0.2);
        pdf.rect(xOff, rowStartY, colW, 8, 'S');

        pdf.setFontSize(7.5);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(130, 130, 130);
        pdf.text(String(key), xOff + 2.5, rowStartY + 3.2);

        pdf.setFontSize(8.5);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(...DARK);
        const valStr = String(val).substring(0, 28);
        pdf.text(valStr, xOff + 2.5, rowStartY + 6.8);

        col++;
        if (col === 2) { col = 0; y = rowStartY + 9; }
      }
      if (col !== 0) y = rowStartY + 9;
      y += 2;
    }

    if (section.table) {
      const { headers, rows } = section.table;
      const colW = CONTENT_W / headers.length;

      // Header row
      check(8);
      pdf.setFillColor(...DARK);
      pdf.rect(MARGIN, y, CONTENT_W, 7, 'F');
      pdf.setFontSize(7.5);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...YELLOW);
      headers.forEach((h: string, i: number) => {
        pdf.text(String(h).substring(0, 14), MARGIN + i * colW + 2, y + 4.8);
      });
      y += 7;

      rows.forEach((row: (string | number)[], ri: number) => {
        check(5.5);
        if (ri % 2 === 0) {
          pdf.setFillColor(248, 248, 248);
          pdf.rect(MARGIN, y, CONTENT_W, 5.5, 'F');
        }
        pdf.setDrawColor(232, 232, 232);
        pdf.setLineWidth(0.2);
        pdf.line(MARGIN, y + 5.5, MARGIN + CONTENT_W, y + 5.5);

        pdf.setFontSize(7.5);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(50, 50, 50);
        row.forEach((cell: any, i: number) => {
          const s = cell === null || cell === undefined ? '' : String(cell);
          pdf.text(s.substring(0, 14), MARGIN + i * colW + 2, y + 3.9);
        });
        y += 5.5;
      });
      y += 4;
    }

    if (section.list) {
      for (const item of section.list) {
        const lines = pdf.splitTextToSize(item, CONTENT_W - 8);
        check(lines.length * 4.5 + 2);
        pdf.setFillColor(...YELLOW);
        pdf.circle(MARGIN + 4, y - 0.5, 1, 'F');
        pdf.setFontSize(8.5);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(50, 50, 50);
        pdf.text(lines, MARGIN + 8, y);
        y += lines.length * 4.5 + 2;
      }
      y += 2;
    }
  }

  // ── Recommendations ──
  const recs: string[] = reportData.recommendations || [];
  if (recs.length > 0) {
    sectionBar('Recommendations & Action Plan');
    recs.forEach((rec, i) => {
      const lines = pdf.splitTextToSize(rec, CONTENT_W - 12);
      check(lines.length * 4.5 + 4);
      // Number badge
      pdf.setFillColor(...YELLOW);
      pdf.roundedRect(MARGIN + 2, y - 3, 6, 5.5, 1, 1, 'F');
      pdf.setFontSize(7.5);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...DARK);
      pdf.text(String(i + 1), MARGIN + 5, y + 0.5, { align: 'center' });

      pdf.setFontSize(8.5);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(50, 50, 50);
      pdf.text(lines, MARGIN + 11, y);
      y += lines.length * 4.5 + 4;
    });
  }

  drawPageFooter(pdf, pageNum);
  pdf.save(filename);
}

export const playwrightPDFService = {
  async generatePDF(reportData: any, filename: string) {
    await buildRichPDF(reportData, null, filename);
  },

  async generatePDFWithChart(reportData: any, elementId: string, filename: string) {
    const chartImage = await captureElementAsBase64(elementId);
    await buildRichPDF(reportData, chartImage, filename);
  },

  async generateChartPDF(chartHTML: string, filename: string) {
    const { jsPDF } = await import('jspdf');
    const html2canvas = (await import('html2canvas')).default;

    const container = document.createElement('div');
    container.innerHTML = chartHTML;
    container.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:794px;';
    document.body.appendChild(container);

    try {
      const canvas = await html2canvas(container, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(filename);
    } finally {
      document.body.removeChild(container);
    }
  },
};
