/**
 * ReviewFlowScreen — Star rating (1-5) with optional comment and submit.
 * Shows a thank-you confirmation after successful submission.
 *
 * Validates: Requirements 7.1
 */

import React, { useCallback, useState } from 'react';
import {
  View,
  ScrollView,
  Pressable,
  StyleSheet,
  TextInput,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/theme/BrandThemeProvider';
import { Typography, Card, Button } from '@/components/ui';
import { createReview } from '@/services/reviews.service';

interface ReviewFlowScreenProps {
  route: { params: { appointmentId: string } };
  navigation: { goBack: () => void };
}

export function ReviewFlowScreen({ route, navigation }: ReviewFlowScreenProps) {
  const { tokens } = useTheme();
  const { appointmentId } = route.params;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (rating === 0) return;

    setSubmitting(true);
    try {
      await createReview({
        appointmentId,
        rating,
        comment: comment.trim() || undefined,
      });
      setSubmitted(true);
    } catch {
      // Silently handle — could show error toast
    } finally {
      setSubmitting(false);
    }
  }, [appointmentId, rating, comment]);

  if (submitted) {
    return (
      <View
        style={[
          styles.container,
          styles.centeredContainer,
          { backgroundColor: tokens.colors.background },
        ]}
      >
        <Feather name="check-circle" size={64} color={tokens.colors.success} />
        <Typography variant="h2" style={styles.thankYouTitle}>
          Thank You!
        </Typography>
        <Typography
          variant="body"
          color={tokens.colors.textSecondary}
          style={styles.thankYouSubtitle}
        >
          Your review has been submitted successfully.
        </Typography>
        <Button
          title="Done"
          onPress={() => navigation.goBack()}
          style={styles.doneButton}
        />
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: tokens.colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Typography variant="h1">Leave a Review</Typography>
          <Typography
            variant="body"
            color={tokens.colors.textSecondary}
            style={styles.subtitle}
          >
            How was your service experience?
          </Typography>
        </View>

        {/* Star Rating */}
        <Card style={styles.section}>
          <Typography variant="h3" style={styles.sectionTitle}>
            Rating
          </Typography>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Pressable
                key={star}
                onPress={() => setRating(star)}
                accessibilityRole="button"
                accessibilityLabel={`Rate ${star} star${star > 1 ? 's' : ''}`}
                accessibilityState={{ selected: rating >= star }}
                style={styles.starButton}
              >
                <Feather
                  name="star"
                  size={36}
                  color={
                    rating >= star
                      ? tokens.colors.warning
                      : tokens.colors.border
                  }
                  fill={rating >= star ? tokens.colors.warning : 'none'}
                />
              </Pressable>
            ))}
          </View>
          {rating > 0 && (
            <Typography
              variant="bodySmall"
              color={tokens.colors.textSecondary}
              style={styles.ratingLabel}
            >
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
            </Typography>
          )}
        </Card>

        {/* Comment */}
        <Card style={styles.section}>
          <Typography variant="h3" style={styles.sectionTitle}>
            Comment (optional)
          </Typography>
          <TextInput
            style={[
              styles.textArea,
              {
                borderColor: tokens.colors.border,
                color: tokens.colors.text,
              },
            ]}
            placeholder="Share your experience..."
            placeholderTextColor={tokens.colors.textMuted}
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </Card>
      </ScrollView>

      {/* Submit Button */}
      <View style={[styles.footer, { borderTopColor: tokens.colors.border }]}>
        <Button
          title="Submit Review"
          onPress={handleSubmit}
          disabled={rating === 0}
          loading={submitting}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  subtitle: {
    marginTop: 8,
  },
  section: {
    marginHorizontal: 24,
    marginTop: 16,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  starButton: {
    padding: 4,
  },
  ratingLabel: {
    textAlign: 'center',
    marginTop: 8,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    minHeight: 100,
    fontSize: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    backgroundColor: '#FFFFFF',
  },
  thankYouTitle: {
    marginTop: 24,
    textAlign: 'center',
  },
  thankYouSubtitle: {
    marginTop: 8,
    textAlign: 'center',
  },
  doneButton: {
    marginTop: 32,
    width: '100%',
  },
});
