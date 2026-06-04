import { unstable_noStore as noStore } from "next/cache";
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
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

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
  noStore();
  const { data, error } = await supabase
    .from("draws")
    .select("*")
    .order("draw_date", { ascending: true });

  if (error) {
    return <div className="p-8">Error: {error.message}</div>;
  }
  
  const { data: predictions, error: predictionsError } = await supabase
  .from("predictions")
  .select("*")
  .order("source_draw_date", { ascending: false });

if (predictionsError) {
  return (
    <div className="p-8">
      Prediction Error: {predictionsError.message}
    </div>
  );
}
  console.log("TRACKER PREDICTIONS:", predictions);

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
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">🎯 Tracker</h1>
        <div className="bg-white rounded-xl shadow p-6 mb-8">
  <h2 className="text-2xl font-bold mb-4">
    📡 Live Prediction Tracker
  </h2>

  <table className="w-full">
    <thead>
      <tr className="border-b">
        <th className="text-left p-2">งวดอ้างอิง</th>
        <th className="text-left p-2">โมเดล</th>
        <th className="text-left p-2">เลขที่ล็อกไว้</th>
        <th className="text-left p-2">ผลจริง</th>
        <th className="text-left p-2">สถานะ</th>
      </tr>
    </thead>

    <tbody>
      {(predictions || []).map((row) => (
        <tr key={row.id} className="border-b">
          <td className="p-2">{row.source_draw_date}</td>
          <td className="p-2 font-bold">{row.model}</td>
          <td className="p-2">
            {Array.isArray(row.predictions)
              ? row.predictions.join(", ")
              : ""}
          </td>
          <td className="p-2">{row.actual_result || "-"}</td>
          <td className="p-2">
            {row.is_hit === true
              ? "✅ เข้า"
              : row.is_hit === false
              ? "❌ ไม่เข้า"
              : "⏳ รอผล"}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
        
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">
            📈 Accuracy Comparison
          </h2>

          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">สูตร</th>
                <th className="text-left p-2">Accuracy</th>
                <th className="text-left p-2">Hit</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b">
                <td className="p-2">20 งวด</td>
                <td className="p-2 font-bold">{stats20.accuracy}%</td>
                <td className="p-2">{stats20.hits}/{stats20.total}</td>
              </tr>

              <tr className="border-b">
                <td className="p-2">50 งวด</td>
                <td className="p-2 font-bold">{stats50.accuracy}%</td>
                <td className="p-2">{stats50.hits}/{stats50.total}</td>
              </tr>

              <tr className="border-b">
                <td className="p-2">100 งวด</td>
                <td className="p-2 font-bold">{stats100.accuracy}%</td>
                <td className="p-2">{stats100.hits}/{stats100.total}</td>
              </tr>

              <tr className="border-b">
                <td className="p-2">Top เลข 2 ตัว</td>
                <td className="p-2 font-bold">{statsTop2.accuracy}%</td>
                <td className="p-2">{statsTop2.hits}/{statsTop2.total}</td>
              </tr>

              <tr className="border-b">
                <td className="p-2">Scoring Engine</td>
                <td className="p-2 font-bold">{statsScoring.accuracy}%</td>
                <td className="p-2">{statsScoring.hits}/{statsScoring.total}</td>
              </tr>

              <tr className="border-b">
                <td className="p-2">Analyzer V5</td>
                <td className="p-2 font-bold">{statsPosition.accuracy}%</td>
                <td className="p-2">{statsPosition.hits}/{statsPosition.total}</td>
              </tr>

              <tr className="border-b">
                <td className="p-2">Analyzer V5 Elite</td>
                <td className="p-2 font-bold">{statsPositionElite.accuracy}%</td>
                <td className="p-2">{statsPositionElite.hits}/{statsPositionElite.total}</td>
              </tr>
<tr className="border-b">
  <td className="p-2">4D Analyzer V1</td>
  <td className="p-2 font-bold">{stats4D.accuracy}%</td>
  <td className="p-2">{stats4D.hits}/{stats4D.total}</td>
</tr>
<tr className="border-b">
  <td className="p-2">Analyzer V6 Trend</td>
  <td className="p-2 font-bold">{statsTrend.accuracy}%</td>
  <td className="p-2">{statsTrend.hits}/{statsTrend.total}</td>
</tr>
<tr className="border-b">
  <td className="p-2">Analyzer V7 Hybrid</td>
  <td className="p-2 font-bold">{statsHybridV7.accuracy}%</td>
  <td className="p-2">{statsHybridV7.hits}/{statsHybridV7.total}</td>
</tr>
              <tr>
                <td className="p-2">ทั้งหมด</td>
                <td className="p-2 font-bold">{accuracy}%</td>
                <td className="p-2">{hitCount}/{results.length}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-2xl font-bold mb-2">Accuracy</h2>

          <p className="text-4xl font-bold">{accuracy}%</p>

          <p className="text-gray-600 mt-2">
            ถูก {hitCount} จาก {results.length} งวด
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">วันที่</th>
                <th className="text-left p-2">เลขออกจริง</th>
                <th className="text-left p-2">เลขแนะนำ</th>
                <th className="text-left p-2">ผล</th>
              </tr>
            </thead>

            <tbody>
              {results
                .slice(-50)
                .reverse()
                .map((row) => (
                  <tr key={row.date} className="border-b">
                    <td className="p-2">{row.date}</td>
                    <td className="p-2 font-bold">{row.actual}</td>
                    <td className="p-2">{row.suggested}</td>
                    <td className="p-2">{row.hit ? "✅" : "❌"}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}