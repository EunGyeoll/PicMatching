"use client";

import { useActionState } from "react";
import { updateProfileAction, type ProfileFormState } from "./actions";

const initialState: ProfileFormState = {};

export function EditProfileForm({
  defaultNickname,
  defaultPhone,
}: {
  defaultNickname: string;
  defaultPhone: string;
}) {
  const [state, formAction, pending] = useActionState(
    updateProfileAction,
    initialState,
  );

  return (
    <form action={formAction} className="mt-8 flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="nickname" className="text-sm font-medium text-stone-700">
          닉네임
        </label>
        <input
          id="nickname"
          name="nickname"
          defaultValue={defaultNickname}
          required
          maxLength={30}
          className="w-full rounded-md border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-stone-500"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="phone" className="text-sm font-medium text-stone-700">
          연락처
        </label>
        <input
          id="phone"
          name="phone"
          defaultValue={defaultPhone}
          maxLength={20}
          placeholder="선택 입력"
          className="w-full rounded-md border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-stone-500"
        />
      </div>

      {state.error ? (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p role="status" className="text-sm text-emerald-600">
          저장되었습니다.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-stone-900 py-3 text-sm font-medium text-white disabled:opacity-50"
      >
        {pending ? "저장 중..." : "저장"}
      </button>
    </form>
  );
}
