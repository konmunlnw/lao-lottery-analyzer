import { supabase } from "@/lib/supabase";

function calculateDigits(draws: any[]) {
  const digitCount: Record<string, number> = {};

  for (let i = 0; i <= 9; i++) {
    digitCount[i.toString()] = 0;
  }

  draws.forEach((draw) => {
    const numbers =
      String(draw.number_6 || "") +
      String(draw.number_3 || "") +
      String(draw.number_2 || "");

    numbers.split("").forEach((digit) => {
      if (digitCount[digit] !== undefined) {
        digitCount[digit]++;
      }
    });
  });

  const sorted = Object.entries(digitCount).sort(
    (a, b) => b[1] - a[1]
  );

  return {
    ranking: sorted,
    hot: sorted.slice(0, 3).map(([d]) => d),
    cold: [...sorted].reverse().slice(0, 3).map(([d]) => d),
  };
}

export default async function StatisticsPage() {
  const { data, error } = await supabase
    .from("draws")
    .select("*")
    .order("draw_date", { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-red-50 p-5 shadow-sm">
          <p className="text-sm font-bold text-red-700">เกิดข้อผิดพลาด</p>
          <p className="mt-2 break-words text-sm leading-6 text-red-600">
            {error.message}
          </p>
        </div>
      </main>
    );
  }

  const stats20 = calculateDigits(data.slice(0, 20));
  const stats50 = calculateDigits(data.slice(0, 50));
  const stats100 = calculateDigits(data.slice(0, 100));
  const statsAll = calculateDigits(data);
  const number2Count: Record<string, number> = {};

data.forEach((draw) => {
  const num = draw.number_2;

  if (!num) return;

  number2Count[num] =
    (number2Count[num] || 0) + 1;
});

const topNumber2 = Object.entries(number2Count)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 20);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
        <header className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            Analytics Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl">
            Statistics
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            ภาพรวมสถิติเลขร้อน เลขเย็น อันดับตัวเลข และ Top เลข 2 ตัวจากข้อมูลย้อนหลังทั้งหมด
          </p>
        </header>

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <p className="text-xs font-bold text-slate-500">จำนวนข้อมูลงวด</p>
            <p className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">
              {data.length}
            </p>
            <p className="mt-1 text-xs text-slate-500">งวดทั้งหมด</p>
          </div>

          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 shadow-sm sm:p-5">
            <p className="text-xs font-bold text-rose-700">Hot Digit อันดับ 1</p>
            <p className="mt-2 text-3xl font-black text-rose-800 sm:text-4xl">
              {statsAll.hot[0]}
            </p>
            <p className="mt-1 text-xs text-rose-700">จากสถิติทั้งหมด</p>
          </div>

          <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 shadow-sm sm:p-5">
            <p className="text-xs font-bold text-sky-700">Cold Digit อันดับ 1</p>
            <p className="mt-2 text-3xl font-black text-sky-800 sm:text-4xl">
              {statsAll.cold[0]}
            </p>
            <p className="mt-1 text-xs text-sky-700">ออกน้อยที่สุด</p>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm sm:p-5">
            <p className="text-xs font-bold text-emerald-700">Top เลข 2 ตัว</p>
            <p className="mt-2 text-3xl font-black text-emerald-800 sm:text-4xl">
              {topNumber2[0]?.[0] || "-"}
            </p>
            <p className="mt-1 text-xs text-emerald-700">
              {topNumber2[0]?.[1] || 0} ครั้ง
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-xl font-black text-slate-950 sm:text-2xl">
              Hot / Cold Numbers
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              เปรียบเทียบเลขที่ออกบ่อยและออกน้อยในช่วง 20, 50, 100 งวด และข้อมูลทั้งหมด
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-black text-slate-950">20 งวดล่าสุด</h3>
                  <p className="mt-1 text-sm text-slate-500">ช่วงสั้นล่าสุด</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600 shadow-sm">
                  20 draws
                </span>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="mb-3 text-sm font-bold text-rose-700">Hot Numbers</p>
                  <div className="flex flex-wrap gap-2.5">
                    {stats20.hot.map((n) => (
                      <div
                        key={n}
                        className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-950 text-xl font-black text-white shadow-sm"
                      >
                        {n}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-sm font-bold text-sky-700">Cold Numbers</p>
                  <div className="flex flex-wrap gap-2.5">
                    {stats20.cold.map((n) => (
                      <div
                        key={n}
                        className="flex h-14 w-14 items-center justify-center rounded-full border border-slate-300 bg-white text-xl font-black text-slate-800"
                      >
                        {n}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-black text-slate-950">50 งวดล่าสุด</h3>
                  <p className="mt-1 text-sm text-slate-500">ช่วงกลางสำหรับดูแนวโน้ม</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600 shadow-sm">
                  50 draws
                </span>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="mb-3 text-sm font-bold text-rose-700">Hot Numbers</p>
                  <div className="flex flex-wrap gap-2.5">
                    {stats50.hot.map((n) => (
                      <div
                        key={n}
                        className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-950 text-xl font-black text-white shadow-sm"
                      >
                        {n}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-sm font-bold text-sky-700">Cold Numbers</p>
                  <div className="flex flex-wrap gap-2.5">
                    {stats50.cold.map((n) => (
                      <div
                        key={n}
                        className="flex h-14 w-14 items-center justify-center rounded-full border border-slate-300 bg-white text-xl font-black text-slate-800"
                      >
                        {n}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-black text-slate-950">100 งวดล่าสุด</h3>
                  <p className="mt-1 text-sm text-slate-500">ช่วงยาวสำหรับภาพรวม</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600 shadow-sm">
                  100 draws
                </span>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="mb-3 text-sm font-bold text-rose-700">Hot Numbers</p>
                  <div className="flex flex-wrap gap-2.5">
                    {stats100.hot.map((n) => (
                      <div
                        key={n}
                        className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-950 text-xl font-black text-white shadow-sm"
                      >
                        {n}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-sm font-bold text-sky-700">Cold Numbers</p>
                  <div className="flex flex-wrap gap-2.5">
                    {stats100.cold.map((n) => (
                      <div
                        key={n}
                        className="flex h-14 w-14 items-center justify-center rounded-full border border-slate-300 bg-white text-xl font-black text-slate-800"
                      >
                        {n}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-black text-slate-950">ทั้งหมด</h3>
                  <p className="mt-1 text-sm text-slate-500">สถิติจากข้อมูลทุกงวด</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600 shadow-sm">
                  All data
                </span>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="mb-3 text-sm font-bold text-rose-700">Hot Numbers</p>
                  <div className="flex flex-wrap gap-2.5">
                    {statsAll.hot.map((n) => (
                      <div
                        key={n}
                        className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-950 text-xl font-black text-white shadow-sm"
                      >
                        {n}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-sm font-bold text-sky-700">Cold Numbers</p>
                  <div className="flex flex-wrap gap-2.5">
                    {statsAll.cold.map((n) => (
                      <div
                        key={n}
                        className="flex h-14 w-14 items-center justify-center rounded-full border border-slate-300 bg-white text-xl font-black text-slate-800"
                      >
                        {n}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-xl font-black text-slate-950 sm:text-2xl">
              อันดับเลขทั้งหมด
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              จำนวนครั้งที่เลข 0-9 ปรากฏในเลข 6 ตัว, 3 ตัว และ 2 ตัวรวมกัน
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {statsAll.ranking.map(([digit, count], index) => (
              <div
                key={digit}
                className={
                  index < 3
                    ? "rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm"
                    : "rounded-2xl border border-slate-200 bg-slate-50 p-4"
                }
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-bold text-slate-500">
                    #{index + 1}
                  </p>
                  <p className="text-xs font-bold text-slate-500">
                    {count} ครั้ง
                  </p>
                </div>
                <p className="mt-3 text-4xl font-black text-slate-950">
                  {digit}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-xl font-black text-slate-950 sm:text-2xl">
              Top 20 เลข 2 ตัว
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              อันดับเลข 2 ตัวที่ออกบ่อยที่สุด แสดงเป็น Card บนมือถือเพื่อป้องกันข้อมูลล้นจอ
            </p>
          </div>

          <div className="grid gap-3 md:hidden">
            {topNumber2.map(
              ([number, count], index) => (
                <div
                  key={number}
                  className={
                    index < 3
                      ? "rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm"
                      : "rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  }
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-slate-500">
                        อันดับ #{index + 1}
                      </p>
                      <p className="mt-1 text-3xl font-black text-slate-950">
                        {number}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white px-4 py-3 text-center shadow-sm ring-1 ring-inset ring-slate-200">
                      <p className="text-xs font-bold text-slate-500">จำนวน</p>
                      <p className="mt-1 text-xl font-black text-emerald-700">
                        {count}
                      </p>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>

          <div className="hidden overflow-hidden rounded-2xl border border-slate-200 md:block">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  <th className="p-4 text-left font-bold">อันดับ</th>
                  <th className="p-4 text-left font-bold">เลข</th>
                  <th className="p-4 text-left font-bold">จำนวนครั้ง</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 bg-white">
                {topNumber2.map(
                  ([number, count], index) => (
                    <tr
                      key={number}
                      className={index < 3 ? "bg-emerald-50/70" : "hover:bg-slate-50"}
                    >
                      <td className="p-4 font-bold text-slate-500">
                        #{index + 1}
                      </td>

                      <td className="p-4 text-lg font-black text-slate-950">
                        {number}
                      </td>

                      <td className="p-4 font-bold text-slate-800">
                        {count}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="pb-4 pt-2 text-center text-xs leading-6 text-slate-500 sm:text-sm">
          Statistics แสดงผลจากข้อมูลย้อนหลัง ใช้เพื่อดูแนวโน้มและภาพรวมของตัวเลขเท่านั้น
        </footer>
      </div>
    </main>
    
  );
}