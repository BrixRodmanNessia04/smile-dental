"use client";

import { useEffect } from "react";

import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

type UseRealtimeNotificationsOptions = {
  profileId: string | null;
  onChange: () => void;
};

export function useRealtimeNotifications({
  profileId,
  onChange,
}: UseRealtimeNotificationsOptions) {
  useEffect(() => {
    if (!profileId) {
      return;
    }

    const supabase = createBrowserSupabaseClient();
    const channel = supabase
      .channel(`notifications:${profileId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `recipient_profile_id=eq.${profileId}`,
        },
        () => {
          onChange();
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [onChange, profileId]);
}
