import { supabase } from "@/lib/supabase";
import {
  testPositionAnalyzer,
  testPositionEliteAnalyzer,
  testTrendAnalyzer,
  testHybridV7Analyzer,
  testDynamicV8Analyzer,
} from "@/lib/backtest";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ModelRankingPage() {
  const { data, error } = await supabase
    .from("draws")
    .select("*")
    .order("draw_date", { ascending: true });

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

  const models = [
    {
      name: "Analyzer V5 Pro",
      accuracy: Number(testPositionAnalyzer(data).accuracy),
      hit: `${testPositionAnalyzer(data).hits}/${testPositionAnalyzer(data).total}`,
      note: "Top 4 หลักสิบ × Top 4 หลักหน่วย",
    },
    {
      name: "Analyzer V5 Elite",
      accuracy: Number(testPositionEliteAnalyzer(data).accuracy),
      hit: `${testPositionEliteAnalyzer(data).hits}/${testPositionEliteAnalyzer(data).total}`,
      note: "คัด Top 10 จาก V5 Pro",
    },
    {
      name: "Analyzer V6 Trend",
      accuracy: Number(testTrendAnalyzer(data).accuracy),
      hit: `${testTrendAnalyzer(data).hits}/${testTrendAnalyzer(data).total}`,
      note: "วิเคราะห์แนวโน้ม 20/50/100 งวดล่าสุด",
    },
    {
      name: "Analyzer V7 Hybrid",
      accuracy: Number(testHybridV7Analyzer(data).accuracy),
      hit: `${testHybridV7Analyzer(data).hits}/${testHybridV7Analyzer(data).total}`,
      note: "รวมคะแนนจาก V5 + V6",
    },
    {
  name: "Analyzer V8 Dynamic",
  accuracy: Number(testDynamicV8Analyzer(data).accuracy),
  hit: `${testDynamicV8Analyzer(data).hits}/${testDynamicV8Analyzer(data).total}`,
  note: "Dynamic Model + Trend + Missing Weight",
},
  ].sort((a, b) => b.accuracy - a.accuracy);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
        <header className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            Model Performance
          </p>
          <h1 className="mt-2 text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl">
            Model Ranking
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Leaderboard เปรียบเทียบ Accuracy และ Hit Rate ของแต่ละโมเดลจากข้อมูลย้อนหลัง
          </p>
        </header>

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm sm:p-5">
            <p className="text-xs font-bold text-amber-700">อันดับ 1</p>
            <p className="mt-2 truncate text-lg font-black text-slate-950 sm:text-2xl">
              {models[0]?.name}
            </p>
            <p className="mt-1 text-xs text-amber-700">Best model</p>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm sm:p-5">
            <p className="text-xs font-bold text-emerald-700">Accuracy สูงสุด</p>
            <p className="mt-2 text-2xl font-black text-emerald-800 sm:text-3xl">
              {models[0]?.accuracy.toFixed(2)}%
            </p>
            <p className="mt-1 text-xs text-emerald-700">Top performance</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <p className="text-xs font-bold text-slate-500">Hit</p>
            <p className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">
              {models[0]?.hit}
            </p>
            <p className="mt-1 text-xs text-slate-500">จากโมเดลอันดับ 1</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <p className="text-xs font-bold text-slate-500">จำนวนโมเดล</p>
            <p className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">
              {models.length}
            </p>
            <p className="mt-1 text-xs text-slate-500">Models tested</p>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {models.slice(0, 3).map((model, index) => (
            <div
              key={model.name}
              className={
                index === 0
                  ? "rounded-3xl border border-amber-300 bg-amber-50 p-5 shadow-md lg:scale-[1.02]"
                  : "rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
              }
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
                  {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                </div>

                <div className="rounded-full bg-white px-3 py-1 text-sm font-black text-emerald-700 shadow-sm">
                  {model.accuracy.toFixed(2)}%
                </div>
              </div>

              <div className="mt-5">
                <p className="text-sm font-bold text-slate-500">อันดับ #{index + 1}</p>
                <h2 className="mt-1 text-2xl font-black leading-tight text-slate-950">
                  {model.name}
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {model.note}
                </p>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-inset ring-slate-200">
                  <p className="text-xs font-bold text-slate-500">Accuracy</p>
                  <p className="mt-1 text-xl font-black text-slate-950">
                    {model.accuracy.toFixed(2)}%
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-inset ring-slate-200">
                  <p className="text-xs font-bold text-slate-500">Hit</p>
                  <p className="mt-1 text-xl font-black text-slate-950">
                    {model.hit}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-xl font-black text-slate-950 sm:text-2xl">
              Full Leaderboard
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              บนมือถือแสดงเป็น Card เพื่อให้อ่านง่ายและไม่เกิดตารางล้นจอ
            </p>
          </div>

          <div className="grid gap-3 md:hidden">
            {models.map((model, index) => (
              <div
                key={model.name}
                className={
                  index < 3
                    ? "rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm"
                    : "rounded-2xl border border-slate-200 bg-slate-50 p-4"
                }
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                    {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="break-words text-lg font-black leading-tight text-slate-950">
                      {model.name}
                    </p>
                    <p className="mt-1 break-words text-sm leading-6 text-slate-600">
                      {model.note}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white p-3 text-center shadow-sm ring-1 ring-inset ring-slate-200">
                    <p className="text-xs font-bold text-slate-500">Accuracy</p>
                    <p className="mt-1 text-xl font-black text-emerald-700">
                      {model.accuracy.toFixed(2)}%
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white p-3 text-center shadow-sm ring-1 ring-inset ring-slate-200">
                    <p className="text-xs font-bold text-slate-500">Hit</p>
                    <p className="mt-1 text-xl font-black text-slate-950">
                      {model.hit}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden overflow-hidden rounded-2xl border border-slate-200 md:block">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  <th className="p-4 text-left font-bold">อันดับ</th>
                  <th className="p-4 text-left font-bold">โมเดล</th>
                  <th className="p-4 text-left font-bold">Accuracy</th>
                  <th className="p-4 text-left font-bold">Hit</th>
                  <th className="p-4 text-left font-bold">หมายเหตุ</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 bg-white">
                {models.map((model, index) => (
                  <tr
                    key={model.name}
                    className={index < 3 ? "bg-amber-50/60" : "hover:bg-slate-50"}
                  >
                    <td className="p-4 text-2xl">
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
                    </td>
                    <td className="p-4 font-black text-slate-950">{model.name}</td>
                    <td className="p-4 font-black text-emerald-700">
                      {model.accuracy.toFixed(2)}%
                    </td>
                    <td className="p-4 font-bold text-slate-800">{model.hit}</td>
                    <td className="max-w-md p-4 leading-6 text-slate-600">
                      {model.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="pb-4 pt-2 text-center text-xs leading-6 text-slate-500 sm:text-sm">
          Model Ranking แสดงผลจากการทดสอบย้อนหลัง ใช้เพื่อเปรียบเทียบประสิทธิภาพของแต่ละโมเดลเท่านั้น
        </footer>
      </div>
    </main>
  );
}