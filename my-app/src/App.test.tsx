import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const links = screen.getAllByRole('link', { name: /learn react/i });
  expect(links.length).toBeGreaterThanOrEqual(1);
});
