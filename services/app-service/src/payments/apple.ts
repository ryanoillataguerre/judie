import {
  decodeNotificationPayload,
  decodeRenewalInfo,
  decodeTransaction,
  NotificationSubtype,
  NotificationType,
} from "app-store-server-api";
import {
  handleAppleSubscriptionCreated,
  handleAppleSubscriptionRenewalPrefsChanged,
  handleAppleSubscriptionExpired,
  handleAppleSubscriptionRenewal,
} from "./service.js";

export const handleAppleWebhookEvents = async (signedPayload: string) => {
  const payload = await decodeNotificationPayload(signedPayload);
  const transactionInfo = await decodeTransaction(
    payload.data.signedTransactionInfo
  );
  switch (payload.notificationType) {
    case NotificationType.Subscribed:
      await handleAppleSubscriptionCreated(transactionInfo);
      break;
    case NotificationType.DidChangeRenewalPref:
      await handleAppleSubscriptionRenewalPrefsChanged(transactionInfo);
    case (NotificationType.Expired,
    NotificationType.Revoke,
    NotificationType.GracePeriodExpired):
      await handleAppleSubscriptionExpired(transactionInfo);
      break;
    case NotificationType.DidFailToRenew:
      if (payload.subtype != NotificationSubtype.GracePeriod) {
        await handleAppleSubscriptionExpired(transactionInfo);
      }
      break;
    case (NotificationType.RenewalExtended, NotificationType.DidRenew):
      await handleAppleSubscriptionRenewal(transactionInfo);
      break;
    default:
      console.log(
        `Apple NotificationType not handled: ${payload.notificationType}`
      );
  }
};
