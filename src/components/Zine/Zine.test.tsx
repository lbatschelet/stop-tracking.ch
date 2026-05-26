/// <reference types="@testing-library/jest-dom" />
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Zine from './index';

describe('Zine', () => {
  it('renders the cover spread', () => {
    render(<Zine />);
    expect(screen.getByText(/ESCAPING/i)).toBeInTheDocument();
    expect(screen.getByText(/THE PANOPTICON/i)).toBeInTheDocument();
    expect(
      screen.getByText(/a zine on AI, state surveillance/i),
    ).toBeInTheDocument();
  });

  it('navigates to the next page', async () => {
    render(<Zine />);
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    await waitFor(() => {
      const matches = screen.getAllByText(/panopticon/i);
      expect(matches.length).toBeGreaterThan(0);
    });
  });
});
