import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #05281f 0%, #0b4f3f 50%, #05281f 100%)",
        color: "#ffffff",
        fontFamily: "'Segoe UI', 'Noto Nastaliq Urdu', system-ui, -apple-system, sans-serif",
        padding: "24px",
      }}
    >
      <div
        style={{
          maxWidth: "640px",
          width: "100%",
          background: "rgba(255, 255, 255, 0.05)",
          border: "1.5px solid rgba(198, 149, 47, 0.4)",
          borderRadius: "24px",
          padding: "48px 36px",
          textAlign: "center",
          backdropFilter: "blur(12px)",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.4)",
        }}
      >
        <div style={{ fontSize: "4rem", marginBottom: "8px", filter: "drop-shadow(0 4px 12px rgba(198,149,47,0.4))" }}>
          🕌
        </div>
        <div
          style={{
            fontSize: "2.8rem",
            fontWeight: 800,
            color: "#c6952f",
            letterSpacing: "2px",
            lineHeight: 1.1,
            marginBottom: "8px",
          }}
        >
          404
        </div>
        <h1
          style={{
            fontSize: "1.6rem",
            margin: "0 0 12px",
            color: "#ffffff",
            fontWeight: 700,
          }}
        >
          صفحہ دستیاب نہیں ہے | Page Not Found
        </h1>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.8)",
            fontSize: "0.95rem",
            lineHeight: 1.6,
            marginBottom: "28px",
          }}
        >
          آپ جس صفحے کو تلاش کر رہے ہیں وہ تبدیل ہو چکا ہے یا درست پتے پر موجود نہیں ہے۔ فاروقی آن لائن قرآن اکیڈمی کے مرکزی صفحات کے لیے نیچے دیے گئے لنکس استعمال کیجیے۔
          <br />
          <span style={{ fontSize: "0.88rem", color: "rgba(255, 255, 255, 0.65)" }}>
            The requested page could not be located. Please use the quick navigation below:
          </span>
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            justifyContent: "center",
            marginBottom: "24px",
          }}
        >
          <Link
            href="/en"
            style={{
              padding: "12px 24px",
              borderRadius: "12px",
              background: "#c6952f",
              color: "#05281f",
              fontWeight: 700,
              textDecoration: "none",
              fontSize: "0.92rem",
              boxShadow: "0 4px 14px rgba(198, 149, 47, 0.3)",
            }}
          >
            Home (English)
          </Link>
          <Link
            href="/ur"
            style={{
              padding: "12px 24px",
              borderRadius: "12px",
              background: "rgba(255, 255, 255, 0.12)",
              color: "#ffffff",
              fontWeight: 700,
              textDecoration: "none",
              fontSize: "0.92rem",
              border: "1px solid rgba(255, 255, 255, 0.25)",
            }}
          >
            مرکزی صفحہ (اردو)
          </Link>
          <Link
            href="/en/courses"
            style={{
              padding: "12px 20px",
              borderRadius: "12px",
              background: "transparent",
              color: "#c6952f",
              fontWeight: 600,
              textDecoration: "none",
              fontSize: "0.9rem",
              border: "1px solid rgba(198, 149, 47, 0.4)",
            }}
          >
            Courses / کورسز
          </Link>
          <Link
            href="/en/free-trial"
            style={{
              padding: "12px 20px",
              borderRadius: "12px",
              background: "transparent",
              color: "#c6952f",
              fontWeight: 600,
              textDecoration: "none",
              fontSize: "0.9rem",
              border: "1px solid rgba(198, 149, 47, 0.4)",
            }}
          >
            Free Trial / مفت ٹرائل
          </Link>
        </div>

        <div style={{ paddingTop: "18px", borderTop: "1px solid rgba(255, 255, 255, 0.12)" }}>
          <a
            href="https://wa.me/923336519527?text=Assalamu%20Alaikum!%20Farooqi%20Online%20Quran%20Academy%20Support"
            target="_blank"
            rel="noreferrer"
            style={{
              color: "#25d366",
              textDecoration: "none",
              fontSize: "0.88rem",
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span>💬</span> واٹس ایپ سپورٹ رابطہ / WhatsApp Support (+92 333 6519527)
          </a>
        </div>
      </div>
    </div>
  );
}
