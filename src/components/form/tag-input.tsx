"use client";

import { useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";

// 지역처럼 정해진 목록이 없는 자유 입력 값을 chip 형태로 추가/삭제합니다.
export function TagInput({
  values,
  onChange,
  placeholder,
  max = 10,
}: {
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  max?: number;
}) {
  const [draft, setDraft] = useState("");

  function addValue() {
    const trimmed = draft.trim();
    if (!trimmed || values.includes(trimmed) || values.length >= max) {
      setDraft("");
      return;
    }
    onChange([...values, trimmed]);
    setDraft("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addValue();
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1.5">
        {values.map((value) => (
          <span
            key={value}
            className="flex items-center gap-1 rounded-full border border-stone-300 bg-stone-100 px-3 py-1.5 text-xs text-stone-700"
          >
            {value}
            <button
              type="button"
              onClick={() => onChange(values.filter((v) => v !== value))}
              aria-label={`${value} 삭제`}
              className="-my-1.5 p-1.5"
            >
              <X className="size-3" />
            </button>
          </span>
        ))}
      </div>
      {values.length < max ? (
        <div className="flex gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-500"
          />
          <button
            type="button"
            onClick={addValue}
            className="rounded-md border border-stone-300 px-3 text-sm text-stone-600"
          >
            추가
          </button>
        </div>
      ) : null}
    </div>
  );
}
