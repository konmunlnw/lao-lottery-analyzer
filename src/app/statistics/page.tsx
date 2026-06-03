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
      <div className="p-8">
        Error: {error.message}
      </div>
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
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          📊 Statistics
        </h1>

        {/* HOT/COLD */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">

          {/* 20 */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-2xl font-bold mb-4">
              20 งวดล่าสุด
            </h2>

            <p className="font-bold mb-2">
              🔥 Hot Numbers
            </p>

            <div className="flex gap-3 mb-4">
              {stats20.hot.map((n) => (
                <div
                  key={n}
                  className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center font-bold text-xl"
                >
                  {n}
                </div>
              ))}
            </div>

            <p className="font-bold mb-2">
              ❄️ Cold Numbers
            </p>

            <div className="flex gap-3">
              {stats20.cold.map((n) => (
                <div
                  key={n}
                  className="w-14 h-14 rounded-full border-2 flex items-center justify-center font-bold text-xl"
                >
                  {n}
                </div>
              ))}
            </div>
          </div>

          {/* 50 */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-2xl font-bold mb-4">
              50 งวดล่าสุด
            </h2>

            <p className="font-bold mb-2">
              🔥 Hot Numbers
            </p>

            <div className="flex gap-3 mb-4">
              {stats50.hot.map((n) => (
                <div
                  key={n}
                  className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center font-bold text-xl"
                >
                  {n}
                </div>
              ))}
            </div>

            <p className="font-bold mb-2">
              ❄️ Cold Numbers
            </p>

            <div className="flex gap-3">
              {stats50.cold.map((n) => (
                <div
                  key={n}
                  className="w-14 h-14 rounded-full border-2 flex items-center justify-center font-bold text-xl"
                >
                  {n}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Ranking */}
        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-2xl font-bold mb-6">
            อันดับเลขทั้งหมด
          </h2>

          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">เลข</th>
                <th className="text-left p-2">จำนวนครั้ง</th>
              </tr>
            </thead>

            <tbody>
              {statsAll.ranking.map(([digit, count]) => (
                <tr
                  key={digit}
                  className="border-b"
                >
                  <td className="p-2 font-bold">
                    {digit}
                  </td>

                  <td className="p-2">
                    {count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
<div className="bg-white rounded-xl shadow p-6 mt-8">

  <h2 className="text-2xl font-bold mb-6">
    🎯 Top 20 เลข 2 ตัว
  </h2>

  <table className="w-full">
    <thead>
      <tr className="border-b">
        <th className="text-left p-2">
          อันดับ
        </th>

        <th className="text-left p-2">
          เลข
        </th>

        <th className="text-left p-2">
          จำนวนครั้ง
        </th>
      </tr>
    </thead>

    <tbody>
      {topNumber2.map(
        ([number, count], index) => (
          <tr
            key={number}
            className="border-b"
          >
            <td className="p-2">
              #{index + 1}
            </td>

            <td className="p-2 font-bold text-lg">
              {number}
            </td>

            <td className="p-2">
              {count}
            </td>
          </tr>
        )
      )}
    </tbody>
  </table>

</div>
      </div>
    </main>
    
  );
}