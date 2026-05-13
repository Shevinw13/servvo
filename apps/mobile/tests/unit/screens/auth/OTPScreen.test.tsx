import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { OTPScreen, formatTimer } from '@/screens/auth/OTPScreen';
import { BrandThemeProvider } from '@/theme/BrandThemeProvider';

function renderWithTheme(ui: React.ReactElement) {
  return render(<BrandThemeProvider>{ui}</BrandThemeProvider>);
}

describe('OTPScreen', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders the header and phone number', () => {
    const { getByText } = renderWithTheme(
      <OTPScreen
        phoneNumber="6155551234"
        onVerify={() => {}}
        onResend={() => {}}
      />
    );
    expect(getByText('Enter the 6-digit code we sent you')).toBeTruthy();
    expect(getByText('Sent to (615) 555-1234')).toBeTruthy();
  });

  it('renders 6 OTP boxes', () => {
    const { getByLabelText } = renderWithTheme(
      <OTPScreen
        phoneNumber="6155551234"
        onVerify={() => {}}
        onResend={() => {}}
      />
    );
    expect(getByLabelText('OTP code input')).toBeTruthy();
  });

  it('shows countdown timer initially', () => {
    const { getByText } = renderWithTheme(
      <OTPScreen
        phoneNumber="6155551234"
        onVerify={() => {}}
        onResend={() => {}}
      />
    );
    expect(getByText('Resend code in 05:00')).toBeTruthy();
  });

  it('counts down the timer', () => {
    const { getByText } = renderWithTheme(
      <OTPScreen
        phoneNumber="6155551234"
        onVerify={() => {}}
        onResend={() => {}}
      />
    );

    act(() => {
      jest.advanceTimersByTime(10000); // 10 seconds
    });

    expect(getByText('Resend code in 04:50')).toBeTruthy();
  });

  it('shows Resend Code button when timer expires', () => {
    const { getByText } = renderWithTheme(
      <OTPScreen
        phoneNumber="6155551234"
        onVerify={() => {}}
        onResend={() => {}}
      />
    );

    act(() => {
      jest.advanceTimersByTime(5 * 60 * 1000); // 5 minutes
    });

    expect(getByText('Resend Code')).toBeTruthy();
  });

  it('calls onResend and resets timer when Resend Code is pressed', () => {
    const onResend = jest.fn();
    const { getByText } = renderWithTheme(
      <OTPScreen
        phoneNumber="6155551234"
        onVerify={() => {}}
        onResend={onResend}
      />
    );

    act(() => {
      jest.advanceTimersByTime(5 * 60 * 1000);
    });

    fireEvent.press(getByText('Resend Code'));
    expect(onResend).toHaveBeenCalledTimes(1);
    expect(getByText('Resend code in 05:00')).toBeTruthy();
  });

  it('auto-submits when 6 digits are entered', () => {
    const onVerify = jest.fn();
    const { getByLabelText } = renderWithTheme(
      <OTPScreen
        phoneNumber="6155551234"
        onVerify={onVerify}
        onResend={() => {}}
      />
    );

    const input = getByLabelText('Enter verification code');
    fireEvent.changeText(input, '123456');

    expect(onVerify).toHaveBeenCalledWith('123456');
  });
});

describe('formatTimer', () => {
  it('formats seconds into MM:SS', () => {
    expect(formatTimer(300)).toBe('05:00');
    expect(formatTimer(290)).toBe('04:50');
    expect(formatTimer(0)).toBe('00:00');
    expect(formatTimer(61)).toBe('01:01');
    expect(formatTimer(59)).toBe('00:59');
  });
});
