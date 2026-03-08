import React, { useState } from 'react';
import { Download, FileImage, FileText, Table } from 'lucide-react';
import { useExportSystem, ExportOptions, ChartExportData, DataExportData, ReportData } from '../hooks/useExportSystem';

interface ExportButtonProps {
  chartData?: ChartExportData;
  dataExport?: DataExportData;
  reportData?: ReportData;
  className?: string;
  disabled?: boolean;
}

export default function ExportButton({ 
  chartData, 
  dataExport, 
  reportData, 
  className = '', 
  disabled = false 
}: ExportButtonProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { exportChart, exportData, generateReport } = useExportSystem();

  const handleExport = async (format: ExportOptions['format']) => {
    setIsExporting(true);
    setShowMenu(false);

    try {
      const options: ExportOptions = {
        format,
        quality: 'high',
        includeBranding: true,
        filename: reportData?.toolName || chartData?.title || 'export'
      };

      if (chartData && (format === 'PNG' || format === 'CHART_PDF')) {
        await exportChart(chartData, options);
      } else if (dataExport && (format === 'Excel' || format === 'CSV')) {
        await exportData(dataExport, options);
      } else if (reportData && format === 'PDF') {
        await generateReport(reportData, options);
      }
    } catch (error) {
      console.error('Export failed:', error);
      // You could show a toast notification here
    } finally {
      setIsExporting(false);
    }
  };

  const getAvailableFormats = () => {
    const formats = [];
    let formatIndex = 0;
    
    if (chartData) {
      formats.push({ 
        format: 'PNG' as const, 
        icon: FileImage, 
        label: 'Export as PNG',
        key: `chart-png-${formatIndex++}`
      });
      formats.push({ 
        format: 'CHART_PDF' as const, 
        icon: FileText, 
        label: 'Export Chart as PDF',
        key: `chart-pdf-${formatIndex++}`
      });
    }
    
    if (dataExport) {
      formats.push({ 
        format: 'Excel' as const, 
        icon: Table, 
        label: 'Export to Excel',
        key: `data-excel-${formatIndex++}`
      });
      formats.push({ 
        format: 'CSV' as const, 
        icon: FileText, 
        label: 'Export to CSV',
        key: `data-csv-${formatIndex++}`
      });
    }
    
    if (reportData) {
      formats.push({ 
        format: 'PDF' as const, 
        icon: FileText, 
        label: 'Generate Full Report',
        key: `report-pdf-${formatIndex++}`
      });
    }
    
    return formats;
  };

  const availableFormats = getAvailableFormats();

  if (availableFormats.length === 0) {
    return null;
  }

  return (
    <div className={`relative ${className}`} data-no-print="true">
      {/* Main Export Button */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={disabled || isExporting}
        className="btn-secondary flex items-center gap-2 relative"
        style={{ 
          padding: '12px 24px',
          fontSize: '14px',
          opacity: (disabled || isExporting) ? 0.6 : 1,
          cursor: (disabled || isExporting) ? 'not-allowed' : 'pointer'
        }}
      >
        {isExporting ? (
          <>
            <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Generating…</span>
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            <span>Export</span>
          </>
        )}
      </button>

      {/* Export Menu */}
      {showMenu && !isExporting && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowMenu(false)}
          />
          
          {/* Menu */}
          <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <div className="py-2">
              {availableFormats.map(({ format, icon: Icon, label, key }) => (
                <button
                  key={key}
                  onClick={() => handleExport(format)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
                  style={{ fontSize: '14px' }}
                >
                  <Icon className="w-4 h-4 text-gray-600" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
            
            {/* Export Info */}
            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-600" style={{ fontSize: '12px' }}>
                High-quality exports with Kaizen Academy branding included
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
