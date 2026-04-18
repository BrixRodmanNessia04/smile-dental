export function buildGenericNotificationTemplate(params: {
  title: string;
  message: string;
}) {
  return {
    title: params.title,
    message: params.message,
  };
}
