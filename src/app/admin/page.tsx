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
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-4 py-6 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-950 px-5 py-6 text-white sm:px-7 sm:py-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
              Admin Panel
            </p>
            <h1 className="mt-2 text-2xl font-black leading-tight tracking-tight sm:text-4xl">
              เพิ่มผลหวยลาวพัฒนา
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
              กรอกเฉพาะวันที่และเลข 6 ตัว ระบบจะแยกเลข 3 ตัวและ 2 ตัวท้ายให้อัตโนมัติ
            </p>
          </div>

          <div className="grid gap-0 lg:grid-cols-[1fr_280px]">
            <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-7">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-800">
                  วันที่ออกผล
                </label>
                <input
                  type="date"
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base font-semibold text-slate-950 shadow-sm outline-none transition focus:border-slate-950 focus:ring-4 focus:ring-slate-200"
                  value={drawDate}
                  onChange={(e) => setDrawDate(e.target.value)}
                  required
                />
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  รูปแบบวันที่เป็น YYYY-MM-DD
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-800">
                  เลข 6 ตัว
                </label>
                <input
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-4 text-center text-3xl font-black tracking-widest text-slate-950 shadow-sm outline-none transition placeholder:text-slate-300 focus:border-slate-950 focus:ring-4 focus:ring-slate-200 sm:text-4xl"
                  value={number6}
                  onChange={(e) => setNumber6(e.target.value)}
                  maxLength={6}
                  inputMode="numeric"
                  placeholder="000000"
                  required
                />
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  ใส่เลข 6 หลักเท่านั้น เช่น 123456 แล้วระบบจะบันทึกเลข 3 ตัวท้ายและ 2 ตัวท้ายให้อัตโนมัติ
                </p>
              </div>

              <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-bold text-slate-500">เลข 3 ตัวท้าย</p>
                  <p className="mt-1 text-2xl font-black text-slate-950">
                    {number6.length >= 3 ? number6.slice(-3) : "---"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-500">เลข 2 ตัวท้าย</p>
                  <p className="mt-1 text-2xl font-black text-slate-950">
                    {number6.length >= 2 ? number6.slice(-2) : "--"}
                  </p>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-800">
                  รหัส Admin
                </label>
                <input
                  type="password"
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base font-semibold text-slate-950 shadow-sm outline-none transition focus:border-slate-950 focus:ring-4 focus:ring-slate-200"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="กรอกรหัสสำหรับบันทึกข้อมูล"
                  required
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-950 px-5 py-4 text-base font-black text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300"
                >
                  บันทึกผลหวย
                </button>

                <a
                  href="/admin/export"
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-blue-600 px-5 py-4 text-base font-black text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                >
                  📥 Export Backup
                </a>
              </div>

              {message && (
                <div
                  className={
                    message.startsWith("✅")
                      ? "rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold leading-6 text-emerald-700"
                      : message.startsWith("❌")
                        ? "rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold leading-6 text-rose-700"
                        : "rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold leading-6 text-slate-700"
                  }
                >
                  {message}
                </div>
              )}
            </form>

            <aside className="border-t border-slate-200 bg-slate-50 p-5 sm:p-7 lg:border-l lg:border-t-0">
              <h2 className="text-lg font-black text-slate-950">
                วิธีกรอกข้อมูล
              </h2>

              <div className="mt-4 space-y-3">
                <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-inset ring-slate-200">
                  <p className="text-sm font-bold text-slate-800">1. เลือกวันที่</p>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    ใช้วันที่ของงวดที่ต้องการบันทึก
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-inset ring-slate-200">
                  <p className="text-sm font-bold text-slate-800">2. กรอกเลข 6 ตัว</p>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    ไม่ต้องกรอกเลข 3 ตัวหรือ 2 ตัวเอง ระบบแยกให้อัตโนมัติ
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-inset ring-slate-200">
                  <p className="text-sm font-bold text-slate-800">3. ใส่รหัส Admin</p>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    ใช้สำหรับยืนยันสิทธิ์ก่อนบันทึกข้อมูล
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-4">
                <p className="text-sm font-bold text-blue-800">
                  Backup
                </p>
                <p className="mt-1 text-sm leading-6 text-blue-700">
                  ใช้ Export Backup เพื่อสำรองข้อมูลผลหวยจากระบบ
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}