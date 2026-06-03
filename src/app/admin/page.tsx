"use client";

import { useState } from "react";

export default function AdminPage() {
  const [drawDate, setDrawDate] = useState("");
  const [number6, setNumber6] = useState("");
  const [number3, setNumber3] = useState("");
  const [number2, setNumber2] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setMessage("กำลังบันทึก...");
const autoNumber3 = number6.slice(-3);
const autoNumber2 = number6.slice(-2);
if (number6.length !== 6) {
  setMessage("❌ เลข 6 ตัวต้องมี 6 หลัก");
  return;
}
    const res = await fetch("/api/add-draw", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
  draw_date: drawDate,
  number_6: number6,
  number_3: autoNumber3,
  number_2: autoNumber2,
  admin_key: adminKey,
}),
    });

    const data = await res.json();

    if (data.success) {
      setMessage("✅ บันทึกสำเร็จ");
      setDrawDate("");
      setNumber6("");
      setNumber3("");
      setNumber2("");
      setAdminKey("");
    } else {
      setMessage(`❌ ${data.error}`);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div style={{ maxWidth: "520px", margin: "0 auto" }} className="bg-white rounded-xl shadow p-6">
        <h1 className="text-3xl font-bold mb-6">
          เพิ่มผลหวยลาวพัฒนา
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">วันที่ (YYYY-MM-DD)</label>
            <input
              className="w-full border-2 border-gray-400 bg-white rounded-lg p-3 text-black"
              value={drawDate}
              onChange={(e) => setDrawDate(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">เลข 6 ตัว</label>
            <input
              className="w-full border-2 border-gray-400 bg-white rounded-lg p-3 text-black"
              value={number6}
              onChange={(e) => setNumber6(e.target.value)}
              maxLength={6}
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">รหัส Admin</label>
            <input
              type="password"
              className="w-full border-2 border-gray-400 bg-white rounded-lg p-3 text-black"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white rounded-lg p-3 font-bold"
          >
            บันทึกผลหวย
          </button>
          <a
  href="/admin/export"
  className="block w-full text-center bg-blue-600 text-white rounded-lg p-3 font-bold mt-3"
>
  📥 Export Backup
</a>
        </form>

        {message && <p className="mt-4 font-medium">{message}</p>}
      </div>
    </main>
  );
}