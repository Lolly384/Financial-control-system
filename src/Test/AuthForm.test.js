import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AuthForm from './AuthForm';

jest.mock('../../Button/Button', () => ({ children, ...props }) => (
  <button {...props}>{children}</button>
));

describe('AuthForm', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form by default', () => {
    render(<AuthForm onClose={jest.fn()} onLogin={jest.fn()} />);
    
    expect(screen.getByText(/Авторизация/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Авторизация/i })).toBeInTheDocument();
  });

  test('toggles to registration form', () => {
    render(<AuthForm onClose={jest.fn()} onLogin={jest.fn()} />);
    
    fireEvent.click(screen.getByRole('button', { name: /У вас нет учетной записи\? Регистрация/i }));
    
    expect(screen.getByText(/Регистрация/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Регистрация/i })).toBeInTheDocument();
  });

  test('submits login form', async () => {
    const mockOnLogin = jest.fn();
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ token: 'fake-token', user: { username: 'test' } })
    });

    render(<AuthForm onClose={jest.fn()} onLogin={mockOnLogin} />);
    
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'admin' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'admin' } });
    fireEvent.click(screen.getByRole('button', { name: /Авторизация/i }));
    
    await waitFor(() => expect(mockOnLogin).toHaveBeenCalledWith('fake-token', { username: 'test' }));
  });

  test('submits registration form', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true })
    });

    render(<AuthForm onClose={jest.fn()} onLogin={jest.fn()} />);
    
    fireEvent.click(screen.getByRole('button', { name: /У вас нет учетной записи\? Регистрация/i }));
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'test' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /Регистрация/i }));
    
    await waitFor(() => expect(fetch).toHaveBeenCalledWith('/api/register', expect.any(Object)));
  });
});
