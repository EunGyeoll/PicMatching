import { BottomNavigation } from "@/components/layout/bottom-navigation";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pb-16">
      {children}
      <BottomNavigation />
    </div>
  );
}
