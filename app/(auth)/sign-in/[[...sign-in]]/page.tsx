import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <section className="SectionCss">
      <SignIn fallbackRedirectUrl="/dashboard" />
    </section>
  );
}
