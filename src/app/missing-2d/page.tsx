import { supabase } from "@/lib/supabase";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Missing2DPage() {
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

  const missingNumbers = [];

  for (let i = 0; i < 100; i++) {
    const target = i.toString().padStart(2, "0");

    let missingCount = 0;

    for (const draw of data) {
      if (draw.number_2 === target) {
        break;
      }

      missingCount++;
    }

    missingNumbers.push({
      number: target,
      missingCount,
    });
  }

  missingNumbers.sort(
    (a, b) => b.missingCount - a.missingCount
  );

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          🎯 Missing 2D Analyzer
        </h1>

        <div className="bg-white rounded-xl shadow p-6">

          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">
                  อันดับ
                </th>

                <th className="text-left p-2">
                  เลข 2 ตัว
                </th>

                <th className="text-left p-2">
                  ไม่ออกมาแล้ว (งวด)
                </th>
              </tr>
            </thead>

            <tbody>
              {missingNumbers
                .slice(0, 20)
                .map((row, index) => (
                  <tr
                    key={row.number}
                    className="border-b"
                  >
                    <td className="p-2">
                      #{index + 1}
                    </td>

                    <td className="p-2 text-xl font-bold">
                      {row.number}
                    </td>

                    <td className="p-2">
                      {row.missingCount}
                    </td>
                  </tr>
                ))}
            </tbody>

          </table>

        </div>

      </div>
    </main>
  );
}