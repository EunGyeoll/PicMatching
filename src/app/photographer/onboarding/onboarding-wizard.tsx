"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { ImageUploader, type UploadedImage } from "@/components/upload/image-uploader";
import { AREA_OPTIONS } from "@/lib/constants/areas";
import {
  onboardingStep1Schema,
  onboardingStep2Schema,
  onboardingStep3Schema,
} from "@/lib/validations/photographer";
import { completeOnboardingAction } from "./actions";

type Props = {
  userId: string;
  initialAvatarUrl: string | null;
  initialDisplayName: string;
  initialHeadline: string;
  initialBio: string;
  initialAreas: string[];
  initialContactInfo: string;
  initialPortfolio: { path: string; url: string }[];
};

export function OnboardingWizard({
  userId,
  initialAvatarUrl,
  initialDisplayName,
  initialHeadline,
  initialBio,
  initialAreas,
  initialContactInfo,
  initialPortfolio,
}: Props) {
  const router = useRouter();
  const isEdit = initialDisplayName.length > 0;
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const [avatar, setAvatar] = useState<UploadedImage | null>(
    initialAvatarUrl ? { path: "", url: initialAvatarUrl } : null,
  );
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [headline, setHeadline] = useState(initialHeadline);
  const [bio, setBio] = useState(initialBio);
  const [areas, setAreas] = useState<string[]>(initialAreas);
  const [portfolio, setPortfolio] = useState<UploadedImage[]>(
    initialPortfolio.map((p) => ({ path: p.path, url: p.url })),
  );
  const [contactInfo, setContactInfo] = useState(initialContactInfo);

  function goNext() {
    setError(null);
    if (step === 1) {
      const parsed = onboardingStep1Schema.safeParse({ displayName, headline });
      if (!parsed.success) {
        setError(parsed.error.issues[0]?.message ?? "입력값을 확인해주세요.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      const parsed = onboardingStep2Schema.safeParse({ bio, areas });
      if (!parsed.success) {
        setError(parsed.error.issues[0]?.message ?? "입력값을 확인해주세요.");
        return;
      }
      setStep(3);
    }
  }

  function goBack() {
    setError(null);
    if (step > 1) {
      setStep((s) => (s - 1) as 1 | 2 | 3);
    } else {
      router.back();
    }
  }

  async function handleSubmit() {
    setError(null);
    const portfolioPaths = portfolio.map((p) => p.path).filter(Boolean);
    const parsed = onboardingStep3Schema.safeParse({
      contactInfo,
      portfolioPaths,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "입력값을 확인해주세요.");
      return;
    }

    setPending(true);
    const result = await completeOnboardingAction({
      displayName,
      headline,
      bio,
      areas,
      contactInfo,
      portfolioPaths,
      avatarUrl: avatar?.url && avatar.path ? avatar.url : null,
    });
    if (result.error) {
      setError(result.error);
      setPending(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-120 flex-col pb-24">
      <div className="border-b border-stone-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goBack}
            aria-label={step > 1 ? "이전 단계" : "나가기"}
            className="-ml-2 flex size-11 items-center justify-center text-stone-400"
          >
            <ChevronLeft className="size-5" />
          </button>
          <span className="text-sm font-bold text-stone-900">
            {isEdit ? "촬영자 정보 수정" : "촬영자 등록"}
          </span>
        </div>
        <div className="mt-2.5 flex gap-1">
          {[1, 2, 3].map((i) => (
            <span
              key={i}
              className={`h-[3px] flex-1 rounded-full ${i <= step ? "bg-stone-900" : "bg-stone-200"}`}
            />
          ))}
        </div>
      </div>

      {step === 1 ? (
        <div className="flex flex-col gap-5 p-4">
          <ImageUploader
            bucket="avatars"
            shape="circle"
            maxFiles={1}
            images={avatar ? [avatar] : []}
            onAdd={(img) => setAvatar(img)}
            onRemove={() => setAvatar(null)}
            buildPath={(file) => {
              const ext = file.name.split(".").pop() ?? "jpg";
              return `${userId}/profile.${ext}`;
            }}
          />
          <Field label="활동명" required>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="예: 서울숲 스냅 — 지호"
              className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-stone-500"
            />
          </Field>
          <Field label="한 줄 소개" required>
            <input
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="예: 자연광을 좋아하는 성수동 스냅 작가"
              className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-stone-500"
            />
          </Field>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="flex flex-col gap-5 p-4">
          <Field label="상세 소개" required>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={5}
              placeholder="촬영 스타일, 경력, 좋아하는 무드 등을 자유롭게 소개해주세요"
              className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-stone-500"
            />
          </Field>
          <Field label="주요 활동 지역" required>
            <div className="flex flex-wrap gap-1.5">
              {AREA_OPTIONS.map((area) => (
                <button
                  key={area}
                  type="button"
                  onClick={() =>
                    setAreas((prev) =>
                      prev.includes(area) ? prev.filter((v) => v !== area) : [...prev, area],
                    )
                  }
                  className={`rounded-full border px-3 py-1.5 text-xs ${
                    areas.includes(area)
                      ? "border-stone-900 bg-stone-900 text-white"
                      : "border-stone-200 text-stone-600"
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </Field>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="flex flex-col gap-5 p-4">
          <Field label="포트폴리오" required hint="최소 3장 이상 등록해주세요">
            <ImageUploader
              bucket="portfolios"
              maxFiles={30}
              images={portfolio}
              onAdd={(img) => setPortfolio((prev) => [...prev, img])}
              onRemove={(path) =>
                setPortfolio((prev) => prev.filter((p) => p.path !== path))
              }
              buildPath={(file) => {
                const ext = file.name.split(".").pop() ?? "jpg";
                return `${userId}/${crypto.randomUUID()}.${ext}`;
              }}
            />
          </Field>
          <Field
            label="촬영 안내사항"
            required
            hint="예약이 완료된 고객에게 보여드릴 안내예요. 카카오톡·이메일 등 외부 연락처 대신, 준비물이나 만남 방법처럼 예약 진행에 필요한 내용을 적어주세요."
          >
            <textarea
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              rows={3}
              placeholder="예: 약속 장소 근처 도착하시면 문자로 안내드릴게요. 편한 신발 추천드려요."
              className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-stone-500"
            />
          </Field>
        </div>
      ) : null}

      {error ? (
        <p className="px-4 pb-2 text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <div className="fixed inset-x-0 bottom-0 mx-auto max-w-120 border-t border-stone-200 bg-white p-4 pb-[max(16px,env(safe-area-inset-bottom))]">
        {step < 3 ? (
          <button
            type="button"
            onClick={goNext}
            className="w-full rounded-lg bg-stone-900 py-3.5 text-sm font-bold text-white"
          >
            다음
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={pending}
              className="w-full rounded-lg bg-stone-900 py-3.5 text-sm font-bold text-white disabled:opacity-40"
            >
              {isEdit
                ? pending
                  ? "저장 중..."
                  : "수정 완료"
                : pending
                  ? "등록 중..."
                  : "등록 완료"}
            </button>
            <p className="mt-2 text-center text-[10.5px] text-stone-400">
              {isEdit
                ? "수정한 내용은 촬영자 상세 화면에 바로 반영돼요"
                : "완료 후 마이페이지에서 촬영자 모드로 전환할 수 있어요"}
            </p>
          </>
        )}
      </div>
    </main>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-bold text-stone-500">
        {label}
        {required ? <span className="text-stone-400"> · 필수</span> : null}
      </span>
      {children}
      {hint ? <span className="text-[10.5px] text-stone-400">{hint}</span> : null}
    </label>
  );
}
