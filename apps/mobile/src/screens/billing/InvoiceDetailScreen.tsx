/**
 * InvoiceDetailScreen — Full invoice details with payment action.
 * Shows amount, date, service description, status.
 * "Pay Now" button for unpaid invoices.
 * Payment confirmation state after successful payment.
 *
 * Validates: Requirements 8.2, 8.3, 8.4
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/theme/BrandThemeProvider';
import { Typography, Card, Button, Badge } from '@/components/ui';
import {
  getInvoiceById,
  type Invoice,
  type InvoiceStatus,
} from '@/services/billing.service';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BillingStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<BillingStackParamList, 'InvoiceDetail'>;

function formatAmount(amountCents: number): string {
  const dollars = amountCents / 100;
  return `$${dollars.toFixed(2)}`;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
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

export function InvoiceDetailScreen({ route, navigation }: Props) {
  const { tokens } = useTheme();
  const { invoiceId } = route.params;
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInvoice() {
      try {
        const data = await getInvoiceById(invoiceId);
        setInvoice(data);
      } catch {
        setError('Failed to load invoice details');
      } finally {
        setLoading(false);
      }
    }
    fetchInvoice();
  }, [invoiceId]);

  const handlePayNow = useCallback(() => {
    if (invoice) {
      navigation.navigate('Payment', {
        invoiceId: invoice.id,
        amountCents: invoice.amountCents,
        description: invoice.description,
      });
    }
  }, [invoice, navigation]);

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: tokens.colors.background }]}>
        <ActivityIndicator size="large" color={tokens.colors.primary} />
      </View>
    );
  }

  if (error || !invoice) {
    return (
      <View style={[styles.centered, { backgroundColor: tokens.colors.background }]}>
        <Feather name="alert-circle" size={48} color={tokens.colors.error} />
        <Typography variant="body" color={tokens.colors.error} style={styles.errorText}>
          {error || 'Invoice not found'}
        </Typography>
      </View>
    );
  }

  const isPayable = invoice.status === 'unpaid' || invoice.status === 'overdue';

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: tokens.colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Amount Card */}
      <Card style={styles.amountCard} variant="elevated">
        <Typography variant="bodySmall" color={tokens.colors.textSecondary}>
          Amount Due
        </Typography>
        <Typography variant="h1" style={styles.amount}>
          {formatAmount(invoice.amountCents)}
        </Typography>
        <Badge
          label={getStatusLabel(invoice.status)}
          variant={getStatusBadgeVariant(invoice.status)}
          style={styles.statusBadge}
        />
      </Card>

      {/* Details */}
      <Card style={styles.detailsCard}>
        <View style={styles.detailRow}>
          <Typography variant="bodySmall" color={tokens.colors.textSecondary}>
            Service
          </Typography>
          <Typography variant="body">{invoice.description}</Typography>
        </View>

        <View style={[styles.detailRow, styles.divider, { borderTopColor: tokens.colors.border }]}>
          <Typography variant="bodySmall" color={tokens.colors.textSecondary}>
            Due Date
          </Typography>
          <Typography variant="body">{formatDate(invoice.dueDate)}</Typography>
        </View>

        <View style={[styles.detailRow, styles.divider, { borderTopColor: tokens.colors.border }]}>
          <Typography variant="bodySmall" color={tokens.colors.textSecondary}>
            Invoice Date
          </Typography>
          <Typography variant="body">{formatDate(invoice.createdAt)}</Typography>
        </View>

        <View style={[styles.detailRow, styles.divider, { borderTopColor: tokens.colors.border }]}>
          <Typography variant="bodySmall" color={tokens.colors.textSecondary}>
            Invoice ID
          </Typography>
          <Typography variant="bodySmall" color={tokens.colors.textMuted}>
            {invoice.id.slice(0, 8).toUpperCase()}
          </Typography>
        </View>
      </Card>

      {/* Pay Now Button */}
      {isPayable && (
        <View style={styles.payButtonContainer}>
          <Button title="Pay Now" onPress={handlePayNow} />
        </View>
      )}

      {/* Paid Confirmation */}
      {invoice.status === 'paid' && (
        <Card style={styles.paidCard}>
          <View style={styles.paidContent}>
            <Feather name="check-circle" size={24} color={tokens.colors.success} />
            <Typography variant="body" color={tokens.colors.success} style={styles.paidText}>
              This invoice has been paid
            </Typography>
          </View>
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    marginTop: 12,
    textAlign: 'center',
  },
  amountCard: {
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 16,
  },
  amount: {
    marginTop: 4,
    marginBottom: 12,
  },
  statusBadge: {
    alignSelf: 'center',
  },
  detailsCard: {
    marginBottom: 24,
  },
  detailRow: {
    paddingVertical: 12,
  },
  divider: {
    borderTopWidth: 1,
  },
  payButtonContainer: {
    marginBottom: 24,
  },
  paidCard: {
    marginBottom: 24,
  },
  paidContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paidText: {
    marginLeft: 12,
  },
});
