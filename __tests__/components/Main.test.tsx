import React from 'react';
import { render } from '@testing-library/react';
import Main from '../../src/Pages/Main'; // adjust this import path to match your project structure
import Dashboard from '../../src/client/components/Dashboard'; // adjust this import path to match your project structure

jest.mock('../client/components/Dashboard', () => {
  return function DummyDashboard() {
    return <div data-testid="dashboard">Dashboard</div>;
  };
});

describe('Main component', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(<Main />);
    expect(getByTestId('dashboard')).toBeInTheDocument();
  });
});
