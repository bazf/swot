import { render, screen } from '@testing-library/react';
import { FINAL_REPORT, STAR_MAP } from '../../data/catalog';
import { ReportDocument } from './ReportDocument';

describe('ReportDocument', () => {
  it('renders all four SWOT sections and the TOP-3 priorities', () => {
    render(<ReportDocument map={STAR_MAP} report={FINAL_REPORT} />);
    expect(screen.getByText('Сильні сторони')).toBeInTheDocument();
    expect(screen.getByText('Слабкі сторони')).toBeInTheDocument();
    expect(screen.getByText('Можливості')).toBeInTheDocument();
    expect(screen.getByText('Загрози')).toBeInTheDocument();
    FINAL_REPORT.priorities.forEach((p) => expect(screen.getByText(p)).toBeInTheDocument());
  });
});
