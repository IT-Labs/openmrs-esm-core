import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import { Snackbar } from './snackbar.component';

jest.useFakeTimers();
const mockedCloseSnackbar = jest.fn();

describe('Snackbar component', () => {
  afterEach(() => jest.clearAllMocks());

  it('renders a snackbar notification', () => {
    renderSnackbar();

    const snackbar = screen.getByRole('alertdialog', { name: /order submitted/i });
    const closeButton = screen.getByRole('button', { name: /close snackbar/i });
    expect(snackbar).toBeInTheDocument();
    expect(snackbar.classList).toContainEqual(expect.stringMatching('info'));
    expect(closeButton).toBeInTheDocument();
  });

  it('renders an error notification if kind is set to error and does not close automatically', async () => {
    renderSnackbar({
      snackbar: {
        kind: 'error',
        title: 'Error submitting order',
        subtitle: 'Error contacting lab system. Please try again later',
      },
    });

    const snackbar = screen.getByRole('alertdialog', { name: /error submitting order/i });
    expect(snackbar).toBeInTheDocument();
    expect(snackbar.classList).toContainEqual(expect.stringMatching('error'));
    expect(screen.getByRole('button', { name: /close snackbar/i })).toBeInTheDocument();
    expect(screen.getByText(/error contacting lab system. please try again later/i)).toBeInTheDocument();

    act(() => jest.advanceTimersByTime(5000));
    await waitFor(() => expect(mockedCloseSnackbar).toHaveBeenCalledTimes(0));
  });

  it('automatically dismisses the snackbar after a timeout if there is no action button and it is not an error', async () => {
    renderSnackbar({
      snackbar: {
        title: 'Order submitted',
        kind: 'success',
      },
    });

    const snackbar = screen.getByRole('alertdialog', { name: /order submitted/i });
    expect(snackbar).toBeInTheDocument();

    act(() => jest.advanceTimersByTime(5000));
    await waitFor(() => expect(mockedCloseSnackbar).toHaveBeenCalledTimes(1));
  });

  it('renders an actionable variant of the snackbar if actionButtonLabel is provided and does not close automatically', async () => {
    renderSnackbar({
      snackbar: {
        actionButtonLabel: 'Undo',
        title: 'Order submitted',
      },
    });

    const snackbar = screen.getByRole('alertdialog', { name: /order submitted/i });
    const actionButton = screen.getByRole('button', { name: /undo/i });
    expect(snackbar).toBeInTheDocument();
    expect(actionButton).toBeInTheDocument();

    act(() => jest.advanceTimersByTime(5000));
    await waitFor(() => expect(mockedCloseSnackbar).toHaveBeenCalledTimes(0));
  });
});

function renderSnackbar(overrides = {}) {
  const testProps = {
    snackbar: {
      id: 1,
      title: 'Order submitted',
    },
    closeSnackbar: mockedCloseSnackbar,
  };

  render(<Snackbar {...testProps} {...overrides} />);
}
