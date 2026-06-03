const models = [
  {
    rank: "🥇",
    name: "Analyzer V5 Pro",
    accuracy: "16.25%",
    hit: "137/843",
    note: "ใช้ Top 4 หลักสิบ × Top 4 หลักหน่วย รวม 16 ชุด",
  },
  {
    rank: "🥈",
    name: "Analyzer V5 Elite",
    accuracy: "10.44%",
    hit: "88/843",
    note: "คัด Top 10 จาก V5 Pro เหมาะสำหรับใช้งานจริง",
  },
  {
    rank: "🥉",
    name: "Hot Digits",
    accuracy: "6.04%",
    hit: "51/844",
    note: "วิเคราะห์จากเลขเดี่ยวที่ออกบ่อยที่สุด",
  },
  {
    rank: "4",
    name: "Scoring Engine",
    accuracy: "5.22%",
    hit: "44/843",
    note: "ใช้ Frequency + Missing แบบถ่วงน้ำหนัก",
  },
  {
    rank: "5",
    name: "50 งวดล่าสุด",
    accuracy: "5.09%",
    hit: "43/844",
    note: "ใช้ข้อมูลย้อนหลัง 50 งวด",
  },
  {
    rank: "6",
    name: "20 งวดล่าสุด",
    accuracy: "4.92%",
    hit: "43/874",
    note: "ใช้ข้อมูลย้อนหลัง 20 งวด",
  },
  {
    rank: "7",
    name: "Top เลข 2 ตัว",
    accuracy: "4.62%",
    hit: "39/844",
    note: "ใช้เลข 2 ตัวที่ออกบ่อยที่สุด",
  },
  {
    rank: "8",
    name: "100 งวดล่าสุด",
    accuracy: "3.02%",
    hit: "24/794",
    note: "ใช้ข้อมูลย้อนหลัง 100 งวด",
  },
];

export default function ModelRankingPage() {
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
              {models.map((model) => (
                <tr key={model.name} className="border-b">
                  <td className="p-2 text-2xl">{model.rank}</td>
                  <td className="p-2 font-bold">{model.name}</td>
                  <td className="p-2 font-bold">{model.accuracy}</td>
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