import { Suspense, lazy } from "react";

const Skills = lazy(() => import("../pages/Skills"));

export default function SkillsApp() {
  return (
    <div className="min-h-full">
      <Suspense fallback={<Loader />}>
        <Skills />
      </Suspense>
    </div>
  );
}

function Loader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 rounded-full border-2 border-[var(--color-primary)] border-t-transparent animate-spin" />
    </div>
  );
}
