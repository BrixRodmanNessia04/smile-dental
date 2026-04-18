type UnreadCountBadgeProps = {
  count: number;
};

export default function UnreadCountBadge({ count }: UnreadCountBadgeProps) {
  if (count <= 0) {
    return null;
  }

  return (
    <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-accent px-1.5 py-0.5 text-xs font-semibold text-accent-foreground">
      {count > 99 ? "99+" : count}
    </span>
  );
}
