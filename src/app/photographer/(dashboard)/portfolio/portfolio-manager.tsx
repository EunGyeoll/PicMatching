"use client";

import { useState } from "react";
import { ImageUploader, type UploadedImage } from "@/components/upload/image-uploader";
import { addPortfolioImageAction, deletePortfolioImageAction } from "./actions";

export function PortfolioManager({
  userId,
  initialImages,
}: {
  userId: string;
  initialImages: UploadedImage[];
}) {
  const [images, setImages] = useState<UploadedImage[]>(initialImages);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd(image: UploadedImage) {
    setError(null);
    setImages((prev) => [...prev, image]);
    const result = await addPortfolioImageAction(image.path);
    if (result.error) {
      setError(result.error);
      setImages((prev) => prev.filter((i) => i.path !== image.path));
    }
  }

  async function handleRemove(path: string) {
    setError(null);
    setImages((prev) => prev.filter((i) => i.path !== path));
    const result = await deletePortfolioImageAction(path);
    if (result.error) setError(result.error);
  }

  return (
    <main className="mx-auto max-w-120 px-4 py-6">
      <h1 className="text-base font-bold text-stone-900">포트폴리오 관리</h1>
      <p className="mt-1 text-xs text-stone-500">사진을 추가하거나 삭제할 수 있어요</p>

      <div className="mt-4">
        <ImageUploader
          bucket="portfolios"
          maxFiles={30}
          images={images}
          onAdd={handleAdd}
          onRemove={handleRemove}
          buildPath={(file) => {
            const ext = file.name.split(".").pop() ?? "jpg";
            return `${userId}/${crypto.randomUUID()}.${ext}`;
          }}
        />
      </div>

      {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
    </main>
  );
}
