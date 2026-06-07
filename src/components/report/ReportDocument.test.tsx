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

  it('renders the recommendations and the written summary', () => {
    render(<ReportDocument map={STAR_MAP} report={FINAL_REPORT} />);
    expect(screen.getByText('Рекомендації')).toBeInTheDocument();
    FINAL_REPORT.recommendations!.forEach((r) => expect(screen.getByText(r)).toBeInTheDocument());
    expect(screen.getByText(/Команда вчителів — головна сила/)).toBeInTheDocument();
  });

  it('renders the vote statistics (totals + similar votes) when present', () => {
    render(<ReportDocument map={STAR_MAP} report={FINAL_REPORT} />);
    expect(screen.getByText('Статистика голосів')).toBeInTheDocument();
    expect(screen.getByText(/Зібрано думок:/)).toBeInTheDocument();
    expect(screen.getByText(`×${FINAL_REPORT.stats!.themes[0].count}`)).toBeInTheDocument();
  });

  it('omits the statistics block when no stats were counted', () => {
    render(<ReportDocument map={STAR_MAP} report={{ ...FINAL_REPORT, stats: undefined }} />);
    expect(screen.queryByText('Статистика голосів')).not.toBeInTheDocument();
  });
});
