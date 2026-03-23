import { Suspense, lazy } from "react";

const Education = lazy(() => import("../components/Education"));

export default function EducationApp() {
  return (
    <div className="min-h-full">
      <Suspense fallback={<Loader />}>
        <Education />
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
