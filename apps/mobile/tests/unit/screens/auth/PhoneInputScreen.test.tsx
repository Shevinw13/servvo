import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import {
  PhoneInputScreen,
  isValidPhone,
  formatPhoneDisplay,
} from '@/screens/auth/PhoneInputScreen';
import { BrandThemeProvider } from '@/theme/BrandThemeProvider';

function renderWithTheme(ui: React.ReactElement) {
  return render(<BrandThemeProvider>{ui}</BrandThemeProvider>);
}

describe('PhoneInputScreen', () => {
  it('renders the header and subtitle', () => {
    const { getByText } = renderWithTheme(
      <PhoneInputScreen onSendCode={() => {}} />
    );
    expect(getByText("Let's verify your phone")).toBeTruthy();
    expect(
      getByText("We'll send a code to confirm your number.")
    ).toBeTruthy();
  });

  it('renders Send Code and Use email buttons', () => {
    const { getByText } = renderWithTheme(
      <PhoneInputScreen onSendCode={() => {}} />
    );
    expect(getByText('Send Code')).toBeTruthy();
    expect(getByText('Use email instead')).toBeTruthy();
  });

  it('shows error for invalid phone number', () => {
    const onSendCode = jest.fn();
    const { getByText, getByLabelText } = renderWithTheme(
      <PhoneInputScreen onSendCode={onSendCode} />
    );

    // Enter short number
    fireEvent.changeText(getByLabelText('Phone number'), '123');
    fireEvent.press(getByText('Send Code'));

    expect(
      getByText('Please enter a valid phone number (at least 10 digits).')
    ).toBeTruthy();
    expect(onSendCode).not.toHaveBeenCalled();
  });

  it('calls onSendCode with valid phone number', async () => {
    const onSendCode = jest.fn();
    const { getByText, getByLabelText } = renderWithTheme(
      <PhoneInputScreen onSendCode={onSendCode} />
    );

    fireEvent.changeText(getByLabelText('Phone number'), '6155551234');
    fireEvent.press(getByText('Send Code'));

    await waitFor(() => {
      expect(onSendCode).toHaveBeenCalledWith('6155551234');
    });
  });
});

describe('isValidPhone', () => {
  it('returns true for 10+ digit numbers', () => {
    expect(isValidPhone('6155551234')).toBe(true);
    expect(isValidPhone('(615) 555-1234')).toBe(true);
    expect(isValidPhone('+1 615 555 1234')).toBe(true);
  });

  it('returns false for short numbers', () => {
    expect(isValidPhone('123')).toBe(false);
    expect(isValidPhone('615555')).toBe(false);
    expect(isValidPhone('')).toBe(false);
  });
});

describe('formatPhoneDisplay', () => {
  it('formats 10-digit numbers in US format', () => {
    expect(formatPhoneDisplay('6155551234')).toBe('(615) 555-1234');
  });

  it('handles partial numbers', () => {
    expect(formatPhoneDisplay('615')).toBe('615');
    expect(formatPhoneDisplay('615555')).toBe('(615) 555');
  });
});
