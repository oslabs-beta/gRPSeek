import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AddItem from '../../src/Pages/AddItem';
import { TodoClient } from '../../src/generated/proto/ToDoServiceClientPb';
// import { TodoItem, voidNoParams } from '../src/generated/proto/toDo_pb';

jest.mock('../src/generated/proto/ToDoServiceClientPb');

describe('AddItem', () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    (TodoClient as jest.Mock).mockClear();
  });

  it('renders without crashing', () => {
    render(<AddItem />);
  });

  it('handles text input change', () => {
    const { getByLabelText } = render(<AddItem />);
    const input = getByLabelText(/item:/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Test' } });
    expect(input.value).toBe('Test');
  });

  it('handles id input change', () => {
    const { getByLabelText } = render(<AddItem />);
    const input = getByLabelText(/id:/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: '1' } });
    expect(input.value).toBe('1');
  });

  it('handles form submission', async () => {
    const { getByText, getByLabelText } = render(<AddItem />);
    const itemInput = getByLabelText(/item:/i) as HTMLInputElement;
    const idInput = getByLabelText(/id:/i) as HTMLInputElement;
    const button = getByText(/add to list/i);

    fireEvent.change(itemInput, { target: { value: 'Test' } });
    fireEvent.change(idInput, { target: { value: '1' } });
    fireEvent.click(button);

    // Assuming that the TodoClient.createTodo method returns a promise that resolves to an object with a toObject method that returns the created todo item
    await waitFor(() =>
      expect(
        (TodoClient.prototype.createTodo as jest.Mock).mock.calls.length
      ).toBe(1)
    );

    // Check if the new item is in the list
    expect(getByText(/test/i)).toBeInTheDocument();
  });
});
