import { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { playwrightPDFService } from '../services/playwrightPDFService';

export interface ExportOptions {
  format: 'PNG' | 'CHART_PDF' | 'PDF' | 'Excel' | 'CSV';
  quality?: 'low' | 'medium' | 'high';
  includeBranding?: boolean;
  filename?: string;
}

export interface ChartExportData {
  elementId: string;
  title: string;
  description?: string;
}

export interface DataExportData {
  data: any[];
  headers?: string[];
  sheetName?: string;
}

export interface ReportData {
  title: string;
  toolName: string;
  date: string;
  data: any;
  charts?: ChartExportData[];
  summary?: string;
  recommendations?: string[];
}

export const useExportSystem = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  // Export chart as PNG or PDF
  const exportChart = useCallback(async (
    chartData: ChartExportData,
    options: ExportOptions
  ) => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const element = document.getElementById(chartData.elementId);
      if (!element) throw new Error(`Element with ID ${chartData.elementId} not found`);

      setExportProgress(50);

      // Hide UI-only elements before capture
      const hidden = Array.from(element.querySelectorAll<HTMLElement>('[data-no-print]'));
      hidden.forEach(el => { el.style.visibility = 'hidden'; });

      // Use html2canvas for any element type (SVG, Recharts, or mixed)
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      // Restore hidden elements
      hidden.forEach(el => { el.style.visibility = ''; });

      setExportProgress(75);

      // Generate PDF for chart export using Playwright
      if (options.format === 'CHART_PDF') {
        // Create a simple HTML template for chart export
        const chartHTML = `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
              .chart-container { text-align: center; }
              .chart-title { font-size: 16px; font-weight: bold; margin-bottom: 10px; }
              img { max-width: 100%; height: auto; }
            </style>
          </head>
          <body>
            <div class="chart-container">
              <div class="chart-title">${chartData.title}</div>
              <img src="${canvas.toDataURL('image/png')}" alt="Chart" />
            </div>
          </body>
          </html>
        `;

        // Use Playwright service for chart PDF export
        await playwrightPDFService.generateChartPDF(
          chartHTML,
          `${options.filename || 'chart'}.pdf`
        );
      } else if (options.format === 'PNG') {
        // Download PNG
        const link = document.createElement('a');
        link.download = `${options.filename || 'chart'}.png`;
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      setExportProgress(100);
    } catch (error) {
      console.error('Chart export failed:', error);
      throw error;
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  }, []);

  // Export data as Excel or CSV
  const exportData = useCallback(async (
    dataExport: DataExportData,
    options: ExportOptions
  ) => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      setExportProgress(50);

      if (options.format === 'Excel') {
        // Convert data to worksheet - handle both array of objects and array of arrays
        const dataToExport = dataExport.headers 
          ? [dataExport.headers, ...dataExport.data.map(row => dataExport.headers!.map(h => row[h]))]
          : dataExport.data;
        const ws = XLSX.utils.aoa_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, dataExport.sheetName || 'Data');
        
        setExportProgress(75);
        XLSX.writeFile(wb, `${options.filename || 'histogram-data'}.xlsx`);
      } else if (options.format === 'CSV') {
        let csv = '';
        if (dataExport.headers) {
          csv += dataExport.headers.join(',') + '\n';
        }
        csv += dataExport.data.map(row => 
          Object.values(row).map(val => 
            typeof val === 'string' && val.includes(',') ? `"${val}"` : String(val)
          ).join(',')
        ).join('\n');
        
        setExportProgress(75);
        
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        const link = document.createElement('a');
        link.download = `${options.filename || 'histogram-data'}.csv`;
        link.href = URL.createObjectURL(blob);
        link.click();
      }
    } catch (error) {
      console.error('Data export failed:', error);
      throw error;
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  }, []);

  // Generate PDF report using Playwright (HTML→PDF approach)
  const generateReport = useCallback(async (
    reportData: ReportData,
    options: ExportOptions
  ) => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      setExportProgress(25);

      // Prepare data for Playwright service
      const playwrightReportData = {
        title: reportData.title,
        toolName: reportData.toolName,
        date: reportData.date,
        data: reportData.data,
        executive_summary: reportData.summary || '',
        chart_caption: reportData.charts?.[0]?.description || '',
        recommendations: reportData.recommendations || []
      };

      setExportProgress(50);

      // Generate PDF with Playwright
      if (reportData.charts && reportData.charts.length > 0) {
        await playwrightPDFService.generatePDFWithChart(
          playwrightReportData,
          reportData.charts[0].elementId,
          `${options.filename || 'histogram-report'}.pdf`
        );
      } else {
        await playwrightPDFService.generatePDF(
          playwrightReportData,
          `${options.filename || 'histogram-report'}.pdf`
        );
      }

      setExportProgress(100);
    } catch (error) {
      console.error('Report generation failed:', error);
      throw error;
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  }, []);

  return {
    exportChart,
    exportData,
    generateReport,
    isExporting,
    exportProgress,
  };
};
