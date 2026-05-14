'use client';

import { PageTransition } from '@/components/shared/PageTransition';
import { ToneSelector } from '@/components/customer-experience/ToneSelector';
import { NotificationTemplateEditor } from '@/components/customer-experience/NotificationTemplateEditor';
import { ServiceStatusMessages } from '@/components/customer-experience/ServiceStatusMessages';
import { ReviewRequestSettings } from '@/components/customer-experience/ReviewRequestSettings';
import { RebookingSettings } from '@/components/customer-experience/RebookingSettings';
import { useBrandConfig } from '@/hooks/useBrandConfig';
import { getTemplatesForTone } from '@/data/mockNotificationTemplates';
import { MessagingTone } from '@/types/brand';

export default function CustomerExperiencePage() {
  const { config, setMessagingTone, setNotifications } = useBrandConfig();
  const { notifications, messagingTone } = config;

  const handleToneChange = (tone: MessagingTone) => {
    setMessagingTone(tone);
    // Update templates to match the new tone
    const newTemplates = getTemplatesForTone(tone);
    setNotifications({ ...notifications, templates: newTemplates });
  };

  const handleTemplatesChange = (templates: typeof notifications.templates) => {
    setNotifications({ ...notifications, templates });
  };

  const handleReviewToggle = (enabled: boolean) => {
    setNotifications({ ...notifications, autoReviewRequest: enabled });
  };

  const handleReviewDelayChange = (hours: number) => {
    setNotifications({ ...notifications, reviewRequestDelay: hours });
  };

  const handleRebookingToggle = (enabled: boolean) => {
    setNotifications({ ...notifications, autoRebooking: enabled });
  };

  return (
    <PageTransition>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Customer Experience</h1>
          <p className="mt-1 text-muted-foreground">
            Configure how your customers experience your brand through notifications and messaging
          </p>
        </div>

        <ToneSelector value={messagingTone} onChange={handleToneChange} />
        <NotificationTemplateEditor
          templates={notifications.templates}
          onChange={handleTemplatesChange}
        />
        <ServiceStatusMessages />
        <ReviewRequestSettings
          enabled={notifications.autoReviewRequest}
          delay={notifications.reviewRequestDelay}
          onToggle={handleReviewToggle}
          onDelayChange={handleReviewDelayChange}
        />
        <RebookingSettings
          enabled={notifications.autoRebooking}
          onToggle={handleRebookingToggle}
        />
      </div>
    </PageTransition>
  );
}
