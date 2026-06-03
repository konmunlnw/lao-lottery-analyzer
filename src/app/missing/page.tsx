import { supabase } from "@/lib/supabase";

export default async function MissingPage() {
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

  const missingData = [];

  for (let digit = 0; digit <= 9; digit++) {
    let missingCount = 0;

    for (const draw of data) {
      const numbers =
        String(draw.number_6 || "") +
        String(draw.number_3 || "") +
        String(draw.number_2 || "");

      if (numbers.includes(digit.toString())) {
        break;
      }

      missingCount++;
    }

    missingData.push({
      digit: digit.toString(),
      missingCount,
    });
  }

  missingData.sort(
    (a, b) => b.missingCount - a.missingCount
  );

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          📈 Missing Numbers
        </h1>

        <div className="bg-white rounded-xl shadow p-6">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">
                  เลข
                </th>

                <th className="text-left p-2">
                  ไม่ออกมาแล้ว (งวด)
                </th>
              </tr>
            </thead>

            <tbody>
              {missingData.map((row) => (
                <tr
                  key={row.digit}
                  className="border-b"
                >
                  <td className="p-2 font-bold text-xl">
                    {row.digit}
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