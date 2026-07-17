"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export function PortfolioLightbox({
  images,
}: {
  images: { id: string; url: string }[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-3 gap-0.5">
        {images.map((image, i) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setOpenIndex(i)}
            aria-label="사진 크게 보기"
            className="relative aspect-4/5 bg-stone-100"
          >
            <Image src={image.url} alt="" fill sizes="140px" className="object-cover" />
          </button>
        ))}
      </div>

      {openIndex !== null ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95">
          <button
            type="button"
            onClick={() => setOpenIndex(null)}
            aria-label="닫기"
            className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full text-white"
          >
            <X className="size-6" />
          </button>

          {openIndex > 0 ? (
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex - 1)}
              aria-label="이전 사진"
              className="absolute left-1 flex size-10 items-center justify-center text-white"
            >
              <ChevronLeft className="size-7" />
            </button>
          ) : null}

          <div className="relative h-[75vh] w-full max-w-120">
            <Image
              src={images[openIndex].url}
              alt=""
              fill
              sizes="480px"
              className="object-contain"
            />
          </div>

          {openIndex < images.length - 1 ? (
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex + 1)}
              aria-label="다음 사진"
              className="absolute right-1 flex size-10 items-center justify-center text-white"
            >
              <ChevronRight className="size-7" />
            </button>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
