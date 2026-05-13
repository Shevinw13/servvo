/**
 * PaymentMethodCard — Displays a saved payment method.
 * Shows card brand icon (text placeholder), last 4 digits, expiry.
 * Includes a delete button (trash icon).
 *
 * Validates: Requirements 8.5
 */

import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Card, Typography } from '@/components/ui';
import { useTheme } from '@/theme/BrandThemeProvider';
import type { PaymentMethod } from '@/services/billing.service';

export interface PaymentMethodCardProps {
  method: PaymentMethod;
  onDelete: (method: PaymentMethod) => void;
}

function getCardBrandIcon(brand: string): string {
  switch (brand.toLowerCase()) {
    case 'visa':
      return 'credit-card';
    case 'mastercard':
      return 'credit-card';
    case 'amex':
      return 'credit-card';
    default:
      return 'credit-card';
  }
}

function formatExpiry(month: number, year: number): string {
  const monthStr = month.toString().padStart(2, '0');
  const yearStr = year.toString().slice(-2);
  return `${monthStr}/${yearStr}`;
}

export function PaymentMethodCard({ method, onDelete }: PaymentMethodCardProps) {
  const { tokens } = useTheme();

  return (
    <Card style={styles.card}>
      <View style={styles.content}>
        <View style={styles.left}>
          <Feather
            name={getCardBrandIcon(method.brand) as any}
            size={24}
            color={tokens.colors.primary}
            style={styles.cardIcon}
          />
          <View style={styles.info}>
            <Typography variant="body" style={styles.brandText}>
              {method.brand.charAt(0).toUpperCase() + method.brand.slice(1)} •••• {method.last4}
            </Typography>
            <Typography variant="bodySmall" color={tokens.colors.textSecondary}>
              Expires {formatExpiry(method.expMonth, method.expYear)}
            </Typography>
          </View>
        </View>

        <Pressable
          onPress={() => onDelete(method)}
          accessibilityRole="button"
          accessibilityLabel={`Remove card ending in ${method.last4}`}
          style={styles.deleteButton}
          hitSlop={8}
        >
          <Feather name="trash-2" size={20} color={tokens.colors.error} />
        </Pressable>
      </View>

      {method.isDefault && (
        <View style={[styles.defaultBadge, { backgroundColor: tokens.colors.accent + '20' }]}>
          <Typography variant="caption" color={tokens.colors.accent}>
            Default
          </Typography>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardIcon: {
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  brandText: {
    fontWeight: '500',
  },
  deleteButton: {
    padding: 8,
  },
  defaultBadge: {
    marginTop: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
});
