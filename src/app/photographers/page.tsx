import { redirect } from "next/navigation";

// decision-log.md 11번 — 촬영자 목록은 별도 화면 대신 탐색 화면의 [촬영자] 보기로 통합했습니다.
export default function PhotographersPage() {
  redirect("/explore?view=photographers");
}
