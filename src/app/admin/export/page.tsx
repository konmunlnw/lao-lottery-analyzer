"use client";

import { useState } from "react";

export default function ExportPage() {
  const [adminKey, setAdminKey] = useState("");
  const [message, setMessage] = useState("");

  async function handleExport() {
  try {
    setMessage("กำลังสร้างไฟล์ Backup...");

    const res = await fetch("/api/export", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        admin_key: adminKey,
      }),
    });

    if (!res.ok) {
      const text = await res.text();

let data;
try {
  data = JSON.parse(text);
} catch {
  setMessage(`❌ Export ไม่สำเร็จ: ${text || "ไม่มีข้อความจาก API"}`);
  return;
}

setMessage(`❌ ${data.error || "Export ไม่สำเร็จ"}`);
      return;
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "draws_backup.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);

    setMessage("✅ ดาวน์โหลด Backup สำเร็จ");
  } catch (error: any) {
    setMessage(`❌ ${error.message || "เกิดข้อผิดพลาด"}`);
  }
}

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div
        style={{ maxWidth: "520px", margin: "0 auto" }}
        className="bg-white rounded-xl shadow p-6"
      >
        <h1 className="text-3xl font-bold mb-6">
          📥 Export Backup
        </h1>

        <label className="block font-medium mb-1">
          รหัส Admin
        </label>

        <input
          type="password"
          className="w-full border-2 border-gray-400 bg-white rounded-lg p-3 text-black mb-4"
          value={adminKey}
          onChange={(e) => setAdminKey(e.target.value)}
        />

        <button
          onClick={handleExport}
          className="w-full bg-black text-white rounded-lg p-3 font-bold"
        >
          ดาวน์โหลด Backup CSV
        </button>

        {message && (
          <p className="mt-4 font-medium">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}