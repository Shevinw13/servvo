/**
 * BillingScreen — Displays invoices and payment history in two tabs.
 * Shows current balance at top, with pull-to-refresh on both tabs.
 *
 * Validates: Requirements 8.1, 8.6
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Pressable,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/theme/BrandThemeProvider';
import { Typography, Card } from '@/components/ui';
import { InvoiceCard } from '@/components/billing';
import {
  getInvoices,
  getPaymentHistory,
  type Invoice,
  type Payment,
} from '@/services/billing.service';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BillingStackParamList } from '@/navigation/types';

type TabFilter = 'invoices' | 'history';

type Props = NativeStackScreenProps<BillingStackParamList, 'BillingHome'>;

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

export function BillingScreen({ navigation }: Props) {
  const { tokens } = useTheme();
  const [activeTab, setActiveTab] = useState<TabFilter>('invoices');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchInvoices = useCallback(async () => {
    try {
      const response = await getInvoices(undefined, 1, 20);
      setInvoices(response.data);
    } catch {
      setInvoices([]);
    }
  }, []);

  const fetchPayments = useCallback(async () => {
    try {
      const response = await getPaymentHistory(1, 20);
      setPayments(response.data);
    } catch {
      setPayments([]);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    if (activeTab === 'invoices') {
      fetchInvoices().finally(() => setLoading(false));
    } else {
      fetchPayments().finally(() => setLoading(false));
    }
  }, [activeTab, fetchInvoices, fetchPayments]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    if (activeTab === 'invoices') {
      await fetchInvoices();
    } else {
      await fetchPayments();
    }
    setRefreshing(false);
  }, [activeTab, fetchInvoices, fetchPayments]);

  const handleInvoicePress = useCallback(
    (invoice: Invoice) => {
      navigation.navigate('InvoiceDetail', { invoiceId: invoice.id });
    },
    [navigation],
  );

  const unpaidTotal = invoices
    .filter((inv) => inv.status === 'unpaid' || inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.amountCents, 0);

  const renderBalanceCard = () => (
    <Card style={styles.balanceCard} variant="elevated">
      <Typography variant="bodySmall" color={tokens.colors.textSecondary}>
        Current Balance
      </Typography>
      <Typography variant="h1" color={unpaidTotal > 0 ? tokens.colors.text : tokens.colors.success}>
        {formatAmount(unpaidTotal)}
      </Typography>
      {unpaidTotal === 0 && (
        <Typography variant="bodySmall" color={tokens.colors.success} style={styles.balanceMessage}>
          You're all caught up!
        </Typography>
      )}
    </Card>
  );

  const renderPaymentItem = ({ item }: { item: Payment }) => (
    <Card style={styles.paymentCard}>
      <View style={styles.paymentRow}>
        <View style={styles.paymentLeft}>
          <Feather name="check-circle" size={18} color={tokens.colors.success} style={styles.paymentIcon} />
          <View>
            <Typography variant="body">{formatAmount(item.amountCents)}</Typography>
            <Typography variant="bodySmall" color={tokens.colors.textSecondary}>
              {formatDate(item.createdAt)}
            </Typography>
          </View>
        </View>
        <View style={styles.paymentRight}>
          <Typography variant="bodySmall" color={tokens.colors.textSecondary}>
            •••• {item.paymentMethodLast4}
          </Typography>
        </View>
      </View>
    </Card>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Feather name="inbox" size={48} color={tokens.colors.textMuted} />
      <Typography variant="h3" style={styles.emptyTitle}>
        {activeTab === 'invoices' ? 'No invoices yet' : 'No payment history'}
      </Typography>
      <Typography
        variant="body"
        color={tokens.colors.textSecondary}
        style={styles.emptySubtitle}
      >
        {activeTab === 'invoices'
          ? 'Your invoices will appear here'
          : 'Your payments will appear here'}
      </Typography>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: tokens.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Typography variant="h1">Billing</Typography>
      </View>

      {/* Balance Card */}
      {renderBalanceCard()}

      {/* Tab Buttons */}
      <View style={[styles.tabContainer, { borderBottomColor: tokens.colors.border }]}>
        <Pressable
          onPress={() => setActiveTab('invoices')}
          style={[
            styles.tab,
            activeTab === 'invoices' && {
              borderBottomColor: tokens.colors.primary,
              borderBottomWidth: 2,
            },
          ]}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'invoices' }}
        >
          <Typography
            variant="body"
            color={
              activeTab === 'invoices'
                ? tokens.colors.primary
                : tokens.colors.textMuted
            }
            style={styles.tabText}
          >
            Invoices
          </Typography>
        </Pressable>

        <Pressable
          onPress={() => setActiveTab('history')}
          style={[
            styles.tab,
            activeTab === 'history' && {
              borderBottomColor: tokens.colors.primary,
              borderBottomWidth: 2,
            },
          ]}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'history' }}
        >
          <Typography
            variant="body"
            color={
              activeTab === 'history'
                ? tokens.colors.primary
                : tokens.colors.textMuted
            }
            style={styles.tabText}
          >
            Payment History
          </Typography>
        </Pressable>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={tokens.colors.primary} />
        </View>
      ) : activeTab === 'invoices' ? (
        <FlatList
          data={invoices}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <InvoiceCard invoice={item} onPress={handleInvoicePress} />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={tokens.colors.primary}
            />
          }
        />
      ) : (
        <FlatList
          data={payments}
          keyExtractor={(item) => item.id}
          renderItem={renderPaymentItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={tokens.colors.primary}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
  },
  balanceCard: {
    marginHorizontal: 24,
    marginBottom: 16,
    alignItems: 'center',
    paddingVertical: 24,
  },
  balanceMessage: {
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabText: {
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 64,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    textAlign: 'center',
  },
  paymentCard: {
    marginBottom: 12,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentIcon: {
    marginRight: 12,
  },
  paymentRight: {
    alignItems: 'flex-end',
  },
});
