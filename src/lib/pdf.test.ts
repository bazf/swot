const save = vi.fn();
const addImage = vi.fn();

vi.mock('jspdf', () => ({
  jsPDF: vi.fn().mockImplementation(() => ({
    internal: { pageSize: { getWidth: () => 595, getHeight: () => 842 } },
    addImage,
    save,
  })),
}));

vi.mock('html2canvas', () => ({
  default: vi.fn().mockResolvedValue({
    width: 520,
    height: 700,
    toDataURL: () => 'data:image/png;base64,AAAA',
  }),
}));

import { generateReportPdf, REPORT_FILENAME } from './pdf';

describe('generateReportPdf', () => {
  it('rasterizes the node and saves a PDF with the official filename', async () => {
    const node = document.createElement('div');
    await generateReportPdf(node);
    expect(addImage).toHaveBeenCalled();
    expect(save).toHaveBeenCalledWith(REPORT_FILENAME);
  });
});
