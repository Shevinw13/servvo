import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { WelcomeScreen } from '@/screens/auth/WelcomeScreen';
import { BrandThemeProvider } from '@/theme/BrandThemeProvider';

function renderWithTheme(ui: React.ReactElement) {
  return render(<BrandThemeProvider>{ui}</BrandThemeProvider>);
}

describe('WelcomeScreen', () => {
  it('renders the business name', () => {
    const { getByText } = renderWithTheme(
      <WelcomeScreen onGetStarted={() => {}} />
    );
    expect(getByText('Servvo')).toBeTruthy();
  });

  it('renders the tagline', () => {
    const { getByText } = renderWithTheme(
      <WelcomeScreen onGetStarted={() => {}} />
    );
    expect(
      getByText('Your trusted partner for a beautiful, healthy lawn.')
    ).toBeTruthy();
  });

  it('renders the Get Started button', () => {
    const { getByText } = renderWithTheme(
      <WelcomeScreen onGetStarted={() => {}} />
    );
    expect(getByText('Get Started')).toBeTruthy();
  });

  it('calls onGetStarted when button is pressed', () => {
    const onGetStarted = jest.fn();
    const { getByText } = renderWithTheme(
      <WelcomeScreen onGetStarted={onGetStarted} />
    );
    fireEvent.press(getByText('Get Started'));
    expect(onGetStarted).toHaveBeenCalledTimes(1);
  });

  it('renders the hero image placeholder', () => {
    const { getByLabelText } = renderWithTheme(
      <WelcomeScreen onGetStarted={() => {}} />
    );
    expect(getByLabelText('Lawn care imagery')).toBeTruthy();
  });
});
