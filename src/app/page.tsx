import {
  testPositionAnalyzer,
  testPositionEliteAnalyzer,
  testTrendAnalyzer,
  testHybridV7Analyzer,
} from "@/lib/backtest";
import { supabase } from "@/lib/supabase";
import {
  analyzeNumbers,
  analyze2DPositions,
  analyze4DPositions,
  analyze2DTrend,
  analyzeHybridV7
} from "@/lib/analyzer";
import { calculateScores } from "@/lib/scoring";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const { data, error } = await supabase
    .from("draws")
    .select("*")
    .order("draw_date", { ascending: false })
   

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

  const analysis = 
  analyzeNumbers(data || []);
  const positionAnalysis =
  analyze2DPositions(data || []);
  const fourDAnalysis =
  analyze4DPositions(data || []);
  const trendAnalysis =
  analyze2DTrend(data || []);
  const hybridAnalysis = 
  analyzeHybridV7(data || []);
  const eliteNumbers =
  positionAnalysis.eliteSuggestions || [];
  const mainEliteNumbers = eliteNumbers.slice(0, 5);
const backupEliteNumbers = eliteNumbers.slice(5, 10);
  const scores = calculateScores(data || []);
const top10 = scores.slice(0, 10);
const backtestData = [...(data || [])].reverse();

const statsV5 = testPositionAnalyzer(backtestData);
const statsElite = testPositionEliteAnalyzer(backtestData);
const statsTrend = testTrendAnalyzer(backtestData);
const statsHybrid = testHybridV7Analyzer(backtestData);
const modelRanking = [
  {
    name: "Analyzer V5 Pro",
    accuracy: Number(statsV5.accuracy),
  },
  {
    name: "V5 Elite",
    accuracy: Number(statsElite.accuracy),
  },
  {
    name: "V6 Trend",
    accuracy: Number(statsTrend.accuracy),
  },
  {
    name: "V7 Hybrid",
    accuracy: Number(statsHybrid.accuracy),
  },
].sort((a, b) => b.accuracy - a.accuracy);
  const latest = data?.[0];
  const recentDraws = data?.slice(0, 50) || [];
  const totalDraws = data?.length || 0;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <header className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            Lao Lottery Dashboard
          </p>
          <h1 className="mt-2 text-2xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl">
            หวยลาวพัฒนา Analyzer
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            สรุปผลล่าสุด เลขแนะนำงวดหน้า และประสิทธิภาพโมเดลในหน้าเดียว
          </p>
        </header>

        <nav className="sticky top-0 z-20 -mx-4 border-y border-slate-200 bg-slate-50/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:rounded-2xl sm:border sm:bg-white sm:shadow-sm">
          <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
            <a href="#recommended" className="shrink-0 rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white">
              เลขแนะนำ
            </a>
            <a href="#latest" className="shrink-0 rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-700 ring-1 ring-inset ring-slate-200">
              ผลล่าสุด
            </a>
            <a href="#models" className="shrink-0 rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-700 ring-1 ring-inset ring-slate-200">
              โมเดล
            </a>
            <a href="#top10" className="shrink-0 rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-700 ring-1 ring-inset ring-slate-200">
              Top 10
            </a>
            <a href="#details" className="shrink-0 rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-700 ring-1 ring-inset ring-slate-200">
              รายละเอียด
            </a>
            <a href="#history" className="shrink-0 rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-700 ring-1 ring-inset ring-slate-200">
              ย้อนหลัง
            </a>
          </div>
        </nav>

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <p className="text-xs font-bold text-slate-500">จำนวนงวดทั้งหมด</p>
            <p className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">
              {totalDraws}
            </p>
            <p className="mt-1 text-xs text-slate-500">งวด</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <p className="text-xs font-bold text-slate-500">โมเดลอันดับ 1</p>
            <p className="mt-2 truncate text-lg font-black text-slate-950 sm:text-2xl">
              {modelRanking[0]?.name}
            </p>
            <p className="mt-1 text-xs text-slate-500">Best model</p>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm sm:p-5">
            <p className="text-xs font-bold text-emerald-700">Accuracy สูงสุด</p>
            <p className="mt-2 text-2xl font-black text-emerald-800 sm:text-3xl">
              {modelRanking[0]?.accuracy.toFixed(2)}%
            </p>
            <p className="mt-1 text-xs text-emerald-700">ล่าสุด</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <p className="text-xs font-bold text-slate-500">อัปเดตล่าสุด</p>
            <p className="mt-2 break-words text-lg font-black text-slate-950 sm:text-2xl">
              {latest?.draw_date || "-"}
            </p>
            <p className="mt-1 text-xs text-slate-500">วันที่ออกผล</p>
          </div>
        </section>

        {latest && (
          <section id="latest" className="scroll-mt-24 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-4">
              <h2 className="text-xl font-black text-slate-950 sm:text-2xl">
                ผลงวดล่าสุด
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                วันที่ {latest.draw_date}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-center sm:p-5">
                <p className="text-xs font-bold text-slate-500 sm:text-sm">6 ตัว</p>
                <p className="mt-2 break-words text-xl font-black tracking-tight text-slate-950 sm:text-3xl">
                  {latest.number_6}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-center sm:p-5">
                <p className="text-xs font-bold text-slate-500 sm:text-sm">3 ตัว</p>
                <p className="mt-2 break-words text-xl font-black tracking-tight text-slate-950 sm:text-3xl">
                  {latest.number_3}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-center sm:p-5">
                <p className="text-xs font-bold text-slate-500 sm:text-sm">2 ตัว</p>
                <p className="mt-2 break-words text-xl font-black tracking-tight text-slate-950 sm:text-3xl">
                  {latest.number_2}
                </p>
              </div>
            </div>
          </section>
        )}

        <section id="recommended" className="scroll-mt-24 rounded-3xl border border-slate-900 bg-slate-950 p-5 text-white shadow-xl sm:p-8">
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
              Main Recommendation
            </p>
            <h2 className="mt-2 text-3xl font-black leading-tight tracking-tight sm:text-5xl">
              เลขแนะนำหลักงวดถัดไป
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-300 sm:text-base">
              ชุดเด่นที่สุดของหน้า ออกแบบให้เห็นชัดทันทีบนมือถือ
            </p>
          </div>

          <div>
            <p className="mb-3 text-sm font-bold text-slate-300">Top 5 เน้น</p>
            <div className="grid grid-cols-5 gap-2 sm:flex sm:flex-wrap sm:gap-4">
              {mainEliteNumbers.map((num) => (
                <span
                  key={num}
                  className="flex min-h-16 items-center justify-center rounded-2xl bg-white px-1 text-2xl font-black text-slate-950 shadow-sm sm:min-h-24 sm:min-w-28 sm:px-6 sm:text-5xl"
                >
                  {num}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-3 text-sm font-bold text-slate-300">สำรอง 5 ตัว</p>
            <div className="grid grid-cols-5 gap-2 sm:flex sm:flex-wrap sm:gap-3">
              {backupEliteNumbers.map((num) => (
                <span
                  key={num}
                  className="flex min-h-12 items-center justify-center rounded-xl bg-slate-800 px-2 text-lg font-black text-white ring-1 ring-inset ring-slate-700 sm:min-w-20 sm:px-4 sm:py-3 sm:text-2xl"
                >
                  {num}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section id="models" className="scroll-mt-24 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4">
            <h2 className="text-xl font-black text-slate-950 sm:text-2xl">
              Ranking โมเดล
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              เปรียบเทียบ Accuracy ของแต่ละโมเดลล่าสุด
            </p>
          </div>

          <div className="space-y-3">
            {modelRanking.map((model, index) => (
              <div
                key={model.name}
                className={
                  index < 3
                    ? "flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm"
                    : "flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4"
                }
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                  {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "4"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-black text-slate-950">
                    {model.name}
                  </p>
                  <p className="text-xs text-slate-500">Accuracy</p>
                </div>
                <p className="shrink-0 text-lg font-black text-emerald-700">
                  {model.accuracy.toFixed(2)}%
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4">
            <h2 className="text-xl font-black text-slate-950 sm:text-2xl">
              Hot Digits / Cold Digits
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              ดูเลขเด่นและเลขเย็นแบบรวดเร็ว
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <div>
              <p className="mb-3 text-sm font-bold text-slate-700">Hot Digits</p>
              <div className="flex flex-wrap gap-2.5">
                {analysis.hotDigits.map((digit) => (
                  <div
                    key={digit}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-950 text-xl font-black text-white shadow-sm sm:h-16 sm:w-16 sm:text-2xl"
                  >
                    {digit}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-bold text-slate-700">Cold Digits</p>
              <div className="flex flex-wrap gap-2.5">
                {analysis.coldDigits && analysis.coldDigits.map((digit) => (
                  <div
                    key={digit}
                    className="flex h-14 w-14 items-center justify-center rounded-full border border-slate-300 bg-slate-50 text-xl font-black text-slate-800 sm:h-16 sm:w-16 sm:text-2xl"
                  >
                    {digit}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="top10" className="scroll-mt-24 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4">
            <h2 className="text-xl font-black text-slate-950 sm:text-2xl">
              Top 10 เลขแนะนำ
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              สรุป Score, Frequency และ Missing แบบอ่านง่าย
            </p>
          </div>

          <div className="grid gap-3 md:hidden">
            {top10.map((row, index) => (
              <div key={row.number} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-bold text-slate-500">#{index + 1}</p>
                  <p className="text-2xl font-black text-slate-950">{row.number}</p>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="rounded-xl bg-white p-2">
                    <p className="text-slate-500">Score</p>
                    <p className="font-black text-slate-950">{row.score.toFixed(1)}</p>
                  </div>
                  <div className="rounded-xl bg-white p-2">
                    <p className="text-slate-500">Frequency</p>
                    <p className="font-black text-slate-950">{row.frequency}</p>
                  </div>
                  <div className="rounded-xl bg-white p-2">
                    <p className="text-slate-500">Missing</p>
                    <p className="font-black text-slate-950">{row.missing}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden overflow-hidden rounded-2xl border border-slate-200 md:block">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  <th className="p-3 text-left font-bold">อันดับ</th>
                  <th className="p-3 text-left font-bold">เลข</th>
                  <th className="p-3 text-left font-bold">Score</th>
                  <th className="p-3 text-left font-bold">Frequency</th>
                  <th className="p-3 text-left font-bold">Missing</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 bg-white">
                {top10.map((row, index) => (
                  <tr key={row.number} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-500">#{index + 1}</td>
                    <td className="p-3 text-lg font-black text-slate-950">{row.number}</td>
                    <td className="p-3 font-bold text-slate-800">{row.score.toFixed(1)}</td>
                    <td className="p-3 text-slate-600">{row.frequency}</td>
                    <td className="p-3 text-slate-600">{row.missing}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h3 className="text-lg font-black text-slate-950">เลข 2 ตัว</h3>
            <p className="mt-1 text-sm text-slate-500">ชุดแนะนำจาก Analyzer</p>

            <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-5 lg:grid-cols-3">
              {analysis.suggested2.map((n) => (
                <div key={n} className="rounded-xl bg-slate-100 px-3 py-2 text-center font-bold text-slate-800">
                  {n}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h3 className="text-lg font-black text-slate-950">เลข 3 ตัว</h3>
            <p className="mt-1 text-sm text-slate-500">ชุดแนะนำจาก Analyzer</p>

            <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-5 lg:grid-cols-3">
              {analysis.suggested3.map((n) => (
                <div key={n} className="rounded-xl bg-slate-100 px-3 py-2 text-center font-bold text-slate-800">
                  {n}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h3 className="text-lg font-black text-slate-950">เลข 4 ตัว</h3>
            <p className="mt-1 text-sm text-slate-500">ชุดแนะนำจาก Analyzer</p>

            <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-2">
              {analysis.suggested4.map((n) => (
                <div key={n} className="rounded-xl bg-slate-100 px-3 py-2 text-center font-bold text-slate-800">
                  {n}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="details" className="scroll-mt-24 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4">
            <h2 className="text-xl font-black text-slate-950 sm:text-2xl">
              รายละเอียด Analyzer ต่างๆ
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              ข้อมูลแยกตามโมเดลสำหรับตรวจสอบเชิงลึก
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
              <h3 className="text-lg font-black text-slate-950">Analyzer V5 PRO</h3>

              <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                <p className="rounded-2xl bg-white p-3">
                  <span className="font-bold text-slate-800">หลักสิบเด่น:</span> {positionAnalysis.topTens.join(", ")}
                </p>

                <p className="rounded-2xl bg-white p-3">
                  <span className="font-bold text-slate-800">หลักหน่วยเด่น:</span> {positionAnalysis.topUnits.join(", ")}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {positionAnalysis.suggestions.map((num) => (
                  <span
                    key={num}
                    className="inline-flex min-w-12 items-center justify-center rounded-xl bg-slate-950 px-3 py-2 font-black text-white"
                  >
                    {num}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
              <h3 className="text-lg font-black text-slate-950">Analyzer V5 Elite</h3>
              <p className="mt-1 text-sm text-slate-500">
                คัด Top 10 จากชุด V5 Pro
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {positionAnalysis.eliteSuggestions.map((num) => (
                  <span
                    key={num}
                    className="inline-flex min-w-12 items-center justify-center rounded-xl bg-slate-950 px-3 py-2 font-black text-white"
                  >
                    {num}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
              <h3 className="text-lg font-black text-slate-950">Analyzer V6 Trend</h3>
              <p className="mt-1 text-sm text-slate-500">
                ทดลองจากแนวโน้มเลข 2 ตัว
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {trendAnalysis.slice(0, 10).map((row) => (
                  <span
                    key={row.number}
                    className="inline-flex min-w-12 items-center justify-center rounded-xl bg-slate-950 px-3 py-2 font-black text-white"
                  >
                    {row.number}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
              <h3 className="text-lg font-black text-slate-950">Analyzer V7 Hybrid</h3>
              <p className="mt-1 text-sm text-slate-500">
                รวมคะแนนจาก V5 Pro + V5 Elite + V6 Trend
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {hybridAnalysis.slice(0, 10).map((row) => (
                  <span
                    key={row.number}
                    className="inline-flex min-w-12 items-center justify-center rounded-xl bg-slate-950 px-3 py-2 font-black text-white"
                  >
                    {row.number}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5 lg:col-span-2">
              <h3 className="text-lg font-black text-slate-950">4D Analyzer V1</h3>

              <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2 lg:grid-cols-4">
                <p className="rounded-2xl bg-white p-3">
                  <span className="font-bold text-slate-800">หลักพันเด่น:</span> {fourDAnalysis.topP1.join(", ")}
                </p>

                <p className="rounded-2xl bg-white p-3">
                  <span className="font-bold text-slate-800">หลักร้อยเด่น:</span> {fourDAnalysis.topP2.join(", ")}
                </p>

                <p className="rounded-2xl bg-white p-3">
                  <span className="font-bold text-slate-800">หลักสิบเด่น:</span> {fourDAnalysis.topP3.join(", ")}
                </p>

                <p className="rounded-2xl bg-white p-3">
                  <span className="font-bold text-slate-800">หลักหน่วยเด่น:</span> {fourDAnalysis.topP4.join(", ")}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {fourDAnalysis.suggestions.map((num) => (
                  <span
                    key={num}
                    className="inline-flex min-w-14 items-center justify-center rounded-xl bg-slate-950 px-3 py-2 font-black text-white"
                  >
                    {num}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="history" className="scroll-mt-24 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4">
            <h2 className="text-xl font-black text-slate-950 sm:text-2xl">
              ผลย้อนหลัง 50 งวด
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              บนมือถือแสดงเป็นการ์ดเพื่อลดปัญหาตารางล้นจอ
            </p>
          </div>

          <div className="grid gap-3 md:hidden">
            {recentDraws.map((row) => (
              <div key={row.draw_date} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-bold text-slate-500">{row.draw_date}</p>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl bg-white p-2">
                    <p className="text-xs text-slate-500">6 ตัว</p>
                    <p className="break-words font-black text-slate-950">{row.number_6}</p>
                  </div>
                  <div className="rounded-xl bg-white p-2">
                    <p className="text-xs text-slate-500">3 ตัว</p>
                    <p className="break-words font-black text-slate-950">{row.number_3}</p>
                  </div>
                  <div className="rounded-xl bg-white p-2">
                    <p className="text-xs text-slate-500">2 ตัว</p>
                    <p className="break-words font-black text-slate-950">{row.number_2}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden overflow-hidden rounded-2xl border border-slate-200 md:block">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  <th className="p-3 text-left font-bold">วันที่</th>
                  <th className="p-3 text-left font-bold">6 ตัว</th>
                  <th className="p-3 text-left font-bold">3 ตัว</th>
                  <th className="p-3 text-left font-bold">2 ตัว</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 bg-white">
                {recentDraws.map((row) => (
                  <tr key={row.draw_date} className="hover:bg-slate-50">
                    <td className="p-3 text-slate-600">{row.draw_date}</td>
                    <td className="p-3 font-bold text-slate-900">{row.number_6}</td>
                    <td className="p-3 font-bold text-slate-900">{row.number_3}</td>
                    <td className="p-3 font-bold text-slate-900">{row.number_2}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="pb-4 pt-2 text-center text-xs leading-6 text-slate-500 sm:text-sm">
          ข้อมูลนี้เป็นผลจากการวิเคราะห์ย้อนหลัง ใช้เพื่อประกอบการตัดสินใจเท่านั้น
        </footer>
      </div>
    </main>
  );
}