export function Stats() {
  return (
    <section className="border-y border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {[
            { value: "14,890", label: "Reports Resolved" },
            { value: "84.2%", label: "Resolution Rate" },
            { value: "2.8 Days", label: "Average Repair Time" },
            { value: "42 Cities", label: "Municipal Desks" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-extrabold text-blue-600 sm:text-4xl">
                {s.value}
              </p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-600">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}