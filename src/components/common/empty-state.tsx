import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
      {icon ? <div className="text-2xl opacity-50">{icon}</div> : null}
      <p className="text-sm font-semibold text-stone-700">{title}</p>
      {description ? (
        <p className="text-xs text-stone-400">{description}</p>
      ) : null}
      {action}
    </div>
  );
}
