/* pdf.ts — render the official SWOT report document to a downloadable PDF.

   We rasterize the already-designed `ReportDocument` DOM node via html2canvas and
   embed it into a jsPDF page. This preserves the exact design AND renders the
   Ukrainian (Cyrillic) text correctly — jsPDF's built-in fonts are WinAnsi-only,
   so capturing the browser-rendered document is the most faithful approach.

   Both libraries are imported dynamically so they stay out of the initial bundle
   and only load when a report is actually exported. */

import type { jsPDF } from 'jspdf';

export const REPORT_FILENAME = 'SWOT_Lyceum_1946.pdf';

/** Capture `node` and save it as an A4 portrait PDF. Returns the jsPDF instance. */
export async function generateReportPdf(
  node: HTMLElement,
  filename: string = REPORT_FILENAME,
): Promise<jsPDF> {
  const [{ default: html2canvas }, { jsPDF: JsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ]);

  // Make sure the web fonts (Unbounded/Nunito) are loaded before we rasterize,
  // otherwise a cold export can fall back to a system font and corrupt the text.
  if (document.fonts?.ready) {
    try {
      await document.fonts.ready;
    } catch {
      /* Font Loading API unavailable — proceed anyway */
    }
  }

  const canvas = await html2canvas(node, {
    scale: 2,
    backgroundColor: '#ffffff',
    useCORS: true,
    logging: false,
  });
  const img = canvas.toDataURL('image/png');

  const pdf = new JsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const margin = 24;
  const usableW = pageW - margin * 2;
  const ratio = canvas.height / Math.max(1, canvas.width);

  let imgW = usableW;
  let imgH = usableW * ratio;
  if (imgH > pageH - margin * 2) {
    imgH = pageH - margin * 2;
    imgW = imgH / ratio;
  }
  const x = (pageW - imgW) / 2;
  pdf.addImage(img, 'PNG', x, margin, imgW, imgH);
  pdf.save(filename);
  return pdf;
}
