import { supabase } from "@/lib/supabase";
import {
  analyzeNumbers,
  analyze2DPositions,
  analyze4DPositions,
  analyze2DTrend,
  analyzeHybridV7
} from "@/lib/analyzer";
import { calculateScores } from "@/lib/scoring";

export default async function Home() {
  const { data, error } = await supabase
    .from("draws")
    .select("*")
    .order("draw_date", { ascending: false })
   

  if (error) {
    return <div>เกิดข้อผิดพลาด: {error.message}</div>;
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
  console.log(positionAnalysis);
  const scores = calculateScores(data || []);
const top10 = scores.slice(0, 10);
  const latest = data?.[0];
  const recentDraws = data?.slice(0, 50) || [];
  const totalDraws = data?.length || 0;
console.log(analysis);
  return (
  <main className="min-h-screen bg-gray-100 p-6">
    <div className="max-w-6xl mx-auto">

      <h1 className="text-4xl font-bold mb-8">
        หวยลาวพัฒนา Analyzer
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
  <div className="bg-white rounded-xl shadow p-6">
    <p className="text-gray-500 mb-2">🏆 โมเดลดีที่สุด</p>
    <h2 className="text-2xl font-bold">Analyzer V5 Pro</h2>
    <p className="text-green-600 font-bold mt-2">
      Accuracy 16.25%
    </p>
  </div>

  <div className="bg-white rounded-xl shadow p-6">
    <p className="text-gray-500 mb-2">🎯 โมเดลใช้งานจริง</p>
    <h2 className="text-2xl font-bold">V5 Elite</h2>
    <p className="text-green-600 font-bold mt-2">
      Accuracy 10.44%
    </p>
  </div>

  <div className="bg-white rounded-xl shadow p-6">
    <p className="text-gray-500 mb-2">📚 จำนวนข้อมูลงวด</p>
    <h2 className="text-2xl font-bold">
      {totalDraws} งวด
    </h2>
  </div>
</div>
<div className="bg-white rounded-xl shadow p-6 mb-8">
  <h2 className="text-2xl font-bold mb-2">
    🎯 เลขแนะนำหลักงวดหน้า
  </h2>

  <p className="text-gray-600 mb-4">
    Analyzer V5 Elite • Backtest Accuracy 10.44%
  </p>

  <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
    {eliteNumbers.map((num) => (
      <span
        key={num}
        style={{
          background: "black",
          color: "white",
          padding: "10px 18px",
          borderRadius: "10px",
          fontWeight: "bold",
          display: "inline-block",
          fontSize: "20px",
        }}
      >
        {num}
      </span>
    ))}
  </div>
</div>
      {/* งวดล่าสุด */}
      {latest && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <h3 className="text-gray-500 mb-2">เลข 6 ตัว</h3>
            <p className="text-3xl font-bold">
              {latest.number_6}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6 text-center">
            <h3 className="text-gray-500 mb-2">เลข 3 ตัว</h3>
            <p className="text-3xl font-bold">
              {latest.number_3}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6 text-center">
            <h3 className="text-gray-500 mb-2">เลข 2 ตัว</h3>
            <p className="text-3xl font-bold">
              {latest.number_2}
            </p>
          </div>
        </div>
      )}

      {/* เลขเด่น */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">
          เลขเด่นงวดหน้า
        </h2>

        <div className="flex gap-4">
          {analysis.hotDigits.map((digit) => (
            <div
              key={digit}
              className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center text-2xl font-bold"
            >
              {digit}
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold mt-8 mb-4">
  Cold Numbers
</h2>

<div className="flex gap-4">
  {analysis.coldDigits && analysis.coldDigits.map((digit) => (
    <div
      key={digit}
      className="w-16 h-16 rounded-full border-2 flex items-center justify-center text-2xl font-bold"
    >
      {digit}
    </div>
  ))}
</div>
      </div>

      {/* เลขแนะนำ */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold text-xl mb-3">
            เลข 2 ตัว
          </h3>

          {analysis.suggested2.map((n) => (
            <div key={n}>{n}</div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold text-xl mb-3">
            เลข 3 ตัว
          </h3>

          {analysis.suggested3.map((n) => (
            <div key={n}>{n}</div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold text-xl mb-3">
            เลข 4 ตัว
          </h3>

          {analysis.suggested4.map((n) => (
            <div key={n}>{n}</div>
          ))}
        </div>

      </div>

      {/* ตารางย้อนหลัง */}
      <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">

        <h2 className="text-2xl font-bold mb-4">
          ผลย้อนหลัง 50 งวด
        </h2>

        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">วันที่</th>
              <th className="text-left p-2">6 ตัว</th>
              <th className="text-left p-2">3 ตัว</th>
              <th className="text-left p-2">2 ตัว</th>
            </tr>
          </thead>

          <tbody>
            {recentDraws.map((row) => (
              <tr
                key={row.draw_date}
                className="border-b"
              >
                <td className="p-2">{row.draw_date}</td>
                <td className="p-2">{row.number_6}</td>
                <td className="p-2">{row.number_3}</td>
                <td className="p-2">{row.number_2}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
<div className="bg-white rounded-xl shadow p-6 mb-8 mt-8">
  <h2 className="text-2xl font-bold mb-4">
    🔥 Top 10 เลขแนะนำงวดหน้า
  </h2>
<div className="bg-white rounded-xl shadow p-6 mb-8">
  <h2 className="text-2xl font-bold mb-4">
    🧪 ทดลอง: Analyzer V6 Trend
  </h2>

  <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
    {trendAnalysis.slice(0, 10).map((row) => (
      <span
        key={row.number}
        style={{
          background: "black",
          color: "white",
          padding: "8px 16px",
          borderRadius: "8px",
          fontWeight: "bold",
          display: "inline-block",
        }}
      >
        {row.number}
      </span>
    ))}
  </div>
</div>

<div className="bg-white rounded-xl shadow p-6 mb-8">
  <h2 className="text-2xl font-bold mb-4">
    🧪 ทดลอง: Analyzer V7 Hybrid
  </h2>

  <p className="text-gray-600 mb-4">
    รวมคะแนนจาก V5 Pro + V5 Elite + V6 Trend
  </p>

  <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
    {hybridAnalysis.slice(0, 10).map((row) => (
      <span
        key={row.number}
        style={{
          background: "black",
          color: "white",
          padding: "8px 16px",
          borderRadius: "8px",
          fontWeight: "bold",
          display: "inline-block",
        }}
      >
        {row.number}
      </span>
    ))}
  </div>
</div>

<table className="w-full">
  <thead>
    <tr className="border-b">
      <th className="p-2 text-left">อันดับ</th>
      <th className="p-2 text-left">เลข</th>
      <th className="p-2 text-left">Score</th>
      <th className="p-2 text-left">Frequency</th>
      <th className="p-2 text-left">Missing</th>
    </tr>
  </thead>

  <tbody>
    {top10.map((row, index) => (
      <tr key={row.number} className="border-b">
        <td className="p-2">#{index + 1}</td>
        <td className="p-2 font-bold">{row.number}</td>
        <td className="p-2">{row.score.toFixed(1)}</td>
        <td className="p-2">{row.frequency}</td>
        <td className="p-2">{row.missing}</td>
      </tr>
    ))}
  </tbody>
</table>
</div>
<div className="bg-white rounded-xl shadow p-6 mb-8">
  <h2 className="text-2xl font-bold mb-4">
    🎯 Analyzer V5
  </h2>

  <p className="mb-2">
    หลักสิบเด่น: {positionAnalysis.topTens.join(", ")}
  </p>

  <p className="mb-4">
    หลักหน่วยเด่น: {positionAnalysis.topUnits.join(", ")}
  </p>

  <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
    {positionAnalysis.suggestions.map((num) => (
      <span
        key={num}
        style={{
          background: "black",
          color: "white",
          padding: "8px 16px",
          borderRadius: "8px",
          fontWeight: "bold",
          display: "inline-block",
        }}
      >
        {num}
      </span>
    ))}
  </div>
</div>

<div className="bg-white rounded-xl shadow p-6 mb-8">
  <h2 className="text-2xl font-bold mb-4">
    🏆 Analyzer V5 Elite
  </h2>

  <p className="mb-4">
    คัด Top 10 จากชุด V5 Pro
  </p>

  <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
    {positionAnalysis.eliteSuggestions.map((num) => (
      <span
        key={num}
        style={{
          background: "black",
          color: "white",
          padding: "8px 16px",
          borderRadius: "8px",
          fontWeight: "bold",
          display: "inline-block",
        }}
      >
        {num}
      </span>
    ))}
  </div>
</div>

<div className="bg-white rounded-xl shadow p-6 mb-8">
  <h2 className="text-2xl font-bold mb-4">
    🧪 ทดลอง: 4D Analyzer V1
  </h2>

  <p className="mb-2">
    หลักพันเด่น: {fourDAnalysis.topP1.join(", ")}
  </p>

  <p className="mb-2">
    หลักร้อยเด่น: {fourDAnalysis.topP2.join(", ")}
  </p>

  <p className="mb-2">
    หลักสิบเด่น: {fourDAnalysis.topP3.join(", ")}
  </p>

  <p className="mb-4">
    หลักหน่วยเด่น: {fourDAnalysis.topP4.join(", ")}
  </p>

  <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
    {fourDAnalysis.suggestions.map((num) => (
      <span
        key={num}
        style={{
          background: "black",
          color: "white",
          padding: "8px 16px",
          borderRadius: "8px",
          fontWeight: "bold",
          display: "inline-block",
        }}
      >
        {num}
      </span>
    ))}
  </div>
</div>
    </div>
  </main>
);
}