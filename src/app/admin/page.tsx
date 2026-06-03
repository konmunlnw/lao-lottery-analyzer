"use client";

import { useState } from "react";

export default function AdminPage() {
  const [drawDate, setDrawDate] = useState("");
  const [number6, setNumber6] = useState("");
  const [number3, setNumber3] = useState("");
  const [number2, setNumber2] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setMessage("กำลังบันทึก...");

    const res = await fetch("/api/add-draw", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        draw_date: drawDate,
        number_6: number6,
        number_3: number3,
        number_2: number2,
      }),
    });

    const text = await res.text();
console.log(text);

let data;

try {
  data = JSON.parse(text);
} catch {
  setMessage("API ส่งข้อมูลกลับไม่ถูกต้อง");
  return;
}

    if (data.success) {
      setMessage("✅ บันทึกสำเร็จ");

      setDrawDate("");
      setNumber6("");
      setNumber3("");
      setNumber2("");
    } else {
      setMessage(`❌ ${data.error}`);
    }
  }

  return (
    <main style={{ padding: "20px", maxWidth: "500px" }}>
      <h1>เพิ่มผลหวยลาวพัฒนา</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>วันที่ (YYYY-MM-DD)</label>
          <br />
          <input
            value={drawDate}
            onChange={(e) => setDrawDate(e.target.value)}
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>เลข 6 ตัว</label>
          <br />
          <input
            value={number6}
            onChange={(e) => setNumber6(e.target.value)}
            maxLength={6}
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>เลข 3 ตัว</label>
          <br />
          <input
            value={number3}
            onChange={(e) => setNumber3(e.target.value)}
            maxLength={3}
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>เลข 2 ตัว</label>
          <br />
          <input
            value={number2}
            onChange={(e) => setNumber2(e.target.value)}
            maxLength={2}
            required
          />
        </div>

        <button type="submit">
          บันทึกผลหวย
        </button>
      </form>

      <p>{message}</p>
    </main>
  );
}