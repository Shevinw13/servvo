/**
 * PaymentScreen — Payment confirmation screen.
 * For MVP: simple confirmation screen (actual Stripe SDK integration comes later).
 * Shows amount, "Processing payment..." state, then success/failure.
 *
 * Validates: Requirements 8.3, 8.4
 */

import React, { useCallback, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/theme/BrandThemeProvider';
import { Typography, Button, Card } from '@/components/ui';
import {
  createPaymentIntent,
  confirmPayment,
} from '@/services/billing.service';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BillingStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<BillingStackParamList, 'Payment'>;

type PaymentState = 'confirm' | 'processing' | 'success' | 'error';

function formatAmount(amountCents: number): string {
  const dollars = amountCents / 100;
  return `$${dollars.toFixed(2)}`;
}

export function PaymentScreen({ route, navigation }: Props) {
  const { tokens } = useTheme();
  const { invoiceId, amountCents, description } = route.params;
  const [paymentState, setPaymentState] = useState<PaymentState>('confirm');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePayment = useCallback(async () => {
    setPaymentState('processing');
    setErrorMessage(null);

    try {
      // Create payment intent
      const intent = await createPaymentIntent(invoiceId);

      // Confirm payment (in full Stripe integration, this would use the Stripe SDK)
      await confirmPayment(intent.id, invoiceId);

      setPaymentState('success');
    } catch (err: any) {
      setPaymentState('error');
      setErrorMessage(
        err?.response?.data?.message || 'Payment failed. Please try again.',
      );
    }
  }, [invoiceId]);

  const handleDone = useCallback(() => {
    navigation.popToTop();
  }, [navigation]);

  const handleRetry = useCallback(() => {
    setPaymentState('confirm');
    setErrorMessage(null);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: tokens.colors.background }]}>
      <View style={styles.content}>
        {/* Confirm State */}
        {paymentState === 'confirm' && (
          <>
            <Card style={styles.summaryCard} variant="elevated">
              <Typography variant="bodySmall" color={tokens.colors.textSecondary}>
                Payment for
              </Typography>
              <Typography variant="h3" style={styles.description}>
                {description}
              </Typography>
              <Typography variant="h1" style={styles.amount}>
                {formatAmount(amountCents)}
              </Typography>
            </Card>

            <Button title="Confirm Payment" onPress={handlePayment} style={styles.button} />
            <Button
              title="Cancel"
              onPress={() => navigation.goBack()}
              variant="ghost"
              style={styles.cancelButton}
            />
          </>
        )}

        {/* Processing State */}
        {paymentState === 'processing' && (
          <View style={styles.stateContainer}>
            <ActivityIndicator size="large" color={tokens.colors.primary} />
            <Typography variant="h3" style={styles.stateTitle}>
              Processing payment...
            </Typography>
            <Typography variant="body" color={tokens.colors.textSecondary} style={styles.stateSubtitle}>
              Please wait while we process your payment
            </Typography>
          </View>
        )}

        {/* Success State */}
        {paymentState === 'success' && (
          <View style={styles.stateContainer}>
            <View style={[styles.iconCircle, { backgroundColor: tokens.colors.success + '20' }]}>
              <Feather name="check" size={48} color={tokens.colors.success} />
            </View>
            <Typography variant="h2" style={styles.stateTitle}>
              Payment Successful
            </Typography>
            <Typography variant="body" color={tokens.colors.textSecondary} style={styles.stateSubtitle}>
              {formatAmount(amountCents)} paid for {description}
            </Typography>
            <Button title="Done" onPress={handleDone} style={styles.button} />
          </View>
        )}

        {/* Error State */}
        {paymentState === 'error' && (
          <View style={styles.stateContainer}>
            <View style={[styles.iconCircle, { backgroundColor: tokens.colors.error + '20' }]}>
              <Feather name="x" size={48} color={tokens.colors.error} />
            </View>
            <Typography variant="h2" style={styles.stateTitle}>
              Payment Failed
            </Typography>
            <Typography variant="body" color={tokens.colors.textSecondary} style={styles.stateSubtitle}>
              {errorMessage}
            </Typography>
            <Button title="Try Again" onPress={handleRetry} style={styles.button} />
            <Button
              title="Cancel"
              onPress={() => navigation.goBack()}
              variant="ghost"
              style={styles.cancelButton}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  summaryCard: {
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 32,
  },
  description: {
    marginTop: 8,
    textAlign: 'center',
  },
  amount: {
    marginTop: 12,
  },
  button: {
    marginTop: 16,
  },
  cancelButton: {
    marginTop: 8,
  },
  stateContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  stateTitle: {
    marginTop: 16,
    textAlign: 'center',
  },
  stateSubtitle: {
    marginTop: 8,
    textAlign: 'center',
  },
});
