"use client";

import { useActionState, useState } from "react";
import { DOW_LABEL_KO } from "@/lib/date-time";
import { updateAvailabilityAction, type AvailabilityFormState } from "./actions";
import type { AvailabilityRuleInput } from "@/lib/validations/availability";

const initialState: AvailabilityFormState = {};

export function AvailabilityForm({
  initialRules,
}: {
  initialRules: AvailabilityRuleInput[];
}) {
  const [state, formAction, pending] = useActionState(updateAvailabilityAction, initialState);
  const [rules, setRules] = useState(initialRules);

  function updateRule(dayOfWeek: number, patch: Partial<AvailabilityRuleInput>) {
    setRules((prev) =>
      prev.map((r) => (r.dayOfWeek === dayOfWeek ? { ...r, ...patch } : r)),
    );
  }

  return (
    <form action={formAction} className="mt-4 flex flex-col gap-6">
      <input type="hidden" name="rules" value={JSON.stringify(rules)} />

      <div className="flex flex-col divide-y divide-stone-100 rounded-xl border border-stone-200">
        {rules.map((rule) => (
          <div key={rule.dayOfWeek} className="flex items-center gap-3 px-4 py-3">
            <button
              type="button"
              role="switch"
              aria-checked={rule.enabled}
              onClick={() => updateRule(rule.dayOfWeek, { enabled: !rule.enabled })}
              className={`h-6 w-10 shrink-0 rounded-full transition-colors ${
                rule.enabled ? "bg-stone-900" : "bg-stone-200"
              }`}
            >
              <span
                className={`block size-5 translate-y-0.5 rounded-full bg-white transition-transform ${
                  rule.enabled ? "translate-x-4.5" : "translate-x-0.5"
                }`}
              />
            </button>

            <span className="w-6 shrink-0 text-sm font-bold text-stone-900">
              {DOW_LABEL_KO[rule.dayOfWeek]}
            </span>

            {rule.enabled ? (
              <div className="flex flex-1 items-center justify-end gap-1.5">
                <input
                  type="time"
                  value={rule.startTime}
                  onChange={(e) => updateRule(rule.dayOfWeek, { startTime: e.target.value })}
                  className="w-24 rounded-lg border border-stone-300 px-2 py-1.5 text-xs outline-none focus:border-stone-500"
                />
                <span className="text-xs text-stone-400">–</span>
                <input
                  type="time"
                  value={rule.endTime}
                  onChange={(e) => updateRule(rule.dayOfWeek, { endTime: e.target.value })}
                  className="w-24 rounded-lg border border-stone-300 px-2 py-1.5 text-xs outline-none focus:border-stone-500"
                />
              </div>
            ) : (
              <span className="flex-1 text-right text-xs text-stone-400">휴무</span>
            )}
          </div>
        ))}
      </div>

      {state.error ? (
        <p className="text-xs text-red-600" role="alert">
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p className="text-xs text-emerald-700" role="status">
          저장됐어요.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-stone-900 py-3.5 text-sm font-bold text-white disabled:opacity-40"
      >
        {pending ? "저장 중..." : "저장"}
      </button>
    </form>
  );
}
