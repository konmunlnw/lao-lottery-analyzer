import { supabase } from "@/lib/supabase";
import {
  analyzeNumbers,
  analyze4DPositions,
} from "@/lib/analyzer";

import {
  testPositionAnalyzer,
  testPositionEliteAnalyzer,
  testTrendAnalyzer,
  testHybridV7Analyzer,
} from "@/lib/backtest";
import { calculateScores } from "@/lib/scoring";


function testAccuracy(data: any[], windowSize: number) {
  let hitCount = 0;
  let total = 0;

  for (let i = windowSize; i < data.length; i++) {
    const history = data.slice(i - windowSize, i);
    const analysis = analyzeNumbers(history);
    const actual = data[i].number_2;

    if (analysis.suggested2.includes(actual)) hitCount++;
    total++;
  }

  return {
    hits: hitCount,
    total,
    accuracy: total > 0 ? ((hitCount / total) * 100).toFixed(2) : "0",
  };
}

function testTopNumber2(data: any[]) {
  let hitCount = 0;
  let total = 0;

  for (let i = 50; i < data.length; i++) {
    const history = data.slice(0, i);
    const countMap: Record<string, number> = {};

    history.forEach((draw) => {
      const num = draw.number_2;
      if (!num) return;
      countMap[num] = (countMap[num] || 0) + 1;
    });

    const top5 = Object.entries(countMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([num]) => num);

    if (top5.includes(data[i].number_2)) hitCount++;
    total++;
  }

  return {
    hits: hitCount,
    total,
    accuracy: total > 0 ? ((hitCount / total) * 100).toFixed(2) : "0",
  };
}

function testScoringEngine(draws: any[]) {
  let hits = 0;
  let total = 0;

  for (let i = 50; i < draws.length - 1; i++) {
    const history = draws.slice(i);
    const scores = calculateScores(history);
    const top5 = scores.slice(0, 5);
    const nextDraw = draws[i - 1];

    if (top5.some((row) => row.number === nextDraw.number_2)) hits++;
    total++;
  }

  return {
    hits,
    total,
    accuracy: total > 0 ? ((hits / total) * 100).toFixed(2) : "0",
  };
}

function test4DAnalyzer(draws: any[]) {
  let hits = 0;
  let total = 0;

  for (let i = 50; i < draws.length - 1; i++) {
    const history = draws.slice(i);
    const analysis = analyze4DPositions(history);

    const nextDraw = draws[i - 1];
    const actual4D = String(nextDraw.number_6 || "")
      .padStart(6, "0")
      .slice(-4);

    if (analysis.suggestions.includes(actual4D)) {
      hits++;
    }

    total++;
  }

  return {
    hits,
    total,
    accuracy: total > 0 ? ((hits / total) * 100).toFixed(2) : "0",
  };
}
export default async function TrackerPage() {

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
  
  const results = [];
  let hitCount = 0;

  for (let i = 50; i < data.length; i++) {
    const history = data.slice(0, i);
    const analysis = analyzeNumbers(history);
    const actual = data[i].number_2;
    const hit = analysis.suggested2.includes(actual);

    if (hit) hitCount++;

    results.push({
      date: data[i].draw_date,
      actual,
      suggested: analysis.suggested2.join(", "),
      hit,
    });
  }

  const accuracy =
    results.length > 0 ? ((hitCount / results.length) * 100).toFixed(2) : "0";

  const stats20 = testAccuracy(data, 20);
  const stats50 = testAccuracy(data, 50);
  const stats100 = testAccuracy(data, 100);
  const statsTop2 = testTopNumber2(data);
  const statsScoring = testScoringEngine(data);
  const statsPosition = testPositionAnalyzer(data);
  const statsPositionElite = testPositionEliteAnalyzer(data);
const stats4D = test4DAnalyzer(data);
const statsTrend = testTrendAnalyzer(data);
const statsHybridV7 = testHybridV7Analyzer(data);
const modelStats = [
  {
    name: "Analyzer V5",
    accuracy: Number(statsPosition.accuracy),
    hits: statsPosition.hits,
    total: statsPosition.total,
  },
  {
    name: "Analyzer V5 Elite",
    accuracy: Number(statsPositionElite.accuracy),
    hits: statsPositionElite.hits,
    total: statsPositionElite.total,
  },
  {
    name: "Analyzer V7 Hybrid",
    accuracy: Number(statsHybridV7.accuracy),
    hits: statsHybridV7.hits,
    total: statsHybridV7.total,
  },
  {
    name: "Analyzer V6 Trend",
    accuracy: Number(statsTrend.accuracy),
    hits: statsTrend.hits,
    total: statsTrend.total,
  },
  {
    name: "Scoring Engine",
    accuracy: Number(statsScoring.accuracy),
    hits: statsScoring.hits,
    total: statsScoring.total,
  },
  {
    name: "Top เลข 2 ตัว",
    accuracy: Number(statsTop2.accuracy),
    hits: statsTop2.hits,
    total: statsTop2.total,
  },
  {
    name: "50 งวด",
    accuracy: Number(stats50.accuracy),
    hits: stats50.hits,
    total: stats50.total,
  },
  {
    name: "20 งวด",
    accuracy: Number(stats20.accuracy),
    hits: stats20.hits,
    total: stats20.total,
  },
  {
    name: "100 งวด",
    accuracy: Number(stats100.accuracy),
    hits: stats100.hits,
    total: stats100.total,
  },
  {
    name: "4D Analyzer V1",
    accuracy: Number(stats4D.accuracy),
    hits: stats4D.hits,
    total: stats4D.total,
  },
].sort((a, b) => b.accuracy - a.accuracy);
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
        <header className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            Accuracy Tracker
          </p>
          <h1 className="mt-2 text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl">
            Tracker
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            เปรียบเทียบ Accuracy ของแต่ละโมเดล พร้อมผลย้อนหลังล่าสุดในรูปแบบที่อ่านง่ายบนมือถือ
          </p>
        </header>

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm sm:p-5">
            <p className="text-xs font-bold text-amber-700">อันดับ 1</p>
            <p className="mt-2 truncate text-lg font-black text-slate-950 sm:text-2xl">
              {modelStats[0]?.name}
            </p>
            <p className="mt-1 text-xs text-amber-700">Best accuracy</p>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm sm:p-5">
            <p className="text-xs font-bold text-emerald-700">Accuracy สูงสุด</p>
            <p className="mt-2 text-2xl font-black text-emerald-800 sm:text-3xl">
              {modelStats[0]?.accuracy.toFixed(2)}%
            </p>
            <p className="mt-1 text-xs text-emerald-700">จากอันดับ 1</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <p className="text-xs font-bold text-slate-500">Hit อันดับ 1</p>
            <p className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">
              {modelStats[0]?.hits}/{modelStats[0]?.total}
            </p>
            <p className="mt-1 text-xs text-slate-500">ผลทดสอบย้อนหลัง</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <p className="text-xs font-bold text-slate-500">Accuracy รวม</p>
            <p className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">
              {accuracy}%
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {hitCount}/{results.length} งวด
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-amber-300 bg-amber-50 p-5 shadow-md sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-4xl shadow-sm">
                🥇
              </div>

              <div>
                <p className="text-sm font-bold text-amber-700">โมเดลอันดับ 1</p>
                <h2 className="mt-1 text-2xl font-black leading-tight text-slate-950 sm:text-4xl">
                  {modelStats[0]?.name}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  โมเดลที่มี Accuracy สูงที่สุดจากการเปรียบเทียบทั้งหมด
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:min-w-72">
              <div className="rounded-2xl bg-white p-4 text-center shadow-sm ring-1 ring-inset ring-amber-200">
                <p className="text-xs font-bold text-slate-500">Accuracy</p>
                <p className="mt-1 text-3xl font-black text-emerald-700">
                  {modelStats[0]?.accuracy.toFixed(2)}%
                </p>
              </div>

              <div className="rounded-2xl bg-white p-4 text-center shadow-sm ring-1 ring-inset ring-amber-200">
                <p className="text-xs font-bold text-slate-500">Hit</p>
                <p className="mt-1 text-3xl font-black text-slate-950">
                  {modelStats[0]?.hits}/{modelStats[0]?.total}
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-xl font-black text-slate-950 sm:text-2xl">
              Accuracy Comparison
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              เรียงอันดับจาก Accuracy สูงสุดลงมาต่ำสุด โดย Top 3 จะถูกเน้นให้เห็นชัด
            </p>
          </div>

          <div className="grid gap-3 md:hidden">
            {modelStats.map((model, index) => (
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
                    <p className="mt-1 text-xs font-bold text-slate-500">
                      อันดับ #{index + 1}
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
                      {model.hits}/{model.total}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <div className="rounded-2xl border border-slate-300 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-lg font-black text-slate-950">ทั้งหมด</p>
                  <p className="mt-1 text-xs font-bold text-slate-500">Overall tracker</p>
                </div>
                <p className="text-2xl font-black text-emerald-700">{accuracy}%</p>
              </div>

              <div className="mt-3 rounded-2xl bg-slate-50 p-3 text-center ring-1 ring-inset ring-slate-200">
                <p className="text-xs font-bold text-slate-500">Hit</p>
                <p className="mt-1 text-xl font-black text-slate-950">
                  {hitCount}/{results.length}
                </p>
              </div>
            </div>
          </div>

          <div className="hidden overflow-hidden rounded-2xl border border-slate-200 md:block">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  <th className="p-4 text-left font-bold">อันดับ</th>
                  <th className="p-4 text-left font-bold">สูตร</th>
                  <th className="p-4 text-left font-bold">Accuracy</th>
                  <th className="p-4 text-left font-bold">Hit</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 bg-white">
                {modelStats.map((model, index) => (
                  <tr
                    key={model.name}
                    className={index < 3 ? "bg-amber-50/70" : "hover:bg-slate-50"}
                  >
                    <td className="p-4 text-2xl">
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
                    </td>
                    <td className="p-4 font-black text-slate-950">{model.name}</td>
                    <td className="p-4 font-black text-emerald-700">
                      {model.accuracy.toFixed(2)}%
                    </td>
                    <td className="p-4 font-bold text-slate-800">
                      {model.hits}/{model.total}
                    </td>
                  </tr>
                ))}
                <tr className="bg-slate-50">
                  <td className="p-4 font-bold text-slate-500">-</td>
                  <td className="p-4 font-black text-slate-950">ทั้งหมด</td>
                  <td className="p-4 font-black text-emerald-700">{accuracy}%</td>
                  <td className="p-4 font-bold text-slate-800">{hitCount}/{results.length}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-xl font-black text-slate-950 sm:text-2xl">
              Accuracy
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              ผลรวมจาก Tracker หลักของหน้านี้
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
            <p className="text-5xl font-black tracking-tight text-slate-950 sm:text-6xl">
              {accuracy}%
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
              ถูก {hitCount} จาก {results.length} งวด
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-xl font-black text-slate-950 sm:text-2xl">
              ผลทดสอบย้อนหลัง 50 งวดล่าสุด
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              บนมือถือแสดงเป็น Card เพื่อป้องกันตารางล้นจอ
            </p>
          </div>

          <div className="grid gap-3 md:hidden">
            {results
              .slice(-50)
              .reverse()
              .map((row) => (
                <div
                  key={row.date}
                  className={
                    row.hit
                      ? "rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm"
                      : "rounded-2xl border border-rose-200 bg-rose-50 p-4 shadow-sm"
                  }
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-slate-500">วันที่</p>
                      <p className="mt-1 font-black text-slate-950">{row.date}</p>
                    </div>
                    <div className="rounded-full bg-white px-3 py-1 text-sm font-black shadow-sm">
                      {row.hit ? "✅ ถูก" : "❌ ไม่ถูก"}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3">
                    <div className="rounded-2xl bg-white p-3 ring-1 ring-inset ring-slate-200">
                      <p className="text-xs font-bold text-slate-500">เลขออกจริง</p>
                      <p className="mt-1 text-2xl font-black text-slate-950">
                        {row.actual}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white p-3 ring-1 ring-inset ring-slate-200">
                      <p className="text-xs font-bold text-slate-500">เลขแนะนำ</p>
                      <p className="mt-1 break-words text-sm font-bold leading-6 text-slate-800">
                        {row.suggested}
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
                  <th className="p-4 text-left font-bold">วันที่</th>
                  <th className="p-4 text-left font-bold">เลขออกจริง</th>
                  <th className="p-4 text-left font-bold">เลขแนะนำ</th>
                  <th className="p-4 text-left font-bold">ผล</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 bg-white">
                {results
                  .slice(-50)
                  .reverse()
                  .map((row) => (
                    <tr key={row.date} className="hover:bg-slate-50">
                      <td className="p-4 text-slate-600">{row.date}</td>
                      <td className="p-4 font-black text-slate-950">{row.actual}</td>
                      <td className="max-w-xl p-4 leading-6 text-slate-700">{row.suggested}</td>
                      <td className="p-4">
                        <span
                          className={
                            row.hit
                              ? "inline-flex rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700"
                              : "inline-flex rounded-full bg-rose-50 px-3 py-1 text-sm font-bold text-rose-700"
                          }
                        >
                          {row.hit ? "✅ ถูก" : "❌ ไม่ถูก"}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="pb-4 pt-2 text-center text-xs leading-6 text-slate-500 sm:text-sm">
          Tracker แสดงผลจากการทดสอบย้อนหลัง ใช้เพื่อเปรียบเทียบประสิทธิภาพของแต่ละสูตรเท่านั้น
        </footer>
      </div>
    </main>
  );
}