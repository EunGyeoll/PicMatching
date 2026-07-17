"use client";

import { useActionState, useState } from "react";
import { ImageUploader, type UploadedImage } from "@/components/upload/image-uploader";
import { TagInput } from "@/components/form/tag-input";
import { DURATION_OPTIONS } from "@/lib/validations/service";
import { createServiceAction, type ServiceFormState } from "../actions";

const initialState: ServiceFormState = {};

export function ServiceForm({
  photographerId,
  tagOptions,
}: {
  photographerId: string;
  tagOptions: {
    purpose: { id: number; label: string }[];
    mood: { id: number; label: string }[];
  };
}) {
  const [state, formAction, pending] = useActionState(createServiceAction, initialState);

  const [serviceId] = useState(() => crypto.randomUUID());
  const [coverImage, setCoverImage] = useState<UploadedImage | null>(null);
  const [duration, setDuration] = useState<number>(60);
  const [customDuration, setCustomDuration] = useState(false);
  const [areas, setAreas] = useState<string[]>([]);
  const [purposeIds, setPurposeIds] = useState<number[]>([]);
  const [moodIds, setMoodIds] = useState<number[]>([]);
  const [isPublished, setIsPublished] = useState(true);

  function toggleId(list: number[], id: number, setList: (v: number[]) => void) {
    setList(list.includes(id) ? list.filter((v) => v !== id) : [...list, id]);
  }

  return (
    <main className="mx-auto max-w-120 px-4 py-6 pb-28">
      <h1 className="text-base font-bold text-stone-900">촬영 서비스 등록</h1>

      <form action={formAction} className="mt-5 flex flex-col gap-6">
        <input type="hidden" name="serviceId" value={serviceId} />
        <input type="hidden" name="coverImagePath" value={coverImage?.path ?? ""} />
        <input type="hidden" name="durationMinutes" value={duration} />
        <input type="hidden" name="bufferAfterMinutes" value={15} />
        <input type="hidden" name="isPublished" value={isPublished ? "on" : ""} />
        {areas.map((area) => (
          <input key={area} type="hidden" name="areas" value={area} />
        ))}
        {purposeIds.map((id) => (
          <input key={id} type="hidden" name="purposeTagIds" value={id} />
        ))}
        {moodIds.map((id) => (
          <input key={id} type="hidden" name="moodTagIds" value={id} />
        ))}

        <Section title="기본 정보">
          <Field label="서비스명" required>
            <input
              name="title"
              required
              maxLength={60}
              placeholder="예: 서울숲 자연광 감성 스냅"
              className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-stone-500"
            />
          </Field>

          <Field label="대표 이미지" required>
            <ImageUploader
              bucket="services"
              shape="wide"
              maxFiles={1}
              images={coverImage ? [coverImage] : []}
              onAdd={setCoverImage}
              onRemove={() => setCoverImage(null)}
              buildPath={(file) => {
                const ext = file.name.split(".").pop() ?? "jpg";
                return `${photographerId}/${serviceId}/cover.${ext}`;
              }}
            />
          </Field>

          <Field label="가격 (원)" required>
            <input
              name="price"
              type="number"
              min={0}
              required
              placeholder="90000"
              className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-stone-500"
            />
          </Field>

          <Field label="촬영 시간" required>
            <div className="flex flex-wrap gap-1.5">
              {DURATION_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setDuration(option);
                    setCustomDuration(false);
                  }}
                  className={`rounded-full border px-3 py-1.5 text-xs ${
                    !customDuration && duration === option
                      ? "border-stone-900 bg-stone-900 text-white"
                      : "border-stone-200 text-stone-600"
                  }`}
                >
                  {option}분
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCustomDuration(true)}
                className={`rounded-full border px-3 py-1.5 text-xs ${
                  customDuration
                    ? "border-stone-900 bg-stone-900 text-white"
                    : "border-stone-200 text-stone-600"
                }`}
              >
                직접 입력
              </button>
            </div>
            {customDuration ? (
              <input
                type="number"
                min={10}
                max={600}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="mt-2 w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-stone-500"
              />
            ) : null}
          </Field>
        </Section>

        <Section title="설명 · 태그">
          <Field label="상세 설명" required>
            <textarea
              name="description"
              required
              rows={4}
              placeholder="촬영 장소, 분위기, 진행 방식 등을 소개해주세요"
              className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-stone-500"
            />
          </Field>

          <Field label="포함 사항">
            <textarea
              name="inclusions"
              rows={2}
              placeholder="예: 보정본 20장, 촬영 장소 이동 1회 포함"
              className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-stone-500"
            />
          </Field>

          <Field label="활동 가능 지역" required>
            <TagInput values={areas} onChange={setAreas} placeholder="예: 성수" />
          </Field>

          <Field label="촬영 목적">
            <div className="flex flex-wrap gap-1.5">
              {tagOptions.purpose.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleId(purposeIds, tag.id, setPurposeIds)}
                  className={`rounded-full border px-3 py-1.5 text-xs ${
                    purposeIds.includes(tag.id)
                      ? "border-stone-900 bg-stone-900 text-white"
                      : "border-stone-200 text-stone-600"
                  }`}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </Field>

          <Field label="무드">
            <div className="flex flex-wrap gap-1.5">
              {tagOptions.mood.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleId(moodIds, tag.id, setMoodIds)}
                  className={`rounded-full border px-3 py-1.5 text-xs ${
                    moodIds.includes(tag.id)
                      ? "border-stone-900 bg-stone-900 text-white"
                      : "border-stone-200 text-stone-600"
                  }`}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </Field>
        </Section>

        <details className="rounded-lg border border-stone-200 px-4 py-3">
          <summary className="cursor-pointer text-xs font-bold text-stone-500">
            선택 정보 더보기 (보정본 수 · 원본 제공 · 전달 기간 · 최대 인원 · 추가 비용 등)
          </summary>
          <div className="mt-4 flex flex-col gap-4">
            <Field label="보정본 수">
              <input
                name="retouchedPhotoCount"
                type="number"
                min={0}
                className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-stone-500"
              />
            </Field>
            <label className="flex items-center gap-2 text-xs text-stone-600">
              <input type="checkbox" name="providesRawFiles" className="size-4" />
              보정 전 원본 제공
            </label>
            <label className="flex items-center gap-2 text-xs text-stone-600">
              <input type="checkbox" name="providesAllRawFiles" className="size-4" />
              전체 원본 제공
            </label>
            <Field label="결과물 전달 기간 (일)">
              <input
                name="deliveryDays"
                type="number"
                min={0}
                className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-stone-500"
              />
            </Field>
            <Field label="최대 촬영 인원">
              <input
                name="maxParticipants"
                type="number"
                min={1}
                className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-stone-500"
              />
            </Field>
            <label className="flex items-center gap-2 text-xs text-stone-600">
              <input type="checkbox" name="allowsOutfitChange" className="size-4" />
              의상 변경 가능
            </label>
            <Field label="추천 대상">
              <input
                name="recommendedFor"
                className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-stone-500"
              />
            </Field>
            <Field label="추가 비용 발생 조건">
              <textarea
                name="extraFeeConditions"
                rows={2}
                className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-stone-500"
              />
            </Field>
            <Field label="장소 이동비 (원)">
              <input
                name="travelFee"
                type="number"
                min={0}
                className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-stone-500"
              />
            </Field>
            <Field label="야간 촬영 추가 비용 (원)">
              <input
                name="nightSurcharge"
                type="number"
                min={0}
                className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-stone-500"
              />
            </Field>
            <Field label="주말 추가 비용 (원)">
              <input
                name="weekendSurcharge"
                type="number"
                min={0}
                className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-stone-500"
              />
            </Field>
            <Field label="기타 안내사항">
              <textarea
                name="notes"
                rows={2}
                className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-stone-500"
              />
            </Field>
          </div>
        </details>

        <div className="flex items-center justify-between rounded-lg border border-stone-200 px-4 py-3">
          <span className="text-xs font-bold text-stone-700">탐색 화면에 공개</span>
          <button
            type="button"
            role="switch"
            aria-checked={isPublished}
            onClick={() => setIsPublished((v) => !v)}
            className={`h-6 w-10 rounded-full transition-colors ${isPublished ? "bg-stone-900" : "bg-stone-200"}`}
          >
            <span
              className={`block size-5 translate-y-0.5 rounded-full bg-white transition-transform ${
                isPublished ? "translate-x-4.5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        {state.error ? (
          <p className="text-xs text-red-600" role="alert">
            {state.error}
          </p>
        ) : null}

        <div className="fixed inset-x-0 bottom-0 mx-auto max-w-120 border-t border-stone-200 bg-white p-4 pb-[max(16px,env(safe-area-inset-bottom))]">
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-stone-900 py-3.5 text-sm font-bold text-white disabled:opacity-40"
          >
            {pending ? "저장 중..." : "저장"}
          </button>
        </div>
      </form>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xs font-bold text-stone-400 uppercase">{title}</h2>
      {children}
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-bold text-stone-500">
        {label}
        {required ? <span className="text-stone-400"> · 필수</span> : null}
      </span>
      {children}
    </label>
  );
}
