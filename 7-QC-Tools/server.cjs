const express = require('express');
const cors = require('cors');
const { chromium } = require('playwright');
const path = require('path');

const app = express();
const SERVER_PORT = process.env.PORT || 3005;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Disable Vite base URL interference
app.disable('x-powered-by');

// HTML Template for PDF generation
const getTemplate = () => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kaizen Academy - Process Histogram Report</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Helvetica:wght@400;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Helvetica', Arial, sans-serif;
            font-size: 10pt;
            line-height: 1.4;
            color: #2E2E2E;
            background: #FFFFFF;
        }
        
        .page {
            width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            position: relative;
        }
        
        .header {
            height: 55mm;
            background: #1A1A1A;
            color: #FFFFFF;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 20mm;
            position: relative;
        }
        
        .header-logo {
            width: 40mm;
            height: 40mm;
            background: url('http://practitioner.kaizenacademy.education/logo_round.png') no-repeat center;
            background-size: contain;
        }
        
        .header-content {
            text-align: right;
            flex: 1;
            padding-left: 20mm;
        }
        
        .header-title {
            font-size: 20pt;
            font-weight: bold;
            margin-bottom: 5mm;
        }
        
        .header-date {
            font-size: 10pt;
            opacity: 0.8;
        }
        
        .header-accent {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 3mm;
            background: #FFD559;
        }
        
        .content {
            padding: 20mm;
            min-height: calc(297mm - 55mm - 12mm - 3mm);
        }
        
        .section {
            margin-bottom: 25mm;
        }
        
        .section-header {
            background: #FFD559;
            padding: 3mm 5mm;
            font-size: 16pt;
            font-weight: bold;
            color: #1A1A1A;
            margin-bottom: 12mm;
        }
        
        .executive-summary {
            font-size: 11pt;
            line-height: 1.5;
            margin-bottom: 20mm;
        }
        
        .stats-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15mm;
        }
        
        .stats-table th {
            background: #F5F5F5;
            padding: 4mm;
            text-align: left;
            font-weight: bold;
            border-bottom: 1px solid #E5E5E5;
        }
        
        .stats-table td {
            padding: 4mm;
            border-bottom: 1px solid #F5F5F5;
        }
        
        .chart-container {
            margin: 15mm 0;
            text-align: center;
        }
        
        .chart-image {
            max-width: 100%;
            height: auto;
        }
        
        .chart-caption {
            font-size: 9pt;
            color: #555555;
            margin-top: 5mm;
            font-style: italic;
        }
        
        .freq-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15mm;
        }
        
        .freq-table th {
            background: #F5F5F5;
            padding: 3mm 4mm;
            text-align: center;
            font-weight: bold;
            font-size: 9pt;
            border-bottom: 1px solid #E5E5E5;
        }
        
        .freq-table td {
            padding: 3mm 4mm;
            text-align: center;
            font-size: 9pt;
            border-bottom: 1px solid #F5F5F5;
        }
        
        .freq-table tr:nth-child(even) {
            background: #F8F8F8;
        }
        
        .recommendations {
            margin-bottom: 20mm;
        }
        
        .recommendation-item {
            margin-bottom: 6mm;
            padding-left: 8mm;
            position: relative;
        }
        
        .recommendation-item::before {
            content: attr(data-number);
            position: absolute;
            left: 0;
            font-weight: bold;
        }
        
        .cta-box {
            background: #1A1A1A;
            border-left: 5mm solid #FFD559;
            padding: 8mm 12mm;
            margin: 20mm 0;
            color: #FFFFFF;
        }
        
        .cta-headline {
            color: #FFD559;
            font-size: 14pt;
            font-weight: bold;
            margin-bottom: 5mm;
        }
        
        .cta-subheadline {
            font-size: 11pt;
            font-weight: bold;
            margin-bottom: 8mm;
        }
        
        .cta-price {
            display: flex;
            align-items: center;
            gap: 10mm;
            margin-bottom: 8mm;
        }
        
        .cta-price-highlight {
            background: #FFD559;
            color: #1A1A1A;
            padding: 4mm 8mm;
            font-weight: bold;
            border-radius: 2mm;
        }
        
        .cta-button {
            background: #FFD559;
            color: #1A1A1A;
            padding: 4mm 12mm;
            font-weight: bold;
            text-decoration: none;
            border-radius: 2mm;
            display: inline-block;
        }
        
        .cta-body {
            font-size: 9pt;
            line-height: 1.4;
            color: #D2D2D2;
        }
        
        .footer {
            height: 12mm;
            background: #F5F5F5;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 20mm;
            font-size: 9pt;
            color: #555555;
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
        }
        
        @media print {
            .page {
                margin: 0;
                box-shadow: none;
            }
        }
    </style>
</head>
<body>
    <div class="page">
        <!-- Header -->
        <div class="header">
            <div class="header-logo"></div>
            <div class="header-content">
                <div class="header-title">Process Histogram Report</div>
                <div class="header-date">Generated: {{date}}</div>
            </div>
            <div class="header-accent"></div>
        </div>
        
        <!-- Content -->
        <div class="content">
            <!-- Executive Summary -->
            <div class="section">
                <div class="section-header">EXECUTIVE SUMMARY</div>
                <div class="executive-summary">{{executive_summary}}</div>
            </div>
            
            <!-- Statistical Summary -->
            <div class="section">
                <div class="section-header">STATISTICAL SUMMARY</div>
                <table class="stats-table">
                    <thead>
                        <tr>
                            <th>Metric</th>
                            <th>Value</th>
                            <th>Interpretation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {{stats_rows}}
                    </tbody>
                </table>
            </div>
            
            <!-- Input Parameters -->
            <div class="section">
                <div class="section-header">INPUT PARAMETERS</div>
                <table class="stats-table">
                    <thead>
                        <tr>
                            <th>Parameter</th>
                            <th>Value</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {{input_rows}}
                    </tbody>
                </table>
            </div>
            
            <!-- Statistical Analysis -->
            <div class="section">
                <div class="section-header">STATISTICAL ANALYSIS</div>
                <div class="chart-container">
                    <img src="{{chart_image}}" alt="Histogram Distribution" class="chart-image">
                    <div class="chart-caption">{{chart_caption}}</div>
                </div>
            </div>
            
            <!-- Frequency Distribution Table -->
            <div class="section">
                <div class="section-header">FREQUENCY DISTRIBUTION TABLE</div>
                <table class="freq-table">
                    <thead>
                        <tr>
                            <th>Class</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Freq</th>
                            <th>Rel %</th>
                            <th>Cum %</th>
                        </tr>
                    </thead>
                    <tbody>
                        {{freq_rows}}
                    </tbody>
                </table>
            </div>
            
            <!-- Recommendations -->
            <div class="section">
                <div class="section-header">RECOMMENDATIONS & ACTION PLAN</div>
                <div class="recommendations">
                    {{recommendations}}
                </div>
            </div>
            
            <!-- Course CTA -->
            <div class="cta-box">
                <div class="cta-headline">🎯 MASTER ALL 7 QC TOOLS - LIMITED TIME OFFER</div>
                <div class="cta-subheadline">Scientific Problem Solving Course - Save 40%</div>
                <div class="cta-price">
                    <div class="cta-price-highlight">
                        <div style="font-size: 12pt;">ONLY $108</div>
                        <div style="font-size: 8pt;">Regular $180</div>
                    </div>
                    <a href="https://academy.continuousimprovement.education/p/en-home?coupon_code=kaizen40" class="cta-button">ENROL NOW</a>
                </div>
                <div class="cta-body">
                    This report was generated using the Histogram tool — one of 7 powerful QC tools taught in the Kaizen Academy "Scientific Problem Solving" course.<br><br>
                    Master all 7 QC tools, A3 Thinking, Root Cause Analysis and process capability — with lifetime access, Excel templates and a certificate issued by Kaizen Academy Australia.<br><br>
                    📚 Course includes:<br>
                    • Complete mastery of all 7 QC Tools<br>
                    • A3 Thinking & Root Cause Analysis<br>
                    • Excel templates & PDF tutorials<br>
                    • Lifetime access & expert coaching<br>
                    • Certificate by Kaizen Academy Australia<br><br>
                    🔗 Enrol now: https://academy.continuousimprovement.education/p/en-home?coupon_code=kaizen40<br>
                    7-day money-back guarantee | No risk enrollment
                </div>
            </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <div>© Kaizen Academy Australia</div>
            <div>www.continuousimprovement.education</div>
            <div>Page 1</div>
        </div>
    </div>
</body>
</html>`;

// Helper functions
const generateStatsTable = (data) => {
  const stats = data.statistics;
  const capabilityLabel = (val) =>
    val >= 1.33 ? 'Excellent (\u22651.33)' : val >= 1.0 ? 'Adequate (\u22651.0)' : 'Needs Improvement (<1.0)';

  const rows = [
    ['Sample Size', String(data.sampleSize || 'N/A'), 'Total measurements analysed'],
    ['Process Mean (x̄)', stats.mean?.toFixed(4) || 'N/A', 'Central tendency of the process'],
    ['Std Deviation (S)', stats.stdDev?.toFixed(4) || 'N/A', 'Process spread / variation'],
    ['Min Value', stats.min?.toFixed(4) || 'N/A', 'Lowest observed measurement'],
    ['Max Value', stats.max?.toFixed(4) || 'N/A', 'Highest observed measurement'],
    ['LSL', stats.lsl?.toFixed(4) || (data.lsl?.toFixed(4)) || 'N/A', 'Lower specification limit'],
    ['USL', stats.usl?.toFixed(4) || (data.usl?.toFixed(4)) || 'N/A', 'Upper specification limit'],
    ['Class Width', stats.classWidth?.toFixed(4) || 'N/A', 'Bin width (Sturges rule)'],
    ['Within Spec', `${(stats.percentWithinSpec || 0).toFixed(2)}%`, 'Values inside LSL–USL range'],
    ['Below LSL', `${(stats.percentBelowLSL || 0).toFixed(2)}%`, 'Values below lower spec limit'],
    ['Above USL', `${(stats.percentAboveUSL || 0).toFixed(2)}%`, 'Values above upper spec limit']
  ];

  if (stats.cp !== undefined) {
    rows.push(
      ['Cp  (potential)', (stats.cp || 0).toFixed(3), capabilityLabel(stats.cp || 0)],
      ['Cpk (actual)', (stats.cpk || 0).toFixed(3), capabilityLabel(stats.cpk || 0)],
      ['Pp', (stats.pp || 0).toFixed(3), capabilityLabel(stats.pp || 0)],
      ['Ppk', (stats.ppk || 0).toFixed(3), capabilityLabel(stats.ppk || 0)]
    );
  }

  return rows.map(row => 
    `<tr>
      <td>${row[0]}</td>
      <td>${row[1]}</td>
      <td>${row[2]}</td>
    </tr>`
  ).join('');
};

const generateInputTable = (data) => {
  const rows = [
    ['Dataset Name', data.datasetName || 'Histogram Data', 'Name of the dataset analysed'],
    ['Sample Size', String(data.sampleSize || data.values?.length || 'N/A'), 'Total number of measurements'],
    ['Lower Specification Limit (LSL)', String(data.lsl || 'N/A'), 'Minimum acceptable value'],
    ['Upper Specification Limit (USL)', String(data.usl || 'N/A'), 'Maximum acceptable value'],
    ['Analysis Date', new Date().toLocaleDateString(), 'Date of analysis']
  ];

  return rows.map(row => 
    `<tr>
      <td>${row[0]}</td>
      <td>${row[1]}</td>
      <td>${row[2]}</td>
    </tr>`
  ).join('');
};

const generateFreqTable = (frequencies) => {
  return frequencies.map((freq, index) => 
    `<tr style="${index % 2 === 0 ? 'background: #F8F8F8;' : ''}">
      <td>${freq.class}</td>
      <td>${freq.lower.toFixed(3)}</td>
      <td>${freq.upper.toFixed(3)}</td>
      <td>${freq.frequency}</td>
      <td>${freq.relativeFreq.toFixed(1)}%</td>
      <td>${freq.cumulativeFreq.toFixed(0)}%</td>
    </tr>`
  ).join('');
};

const generateRecommendations = (recommendations) => {
  return recommendations.map((rec, index) => 
    `<div class="recommendation-item" data-number="${index + 1}.">${rec}</div>`
  ).join('');
};

// PDF Generation Endpoint
app.post('/api/generate-pdf', async (req, res) => {
  try {
    const { title, toolName, date, data, executive_summary, chart_image, chart_caption, recommendations } = req.body;

    let template = getTemplate();

    // Replace template variables
    template = template.replace('{{date}}', date);
    template = template.replace('{{executive_summary}}', executive_summary);
    template = template.replace('{{stats_rows}}', generateStatsTable(data));
    template = template.replace('{{input_rows}}', generateInputTable(data));
    template = template.replace('{{chart_image}}', chart_image || '');
    template = template.replace('{{chart_caption}}', chart_caption || '');
    template = template.replace('{{freq_rows}}', generateFreqTable(data.frequencies || []));
    template = template.replace('{{recommendations}}', generateRecommendations(recommendations));

    // Launch Playwright
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    // Set content and generate PDF
    await page.setContent(template, { waitUntil: 'networkidle' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: {
        top: '0mm',
        bottom: '0mm',
        left: '0mm',
        right: '0mm'
      },
      printBackground: true,
      preferCSSPageSize: true
    });

    await browser.close();

    // Send PDF as response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="histogram-report.pdf"');
    res.send(pdfBuffer);

  } catch (error) {
    console.error('PDF generation failed:', error);
    res.status(500).json({ error: 'PDF generation failed', details: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'PDF generation server is running' });
});

// Start server
app.listen(SERVER_PORT, '0.0.0.0', () => {
  console.log(`🚀 PDF Generation Server running on http://localhost:${SERVER_PORT}`);
  console.log(`📊 Endpoint: POST /api/generate-pdf`);
  console.log(`💚 Health: GET /api/health`);
});
