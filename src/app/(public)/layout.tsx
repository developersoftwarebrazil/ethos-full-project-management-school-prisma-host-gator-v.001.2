// src/app/(public)/layout.tsx
import LandingHeader from "@/components/landing/header/LandingHeader";
import LandingFooter from "@/components/landing/LandingFooter";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LandingHeader />
      <main>{children}</main>
      <LandingFooter />
    </>
  );
}
