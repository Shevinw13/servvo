/**
 * InvoiceCard — Pressable card displaying invoice summary.
 * Shows service description, amount (formatted as $XX.XX), date, and status badge.
 * Status badge: paid=success, unpaid=warning, overdue=error.
 * Navigates to invoice detail on tap.
 *
 * Validates: Requirements 8.1, 8.2
 */

import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Card, Typography, Badge } from '@/components/ui';
import { useTheme } from '@/theme/BrandThemeProvider';
import type { Invoice, InvoiceStatus } from '@/services/billing.service';

export interface InvoiceCardProps {
  invoice: Invoice;
  onPress: (invoice: Invoice) => void;
}

function formatAmount(amountCents: number): string {
  const dollars = amountCents / 100;
  return `$${dollars.toFixed(2)}`;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getStatusBadgeVariant(status: InvoiceStatus): 'success' | 'warning' | 'error' {
  switch (status) {
    case 'paid':
      return 'success';
    case 'unpaid':
      return 'warning';
    case 'overdue':
      return 'error';
  }
}

function getStatusLabel(status: InvoiceStatus): string {
  switch (status) {
    case 'paid':
      return 'Paid';
    case 'unpaid':
      return 'Unpaid';
    case 'overdue':
      return 'Overdue';
  }
}

export function InvoiceCard({ invoice, onPress }: InvoiceCardProps) {
  const { tokens } = useTheme();

  return (
    <Pressable
      onPress={() => onPress(invoice)}
      accessibilityRole="button"
      accessibilityLabel={`Invoice for ${invoice.description}, ${formatAmount(invoice.amountCents)}, ${getStatusLabel(invoice.status)}`}
    >
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Feather
              name="file-text"
              size={18}
              color={tokens.colors.textSecondary}
              style={styles.icon}
            />
            <Typography variant="h3" style={styles.description} numberOfLines={1}>
              {invoice.description}
            </Typography>
          </View>
          <Badge
            label={getStatusLabel(invoice.status)}
            variant={getStatusBadgeVariant(invoice.status)}
          />
        </View>

        <View style={styles.details}>
          <View style={styles.row}>
            <Typography variant="h2" color={tokens.colors.text}>
              {formatAmount(invoice.amountCents)}
            </Typography>
          </View>
          <View style={styles.row}>
            <Typography variant="bodySmall" color={tokens.colors.textSecondary}>
              Due: {formatDate(invoice.dueDate)}
            </Typography>
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  icon: {
    marginRight: 8,
  },
  description: {
    flex: 1,
  },
  details: {
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
