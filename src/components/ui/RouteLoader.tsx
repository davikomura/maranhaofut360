export function RouteLoader() {
  return (
    <div className="min-h-[60vh] bg-gradient-to-r from-black via-gray-900 to-black px-4 py-16 text-white">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="h-10 w-48 animate-pulse rounded-full bg-gray-800" />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="h-44 animate-pulse rounded-3xl bg-gray-900" />
          <div className="h-44 animate-pulse rounded-3xl bg-gray-900" />
        </div>
        <div className="h-72 animate-pulse rounded-3xl bg-gray-950" />
      </div>
    </div>
  );
}
