"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Plus, X, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export type UploadedImage = { path: string; url: string };

export function ImageUploader({
  bucket,
  images,
  onAdd,
  onRemove,
  buildPath,
  maxFiles = 1,
  shape = "square",
}: {
  bucket: "avatars" | "portfolios" | "services";
  images: UploadedImage[];
  onAdd: (image: UploadedImage) => void;
  onRemove: (path: string) => void;
  buildPath: (file: File) => string;
  maxFiles?: number;
  shape?: "square" | "circle" | "wide";
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canAddMore = images.length < maxFiles;

  function validate(file: File): string | null {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return "jpg, png, webp 형식의 이미지만 업로드할 수 있습니다.";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "이미지 용량은 8MB 이하여야 합니다.";
    }
    return null;
  }

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setError(null);

    const files = Array.from(fileList).slice(0, maxFiles - images.length);
    const supabase = createClient();

    setUploading(true);
    for (const file of files) {
      const validationError = validate(file);
      if (validationError) {
        setError(validationError);
        continue;
      }

      const path = buildPath(file);
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file, { upsert: true });

      if (uploadError) {
        console.error("Storage upload failed", { bucket, path, uploadError });
        setError(`업로드 중 문제가 발생했습니다: ${uploadError.message}`);
        continue;
      }

      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      // 같은 경로에 덮어쓴 경우에도 Next.js Image 캐시가 이전 이미지를 그대로 보여주지
      // 않도록, 업로드 시각을 붙여 매번 새로운 URL을 만든다.
      onAdd({ path, url: `${data.publicUrl}?v=${Date.now()}` });
    }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleRemove(path: string) {
    const supabase = createClient();
    await supabase.storage.from(bucket).remove([path]);
    onRemove(path);
  }

  const cellShape =
    shape === "circle"
      ? "rounded-full"
      : shape === "wide"
        ? "aspect-video rounded-lg"
        : "aspect-square rounded-lg";

  return (
    <div className="flex flex-col gap-2">
      <div
        className={
          shape === "circle"
            ? "flex flex-wrap gap-3"
            : "grid grid-cols-3 gap-2"
        }
      >
        {images.map((image) => (
          <div key={image.path} className={`relative overflow-hidden border border-stone-200 bg-stone-100 ${cellShape} ${shape === "circle" ? "size-20" : ""}`}>
            <Image
              src={image.url}
              alt=""
              fill
              sizes="200px"
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemove(image.path)}
              aria-label="이미지 삭제"
              className="absolute top-0.5 right-0.5 flex size-7 items-center justify-center rounded-full bg-white/90 text-stone-700 shadow-sm"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}

        {canAddMore ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className={`flex flex-col items-center justify-center gap-1 border border-dashed border-stone-300 text-stone-400 disabled:opacity-50 ${cellShape} ${shape === "circle" ? "size-20" : ""}`}
          >
            {uploading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <Plus className="size-5" />
            )}
          </button>
        ) : null}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        multiple={maxFiles > 1}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
