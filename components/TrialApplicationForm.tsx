"use client";

import { FormEvent, useMemo, useState } from "react";
import { siteData, type Locale } from "@/lib/siteData";

export default function TrialApplicationForm({ locale }: { locale: Locale }) {
  const t = siteData[locale];
  const isUrdu = locale === "ur";
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const dayOptions = useMemo(
    () =>
      isUrdu
        ? ["پیر", "منگل", "بدھ", "جمعرات", "جمعہ", "ہفتہ", "اتوار"]
        : ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    [isUrdu]
  );

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setStatus("");

    const form = new FormData(e.currentTarget);
    const days = form.getAll("preferred_days").map(String);
    const payload = Object.fromEntries(form.entries()) as Record<string, unknown>;
    payload.preferred_days = days;
    payload.locale = locale;
    payload.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";

    try {
      const response = await fetch("/api/trials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Submission failed");
      }

      const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923336519527";
      const text = isUrdu
        ? `السلام علیکم، میں نے فاروقی آن لائن قرآن اکیڈمی کی ویب سائٹ پر مفت ٹرائل کلاس کی درخواست جمع کر دی ہے۔\nدرخواست نمبر: ${result.id}`
        : `Assalamu Alaikum, I have submitted a free trial request on Farooqi Online Quran Academy.\nApplication ID: ${result.id}`;

      setStatus(
        isUrdu
          ? "الحمدللہ! آپ کی درخواست محفوظ ہوگئی ہے۔"
          : "Your request has been saved successfully."
      );

      e.currentTarget.reset();

      window.open(
        `https://wa.me/${number}?text=${encodeURIComponent(text)}`,
        "_blank",
        "noopener,noreferrer"
      );
    } catch {
      setStatus(
        isUrdu
          ? "درخواست جمع نہیں ہوسکی۔ براہِ کرم دوبارہ کوشش کریں یا واٹس ایپ پر رابطہ کریں۔"
          : "We could not save your request. Please try again or contact us on WhatsApp."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="trial-application-form" onSubmit={submit}>
      <div className="form-section-head">
        <span className="eyebrow">{isUrdu ? "داخلہ و ٹرائل" : "Admission & Trial"}</span>
        <h2>{isUrdu ? "طالب علم کی معلومات" : "Student Information"}</h2>
      </div>

      <div className="form-row">
        <label>
          {isUrdu ? "طالب علم کا نام *" : "Student name *"}
          <input name="student_name" required />
        </label>
        <label>
          {isUrdu ? "والد / والدہ / سرپرست" : "Parent / guardian"}
          <input name="parent_name" />
        </label>
      </div>

      <div className="form-row">
        <label>
          {isUrdu ? "واٹس ایپ نمبر *" : "WhatsApp *"}
          <input name="whatsapp" inputMode="tel" required />
        </label>
        <label>
          {isUrdu ? "ای میل" : "Email"}
          <input name="email" type="email" />
        </label>
      </div>

      <div className="form-row">
        <label>
          {isUrdu ? "ملک *" : "Country *"}
          <input name="country" required />
        </label>
        <label>
          {isUrdu ? "شہر" : "City"}
          <input name="city" />
        </label>
      </div>

      <div className="form-row">
        <label>
          {isUrdu ? "عمر" : "Age"}
          <input name="age" type="number" min="3" max="100" />
        </label>
        <label>
          {isUrdu ? "طالب علم کی جنس" : "Student gender"}
          <select name="gender" defaultValue="">
            <option value="">{isUrdu ? "منتخب کریں" : "Select"}</option>
            <option value="male">{isUrdu ? "مرد / لڑکا" : "Male"}</option>
            <option value="female">{isUrdu ? "خاتون / لڑکی" : "Female"}</option>
          </select>
        </label>
      </div>

      <label>
        {isUrdu ? "مطلوبہ کورس *" : "Preferred course *"}
        <select name="course" required defaultValue="">
          <option value="" disabled>
            {isUrdu ? "کورس منتخب کریں" : "Select a course"}
          </option>
          {t.coursesList.map(([name]) => (
            <option value={name} key={name}>{name}</option>
          ))}
        </select>
      </label>

      <div className="form-row">
        <label>
          {isUrdu ? "استاد کی ترجیح" : "Teacher preference"}
          <select name="preferred_teacher_gender" defaultValue="">
            <option value="">{isUrdu ? "کوئی خاص ترجیح نہیں" : "No preference"}</option>
            <option value="male">{isUrdu ? "مرد استاد" : "Male tutor"}</option>
            <option value="female">{isUrdu ? "خاتون معلمہ" : "Female tutor"}</option>
          </select>
        </label>

        <label>
          {isUrdu ? "کلاس کی زبان" : "Class language"}
          <select name="preferred_language" defaultValue="">
            <option value="">{isUrdu ? "منتخب کریں" : "Select"}</option>
            <option value="Urdu">{isUrdu ? "اردو" : "Urdu"}</option>
            <option value="English">{isUrdu ? "انگلش" : "English"}</option>
            <option value="Arabic">{isUrdu ? "عربی" : "Arabic"}</option>
          </select>
        </label>
      </div>

      <fieldset className="days-fieldset">
        <legend>{isUrdu ? "پسندیدہ دن" : "Preferred days"}</legend>
        <div className="days-grid">
          {dayOptions.map((day) => (
            <label className="check-option" key={day}>
              <input type="checkbox" name="preferred_days" value={day} />
              <span>{day}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label>
        {isUrdu ? "پسندیدہ وقت" : "Preferred time"}
        <input
          name="preferred_time"
          placeholder={isUrdu ? "مثلاً شام 7 سے 9 بجے" : "e.g. 7:00–9:00 PM"}
        />
      </label>

      <label>
        {isUrdu ? "موجودہ تعلیمی سطح" : "Current Quran level"}
        <textarea
          name="previous_level"
          rows={3}
          placeholder={
            isUrdu
              ? "مثلاً قاعدہ مکمل، ناظرہ پارہ 5، یا بالکل ابتدائی"
              : "e.g. beginner, completed Qaida, reading Juz 5, etc."
          }
        />
      </label>

      <label>
        {isUrdu ? "اضافی تفصیل" : "Additional details"}
        <textarea name="message" rows={4} />
      </label>

      <button className="btn btn-gold" type="submit" disabled={busy}>
        {busy
          ? isUrdu ? "درخواست محفوظ ہو رہی ہے…" : "Submitting…"
          : isUrdu ? "مفت ٹرائل درخواست جمع کریں" : "Submit Free Trial Request"}
      </button>

      <p className="form-status" aria-live="polite">{status}</p>
    </form>
  );
}
