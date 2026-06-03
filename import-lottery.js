const XLSX = require("xlsx");
const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");

// อ่าน .env.import
const env = fs.readFileSync(".env.import", "utf8");

const getEnv = (key) => {
  const match = env.match(new RegExp(`${key}=(.*)`));
  return match ? match[1].trim() : "";
};

const supabase = createClient(
  getEnv("SUPABASE_URL"),
  getEnv("SUPABASE_SERVICE_ROLE_KEY")
);

async function run() {
  const workbook = XLSX.readFile(
    "lao_lottery_years10_894_draws.xlsx"
  );

  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet);

  console.log(`พบข้อมูล ${rows.length} แถว`);

  let imported = 0;

  for (const row of rows) {
    const rawDate = String(row["งวดวันที่"]).trim();

const [day, month, buddhistYear] = rawDate.split("/");

const drawDate = `${Number(buddhistYear) - 543}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

    const number6 = String(row["เลข 6 ตัว"]).padStart(6, "0");
    const number3 = String(row["เลข 3 ตัว"]).padStart(3, "0");
    const number2 = String(row["เลข 2 ตัว"]).padStart(2, "0");

    const { error } = await supabase
      .from("draws")
      .upsert(
  {
    draw_date: drawDate,
    number_6: number6,
    number_3: number3,
    number_2: number2,
  },
  {
    onConflict: "draw_date",
  }
);

    if (error) {
  console.log("ERROR:", drawDate, error.message);
  continue;
}

    imported++;
  }

  console.log(`นำเข้าสำเร็จ ${imported} รายการ`);
}

run();