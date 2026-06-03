import { supabase } from "@/lib/supabase";
import {
  testPositionAnalyzer,
  testPositionEliteAnalyzer,
  testTrendAnalyzer,
  testHybridV7Analyzer,
} from "@/lib/backtest";

export default async function ModelRankingPage() {
  const { data, error } = await supabase
    .from("draws")
    .select("*")
    .order("draw_date", { ascending: true });

  if (error) {
    return <div className="p-8">Error: {error.message}</div>;
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
  ].sort((a, b) => b.accuracy - a.accuracy);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">
          🏆 Model Ranking
        </h1>

        <div className="bg-white rounded-xl shadow p-6">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">อันดับ</th>
                <th className="text-left p-2">โมเดล</th>
                <th className="text-left p-2">Accuracy</th>
                <th className="text-left p-2">Hit</th>
                <th className="text-left p-2">หมายเหตุ</th>
              </tr>
            </thead>

            <tbody>
              {models.map((model, index) => (
                <tr key={model.name} className="border-b">
                  <td className="p-2 text-2xl">
                    {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
                  </td>
                  <td className="p-2 font-bold">{model.name}</td>
                  <td className="p-2 font-bold">{model.accuracy.toFixed(2)}%</td>
                  <td className="p-2">{model.hit}</td>
                  <td className="p-2 text-gray-600">{model.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}