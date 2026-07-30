"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { deleteServiceAction, togglePublishAction } from "./actions";

export function ServiceRowActions({
  serviceId,
  isPublished,
}: {
  serviceId: string;
  isPublished: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleTogglePublish() {
    setError(null);
    startTransition(async () => {
      const result = await togglePublishAction(serviceId, !isPublished);
      if (result.error) setError(result.error);
    });
  }

  function handleDelete() {
    if (!window.confirm("이 서비스를 삭제할까요? 되돌릴 수 없습니다.")) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteServiceAction(serviceId);
      if (result.error) setError(result.error);
    });
  }

  return (
    <div className="mt-1 flex flex-col gap-1">
      <div className="flex gap-3">
        <Link
          href={`/photographer/services/${serviceId}/edit`}
          className="text-[11px] font-semibold text-stone-600 underline"
        >
          수정
        </Link>
        <button
          type="button"
          disabled={pending}
          onClick={handleTogglePublish}
          className="text-[11px] font-semibold text-stone-600 underline disabled:opacity-40"
        >
          {isPublished ? "비공개로 전환" : "공개로 전환"}
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={handleDelete}
          className="text-[11px] font-semibold text-red-600 underline disabled:opacity-40"
        >
          삭제
        </button>
      </div>
      {error ? <p className="text-[10.5px] text-red-600">{error}</p> : null}
    </div>
  );
}
