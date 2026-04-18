import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

type QueueNotificationEmailInput = {
  profileId: string | null;
  notificationId?: string | null;
  emailTo: string;
  subject: string;
  templateKey?: string | null;
};

export async function queueNotificationEmail(
  supabase: SupabaseClient<Database>,
  input: QueueNotificationEmailInput,
) {
  // Provider integration is intentionally abstract for this step.
  const { error } = await supabase.from("email_logs").insert({
    profile_id: input.profileId,
    notification_id: input.notificationId ?? null,
    email_to: input.emailTo,
    subject: input.subject,
    template_key: input.templateKey ?? null,
    status: "queued",
  });

  if (error) {
    return {
      ok: false as const,
      message: "Unable to queue notification email.",
    };
  }

  return {
    ok: true as const,
  };
}
