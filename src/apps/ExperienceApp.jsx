import { Suspense, lazy } from "react";

const Experience = lazy(() => import("../pages/Experience"));

export default function ExperienceApp() {
  return (
    <div className="min-h-full">
      <Suspense fallback={<Loader />}>
        <Experience />
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
