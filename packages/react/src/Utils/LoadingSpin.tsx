// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";

/**
 * Four-dot spinner shared by the `DataTable` and `Chart` loading overlays.
 */
export function LoadingSpin() {
  const resolveMessage = useResolveMessage();

  return (
    <span
      role="status"
      aria-label={resolveMessage("Loading")}
      className="relative inline-block size-5 animate-spin motion-reduce:animate-none"
    >
      <span className="absolute inset-s-0 top-0 size-2 rounded-full bg-primary-500 opacity-30 dark:bg-primary-400" />
      <span className="absolute inset-e-0 top-0 size-2 rounded-full bg-primary-500 opacity-50 dark:bg-primary-400" />
      <span className="absolute inset-e-0 bottom-0 size-2 rounded-full bg-primary-500 dark:bg-primary-400" />
      <span className="absolute inset-s-0 bottom-0 size-2 rounded-full bg-primary-500 opacity-70 dark:bg-primary-400" />
    </span>
  );
}
