import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import Home from '../../src/Pages/Home';

describe('Home component', () => {
  it('renders without crashing', () => {
    const history = createMemoryHistory();
    const { getByText } = render(
      <Router history={history}>
        <Home />
      </Router>
    );

    expect(getByText('gRPSeek')).toBeInTheDocument();
    expect(
      getByText('A POWERFUL VISUALIZATION TOOL FOR gRPC')
    ).toBeInTheDocument();
    expect(getByText('Start Seeking')).toBeInTheDocument();
    expect(getByText('Add Item Page')).toBeInTheDocument();
  });

  it('navigates to /main when Start Seeking button is clicked', () => {
    const history = createMemoryHistory();
    const { getByText } = render(
      <Router history={history}>
        <Home />
      </Router>
    );

    fireEvent.click(getByText('Start Seeking'));
    expect(history.location.pathname).toBe('/main');
  });

  it('navigates to /additem when Add Item Page link is clicked', () => {
    const history = createMemoryHistory();
    const { getByText } = render(
      <Router history={history}>
        <Home />
      </Router>
    );

    fireEvent.click(getByText('Add Item Page'));
    expect(history.location.pathname).toBe('/additem');
  });
});
