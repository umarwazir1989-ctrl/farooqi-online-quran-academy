"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import {
  siteData,
  QURAN_SURAHS,
  QURAN_FULL_DATA,
  NOORANI_QAIDA_LESSONS,
  type Locale,
  type CourseDetail,
  type CourseOutlineModule,
  TAFASEER_CATALOG,
  TRANSLATIONS_CATALOG,
  SAMPLE_AYAH_TAFSIR_LIBRARY,
  HADITH_ENCYCLOPEDIA,
  HARAMAIN_LIVE_STREAMS,
  DAILY_AZKAR_DATA,
  ISLAMIC_LIBRARY_CATEGORIES,
  type HadithRecord,
} from "@/lib/siteData";

type QariReciterId = "husary_muallim" | "afasy" | "basit" | "sudais" | "minshawi_muallim";

interface QariReciter {
  id: QariReciterId;
  nameUr: string;
  nameEn: string;
  serverUrl: string;
  isTeacherMode: boolean;
  descUr: string;
  descEn: string;
}

const RECITERS: QariReciter[] = [
  {
    id: "husary_muallim",
    nameUr: "شیخ محمود خلیل الحصری (معلم - تدریس کا انداز)",
    nameEn: "Sheikh Al-Husary (Educational / Teacher Mode)",
    serverUrl: "https://server13.mp3quran.net/husr_moal",
    isTeacherMode: true,
    descUr: "تدریس کا روایتی انداز: استاد آیت تلاوت کر کے ٹھہرتے ہیں تاکہ طلبہ دہرائیں",
    descEn: "Traditional teaching style: measured recitation with pauses for student repetition",
  },
  {
    id: "afasy",
    nameUr: "شیخ مشاری راشد العفاسی",
    nameEn: "Sheikh Mishary Rashid Alafasy",
    serverUrl: "https://server8.mp3quran.net/afs",
    isTeacherMode: false,
    descUr: "خوش الحان اور دلنشین ترتیل",
    descEn: "Renowned soulful and melodious Murattal recitation",
  },
  {
    id: "basit",
    nameUr: "شیخ عبد الباسط عبد الصمد (مرتل)",
    nameEn: "Sheikh Abdul Basit (Murattal)",
    serverUrl: "https://server7.mp3quran.net/basit",
    isTeacherMode: false,
    descUr: "مصر کے سنہرے دور کی بے مثل تجوید و قراءت",
    descEn: "Timeless Egyptian master of crisp, measured Tajweed",
  },
  {
    id: "sudais",
    nameUr: "شیخ عبد الرحمٰن السدیس (امامِ کعبہ)",
    nameEn: "Sheikh Abdur-Rahman As-Sudais",
    serverUrl: "https://server11.mp3quran.net/sds",
    isTeacherMode: false,
    descUr: "مسجدِ حرام، مکہ مکرمہ کی پر اثر تلاوت",
    descEn: "Revered recitation from the Grand Mosque in Makkah",
  },
  {
    id: "minshawi_muallim",
    nameUr: "شیخ محمد صدیق المنشاوی (معلم / تدریس)",
    nameEn: "Sheikh Al-Minshawi (Teacher Mode)",
    serverUrl: "https://server10.mp3quran.net/minsh_moal",
    isTeacherMode: true,
    descUr: "تدریسی انداز مع تکرارِ طلبہ",
    descEn: "Educational recitation with student choir repetition",
  },
];

const CURRENCIES: Record<
  string,
  { symbol: string; labelEn: string; labelUr: string; basePerClass: number }
> = {
  GBP: { symbol: "£", labelEn: "UK (GBP £)", labelUr: "برطانیہ — پاؤنڈ (£)", basePerClass: 3.25 },
  USD: { symbol: "$", labelEn: "USA (USD $)", labelUr: "امریکہ — ڈالر ($)", basePerClass: 4.5 },
  EUR: { symbol: "€", labelEn: "Europe (EUR €)", labelUr: "یورپ — یورو (€)", basePerClass: 4.1 },
  CAD: { symbol: "C$", labelEn: "Canada (CAD C$)", labelUr: "کینیڈا — کینیڈین ڈالر ($)", basePerClass: 6.2 },
  AUD: { symbol: "A$", labelEn: "Australia (AUD A$)", labelUr: "آسٹریلیا — ڈالر ($)", basePerClass: 7.0 },
  AED: { symbol: "AED ", labelEn: "UAE / Gulf (AED)", labelUr: "متحدہ عرب امارات — درہم", basePerClass: 16.5 },
  PKR: { symbol: "Rs ", labelEn: "Pakistan (PKR ₨)", labelUr: "پاکستان — روپیہ (Rs)", basePerClass: 540 },
};

export default function AcademySite({ locale }: { locale: Locale }) {
  const router = useRouter();
  const t = siteData[locale];
  const isUrdu = locale === "ur";

  // Mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Noorani Qaida State
  const [activeQaidaLessonId, setActiveQaidaLessonId] = useState(1);
  const [playingQaidaItem, setPlayingQaidaItem] = useState<string | null>(null);
  const [qaidaGainBoost, setQaidaGainBoost] = useState<number>(2.8);
  const [quranScript, setQuranScript] = useState<"indopak" | "uthmani">("indopak");
  const [playingTeacherIdx, setPlayingTeacherIdx] = useState<number | null>(null);
  const teacherAudioRef = useRef<HTMLAudioElement | null>(null);

  // Full Quran Player State
  const [selectedReciterId, setSelectedReciterId] = useState<QariReciterId>("husary_muallim");
  const [selectedSurahNumber, setSelectedSurahNumber] = useState<number>(1);
  const [surahSearchQuery, setSurahSearchQuery] = useState("");
  const [isPlayingQuran, setIsPlayingQuran] = useState(false);
  const [quranAudioDuration, setQuranAudioDuration] = useState(0);
  const [quranAudioCurrentTime, setQuranAudioCurrentTime] = useState(0);
  const [wordByWordMode, setWordByWordMode] = useState(false);
  const [showTranslations, setShowTranslations] = useState(true);
  const [activeAyahNum, setActiveAyahNum] = useState(1);

  const quranAudioRef = useRef<HTMLAudioElement | null>(null);

  // Courses Track Filter & Course Outline Modal
  const [courseFilter, setCourseFilter] = useState<"all" | "quran" | "islamic" | "advanced">("all");
  const [selectedCourseForOutline, setSelectedCourseForOutline] = useState<CourseDetail | null>(null);

  // Fee Calculator State
  const [calcCurrency, setCalcCurrency] = useState("GBP");
  const [calcDays, setCalcDays] = useState(3);
  const [calcDuration, setCalcDuration] = useState(30);
  const [calcStudents, setCalcStudents] = useState(1);

  // Verify ID Input
  const [verifyCode, setVerifyCode] = useState("");

  // Contact / Trial Form State
  const [formBusy, setFormBusy] = useState(false);
  const [formStatus, setFormStatus] = useState("");

  // ==========================================
  // ISLAMIC LIBRARY & TAFSIR STATE
  // ==========================================
  const [activeTafsirId, setActiveTafsirId] = useState<string>("ibnKathir");
  const [activeTranslationId, setActiveTranslationId] = useState<string>("jalandhri");
  const [activeAyahIndex, setActiveAyahIndex] = useState<number>(0);
  const [activeLibraryTab, setActiveLibraryTab] = useState<'tafsir' | 'hadith' | 'azkar'>('tafsir');
  const [isHaramainSideOpen, setIsHaramainSideOpen] = useState<boolean>(false);
  
  // Dawah Card Generator State
  const [dawahModalData, setDawahModalData] = useState<{
    title: string;
    arabic: string;
    translation: string;
    reference: string;
  } | null>(null);

  // Live Classroom & Lesson Viewroom State
  const [classroomRole, setClassroomRole] = useState<'teacher' | 'student'>('teacher');
  const [classroomPointer, setClassroomPointer] = useState<{ x: number; y: number } | null>({ x: 50, y: 40 });
  const [classroomLessonType, setClassroomLessonType] = useState<'qaida' | 'nazra' | 'hifz'>('nazra');
  const [diarySabaq, setDiarySabaq] = useState('سورۃ البقرہ: آیات ۱ تا ۱۰ (تجوید و روانی)');
  const [diarySabqi, setDiarySabqi] = useState('سورۃ الفاتحہ (مکمل باقاعدہ ترتیل)');
  const [diaryManzil, setDiaryManzil] = useState('پارہ نمبر ۱ (مکمل روانگی جائزہ)');
  const [diaryRemarks, setDiaryRemarks] = useState('ممتاز (A+) — مخارج و صفات کی ادائیگی شاندار رہی');
  const [activePlayingWord, setActivePlayingWord] = useState<string | null>(null);
  const [showAllTranslations, setShowAllTranslations] = useState<boolean>(false);

  // ==========================================
  // HADITH ENCYCLOPEDIA STATE
  // ==========================================
  const [hadithSearch, setHadithSearch] = useState<string>("");
  const [hadithBookFilter, setHadithBookFilter] = useState<string>("all");
  const [hadithTopicFilter, setHadithTopicFilter] = useState<string>("all");
  const [copiedHadithId, setCopiedHadithId] = useState<string | null>(null);

  // ==========================================
  // HARAMAIN LIVE & MASNOON AZKAR STATE
  // ==========================================
  const [activeHaramainTab, setActiveHaramainTab] = useState<string>("makkah-live");
  const [azkarCategoryFilter, setAzkarCategoryFilter] = useState<string>("all");
  const [azkarCounters, setAzkarCounters] = useState<Record<string, number>>({});

  // ==========================================
  // ULTRA-MODERN VISITOR ANALYTICS STATE
  // ==========================================
  const [liveOnlineVisitors, setLiveOnlineVisitors] = useState<number>(48);
  const [lifetimeVisitors, setLifetimeVisitors] = useState<number>(1482930);
  const [todayVisitors, setTodayVisitors] = useState<number>(3412);
  const [mySessionVisits, setMySessionVisits] = useState<number>(1);
  const [tickerIndex, setTickerIndex] = useState<number>(0);

  const recentLiveActivities = [
    isUrdu ? "طالب علم لندن، برطانیہ سے ناظرہ قرآن کلاس میں شامل ہوئے (ابھی ابھی)" : "Student from London, UK joined Nazra Quran Class (Just now)",
    isUrdu ? "قارئین ٹورنٹو، کینیڈا سے سورۃ الملک تفسیر کا مطالعہ کر رہے ہیں (2 منٹ قبل)" : "Reader from Toronto, Canada studying Surah Al-Mulk Tafsir (2 min ago)",
    isUrdu ? "لاہور، پاکستان سے نورانی قاعدہ تختی نمبر 4 مکمل کی گئی (5 منٹ قبل)" : "Student from Lahore completed Noorani Qaida Lesson 4 (5 min ago)",
    isUrdu ? "ہیوسٹن، امریکہ سے نیا ٹرائل کلاس فارم موصول ہوا (10 منٹ قبل)" : "New Trial Class Application received from Houston, USA (10 min ago)",
    isUrdu ? "سڈنی، آسٹریلیا سے حدیثِ نبوی ﷺ کا دعوتی کارڈ واٹس ایپ پر شیئر کیا گیا (15 منٹ قبل)" : "Hadith Dawah Card shared to WhatsApp from Sydney, Australia (15 min ago)",
  ];

  // Real Server-Connected Visitor Tracking & Heartbeat
  useEffect(() => {
    let isMounted = true;

    // Track user session visit in localStorage
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("farooqi_academy_visits");
        const count = stored ? parseInt(stored, 10) + 1 : 1;
        localStorage.setItem("farooqi_academy_visits", count.toString());
        setMySessionVisits(count);
      } catch (err) {}
    }

    // Ping the real Next.js visitor analytics API
    async function recordVisit() {
      try {
        const res = await fetch("/api/visitors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "visit",
            path: typeof window !== "undefined" ? window.location.pathname : "/",
            referrer: typeof document !== "undefined" ? document.referrer : "",
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.ok) {
            if (data.totalVisitors) setLifetimeVisitors(data.totalVisitors);
            if (data.todayVisitors) setTodayVisitors(data.todayVisitors);
            if (data.liveOnline) setLiveOnlineVisitors(data.liveOnline);
          }
        }
      } catch (err) {
        // Fallback gracefully
      }
    }

    recordVisit();

    // Heartbeat every 20 seconds to keep real active online status
    const heartbeatTimer = setInterval(async () => {
      try {
        const res = await fetch("/api/visitors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "heartbeat" }),
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.ok && data.liveOnline) {
            setLiveOnlineVisitors(data.liveOnline);
          }
        }
      } catch (err) {}

      setTickerIndex((prev) => (prev + 1) % 5);
    }, 20000);

    return () => {
      isMounted = false;
      clearInterval(heartbeatTimer);
    };
  }, []);

  function handleTasbeehTap(zikrId: string, targetCount: number) {
    setAzkarCounters((prev) => {
      const current = prev[zikrId] || 0;
      return { ...prev, [zikrId]: current + 1 };
    });
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        (navigator as any).vibrate(35);
      } catch (e) {}
    }
  }

  function handleResetTasbeeh(zikrId: string) {
    setAzkarCounters((prev) => ({ ...prev, [zikrId]: 0 }));
  }

  function handleCopyHadith(h: HadithRecord) {
    const textToCopy = `${h.bookNameUr} (${h.takhreej})\n\n${h.matnAr}\n\nترجمہ: ${h.translationUr}\n\nشرح: ${h.sharh}\n\nفاروقی آن لائن قرآن اکیڈمی: https://farooqi-online-quran-academy.vercel.app`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        setCopiedHadithId(h.id);
        setTimeout(() => setCopiedHadithId(null), 3000);
      });
    }
  }

  function handleOpenDawahCard(title: string, arabic: string, translation: string, reference: string) {
    setDawahModalData({ title, arabic, translation, reference });
  }

  function handlePlayWordAudio(surahNum: number, ayahNum: number, wordIdx: number, wordArabic: string) {
    setActivePlayingWord(`${surahNum}_${ayahNum}_${wordIdx}`);
    const pSurah = String(surahNum).padStart(3, "0");
    const pAyah = String(ayahNum).padStart(3, "0");
    const pWord = String(wordIdx + 1).padStart(3, "0");
    const audioUrl = `https://audio.qurancdn.com/wbw/${pSurah}_${pAyah}_${pWord}.mp3`;
    const audio = new Audio(audioUrl);
    audio.play().catch(() => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        const ut = new SpeechSynthesisUtterance(wordArabic);
        ut.lang = "ar-SA";
        window.speechSynthesis.speak(ut);
      }
    });
    setTimeout(() => setActivePlayingWord(null), 1200);
  }

  function handleSendParentDiaryWhatsApp() {
    const text = `*فاروقی آن لائن قرآن اکیڈمی — روزانہ تعلیمی ڈائری و کارکردگی رپورٹ*\n` +
      `📅 تاریخ: ${new Date().toLocaleDateString("en-GB")}\n` +
      `👤 طالب علم: محمد ریان (لندن، برطانیہ)\n` +
      `👨‍🏫 استاد: قاری محمد عمر فاروقی (لاہور، پاکستان)\n\n` +
      `📖 *آج کا نیا سبق (Sabaq):* ${diarySabaq}\n` +
      `🔄 *سبقی (دہرائی):* ${diarySabqi}\n` +
      `📚 *منزل (حفظ):* ${diaryManzil}\n` +
      `⭐ *استاد کے ریمارکس:* ${diaryRemarks}\n\n` +
      `📞 رابطہ اکیڈمی: 0333-6519527 / 0334-4323994\n` +
      `🌐 پورٹل: https://farooqi-online-quran-academy.vercel.app/portal`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  }

  function renderAndDownloadDawahCanvas() {
    if (!dawahModalData || typeof document === "undefined") return;
    const canvas = document.getElementById("dawahCardCanvas") as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background gradient: Deep emerald & gold accents
    ctx.fillStyle = "#062e24";
    ctx.fillRect(0, 0, 800, 800);

    // Ornate Gold Border
    ctx.strokeStyle = "#c6952f";
    ctx.lineWidth = 10;
    ctx.strokeRect(20, 20, 760, 760);

    ctx.strokeStyle = "#e9d9a9";
    ctx.lineWidth = 2;
    ctx.strokeRect(32, 32, 736, 736);

    // Header Title
    ctx.textAlign = "center";
    ctx.fillStyle = "#e9d9a9";
    ctx.font = "bold 24px sans-serif";
    ctx.fillText("فاروقی آن لائن قرآن اکیڈمی — لاہور، پاکستان", 400, 80);

    // Bismillah
    ctx.fillStyle = "#ffffff";
    ctx.font = "28px serif";
    ctx.fillText("بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", 400, 130);

    // Topic / Reference
    ctx.fillStyle = "#c6952f";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText(`✨ ${dawahModalData.title} ✨`, 400, 180);

    // Arabic Matn Box
    ctx.fillStyle = "#0a4738";
    ctx.fillRect(50, 210, 700, 230);
    ctx.strokeStyle = "#c6952f";
    ctx.lineWidth = 2;
    ctx.strokeRect(50, 210, 700, 230);

    ctx.fillStyle = "#ffffff";
    ctx.font = "32px 'Amiri', serif";
    const arabicWords = dawahModalData.arabic.split(" ");
    let line = "";
    let y = 280;
    for (let n = 0; n < arabicWords.length; n++) {
      const testLine = line + arabicWords[n] + " ";
      if (ctx.measureText(testLine).width > 650 && n > 0) {
        ctx.fillText(line, 400, y);
        line = arabicWords[n] + " ";
        y += 50;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 400, y);

    // Urdu Translation Box
    ctx.fillStyle = "#fefcf6";
    ctx.fillRect(50, 460, 700, 190);
    ctx.strokeRect(50, 460, 700, 190);

    ctx.fillStyle = "#171614";
    ctx.font = "22px sans-serif";
    const urduWords = dawahModalData.translation.split(" ");
    let uLine = "";
    let uY = 510;
    for (let i = 0; i < urduWords.length; i++) {
      const testU = uLine + urduWords[i] + " ";
      if (ctx.measureText(testU).width > 640 && i > 0) {
        ctx.fillText(uLine, 400, uY);
        uLine = urduWords[i] + " ";
        uY += 38;
      } else {
        uLine = testU;
      }
    }
    ctx.fillText(uLine, 400, uY);

    // Reference Pill
    ctx.fillStyle = "#062e24";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText(`تخریج و حوالہ: ${dawahModalData.reference}`, 400, 620);

    // Footer Ribbon
    ctx.fillStyle = "#c6952f";
    ctx.fillRect(32, 670, 736, 96);

    ctx.fillStyle = "#062e24";
    ctx.font = "bold 22px sans-serif";
    ctx.fillText("داخلہ اور مفت ۳ روزہ ٹرائل کے لیے رابطہ فرمائیں:", 400, 705);
    ctx.font = "bold 20px monospace";
    ctx.fillText("WhatsApp: +92 333 6519527 | 0334-4323994", 400, 740);

    // Trigger Download
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `Farooqi-Academy-Dawah-Card.png`;
    link.href = dataUrl;
    link.click();
  }

  function handleShareWhatsAppDawahImage() {
    renderAndDownloadDawahCanvas();
    if (!dawahModalData) return;
    const shareText = `*فرمانِ رسول اللہ ﷺ / کلام الٰہی*\n\n` +
      `${dawahModalData.arabic}\n\n` +
      `*ترجمہ:* ${dawahModalData.translation}\n\n` +
      `*حوالہ:* ${dawahModalData.reference}\n\n` +
      `*فاروقی آن لائن قرآن اکیڈمی (لاہور، پاکستان)*\n` +
      `📞 واٹس ایپ: 0333-6519527 / 0334-4323994\n` +
      `🌐 https://farooqi-online-quran-academy.vercel.app`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, "_blank");
  }
  
  function handleWhatsAppDawah(h: HadithRecord) {
    const textToShare = `*فرمانِ رسول اللہ ﷺ*\n\n${h.matnAr}\n\n*ترجمہ:* ${h.translationUr}\n\n*تخریج و حکم:* ${h.takhreej} [${h.grade}]\n\n*شرح و فائدہ:* ${h.sharh}\n\n*فاروقی آن لائن قرآن اکیڈمی*: https://farooqi-online-quran-academy.vercel.app`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(textToShare)}`;
    window.open(url, "_blank");
  }

  // Active Reciter & Surah Objects
  const activeReciter = RECITERS.find((r) => r.id === selectedReciterId) || RECITERS[0];
  const activeSurah = QURAN_SURAHS.find((s) => s.number === selectedSurahNumber) || QURAN_SURAHS[0];

  // Active Noorani Qaida Lesson
  const activeQaidaLesson =
    NOORANI_QAIDA_LESSONS.find((l) => l.id === activeQaidaLessonId) || NOORANI_QAIDA_LESSONS[0];

  // Fee Calculator calculation
  const currInfo = CURRENCIES[calcCurrency] || CURRENCIES.GBP;
  const classesPerMonth = calcDays * 4;
  const durMultiplier = calcDuration === 30 ? 1 : calcDuration === 45 ? 1.4 : 1.75;
  const rawPerStudent = currInfo.basePerClass * classesPerMonth * durMultiplier;
  const discountRate =
    calcStudents === 1 ? 0 : calcStudents === 2 ? 0.1 : calcStudents === 3 ? 0.15 : 0.2;
  const totalMonthlyFee = Math.round(rawPerStudent * calcStudents * (1 - discountRate));
  const monthlySavings = Math.round(rawPerStudent * calcStudents * discountRate);

  // Filtered Courses
  const filteredCourses = t.coursesDetailed.filter(
    (c) => courseFilter === "all" || c.track === courseFilter
  );

  // Filtered Surahs for Search
  const filteredSurahs = QURAN_SURAHS.filter((s) => {
    if (!surahSearchQuery) return true;
    const q = surahSearchQuery.toLowerCase().trim();
    return (
      s.number.toString().includes(q) ||
      s.nameAr.includes(q) ||
      s.nameUr.includes(q) ||
      s.nameEn.toLowerCase().includes(q)
    );
  });

  // Handle Quran Audio Playback
  useEffect(() => {
    return () => {
      if (quranAudioRef.current) {
        quranAudioRef.current.pause();
        quranAudioRef.current = null;
      }
    };
  }, []);

  function getSurahAudioUrl(reciter: QariReciter, surahNum: number): string {
    const padded = String(surahNum).padStart(3, "0");
    return `${reciter.serverUrl}/${padded}.mp3`;
  }

  function togglePlayQuran(surahNum?: number) {
    const targetSurahNum = surahNum !== undefined ? surahNum : selectedSurahNumber;
    if (surahNum !== undefined && surahNum !== selectedSurahNumber) {
      setSelectedSurahNumber(surahNum);
    }

    if (isPlayingQuran && surahNum === undefined) {
      if (quranAudioRef.current) {
        quranAudioRef.current.pause();
      }
      setIsPlayingQuran(false);
      return;
    }

    const audioUrl = getSurahAudioUrl(activeReciter, targetSurahNum);

    if (quranAudioRef.current) {
      quranAudioRef.current.pause();
    }

    const audio = new Audio(audioUrl);
    quranAudioRef.current = audio;

    audio.ontimeupdate = () => {
      setQuranAudioCurrentTime(audio.currentTime);
      setQuranAudioDuration(audio.duration || 0);
    };

    audio.onended = () => {
      if (targetSurahNum < 114) {
        togglePlayQuran(targetSurahNum + 1);
      } else {
        setIsPlayingQuran(false);
      }
    };

    audio.onerror = () => {
      setIsPlayingQuran(false);
    };

    audio.play().then(() => {
      setIsPlayingQuran(true);
    }).catch(() => {
      setIsPlayingQuran(false);
    });
  }

  function handleSeekQuran(e: React.ChangeEvent<HTMLInputElement>) {
    const seekTime = Number(e.target.value);
    if (quranAudioRef.current) {
      quranAudioRef.current.currentTime = seekTime;
      setQuranAudioCurrentTime(seekTime);
    }
  }

  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = qaidaGainBoost;
    }
  }, [qaidaGainBoost]);

  function getGainNode(): GainNode | null {
    if (typeof window === "undefined") return null;
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return null;
    if (!audioCtxRef.current) {
      const ctx = new AudioContextClass();
      const gain = ctx.createGain();
      gain.gain.value = qaidaGainBoost;
      gain.connect(ctx.destination);
      audioCtxRef.current = ctx;
      gainNodeRef.current = gain;
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = qaidaGainBoost;
    }
    return gainNodeRef.current;
  }

  const LETTER_FILE_IDS: Record<string, string> = {
    "ا": "1_alif", "ب": "2_baa", "ت": "3_taa", "ث": "4_thaa", "ج": "5_jeem", "ح": "6_haa", "خ": "7_khaa",
    "د": "8_daal", "ذ": "9_dhaal", "ر": "10_raa", "ز": "11_zaay", "س": "12_seen", "ش": "13_sheen", "ص": "14_saad",
    "ض": "15_daad", "ط": "16_taa", "ظ": "17_zaa", "ع": "18_ayn", "غ": "19_ghayn", "ف": "20_faa", "ق": "21_qaaf",
    "ك": "22_kaaf", "ل": "23_laam", "م": "24_meem", "ن": "25_noon", "و": "26_waaw", "هـ": "27_haa", "ء": "28_hamza",
    "ي": "29_yaa"
  };

  const ARABIC_LETTER_NAMES: Record<string, string> = {
    "ا": "أَلِف", "ب": "بَاء", "ت": "تَاء", "ث": "ثَاء", "ج": "جِيم", "ح": "حَاء", "خ": "خَاء",
    "د": "دَال", "ذ": "ذَال", "ر": "رَاء", "ز": "زَاي", "س": "سِين", "ش": "شِين", "ص": "صَاد",
    "ض": "ضَاد", "ط": "طَاء", "ظ": "ظَاء", "ع": "عَيْن", "غ": "غَيْن", "ف": "فَاء", "ق": "قَاف",
    "ك": "كَاف", "ل": "لَام", "م": "مِيم", "ن": "نُون", "و": "وَاو", "هـ": "هَاء", "ء": "هَمْزَة",
    "ي": "يَاء", "لا": "لَام أَلِف", "با": "بَاء أَلِف", "تا": "تَاء أَلِف", "ثا": "ثَاء أَلِف",
    "بل": "بَاء لَام", "تل": "تَاء لَام", "ثل": "ثَاء لَام", "نل": "نُون لَام", "يل": "يَاء لَام",
    "بـح": "بَاء حَاء", "تـخ": "تَاء خَاء", "نـج": "نُون جِيم"
  };

  function fallbackSpeak(letterArabic: string) {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const textToSpeak = ARABIC_LETTER_NAMES[letterArabic] || letterArabic;
      const utter = new SpeechSynthesisUtterance(textToSpeak);
      utter.lang = "ar-SA";
      utter.volume = 1.0;
      utter.rate = 0.72;
      utter.pitch = 1.05;
      utter.onend = () => setPlayingQaidaItem(null);
      utter.onerror = () => setPlayingQaidaItem(null);
      window.speechSynthesis.speak(utter);
    } else {
      setTimeout(() => setPlayingQaidaItem(null), 1200);
    }
  }

  function playQaidaSound(letterArabic: string, letterName: string) {
    setPlayingQaidaItem(letterArabic);

    const fileId = LETTER_FILE_IDS[letterArabic];
    const gain = getGainNode();

    if (fileId && audioCtxRef.current && gain) {
      const audioUrl = `https://raw.githubusercontent.com/adnan/Arabic-Alphabet/master/sounds/${fileId}.mp3`;
      const audio = new Audio(audioUrl);
      audio.crossOrigin = "anonymous";
      try {
        const source = audioCtxRef.current.createMediaElementSource(audio);
        source.connect(gain);
      } catch {
        // cross origin fallback
      }
      audio.play().then(() => {
        audio.onended = () => setPlayingQaidaItem(null);
        audio.onerror = () => fallbackSpeak(letterArabic);
      }).catch(() => {
        fallbackSpeak(letterArabic);
      });
    } else {
      fallbackSpeak(letterArabic);
    }
  }

  function playTeacherRecitationSample(idx: number) {
    if (teacherAudioRef.current) {
      teacherAudioRef.current.pause();
      teacherAudioRef.current = null;
    }
    if (playingTeacherIdx === idx) {
      setPlayingTeacherIdx(null);
      return;
    }

    setPlayingTeacherIdx(idx);
    const sampleUrls = [
      "https://everyayah.com/data/Alafasy_128kbps/001001.mp3",
      "https://everyayah.com/data/Husary_128kbps_Mujawwad/093001.mp3",
      "https://everyayah.com/data/Minshawy_Teacher_128kbps/078001.mp3",
      "https://everyayah.com/data/Alafasy_128kbps/112001.mp3",
      "https://everyayah.com/data/Husary_128kbps_Mujawwad/114001.mp3"
    ];

    const audio = new Audio(sampleUrls[idx % sampleUrls.length]);
    teacherAudioRef.current = audio;
    audio.volume = 1.0;
    audio.play().catch(() => {});
    audio.onended = () => {
      setPlayingTeacherIdx(null);
      teacherAudioRef.current = null;
    };
  }

  function formatTime(seconds: number): string {
    if (isNaN(seconds) || seconds <= 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }

  // Handle Verify Form
  function handleVerifySubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const clean = verifyCode.trim();
    if (!clean) return;
    router.push(`/verify/${encodeURIComponent(clean)}`);
  }

  // Handle Admissions Form Submission
  async function handleTrialSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormBusy(true);
    setFormStatus("");

    const form = new FormData(e.currentTarget);
    const payload: Record<string, unknown> = Object.fromEntries(form.entries());
    payload.locale = locale;

    let appId = "";
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const text = await res.text().catch(() => "");
      const data = text ? JSON.parse(text) : null;
      if (data?.id) appId = String(data.id);
    } catch {
      // Continue to WhatsApp
    }

    const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923336519527";
    const lines = [
      isUrdu
        ? "السلام علیکم! فاروقی آن لائن قرآن اکیڈمی مفت ٹرائل درخواست:"
        : "Assalamu Alaikum! Farooqi Online Quran Academy Free Trial Request:",
      appId ? `Application ID: ${appId}` : "",
      `Student Name: ${payload.name || ""}`,
      `WhatsApp: ${payload.phone || ""}`,
      `Country/City: ${payload.country || ""}`,
      `Preferred Course: ${payload.course || ""}`,
      `Preferred Time: ${payload.timeSlot || ""}`,
      payload.message ? `Notes: ${payload.message}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    setFormStatus(
      isUrdu
        ? "الحمدللہ! آپ کی درخواست جمع ہو گئی ہے۔ واٹس ایپ کھولی جا رہی ہے۔"
        : "Alhamdulillah! Your request has been saved. Opening WhatsApp confirmation."
    );
    setFormBusy(false);

    window.open(
      `https://wa.me/${waNumber}?text=${encodeURIComponent(lines)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <div dir={t.dir} lang={locale} className={isUrdu ? "urdu" : "english"}>
      {/* Accessibility Skip Link */}
      <a className="skip-link" href="#main-content">
        {isUrdu ? "اصل مواد پر جائیں" : "Skip to main content"}
      </a>

      {/* TOP ANNOUNCEMENT BAR */}
      <div className="topbar">
        <div className="wrap topbar-inner">
          <span className="topbar-tagline">
            <i className="topbar-dot" aria-hidden="true" />
            {isUrdu
              ? "لاہور، پاکستان · دنیا بھر کے لیے مستند و معیاری آن لائن قرآن کلاسز"
              : "Lahore, Pakistan · Worldwide Certified 1-to-1 Online Quran Classes"}
          </span>
          <div className="topbar-contacts">
            <a href="tel:+923336519527" className="ltr-num">☎ 0333-6519527</a>
            <a href="tel:+923344323994" className="ltr-num">☎ 0334-4323994</a>
            <a href="mailto:umarwazir1989@gmail.com">✉ umarwazir1989@gmail.com</a>
          </div>
        </div>
      </div>

      {/* CLEAN, UNCLUTTERED LUXURY HEADER */}
      <header>
        <div className="wrap nav">
          <Link href={`/${locale}`} className="brand">
            <div className="brand-logo-frame">
              <Image
                src="/logo.jpg"
                alt="Farooqi Online Quran Academy"
                width={50}
                height={50}
                priority
              />
            </div>
            <span>
              <strong>{isUrdu ? "فاروقی آن لائن قرآن اکیڈمی" : "Farooqi Online Quran Academy"}</strong>
              <small>{isUrdu ? "لاہور · پاکستان" : "Lahore · Pakistan"}</small>
            </span>
          </Link>

          {/* STREAMLINED NAVIGATION LINKS (NO CLUTTER) */}
          <nav
            className={mobileMenuOpen ? "nav-links open" : "nav-links"}
            aria-label="Main Navigation"
          >
            <a href={`/${locale}`} onClick={() => setMobileMenuOpen(false)}>
              {isUrdu ? "ہوم" : "Home"}
            </a>
            <a href="#courses-section" onClick={() => setMobileMenuOpen(false)}>
              {isUrdu ? "کورسز و نصاب" : "Courses & Outlines"}
            </a>
            <a href="#qaida-section" onClick={() => setMobileMenuOpen(false)}>
              {isUrdu ? "نورانی قاعدہ" : "Noorani Qaida"}
            </a>
            <a href="#quran-player-section" onClick={() => setMobileMenuOpen(false)}>
              {isUrdu ? "تلاوتِ قرآن" : "Quran Player"}
            </a>
            <a href="#islamic-hub-section" onClick={() => setMobileMenuOpen(false)}>
              {isUrdu ? "جامع مکتبہ و تفاسیر" : "Islamic Hub"}
            </a>
            <a href="#classroom-section" onClick={() => setMobileMenuOpen(false)}>
              {isUrdu ? "لائیو کلاس روم" : "Live Classroom"}
            </a>
            <a href="#teachers-section" onClick={() => setMobileMenuOpen(false)}>
              {isUrdu ? "اساتذہ" : "Teachers"}
            </a>
            <a href="#pricing-section" onClick={() => setMobileMenuOpen(false)}>
              {isUrdu ? "فیس کیلکولیٹر" : "Tuition & Fees"}
            </a>
            <Link
              className="portal-mobile"
              href="/portal"
              onClick={() => setMobileMenuOpen(false)}
            >
              {isUrdu ? "پورٹل لاگ اِن" : "Portal Login"}
            </Link>
            <Link
              className="language-mobile"
              href={t.otherPath}
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.other}
            </Link>
          </nav>

          {/* ACTION BUTTONS (CLEAN & MINIMAL) */}
          <div className="nav-actions">
            <Link className="portal-link" href="/portal">
              {isUrdu ? "پورٹل لاگ اِن" : "Portal Login"}
            </Link>
            <Link className="language" href={t.otherPath}>
              {t.other}
            </Link>
            <a className="btn btn-gold btn-small" href="#admissions-section">
              {isUrdu ? "مفت ٹرائل کلاس" : "Book Free Trial"}
            </a>
            <button
              className="menu"
              type="button"
              aria-label="Toggle Menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {/* MAIN BODY CONTENT */}
      <main id="main-content">
        {/* ========================================================
            HERO SECTION (SPACIOUS, UNCLUTTERED & ELEGANT)
            ======================================================== */}
        <section className="hero">
          <div className="wrap hero-grid">
            <div>
              <span className="eyebrow">
                <span className="eyebrow-star">✦</span>
                {isUrdu
                  ? "عالمی سطح پر آن لائن قرآن و تجوید کی معیاری تعلیم"
                  : "Premier Online Quran & Tajweed Academy for Worldwide Learners"}
              </span>

              <h1>
                {isUrdu ? "قرآنِ مجید سیکھیے" : "Learn the Holy Quran"}
                <em>{isUrdu ? "تجوید، محبت اور روانی کے ساتھ" : "with Tajweed, Care & Confidence"}</em>
              </h1>

              <p className="lead">
                {isUrdu
                  ? "بچوں، خواتین اور بڑوں کے لیے مستند و سند یافتہ اساتذہ اور معلمات کے ساتھ انفرادی (1-to-1) آن لائن کلاسز۔ آپ کے پسندیدہ وقت، سمارٹ پورٹل ٹریکنگ اور مکمل محفوظ ماحول میں۔"
                  : "Private one-to-one online Quran classes for children, women and adults with certified male scholars and female tutors. Safe environment, smart Parent Portal and flexible scheduling across your local timezone."}
              </p>

              <div className="hero-actions">
                <a className="btn btn-gold" href="#admissions-section">
                  {isUrdu ? "مفت ٹرائل کلاس بک کریں" : "Book a Free Trial Class"}
                </a>
                <a
                  className="btn btn-outline"
                  href="https://wa.me/923336519527?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%DB%8C%DA%A9%D9%85!%20%D9%81%D8%A7%D8%B1%D9%88%D9%82%DB%8C%20%D8%A2%D9%86%20%D9%84%D8%A7%D8%A6%D9%86%20%D9%82%D8%B1%D8%A2%D9%86%20%D8%A7%DA%A9%DB%8C%DA%88%D9%85%DB%8C%20%D9%85%DB%8C%DA%BA%20%D8%AF%D8%A7%D8%AE%D9%84%DB%92%20%DA%A9%DB%92%20%D8%A8%D8%A7%D8%B1%DB%92%20%D9%85%DB%8C%DA%BA%20%D9%85%D8%B9%D9%84%D9%88%D9%85%D8%A7%D8%AA%20%DA%86%D8%A7%DB%81%DB%8C%DB%92%DB%94"
                  target="_blank"
                  rel="noreferrer"
                >
                  {isUrdu ? "واٹس ایپ رابطہ: 0333-6519527" : "WhatsApp: +92 333-6519527"}
                </a>
              </div>

              {/* CLEAN METRICS (SPACIOUS & LEGIBLE) */}
              <div className="stats">
                <div className="stat-box">
                  <strong>50+</strong>
                  <span>{isUrdu ? "زیرِ تعلیم طلبہ" : "Active Students"}</span>
                </div>
                <div className="stat-box">
                  <strong>5</strong>
                  <span>{isUrdu ? "مستند اساتذہ و معلمات" : "Certified Scholars"}</span>
                </div>
                <div className="stat-box">
                  <strong>1-to-1</strong>
                  <span>{isUrdu ? "انفرادی لائیو کلاسز" : "Private Sessions"}</span>
                </div>
                <div className="stat-box">
                  <strong>100%</strong>
                  <span>{isUrdu ? "والدین پورٹل و رپورٹس" : "Portal Tracking"}</span>
                </div>
              </div>
            </div>

            {/* HERO RIGHT: ELEGANT FLOATING SHOWCASE CARD */}
            <div>
              <div className="hero-card">
                <div className="hero-card-topbar">
                  <span className="hero-surah-pill">
                    {isUrdu ? "سورۃ المزمل: آیت ۴" : "Surah Al-Muzzammil: 4"}
                  </span>
                  <span className="hero-live-pill">
                    <i className="live-dot" />
                    {isUrdu ? "انفرادی آن لائن کلاس" : "1-to-1 Live Class"}
                  </span>
                </div>

                <div className="hero-verse-frame">
                  <div className="hero-card-badge">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
                  <div className="arabic">وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا</div>
                  <p className="hero-verse-translation">
                    {isUrdu
                      ? "”اور قرآنِ مجید کو خوب ٹھہر ٹھہر کر (واضح تجوید کے ساتھ) پڑھیے۔“"
                      : "“And recite the Holy Quran with measured, clear recitation.”"}
                  </p>

                  <button
                    type="button"
                    className="hero-audio-btn"
                    onClick={() => togglePlayQuran(1)}
                  >
                    {isPlayingQuran && selectedSurahNumber === 1
                      ? isUrdu
                        ? "⏸ تلاوت روکیں"
                        : "⏸ Pause Recitation"
                      : isUrdu
                      ? "🔊 تلاوت سنیں (شیخ محمود خلیل الحصری - تدریسی انداز)"
                      : "🔊 Listen to Recitation (Sheikh Al-Husary - Teaching Mode)"}
                  </button>
                </div>

                <div className="mini-list">
                  <span className="mini-list-item">
                    <i className="mini-check">✓</i>
                    {isUrdu ? "مرد و خواتین کے لیے الگ اساتذہ" : "Male & Female Certified Tutors"}
                  </span>
                  <span className="mini-list-item">
                    <i className="mini-check">✓</i>
                    {isUrdu ? "بچوں کے لیے خصوصی توجہ و صبر" : "Patient Care for Kids & Sisters"}
                  </span>
                  <span className="mini-list-item">
                    <i className="mini-check">✓</i>
                    {isUrdu ? "مفت جائزہ اور ٹرائل کلاس" : "Free Assessment & Trial Class"}
                  </span>
                  <span className="mini-list-item">
                    <i className="mini-check">✓</i>
                    {isUrdu ? "ماہانہ پی ڈی ایف تعلیمی رپورٹ" : "Monthly Progress PDF Reports"}
                  </span>
                </div>

                <div className="hero-card-links">
                  <a href="#qaida-section">
                    {isUrdu ? "← نورانی قاعدہ مع آڈیو کا مشاہدہ کریں" : "Explore Noorani Qaida with Audio →"}
                  </a>
                  <a href="#teachers-section">
                    {isUrdu ? "← اساتذہ کی اسناد دیکھیں" : "View Teacher Credentials →"}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            COMPLETE NOORANI QAIDA WITH AUDIO MODULE
            ======================================================== */}
        <section id="qaida-section" className="soft">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">
                <span className="eyebrow-star">✦</span>
                {isUrdu ? "مکمل نورانی قاعدہ مع آڈیو و مخارج" : "Complete Noorani Qaida with Audio"}
              </span>
              <h2>
                {isUrdu
                  ? "نورانی قاعدہ کی تختیاں، تلفظ اور صوتی رہنمائی"
                  : "Interactive Noorani Qaida Lessons with Audio Pronunciation"}
              </h2>
              <p>
                {isUrdu
                  ? "کسی بھی حرف یا لفظ پر کلک کریں تاکہ اس کا درست تلفظ اور مخرج سن سکیں۔ بچے اور ابتدائی طلبہ یہاں سے براہِ راست مشق کر سکتے ہیں:"
                  : "Click any Arabic letter or word box below to listen to its authentic pronunciation and articulation rules. Designed for interactive learning:"}
              </p>
            </div>

            <div className="qaida-studio">
              {/* QAIDA LESSONS TABS */}
              <div className="qaida-lessons-nav" role="tablist">
                {NOORANI_QAIDA_LESSONS.map((lesson) => (
                  <button
                    key={lesson.id}
                    type="button"
                    className={`qaida-lesson-tab ${
                      activeQaidaLessonId === lesson.id ? "active" : ""
                    }`}
                    onClick={() => setActiveQaidaLessonId(lesson.id)}
                  >
                    {isUrdu ? lesson.titleUr : lesson.titleEn}
                  </button>
                ))}
              </div>

              {/* ACTIVE LESSON HEADER */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "12px",
                  borderBottom: "1px solid var(--line)",
                  paddingBottom: "14px",
                  marginBottom: "16px",
                }}
              >
                <div>
                  <h3 style={{ margin: "0 0 4px", color: "var(--deep)", fontSize: "1.35rem" }}>
                    {isUrdu ? activeQaidaLesson.titleUr : activeQaidaLesson.titleEn}
                  </h3>
                  <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.88rem" }}>
                    {isUrdu ? activeQaidaLesson.descUr : activeQaidaLesson.descEn}
                  </p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-end" }}>
                  <div style={{ color: "var(--green)", fontSize: "0.84rem", fontWeight: 700 }}>
                    {isUrdu ? "🔊 آواز سننے کے لیے کسی بھی خانے پر کلک کریں" : "🔊 Click any letter/word to play audio"}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--muted)" }}>
                      {isUrdu ? "والیوم بوسٹ:" : "Volume Boost:"}
                    </span>
                    {[1.0, 1.5, 2.0, 2.8].map((val) => (
                      <button
                        key={val}
                        type="button"
                        style={{
                          padding: "3px 8px",
                          borderRadius: "6px",
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          border: qaidaGainBoost === val ? "1px solid var(--gold)" : "1px solid var(--line)",
                          background: qaidaGainBoost === val ? "var(--gold)" : "#fff",
                          color: qaidaGainBoost === val ? "#1b1a17" : "var(--muted)",
                          cursor: "pointer",
                        }}
                        onClick={() => setQaidaGainBoost(val)}
                      >
                        {Math.round(val * 100)}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* LETTERS / WORDS INTERACTIVE TILES */}
              <div className="qaida-grid">
                {activeQaidaLesson.letters.map((item, idx) => (
                  <div
                    key={idx}
                    className={`qaida-tile ${playingQaidaItem === item.ar ? "playing" : ""}`}
                    onClick={() => playQaidaSound(item.ar, item.name)}
                    title={item.note}
                  >
                    <div className="qaida-letter">{item.ar}</div>
                    <small>{item.name}</small>
                  </div>
                ))}
              </div>

              {/* LESSON HINT & TRIAL TRIGGER */}
              <div className="qaida-hint-box">
                <div>
                  <strong>{isUrdu ? "استاد کے ساتھ باقاعدہ مشق:" : "Live Teacher Guidance:"}</strong>{" "}
                  <span>
                    {isUrdu
                      ? "ہماری لائیو انفرادی کلاسز میں استاد اسکرین شیئرنگ پر طالب علم کے تلفظ اور سانس کی درستگی کی نگرانی کرتے ہیں۔"
                      : "In our live one-to-one classes, tutors guide every student patiently through mouth positioning and breathing."}
                  </span>
                </div>
                <a className="btn btn-small btn-gold" href="#admissions-section">
                  {isUrdu ? "نورانی قاعدہ کی کلاس لیں" : "Start Noorani Qaida Class"}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            FULL QURAN RECITATION PLAYER WITH TEACHER/MUALLIM MODE
            ======================================================== */}
        <section id="quran-player-section">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">
                <span className="eyebrow-star">✦</span>
                {isUrdu ? "مکمل 114 سورتیں اور تدریسی انداز" : "Complete 114 Surahs & Educational Mode"}
              </span>
              <h2>
                {isUrdu
                  ? "مکمل قرآنِ مجید کی تلاوت (معلم اور تدریس کے انداز میں)"
                  : "Complete Holy Quran Audio with Teaching & Repetition Mode"}
              </h2>
              <p>
                {isUrdu
                  ? "عالمی شہرت یافتہ قراء کی آوازوں میں قرآن مجید کی تمام 114 سورتیں سنیں۔ شیخ محمود خلیل الحصری کا معلم و تدریسی انداز خاص طور پر طلبہ کے حفظ اور دہرائی کے لیے بہترین ہے:"
                  : "Stream all 114 Surahs by world-renowned reciters. Sheikh Al-Husary's Muallim style is specifically formatted for students to listen, pause, and repeat:"}
              </p>
            </div>

            <div className="quran-player-wrapper">
              {/* RECITER SELECTION PILLS */}
              <div style={{ marginBottom: "22px" }}>
                <span
                  style={{
                    display: "block",
                    fontSize: "0.82rem",
                    color: "var(--gold-light)",
                    fontWeight: 700,
                    marginBottom: "10px",
                  }}
                >
                  {isUrdu ? "قاری کا انتخاب کریں:" : "Select Reciter:"}
                </span>
                {/* SCRIPT TOGGLE (INDO-PAK VS UTHMANI) */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.82rem", color: "var(--gold-light)", fontWeight: 700 }}>
                    {isUrdu ? "رسم الخط (Script):" : "Quranic Script:"}
                  </span>
                  <button
                    type="button"
                    style={{
                      padding: "4px 12px",
                      borderRadius: "8px",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      background: quranScript === "indopak" ? "var(--green)" : "rgba(255,255,255,0.1)",
                      color: "#fff",
                      border: "1px solid var(--gold)",
                      cursor: "pointer",
                    }}
                    onClick={() => setQuranScript("indopak")}
                  >
                    {isUrdu ? "📜 پاک و ہند (16 سطری نستعلیق)" : "Indo-Pak Nastaliq"}
                  </button>
                  <button
                    type="button"
                    style={{
                      padding: "4px 12px",
                      borderRadius: "8px",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      background: quranScript === "uthmani" ? "var(--green)" : "rgba(255,255,255,0.1)",
                      color: "#fff",
                      border: "1px solid var(--gold)",
                      cursor: "pointer",
                    }}
                    onClick={() => setQuranScript("uthmani")}
                  >
                    {isUrdu ? "📖 عثمانی مصحف (حفص)" : "Uthmani Madani"}
                  </button>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {RECITERS.map((reciter) => (
                    <button
                      key={reciter.id}
                      type="button"
                      className={`qari-pill ${selectedReciterId === reciter.id ? "active" : ""}`}
                      onClick={() => {
                        setSelectedReciterId(reciter.id);
                        if (isPlayingQuran) {
                          togglePlayQuran(selectedSurahNumber);
                        }
                      }}
                    >
                      {reciter.isTeacherMode && "🎓 "}
                      {isUrdu ? reciter.nameUr : reciter.nameEn}
                    </button>
                  ))}
                </div>
                <small style={{ display: "block", color: "rgba(255,255,255,0.7)", marginTop: "8px", fontSize: "0.78rem" }}>
                  ℹ️ {isUrdu ? activeReciter.descUr : activeReciter.descEn}
                </small>
              </div>

              {/* CURRENT PLAYING BAR */}
              <div className="quran-controls-bar">
                <div className="quran-now-playing">
                  <div className="quran-surah-icon">{activeSurah.number}</div>
                  <div>
                    <strong>
                      {activeSurah.number}. {activeSurah.nameAr} — {activeSurah.nameEn}
                    </strong>
                    <span>
                      {isUrdu ? activeSurah.nameUr : activeSurah.nameEn} · {activeSurah.ayahs}{" "}
                      {isUrdu ? "آیات" : "Verses"} · {activeSurah.type}
                    </span>
                  </div>
                </div>

                <div className="quran-player-actions">
                  <button
                    type="button"
                    className="quran-btn-nav"
                    title={isUrdu ? "پچھلی سورت" : "Previous Surah"}
                    onClick={() => {
                      if (selectedSurahNumber > 1) {
                        togglePlayQuran(selectedSurahNumber - 1);
                      }
                    }}
                    disabled={selectedSurahNumber <= 1}
                  >
                    ⏮
                  </button>
                  <button
                    type="button"
                    className="quran-btn-play"
                    onClick={() => togglePlayQuran()}
                    title={isPlayingQuran ? "Pause" : "Play"}
                  >
                    {isPlayingQuran ? "⏸" : "▶"}
                  </button>
                  <button
                    type="button"
                    className="quran-btn-nav"
                    title={isUrdu ? "اگلی سورت" : "Next Surah"}
                    onClick={() => {
                      if (selectedSurahNumber < 114) {
                        togglePlayQuran(selectedSurahNumber + 1);
                      }
                    }}
                    disabled={selectedSurahNumber >= 114}
                  >
                    ⏭
                  </button>
                </div>
              </div>

              {/* AUDIO TIMELINE SCRUBBER */}
              {isPlayingQuran && (
                <div style={{ marginBottom: "20px" }}>
                  <input
                    type="range"
                    min={0}
                    max={quranAudioDuration || 100}
                    value={quranAudioCurrentTime}
                    onChange={handleSeekQuran}
                    style={{ width: "100%", accentColor: "var(--gold)" }}
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.76rem",
                      color: "rgba(255,255,255,0.7)",
                      marginTop: "4px",
                    }}
                  >
                    <span>{formatTime(quranAudioCurrentTime)}</span>
                    <span>{formatTime(quranAudioDuration)}</span>
                  </div>
                </div>
              )}

              {/* INTERACTIVE MUSHAF READER (SYNCHRONIZED WITH AUDIO) */}
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "20px",
                  padding: "24px",
                  marginTop: "24px",
                  marginBottom: "24px",
                  border: "2px solid rgba(198, 149, 47, 0.4)",
                  boxShadow: "0 10px 25px rgba(6, 46, 36, 0.08)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "12px",
                    borderBottom: "1px solid #f0e6d2",
                    paddingBottom: "16px",
                    marginBottom: "18px",
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        color: "#c6952f",
                        letterSpacing: "0.5px",
                        display: "block",
                      }}
                    >
                      {isUrdu ? "📖 مصحف شریف اور تلاوتِ کلامِ پاک" : "📖 Live Holy Quran Mushaf"}
                    </span>
                    <h3
                      style={{
                        margin: "4px 0 0 0",
                        color: "#062e24",
                        fontSize: "1.35rem",
                      }}
                    >
                      {activeSurah.number}. {activeSurah.nameAr} — {isUrdu ? activeSurah.nameUr : activeSurah.nameEn}
                    </h3>
                    <small style={{ color: "#666" }}>
                      {activeSurah.type} · {activeSurah.ayahs} {isUrdu ? "آیات" : "Verses"} · {isUrdu ? "تلاوت سنتے جائیں اور ساتھ ساتھ مصحف میں دیکھتے جائیں" : "Listen & Read along simultaneously"}
                    </small>
                  </div>

                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <button
                      type="button"
                      style={{
                        padding: "6px 14px",
                        borderRadius: "999px",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        background: wordByWordMode ? "#0b4f3f" : "#ffffff",
                        color: wordByWordMode ? "#e9d9a9" : "#0b4f3f",
                        border: "1px solid #0b4f3f",
                        cursor: "pointer",
                      }}
                      onClick={() => setWordByWordMode(!wordByWordMode)}
                    >
                      {wordByWordMode
                        ? (isUrdu ? "✓ لفظ بہ لفظ فعال" : "✓ Word-by-Word Active")
                        : (isUrdu ? "لفظ بہ لفظ موڈ چلائیں" : "Enable Word-by-Word")}
                    </button>

                    <button
                      type="button"
                      style={{
                        padding: "6px 14px",
                        borderRadius: "999px",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        background: showTranslations ? "#f1ead9" : "#ffffff",
                        color: "#0b4f3f",
                        border: "1px solid #c6952f",
                        cursor: "pointer",
                      }}
                      onClick={() => setShowTranslations(!showTranslations)}
                    >
                      {showTranslations
                        ? (isUrdu ? "ترجمہ چھپائیں" : "Hide Translation")
                        : (isUrdu ? "ترجمہ دکھائیں" : "Show Translation")}
                    </button>
                  </div>
                </div>

                {selectedSurahNumber !== 9 && (
                  <div
                    style={{
                      textAlign: "center",
                      margin: "14px 0 20px 0",
                      fontSize: "1.55rem",
                      color: "#062e24",
                      direction: "rtl",
                    }}
                  >
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </div>
                )}

                <div
                  style={{
                    maxHeight: "480px",
                    overflowY: "auto",
                    paddingRight: "6px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                  }}
                >
                  {QURAN_FULL_DATA[String(selectedSurahNumber)]?.verses?.map((verse: any) => (
                    <div
                      key={verse.num}
                      style={{
                        background: activeAyahNum === verse.num ? "#faf6ec" : "#ffffff",
                        border: activeAyahNum === verse.num ? "2px solid #c6952f" : "1px solid #e5e7eb",
                        borderRadius: "14px",
                        padding: "14px 18px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "8px",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "28px",
                            height: "28px",
                            borderRadius: "50%",
                            background: "#0b4f3f",
                            color: "#e9d9a9",
                            fontWeight: 800,
                            fontSize: "0.75rem",
                          }}
                        >
                          {verse.num}
                        </span>
                        <button
                          type="button"
                          style={{
                            background: "none",
                            border: "none",
                            color: "#0b4f3f",
                            fontWeight: 700,
                            fontSize: "0.78rem",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setActiveAyahNum(verse.num);
                            const pSurah = String(selectedSurahNumber).padStart(3, "0");
                            const pAyah = String(verse.num).padStart(3, "0");
                            const vAudio = new Audio(`https://cdn.islamic.network/quran/audio/128/ar.alafasy/${selectedSurahNumber === 1 ? verse.num : (verse.num + 7)}.mp3`);
                            vAudio.play().catch(() => {});
                          }}
                        >
                          ▶ {isUrdu ? "یہ آیت سنیں" : "Listen Ayah"}
                        </button>
                      </div>

                      {wordByWordMode ? (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", direction: "rtl", marginBottom: "10px" }}>
                          {verse.words?.map((w: any, wIdx: number) => (
                            <div
                              key={wIdx}
                              style={{
                                background: "#fbf9f4",
                                border: "1px solid #e5dcbe",
                                borderRadius: "8px",
                                padding: "6px 8px",
                                textAlign: "center",
                                minWidth: "55px",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                const pSurah = String(selectedSurahNumber).padStart(3, "0");
                                const pAyah = String(verse.num).padStart(3, "0");
                                const pWord = String(wIdx + 1).padStart(3, "0");
                                handlePlayWordAudio(selectedSurahNumber, verse.num, wIdx, w.ar);
                              }}
                            >
                              <div style={{ fontSize: "1.25rem", color: "#062e24", fontWeight: 700 }}>
                                {w.ar}
                              </div>
                              <div style={{ fontSize: "0.7rem", color: "#8a6d2b", fontWeight: 600 }}>
                                {w.trans}
                              </div>
                              <div style={{ fontSize: "0.74rem", color: "#0b4f3f", fontWeight: 700, marginTop: "2px" }}>
                                {isUrdu ? w.ur : w.en}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p
                          style={{
                            fontSize: "1.4rem",
                            color: "#062e24",
                            lineHeight: "2.1",
                            direction: "rtl",
                            textAlign: "right",
                            margin: "0 0 8px 0",
                          }}
                        >
                          {verse.ar}
                        </p>
                      )}

                      {showTranslations && (
                        <div style={{ borderTop: "1px dashed #e5e7eb", paddingTop: "6px", marginTop: "6px", fontSize: "0.85rem" }}>
                          <p style={{ margin: "0 0 2px 0", color: "#0b4f3f", fontWeight: 600 }}>
                            {isUrdu ? "اردو: " + verse.ur : "English: " + verse.en}
                          </p>
                          {isUrdu && (
                            <p style={{ margin: 0, fontSize: "0.78rem", color: "#6b7280" }}>
                              English: {verse.en}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )) || (
                    <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
                      <p>{isUrdu ? "اس سورت کی مکمل صوتی تلاوت اوپر پلے بٹن سے سنیں!" : "Listen to full recitation audio using the controls above!"}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* SURAH SEARCH & 114 SURAHS DIRECTORY */}
              <div>
                <input
                  type="text"
                  placeholder={
                    isUrdu
                      ? "سورت تلاش کریں (نمبر، نام یا انگریزی، مثلاً 36 یا یس یا Yasin)..."
                      : "Search Surah by number, Arabic or English name (e.g. 36, Ya-Sin, Mulk)..."
                  }
                  value={surahSearchQuery}
                  onChange={(e) => setSurahSearchQuery(e.target.value)}
                  className="quran-surah-search"
                />

                <div className="quran-surahs-grid">
                  {filteredSurahs.map((surah) => (
                    <div
                      key={surah.number}
                      className={`quran-surah-item ${
                        selectedSurahNumber === surah.number ? "active" : ""
                      }`}
                      onClick={() => togglePlayQuran(surah.number)}
                    >
                      <span className="quran-surah-num">{surah.number}</span>
                      <div className="quran-surah-names">
                        <strong>{surah.nameAr}</strong>
                        <small>{surah.nameEn}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            QURAN TAFSEER STUDIO WITH COMPARATIVE TRANSLATIONS
            ======================================================== */}
        
        {/* ========================================================
            UNIFIED MASTER ISLAMIC KNOWLEDGE HUB & DIGITAL STUDIO
            ======================================================== */}
        <section id="islamic-hub-section" className="sec-islamic-hub">
          <div className="wrap">
            <div className="section-head" style={{ textAlign: "center" }}>
              <span className="eyebrow">
                <span className="eyebrow-star">✦</span>
                {isUrdu ? "جامع قرآنی و اسلامی مکتبہ" : "Unified Islamic Digital Library"}
              </span>
              <h2>
                {isUrdu ? (
                  <>قرآنی تفاسیر، <span>احادیثِ نبویہ اور مسنون اذکار</span></>
                ) : (
                  <>Quran Exegesis, <span>Hadith Encyclopedia & Daily Azkar</span></>
                )}
              </h2>
              <p style={{ maxWidth: "700px", margin: "0 auto" }}>
                {isUrdu
                  ? "ایک ہی خوبصورت اور پرسکون انٹرفیس میں 5 مستند تفاسیر، تقابلی تراجم، صحاح ستہ کی احادیث اور مسنون اذکار کا مطالعہ فرمائیں۔"
                  : "Explore authentic commentaries from renowned scholars, comparative translations, verified hadiths, and daily supplications in one unified hub."}
              </p>
            </div>

            {/* MASTER HUB SELECTOR TABS */}
            <div className="master-hub-nav">
              <button
                type="button"
                className={activeLibraryTab === "tafsir" ? "master-hub-tab-btn active" : "master-hub-tab-btn"}
                onClick={() => setActiveLibraryTab("tafsir")}
              >
                📖 {isUrdu ? "قرآن تفاسیر و تقابلی تراجم" : "Quran Tafsir & Translations"}
              </button>
              <button
                type="button"
                className={activeLibraryTab === "hadith" ? "master-hub-tab-btn active" : "master-hub-tab-btn"}
                onClick={() => setActiveLibraryTab("hadith")}
              >
                📜 {isUrdu ? "احادیثِ نبویہ مع شرح و تخریج" : "Hadith Encyclopedia"}
              </button>
              <button
                type="button"
                className={activeLibraryTab === "azkar" ? "master-hub-tab-btn active" : "master-hub-tab-btn"}
                onClick={() => setActiveLibraryTab("azkar")}
              >
                📿 {isUrdu ? "مسنون اذکار و ڈیجیٹل تسبیح" : "Daily Azkar & Tasbeeh"}
              </button>
              <button
                type="button"
                className="master-hub-tab-btn"
                style={{ background: isHaramainSideOpen ? "var(--deep)" : "#fdfbf7", color: isHaramainSideOpen ? "#ffffff" : "var(--gold)", borderColor: "var(--gold)" }}
                onClick={() => setIsHaramainSideOpen(!isHaramainSideOpen)}
              >
                🕋 {isUrdu ? "حرمین 24/7 لائیو (سائیڈ ڈاک)" : "Haramain Live 24/7 (Side Dock)"}
              </button>
            </div>

            {/* TAB 1: TAFSIR & TRANSLATIONS */}
            {activeLibraryTab === "tafsir" && (
              <div>
                {/* TAFSIR SELECTOR TABS */}
                <div className="tafsir-selector-tabs">
                  {TAFASEER_CATALOG.map((tafsir) => (
                    <button
                      key={tafsir.id}
                      type="button"
                      className={activeTafsirId === tafsir.id ? "tafsir-tab-btn active" : "tafsir-tab-btn"}
                      onClick={() => setActiveTafsirId(tafsir.id)}
                    >
                      {isUrdu ? tafsir.nameUr : tafsir.nameAr}
                    </button>
                  ))}
                </div>

                {/* ACTIVE TAFSIR AUTHOR BIO BANNER */}
                {(() => {
                  const curTafsir = TAFASEER_CATALOG.find((t) => t.id === activeTafsirId) || TAFASEER_CATALOG[0];
                  return (
                    <div style={{
                      background: "#fdfbf7",
                      border: "1px solid rgba(198, 149, 47, 0.3)",
                      borderRadius: "14px",
                      padding: "14px 20px",
                      marginBottom: "16px",
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "10px"
                    }}>
                      <div>
                        <strong style={{ color: "var(--deep)", fontSize: "1.02rem" }}>{curTafsir.nameUr}</strong>
                        <span style={{ margin: "0 8px", color: "var(--gold)" }}>•</span>
                        <span style={{ color: "var(--muted)", fontSize: "0.88rem" }}>{curTafsir.author} ({curTafsir.era})</span>
                      </div>
                      <span style={{ fontSize: "0.8rem", background: "rgba(11, 79, 63, 0.08)", color: "var(--green)", padding: "3px 12px", borderRadius: "999px", fontWeight: "600" }}>
                        منہج: {curTafsir.methodology}
                      </span>
                    </div>
                  );
                })()}

                {/* AYAH SELECTOR CHIPS */}
                <div style={{ textAlign: "center", marginBottom: "12px" }}>
                  <div className="book-filter-chips">
                    {SAMPLE_AYAH_TAFSIR_LIBRARY.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={activeAyahIndex === idx ? "filter-chip-btn active" : "filter-chip-btn"}
                        onClick={() => setActiveAyahIndex(idx)}
                      >
                        {item.surahNameUr} ({isUrdu ? `آیت ${item.ayahNumber}` : `Ayah ${item.ayahNumber}`})
                      </button>
                    ))}
                  </div>
                </div>

                {/* TRANSLATION SELECTOR CHIPS */}
                <div style={{ textAlign: "center", marginBottom: "16px" }}>
                  <div className="translation-selector-chips">
                    {TRANSLATIONS_CATALOG.map((tr) => (
                      <button
                        key={tr.id}
                        type="button"
                        className={activeTranslationId === tr.id ? "translation-chip-btn active" : "translation-chip-btn"}
                        onClick={() => setActiveTranslationId(tr.id)}
                      >
                        {tr.name}
                      </button>
                    ))}
                    <button
                      type="button"
                      className={showAllTranslations ? "translation-chip-btn active" : "translation-chip-btn"}
                      style={{ background: showAllTranslations ? "var(--gold)" : "#f5ecd7", color: "#171614", borderColor: "var(--gold)" }}
                      onClick={() => setShowAllTranslations(!showAllTranslations)}
                    >
                      {showAllTranslations ? "✓ تمام 5 تراجم فعال ہیں" : "⚖ تمام 5 تراجم کا آمنے سامنے تقابل"}
                    </button>
                  </div>
                </div>

                {/* ACTIVE AYAH TAFSIR CARD */}
                {(() => {
                  const curAyah = SAMPLE_AYAH_TAFSIR_LIBRARY[activeAyahIndex] || SAMPLE_AYAH_TAFSIR_LIBRARY[0];
                  const curTafsir = TAFASEER_CATALOG.find((t) => t.id === activeTafsirId) || TAFASEER_CATALOG[0];
                  const commentaryText = (curAyah.tafaseer as any)[activeTafsirId] || curAyah.tafaseer.ibnKathir;

                  return (
                    <div className="tafsir-card">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", marginBottom: "16px" }}>
                        <div className="tafsir-header-badge">
                          <span>📖 {curAyah.surahNameUr} ({curAyah.surahNameAr})</span>
                          <span>•</span>
                          <span>{isUrdu ? `آیت نمبر ${curAyah.ayahNumber}` : `Ayah ${curAyah.ayahNumber}`}</span>
                          <span>•</span>
                          <span>{curAyah.topic}</span>
                        </div>

                        <a
                          href={curAyah.audioUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="hadith-action-btn"
                          style={{ background: "var(--deep)", color: "#fff", borderColor: "var(--gold)" }}
                        >
                          ▶ {isUrdu ? "صوتی تلاوت سنیں (مشاری العفاسی)" : "Play Audio Recitation"}
                        </a>
                      </div>

                      {/* ARABIC TEXT WITH DEDICATED ARABIC FONT */}
                      <div className="tafsir-arabic-box">
                        <div className="tafsir-arabic-text font-arabic" lang="ar" dir="rtl">{curAyah.arabicText}</div>
                      </div>

                      {/* COMPARATIVE TRANSLATIONS OR SINGLE TRANSLATION */}
                      {/* SCHOLAR NAME ATTRIBUTION BAR */}
                  <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", background: "#fbf8ef", border: "1px solid #e2d7ba", borderRadius: "10px", padding: "10px 16px", marginBottom: "16px", fontSize: "0.85rem" }}>
                    <div>
                      <strong style={{ color: "var(--deep)" }}>مترجم: </strong>
                      <span style={{ color: "var(--gold)", fontWeight: 700 }}>
                        {activeTranslationId === "jalandhri" ? "مولانا فتح محمد جالندھریؒ (سلیس روایتی اردو)" :
                         activeTranslationId === "taqi" ? "شیخ الاسلام مفتی محمد تقی عثمانی (عصر حاضر کا عام فہم ترجمہ)" :
                         activeTranslationId === "junagarhi" ? "مولانا محمد جوناگڑھیؒ (مجمع الملک فہد)" :
                         activeTranslationId === "ahmedRaza" ? "امام احمد رضا خانؒ (کنز الایمان)" :
                         "Saheeh International (Authentic English)"}
                      </span>
                    </div>
                    <div>
                      <strong style={{ color: "var(--deep)" }}>مفسر: </strong>
                      <span style={{ color: "var(--green)", fontWeight: 700 }}>
                        {activeTafsirId === "ibnKathir" ? "عماد الدین حافظ ابن کثیر الدمشقیؒ (تفسیر بالماثور)" :
                         activeTafsirId === "maarifulQuran" ? "مفتی اعظم مفتی محمد شفیع عثمانیؒ (معارف القرآن)" :
                         activeTafsirId === "tafheemulQuran" ? "مولانا سید ابوالاعلیٰ مودودیؒ (تفہیم القرآن)" :
                         activeTafsirId === "asaanQuran" ? "مفتی محمد تقی عثمانی (توضیح القرآن)" :
                         "حکیم الامت مولانا اشرف علی تھانویؒ (بیان القرآن)"}
                      </span>
                    </div>
                  </div>

                  {showAllTranslations ? (
                        <div className="tafsir-translations-grid">
                          <div className="translation-item-box" style={{ borderRightColor: "#0b4f3f" }}>
                            <span className="translation-scholar-tag">مولانا فتح محمد جالندھریؒ</span>
                            <div className="translation-text-urdu">{curAyah.translations.jalandhri}</div>
                          </div>
                          <div className="translation-item-box" style={{ borderRightColor: "#c6952f" }}>
                            <span className="translation-scholar-tag">شیخ الاسلام مفتی محمد تقی عثمانی</span>
                            <div className="translation-text-urdu">{curAyah.translations.taqi}</div>
                          </div>
                          <div className="translation-item-box" style={{ borderRightColor: "#1565c0" }}>
                            <span className="translation-scholar-tag">مولانا محمد جوناگڑھیؒ (مجمع الملک فہد)</span>
                            <div className="translation-text-urdu">{curAyah.translations.junagarhi}</div>
                          </div>
                          <div className="translation-item-box" style={{ borderRightColor: "#ad1457" }}>
                            <span className="translation-scholar-tag">امام احمد رضا خان بریلویؒ (کنز الایمان)</span>
                            <div className="translation-text-urdu">{curAyah.translations.ahmedRaza}</div>
                          </div>
                          <div className="translation-item-box" style={{ borderRightColor: "#455a64" }}>
                            <span className="translation-scholar-tag">Saheeh International (English)</span>
                            <div style={{ fontSize: "1.02rem", color: "#222" }}>{curAyah.translations.saheehEn}</div>
                          </div>
                        </div>
                      ) : (
                        <div className="translation-item-box" style={{ marginBottom: "22px" }}>
                          <span className="translation-scholar-tag">
                            مستند ترجمہ: {
                              activeTranslationId === "jalandhri" ? "مولانا فتح محمد جالندھریؒ" :
                              activeTranslationId === "taqi" ? "مفتی محمد تقی عثمانی" :
                              activeTranslationId === "junagarhi" ? "مولانا محمد جوناگڑھیؒ" :
                              activeTranslationId === "ahmedRaza" ? "امام احمد رضا خانؒ (کنز الایمان)" :
                              "Saheeh International (English)"
                            }
                          </span>
                          <div className="translation-text-urdu">
                            {
                              activeTranslationId === "jalandhri" ? curAyah.translations.jalandhri :
                              activeTranslationId === "taqi" ? curAyah.translations.taqi :
                              activeTranslationId === "junagarhi" ? curAyah.translations.junagarhi :
                              activeTranslationId === "ahmedRaza" ? curAyah.translations.ahmedRaza :
                              curAyah.translations.saheehEn
                            }
                          </div>
                        </div>
                      )}

                      {/* TAFSEER COMMENTARY BOX */}
                      <div className="tafsir-commentary-box">
                        <div className="tafsir-commentary-title">
                          <div>
                            <strong style={{ color: "var(--deep)", fontSize: "1.1rem" }}>
                              {curTafsir.nameUr} — تفسیر و تشریح
                            </strong>
                            <p style={{ margin: "2px 0 0 0", fontSize: "0.85rem", color: "var(--muted)" }}>
                              مفسر: {curTafsir.author}
                            </p>
                          </div>
                          <span className="hadith-grade-badge">مستند شرح بالماثور</span>
                        </div>

                        <div className="tafsir-commentary-text">
                          {commentaryText}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* TAB 2: HADITH ENCYCLOPEDIA */}
            {activeLibraryTab === "hadith" && (
              <div>
                {/* SEARCH BAR */}
                <div className="hadith-search-bar">
                  <input
                    type="text"
                    className="hadith-search-input"
                    placeholder={isUrdu ? "حدیث کا عنوان، راوی، متن یا نمبر تلاش کریں... (مثلاً: نیت، تسبیح، صدقہ، علم)" : "Search Hadith by topic, narrator, or keyword..."}
                    value={hadithSearch}
                    onChange={(e) => setHadithSearch(e.target.value)}
                  />
                </div>

                {/* CANONICAL BOOKS FILTER */}
                <div className="book-filter-chips">
                  <button
                    type="button"
                    className={hadithBookFilter === "all" ? "filter-chip-btn active" : "filter-chip-btn"}
                    onClick={() => setHadithBookFilter("all")}
                  >
                    {isUrdu ? "تمام کتب (All Books)" : "All Books"}
                  </button>
                  <button
                    type="button"
                    className={hadithBookFilter === "bukhari" ? "filter-chip-btn active" : "filter-chip-btn"}
                    onClick={() => setHadithBookFilter("bukhari")}
                  >
                    صحیح البخاری
                  </button>
                  <button
                    type="button"
                    className={hadithBookFilter === "muslim" ? "filter-chip-btn active" : "filter-chip-btn"}
                    onClick={() => setHadithBookFilter("muslim")}
                  >
                    صحیح مسلم
                  </button>
                  <button
                    type="button"
                    className={hadithBookFilter === "tirmidhi" ? "filter-chip-btn active" : "filter-chip-btn"}
                    onClick={() => setHadithBookFilter("tirmidhi")}
                  >
                    جامع الترمذی
                  </button>
                </div>

                {/* HADITH CARDS GRID */}
                <div className="hadith-grid">
                  {HADITH_ENCYCLOPEDIA.filter((h) => {
                    if (hadithBookFilter !== "all" && h.bookId !== hadithBookFilter) return false;
                    if (hadithSearch.trim()) {
                      const q = hadithSearch.toLowerCase();
                      return (
                        h.matnAr.includes(q) ||
                        h.translationUr.includes(q) ||
                        h.narratorUr.includes(q) ||
                        h.chapterUr.includes(q) ||
                        h.takhreej.includes(q)
                      );
                    }
                    return true;
                  }).map((h) => (
                    <div key={h.id} className="hadith-card">
                      <div className="hadith-card-header">
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span className="hadith-book-badge">
                            📜 {h.bookNameUr} #{h.hadithNo}
                          </span>
                          <span className="hadith-grade-badge">
                            ✓ {h.grade}
                          </span>
                        </div>
                        <span style={{ fontSize: "0.85rem", color: "var(--muted)", fontWeight: "600" }}>
                          {h.chapterUr}
                        </span>
                      </div>

                      <div className="hadith-narrator font-arabic" lang="ar">
                        {h.narratorAr} <span style={{ fontFamily: "var(--font-urdu)" }}>({h.narratorUr})</span>
                      </div>

                      {/* ARABIC MATN WITH AUTHENTIC ARABIC FONT */}
                      <div className="hadith-matn-ar font-arabic" lang="ar" dir="rtl">
                        {h.matnAr}
                      </div>

                      <div className="hadith-translation-ur">
                        <strong>ترجمہ: </strong>{h.translationUr}
                      </div>

                      <div className="hadith-takhreej-pill">
                        🔍 <strong>تخریج الحدیث: </strong>{h.takhreej}
                      </div>

                      <div className="hadith-sharh-box">
                        <div className="hadith-sharh-title">
                          💡 شرح الحدیث و فقہی فوائد:
                        </div>
                        <div className="hadith-sharh-text">
                          {h.sharh}
                        </div>
                        <ul style={{ margin: "10px 0 0 0", paddingRight: "20px", fontSize: "0.95rem", color: "var(--deep)" }}>
                          {h.benefits.map((b, bIdx) => (
                            <li key={bIdx} style={{ marginBottom: "4px" }}>{b}</li>
                          ))}
                        </ul>
                      </div>

                      {/* ACTION BUTTONS */}
                      <div className="hadith-actions-bar">
                        <button
                          type="button"
                          className="hadith-action-btn"
                          onClick={() => handleCopyHadith(h)}
                        >
                          {copiedHadithId === h.id ? "✓ کاپی ہو گیا!" : "📋 کاپی حدیث"}
                        </button>
                        <button
                          type="button"
                          className="hadith-action-btn btn-whatsapp-dawah"
                          onClick={() => handleOpenDawahCard(h.chapterUr, h.matnAr, h.translationUr, `${h.bookNameUr} (${h.takhreej})`)}
                        >
                          💬 واٹس ایپ دعوتی کارڈ بھیجیں
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: MASNOON AZKAR & DIGITAL TASBEEH */}
            {activeLibraryTab === "azkar" && (
              <div>
                {/* AZKAR CATEGORY FILTER */}
                <div className="category-filter-chips">
                  <button
                    type="button"
                    className={azkarCategoryFilter === "all" ? "filter-chip-btn active" : "filter-chip-btn"}
                    onClick={() => setAzkarCategoryFilter("all")}
                  >
                    {isUrdu ? "تمام اذکار" : "All Azkar"}
                  </button>
                  <button
                    type="button"
                    className={azkarCategoryFilter === "morning" ? "filter-chip-btn active" : "filter-chip-btn"}
                    onClick={() => setAzkarCategoryFilter("morning")}
                  >
                    صبح کے اذکار
                  </button>
                  <button
                    type="button"
                    className={azkarCategoryFilter === "evening" ? "filter-chip-btn active" : "filter-chip-btn"}
                    onClick={() => setAzkarCategoryFilter("evening")}
                  >
                    شام کے اذکار
                  </button>
                  <button
                    type="button"
                    className={azkarCategoryFilter === "after_salah" ? "filter-chip-btn active" : "filter-chip-btn"}
                    onClick={() => setAzkarCategoryFilter("after_salah")}
                  >
                    بعد از نماز پنجگانہ
                  </button>
                </div>

                {/* AZKAR CARDS */}
                <div className="azkar-grid">
                  {DAILY_AZKAR_DATA.filter((z) => {
                    if (azkarCategoryFilter === "all") return true;
                    return z.category === azkarCategoryFilter;
                  }).map((z) => {
                    const count = azkarCounters[z.id] || 0;
                    const isFinished = count >= z.targetCount;

                    return (
                      <div key={z.id} className="zikr-card">
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                            <span style={{ fontSize: "0.78rem", background: "rgba(198, 149, 47, 0.15)", color: "var(--deep)", padding: "2px 10px", borderRadius: "999px", fontWeight: "700" }}>
                              {z.categoryUr}
                            </span>
                            <span style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
                              ہدف: <strong>{z.targetCount} مرتبہ</strong>
                            </span>
                          </div>

                          <strong style={{ display: "block", color: "var(--deep)", fontSize: "1.02rem", marginBottom: "12px" }}>
                            {z.titleUr}
                          </strong>

                          {/* ARABIC TEXT WITH DEDICATED ARABIC FONT */}
                          <div className="zikr-arabic font-arabic" lang="ar" dir="rtl">
                            {z.arabicText}
                          </div>

                          <div className="zikr-translation">
                            <strong>ترجمہ: </strong>{z.translationUr}
                          </div>

                          <div style={{ fontSize: "0.86rem", color: "var(--green)", background: "#e8f5e9", padding: "8px 12px", borderRadius: "8px", marginBottom: "14px" }}>
                            ✨ <strong>فضیلت: </strong>{z.virtueUr}
                            <br />
                            <small style={{ color: "var(--muted)" }}>({z.takhreej})</small>
                          </div>
                        </div>

                        {/* INTERACTIVE TASBEEH COUNTER */}
                        <div className="tasbeeh-interactive-bar">
                          <div>
                            <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>تعداد: </span>
                            <strong style={{ fontSize: "1.3rem", color: "var(--deep)" }}>
                              {count}
                            </strong>
                            <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}> / {z.targetCount}</span>
                          </div>

                          {isFinished ? (
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <span className="tasbeeh-completed-badge">
                                ✓ ماشاء اللہ! مکمل
                              </span>
                              <button
                                type="button"
                                onClick={() => handleResetTasbeeh(z.id)}
                                style={{ background: "none", border: "1px solid #ccc", borderRadius: "6px", fontSize: "0.75rem", padding: "3px 8px", cursor: "pointer" }}
                              >
                                دوبارہ
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              className="tasbeeh-tap-btn"
                              onClick={() => handleTasbeehTap(z.id, z.targetCount)}
                            >
                              +1 پڑھیں
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>



        {/* ========================================================
            12 COURSES & COMPREHENSIVE OUTLINES
            ======================================================== */}
        
        {/* ========================================================
            LIVE INTERACTIVE CLASSROOM & LESSON VIEWROOM
            ======================================================== */}
        <section id="classroom-section" style={{ padding: "65px 0", background: "linear-gradient(180deg, var(--cream) 0%, #f6efe1 100%)", borderTop: "1px solid rgba(198, 149, 47, 0.25)" }}>
          <div className="wrap">
            <div className="section-head" style={{ textAlign: "center" }}>
              <span className="eyebrow">
                <span className="eyebrow-star">✦</span>
                {isUrdu ? "جدید ترین ٹیکنالوجی پر مبنی لائیو کلاس روم" : "Live Interactive Virtual Classroom"}
              </span>
              <h2>
                {isUrdu ? (
                  <>لائیو تعلیمی ویو روم <span>و ڈیجیٹل اسباق ڈیش بورڈ</span></>
                ) : (
                  <>Synchronized Lesson Viewroom <span>& Student Dashboard</span></>
                )}
              </h2>
              <p style={{ maxWidth: "750px", margin: "0 auto" }}>
                {isUrdu
                  ? "طالب علم اور استاد دونوں کے سامنے ایک ہی سبق کھلتا ہے، ریئل ٹائم پوائنٹر، صوتی رہنمائی اور روزانہ سبق ڈائری کے ساتھ۔"
                  : "Teacher and student share the exact same synchronized lesson board with real-time pointing, voice guidance, and daily performance diary."}
              </p>
            </div>

            {/* CLASSROOM CONTAINER */}
            <div className="classroom-container">
              {/* TOP STATUS BAR */}
              <div className="classroom-header-bar">
                <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span className="pulse-radar" style={{ margin: 0 }}></span>
                    <strong style={{ color: "var(--gold-light)", fontSize: "0.95rem" }}>
                      {classroomRole === "teacher" ? "استاد اسکرین: قاری محمد عمر فاروقی (لاہور)" : "طالب علم اسکرین: محمد ریان (لندن، برطانیہ)"}
                    </strong>
                  </div>
                  <span style={{ fontSize: "0.8rem", background: "rgba(255,255,255,0.12)", padding: "3px 10px", borderRadius: "999px" }}>
                    ⏱ لائیو سیشن: 24:18 منٹ
                  </span>
                </div>

                {/* ROLE SWITCHER */}
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    type="button"
                    onClick={() => setClassroomRole("teacher")}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "999px",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      border: "1px solid var(--gold)",
                      background: classroomRole === "teacher" ? "var(--gold)" : "transparent",
                      color: classroomRole === "teacher" ? "#062e24" : "#ffffff",
                      cursor: "pointer"
                    }}
                  >
                    🎓 استاد موڈ
                  </button>
                  <button
                    type="button"
                    onClick={() => setClassroomRole("student")}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "999px",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      border: "1px solid var(--gold)",
                      background: classroomRole === "student" ? "var(--gold)" : "transparent",
                      color: classroomRole === "student" ? "#062e24" : "#ffffff",
                      cursor: "pointer"
                    }}
                  >
                    👦 طالب علم موڈ
                  </button>
                </div>
              </div>

              {/* SHARED LESSON BOARD */}
              <div
                className="classroom-board"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  setClassroomPointer({ x, y });
                }}
              >
                {classroomPointer && (
                  <div
                    className="classroom-pointer-dot"
                    style={{ left: `${classroomPointer.x}%`, top: `${classroomPointer.y}%` }}
                    title="استاد کا لائیو پوائنٹر"
                  />
                )}

                <span style={{ fontSize: "0.82rem", color: "var(--muted)", marginBottom: "8px", fontWeight: 700 }}>
                  {classroomLessonType === "qaida" ? "سبق: نورانی قاعدہ — تختی نمبر 4 (حرکات)" :
                   classroomLessonType === "nazra" ? "سبق: ناظرہ قرآن کریم — سورۃ الملک، آیات 1 تا 5" :
                   "سبق: حفظ القرآن — پارہ 1 (سورۃ البقرہ)"}
                </span>

                <div className="font-arabic" lang="ar" dir="rtl" style={{ fontSize: "2.4rem", lineHeight: "2.8", color: "var(--deep)", maxWidth: "800px" }}>
                  تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ ۝ الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ
                </div>

                <small style={{ marginTop: "14px", color: "var(--green)", fontWeight: 600 }}>
                  👆 استاد اسکرین پر جس لفظ پر کلک کریں گے، طالب علم کے سامنے ریڈار پوائنٹر نمودار ہوگا۔
                </small>
              </div>

              {/* SABAQ TRACKER & PARENT DIARY */}
              <div className="sabaq-diary-box">
                <div className="sabaq-item-cell">
                  <span style={{ fontSize: "0.78rem", color: "var(--gold)", fontWeight: 700, display: "block" }}>
                    📖 آج کا سبق (Sabaq):
                  </span>
                  <input
                    type="text"
                    value={diarySabaq}
                    onChange={(e) => setDiarySabaq(e.target.value)}
                    style={{ width: "100%", border: "0", background: "transparent", fontWeight: 700, color: "var(--deep)", fontSize: "0.92rem", outline: "none", marginTop: "4px" }}
                  />
                </div>

                <div className="sabaq-item-cell" style={{ borderRightColor: "#1565c0" }}>
                  <span style={{ fontSize: "0.78rem", color: "#1565c0", fontWeight: 700, display: "block" }}>
                    🔄 سبقی (پچھلی دہرائی):
                  </span>
                  <input
                    type="text"
                    value={diarySabqi}
                    onChange={(e) => setDiarySabqi(e.target.value)}
                    style={{ width: "100%", border: "0", background: "transparent", fontWeight: 700, color: "var(--deep)", fontSize: "0.92rem", outline: "none", marginTop: "4px" }}
                  />
                </div>

                <div className="sabaq-item-cell" style={{ borderRightColor: "#0b4f3f" }}>
                  <span style={{ fontSize: "0.78rem", color: "#0b4f3f", fontWeight: 700, display: "block" }}>
                    ⭐ استاد کے ریمارکس:
                  </span>
                  <input
                    type="text"
                    value={diaryRemarks}
                    onChange={(e) => setDiaryRemarks(e.target.value)}
                    style={{ width: "100%", border: "0", background: "transparent", fontWeight: 700, color: "var(--deep)", fontSize: "0.92rem", outline: "none", marginTop: "4px" }}
                  />
                </div>

                <div style={{ display: "flex", alignItems: "center" }}>
                  <button
                    type="button"
                    onClick={handleSendParentDiaryWhatsApp}
                    className="btn btn-gold"
                    style={{ width: "100%", fontSize: "0.88rem", padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                  >
                    📲 والدین کے واٹس ایپ پر ڈائری بھیجیں
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>


        <section id="courses-section" className="soft">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">
                <span className="eyebrow-star">✦</span>
                {isUrdu ? "12 جامع تعلیمی کورسز" : "Complete 12 Course Programs"}
              </span>
              <h2>{isUrdu ? "مکمل تعلیمی نصاب اور کورس آؤٹ لائنز" : "Structured Syllabi & Comprehensive Outlines"}</h2>
              <p>
                {isUrdu
                  ? "ہر کورس انفرادی کلاسز، مرحلہ وار نصاب اور مستند اساتذہ کے ساتھ پڑھایا جاتا ہے۔ کسی بھی کورس کی تفصیلی آؤٹ لائن دیکھنے کے لیے بٹن دبائیں:"
                  : "Every course offers private 1-to-1 live sessions, progressive modules and certified scholars. Click any course to view its comprehensive syllabus:"}
              </p>
            </div>

            {/* TRACK FILTER PILLS */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "26px" }}>
              <button
                type="button"
                className={`qari-pill ${courseFilter === "all" ? "active" : ""}`}
                onClick={() => setCourseFilter("all")}
              >
                {isUrdu ? "تمام کورسز (12)" : "All Programs (12)"}
              </button>
              <button
                type="button"
                className={`qari-pill ${courseFilter === "quran" ? "active" : ""}`}
                onClick={() => setCourseFilter("quran")}
              >
                {isUrdu ? "قرآن ٹریک (۵)" : "Quran Track (5)"}
              </button>
              <button
                type="button"
                className={`qari-pill ${courseFilter === "islamic" ? "active" : ""}`}
                onClick={() => setCourseFilter("islamic")}
              >
                {isUrdu ? "اسلامک اسٹڈیز (۵)" : "Islamic Studies (5)"}
              </button>
              <button
                type="button"
                className={`qari-pill ${courseFilter === "advanced" ? "active" : ""}`}
                onClick={() => setCourseFilter("advanced")}
              >
                {isUrdu ? "عربی و قراءات (۲)" : "Arabic & Qira'at (2)"}
              </button>
            </div>

            {/* COURSES GRID */}
            <div className="cards">
              {filteredCourses.map((course) => (
                <article className="card" key={course.code}>
                  <div>
                    <div className="card-top-meta">
                      <span className="number">#{course.code}</span>
                      <span className="course-audience-pill">{course.audience}</span>
                    </div>
                    <h3>{course.name}</h3>
                    <p>{course.shortDesc}</p>
                    <div style={{ color: "var(--green)", fontWeight: 700, fontSize: "0.82rem", marginBottom: "12px" }}>
                      ⏱ {course.duration} ({course.sessions})
                    </div>
                  </div>

                  <div className="card-footer-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <button
                      type="button"
                      className="text-link"
                      onClick={() => setSelectedCourseForOutline(course as CourseDetail)}
                    >
                      {isUrdu ? "نصاب و آؤٹ لائن دیکھیں ←" : "View Course Outline →"}
                    </button>
                    <a className="btn btn-small btn-gold" href="#admissions-section">
                      {isUrdu ? "مفت ٹرائل لیں" : "Free Trial"}
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================
            COURSE OUTLINE MODAL (OPENED ON CLICK)
            ======================================================== */}
        {selectedCourseForOutline && (
          <div
            className="outline-modal-backdrop"
            onClick={() => setSelectedCourseForOutline(null)}
          >
            <div
              className="outline-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="outline-modal-close"
                onClick={() => setSelectedCourseForOutline(null)}
                aria-label="Close"
              >
                ×
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <span className="number">#{selectedCourseForOutline.code}</span>
                <span className="course-audience-pill">{selectedCourseForOutline.audience}</span>
              </div>

              <h2 style={{ fontSize: "1.9rem", color: "var(--deep)", margin: "4px 0 8px" }}>
                {selectedCourseForOutline.name}
              </h2>
              <p style={{ color: "var(--muted)", margin: "0 0 16px" }}>
                {selectedCourseForOutline.shortDesc}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  background: "var(--cream)",
                  padding: "12px 18px",
                  borderRadius: "14px",
                  fontSize: "0.86rem",
                  marginBottom: "20px",
                  flexWrap: "wrap",
                }}
              >
                <span>
                  <strong>{isUrdu ? "مدت:" : "Duration:"}</strong> {selectedCourseForOutline.duration}
                </span>
                <span>
                  <strong>{isUrdu ? "سیشنز:" : "Sessions:"}</strong> {selectedCourseForOutline.sessions}
                </span>
                <span>
                  <strong>{isUrdu ? "پیشگی شرط:" : "Prerequisite:"}</strong> {selectedCourseForOutline.prerequisites}
                </span>
              </div>

              <h3 style={{ fontSize: "1.25rem", color: "var(--deep)", marginBottom: "14px" }}>
                {isUrdu ? "تفصیلی مرحلہ وار نصاب (Detailed Modules):" : "Detailed Course Modules:"}
              </h3>

              <div style={{ display: "grid", gap: "10px", marginBottom: "22px" }}>
                {selectedCourseForOutline.modules.map((mod: CourseOutlineModule, i: number) => (
                  <div key={i} className="outline-module-card">
                    <h4>{mod.title}</h4>
                    <ul>
                      {mod.topics.map((t: string, ti: number) => (
                        <li key={ti}>{t}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div
                style={{
                  background: "rgba(11, 79, 63, 0.06)",
                  border: "1px solid rgba(11, 79, 63, 0.2)",
                  padding: "18px",
                  borderRadius: "16px",
                  marginBottom: "22px",
                }}
              >
                <strong style={{ display: "block", color: "var(--deep)", marginBottom: "8px" }}>
                  {isUrdu ? "کامیابی کے بعد کیا حاصل ہوگا؟ (Learning Outcomes):" : "Learning Outcomes:"}
                </strong>
                <ul style={{ margin: 0, paddingInlineStart: "20px", color: "var(--muted)", fontSize: "0.88rem" }}>
                  {selectedCourseForOutline.outcomes.map((out: string, oi: number) => (
                    <li key={oi}>{out}</li>
                  ))}
                </ul>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                <a
                  className="btn btn-gold"
                  href="#admissions-section"
                  onClick={() => setSelectedCourseForOutline(null)}
                >
                  {isUrdu ? "اس کورس کے لیے مفت ٹرائل بک کریں" : "Enroll with a Free Trial"}
                </a>
                <a
                  className="text-link"
                  href={`https://wa.me/923336519527?text=${encodeURIComponent(
                    isUrdu
                      ? `السلام علیکم! میں کورس "${selectedCourseForOutline.name}" کے نصاب کے بارے میں بات کرنا چاہتا ہوں۔`
                      : `Assalamu Alaikum! I would like to discuss the syllabus for "${selectedCourseForOutline.name}".`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {isUrdu ? "واٹس ایپ مشورہ →" : "Consult on WhatsApp →"}
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            ORIGINAL 5 CERTIFIED TEACHERS (AUTHENTIC FACULTY)
            ======================================================== */}
        <section id="teachers-section">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">
                <span className="eyebrow-star">✦</span>
                {isUrdu ? "سند یافتہ اور مستند اساتذہ" : "Faculty of Certified Scholars"}
              </span>
              <h2>{isUrdu ? "ہمارے مستند قراء اور معلمات" : "Meet Our Certified Scholars & Ustadhas"}</h2>
              <p>
                {isUrdu
                  ? "فاروقی اکیڈمی کے تمام اساتذہ وفاق المدارس العربیہ سے فاضل درس نظامی اور قراءات سبعہ و عشرہ کی مستند اسناد کے حامل ہیں۔ خواتین اور بچیوں کے لیے الگ مستند معلمات دستیاب ہیں:"
                  : "All tutors at Farooqi Academy hold formal Dars-e-Nizami and Qira'at certifications. Dedicated female scholars teach sisters and young girls in complete privacy:"}
              </p>
            </div>

            <div className="cards" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
              {t.teachersList.map((teacher) => (
                <article className="card" key={teacher.name} style={{ textAlign: "start" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <span className="verified-tag">✓ {isUrdu ? "مستند فاضل" : "Verified Scholar"}</span>
                      <small style={{ color: "var(--gold)", fontWeight: 700 }}>{teacher.experience}</small>
                    </div>
                    <h3 style={{ margin: "4px 0 6px" }}>{teacher.name}</h3>
                    <div className="teacher-qualification">{teacher.qualification}</div>
                    <p style={{ fontWeight: 600, color: "var(--green)", fontSize: "0.85rem", marginBottom: "8px" }}>
                      {teacher.role}
                    </p>
                    <p style={{ fontSize: "0.88rem", color: "var(--muted)", marginBottom: "12px" }}>
                      {teacher.bio}
                    </p>
                    <div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                        {teacher.specialties.map((spec) => (
                          <span key={spec} className="teacher-specialty-pill">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: "12px", marginBottom: "8px" }}>
                    <button
                      type="button"
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        borderRadius: "10px",
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        background: playingTeacherIdx === t.teachersList.indexOf(teacher) ? "#d97706" : "var(--green)",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                      }}
                      onClick={() => playTeacherRecitationSample(t.teachersList.indexOf(teacher))}
                    >
                      {playingTeacherIdx === t.teachersList.indexOf(teacher)
                        ? (isUrdu ? "🔊 تلاوت جاری ہے... (روکیں)" : "🔊 Playing Sample... (Stop)")
                        : (isUrdu ? "▶️ تلاوت کا نمونہ سنیں" : "▶️ Listen to Recitation Sample")}
                    </button>
                  </div>

                  <div className="card-footer-row" style={{ marginTop: "16px" }}>
                    <a className="text-link" href="#admissions-section">
                      {isUrdu ? "استاد کے ساتھ کلاس لیں ←" : "Request This Tutor →"}
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================
            TRANSPARENT FEE PLANS & INTERACTIVE CALCULATOR
            ======================================================== */}
        <section id="pricing-section" className="soft">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">
                <span className="eyebrow-star">✦</span>
                {isUrdu ? "شفاف فیس اور فیملی رعایت" : "Transparent Tuition & Sibling Discounts"}
              </span>
              <h2>{isUrdu ? "ماہانہ فیس کیلکولیٹر اور فیملی ڈسکاؤنٹ" : "Interactive Fee Calculator & Family Discount"}</h2>
              <p>
                {isUrdu
                  ? "اپنا ملک، ہفتہ وار کلاسز اور بچوں کی تعداد منتخب کر کے فوری فیس معلوم کریں۔ ایک سے زائد بچوں پر ۱۰٪ تا ۲۰٪ خودکار رعایت:"
                  : "Select your country, weekly frequency and number of children to calculate exact tuition with automatic 10% to 20% sibling discounts:"}
              </p>
            </div>

            {/* INTERACTIVE CALCULATOR CARD */}
            <div className="fee-calculator-card">
              <div className="calc-controls">
                <h3>{isUrdu ? "فیس کا درست تخمینہ لگائیں" : "Calculate Your Monthly Plan"}</h3>
                <div className="calc-grid">
                  <label>
                    {isUrdu ? "ملک / کرنسی:" : "Country / Currency:"}
                    <select
                      value={calcCurrency}
                      onChange={(e) => setCalcCurrency(e.target.value)}
                    >
                      {Object.entries(CURRENCIES).map(([code, info]) => (
                        <option key={code} value={code}>
                          {isUrdu ? info.labelUr : info.labelEn}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    {isUrdu ? "ہفتہ وار کلاسز:" : "Classes per Week:"}
                    <select
                      value={calcDays}
                      onChange={(e) => setCalcDays(Number(e.target.value))}
                    >
                      <option value={2}>{isUrdu ? "ہفتے میں 2 دن (8 کلاسز ماہانہ)" : "2 Days / Week (8 classes/mo)"}</option>
                      <option value={3}>{isUrdu ? "ہفتے میں 3 دن (12 کلاسز ماہانہ)" : "3 Days / Week (12 classes/mo)"}</option>
                      <option value={5}>{isUrdu ? "ہفتے میں 5 دن (20 کلاسز ماہانہ)" : "5 Days / Week (20 classes/mo)"}</option>
                      <option value={6}>{isUrdu ? "ہفتے میں 6 دن (24 کلاسز ماہانہ)" : "6 Days / Week (24 classes/mo)"}</option>
                    </select>
                  </label>

                  <label>
                    {isUrdu ? "کلاس کا دورانیہ:" : "Session Duration:"}
                    <select
                      value={calcDuration}
                      onChange={(e) => setCalcDuration(Number(e.target.value))}
                    >
                      <option value={30}>{isUrdu ? "30 منٹ (معیاری انفرادی کلاس)" : "30 Minutes (Standard 1-to-1)"}</option>
                      <option value={45}>{isUrdu ? "45 منٹ (تفصیلی انفرادی کلاس)" : "45 Minutes (Extended 1-to-1)"}</option>
                      <option value={60}>{isUrdu ? "60 منٹ (حفظ و خصوصی سیشن)" : "60 Minutes (Hifz / Intensive)"}</option>
                    </select>
                  </label>

                  <label>
                    {isUrdu ? "طلبہ کی تعداد (فیملی ڈسکاؤنٹ):" : "Number of Students:"}
                    <select
                      value={calcStudents}
                      onChange={(e) => setCalcStudents(Number(e.target.value))}
                    >
                      <option value={1}>{isUrdu ? "1 طالب علم (معیاری فیس)" : "1 Student (Standard Tuition)"}</option>
                      <option value={2}>{isUrdu ? "2 بہن بھائی (10% رعایت)" : "2 Siblings (10% Discount)"}</option>
                      <option value={3}>{isUrdu ? "3 بہن بھائی (15% رعایت)" : "3 Siblings (15% Discount)"}</option>
                      <option value={4}>{isUrdu ? "4 بہن بھائی (20% رعایت)" : "4 Siblings (20% Discount)"}</option>
                    </select>
                  </label>
                </div>
              </div>

              {/* CALC RESULT DISPLAY */}
              <div className="calc-summary">
                <span className="calc-badge">{isUrdu ? "ماہانہ فیس" : "Monthly Tuition"}</span>
                <div className="calc-price">
                  <span className="ltr-num">{currInfo.symbol}{totalMonthlyFee.toLocaleString()}</span>
                  <small> / {isUrdu ? "ماہ" : "mo"}</small>
                </div>
                <p className="calc-detail">
                  {classesPerMonth * calcStudents} {isUrdu ? "انفرادی کلاسز فی ماہ" : "classes per month"} · {calcDuration} {isUrdu ? "منٹ فی کلاس" : "mins each"}
                </p>
                {monthlySavings > 0 && (
                  <div className="calc-savings">
                    🎉 {isUrdu ? `فیملی بچت: ${currInfo.symbol}${monthlySavings} ماہانہ` : `You save ${currInfo.symbol}${monthlySavings}/mo`}
                  </div>
                )}
                <a className="btn btn-gold" href="#admissions-section">
                  {isUrdu ? "اس پلان پر ٹرائل لیں" : "Enroll With This Plan"}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            STUDENT VERIFICATION & FAQ SECTION
            ======================================================== */}
        <section>
          <div className="wrap faq-verify-grid">
            {/* FAQ ACCORDION */}
            <div>
              <div className="section-head" style={{ marginBottom: "26px" }}>
                <span className="eyebrow">
                  <span className="eyebrow-star">✦</span>
                  {isUrdu ? "اکثر پوچھے گئے سوالات" : "Common Questions"}
                </span>
                <h2>{isUrdu ? "عام سوالات کے تسلی بخش جوابات" : "Frequently Asked Questions"}</h2>
              </div>

              <div className="faq-list">
                <div className="faq-item">
                  <div className="faq-question">
                    <span>{isUrdu ? "کلاسز کس سافٹ ویئر پر اور کیسے لی جاتی ہیں؟" : "How are the one-to-one online classes conducted?"}</span>
                  </div>
                  <p className="faq-answer">
                    {isUrdu
                      ? "تمام کلاسز زوم، گوگل میٹ یا واٹس ایپ کے ذریعے انفرادی طور پر لی جاتی ہیں، جہاں استاد اسکرین شیئرنگ پر قرآنِ مجید کے صفحات واضح دکھا کر پڑھاتے ہیں۔"
                      : "Classes are conducted live 1-to-1 via Zoom, Google Meet or WhatsApp with high-definition Quran screen sharing and teacher interaction."}
                  </p>
                </div>

                <div className="faq-item">
                  <div className="faq-question">
                    <span>{isUrdu ? "کیا خواتین اور بچیوں کے لیے الگ خواتین معلمات موجود ہیں؟" : "Do you have female tutors for sisters and young girls?"}</span>
                  </div>
                  <p className="faq-answer">
                    {isUrdu
                      ? "جی ہاں! الحمدللہ ہمارے پاس فاضلہ درس نظامی اور تجوید یافتہ مستند خواتین معلمات ہیں جو صرف خواتین اور بچیوں کو پڑھاتی ہیں۔"
                      : "Yes! We have qualified, certified female scholars (Ustadhas) exclusively for women, girls and young children."}
                  </p>
                </div>

                <div className="faq-item">
                  <div className="faq-question">
                    <span>{isUrdu ? "اگر کسی دن کلاس چھوٹ جائے تو کیا متبادل ملتا ہے؟" : "What happens if a student misses a scheduled class?"}</span>
                  </div>
                  <p className="faq-answer">
                    {isUrdu
                      ? "جی ہاں، پیشگی اطلاع کی صورت میں اکیڈمی پورٹل کے ذریعے کلاس کو ری شیڈول کیا جا سکتا ہے۔"
                      : "With advance notice, parents and teachers can reschedule classes directly through the Academy Portal without losing sessions."}
                  </p>
                </div>
              </div>
            </div>

            {/* VERIFY WIDGET */}
            <div>
              <div className="verify-widget-card">
                <span className="verified-tag">🛡️ {isUrdu ? "آن لائن تصدیق" : "Instant Verification"}</span>
                <h3>{isUrdu ? "طالب علم کارڈ تصدیق کریں" : "Verify Student ID / Certificate"}</h3>
                <p>
                  {isUrdu
                    ? "طالب علم کے شناختی کارڈ یا سند پر درج کوڈ لکھیں (مثلاً FQA-1042):"
                    : "Enter the student ID code from any official card or certificate (e.g. FQA-1042):"}
                </p>

                <form onSubmit={handleVerifySubmit} className="verify-widget-form">
                  <input
                    type="text"
                    value={verifyCode}
                    onChange={(e) => setVerifyCode(e.target.value)}
                    placeholder="e.g. FQA-1042 or FQV-8891"
                    className="ltr-num"
                    required
                  />
                  <button type="submit" className="btn btn-gold">
                    {isUrdu ? "تصدیق کیجیے" : "Verify Credential"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            ADMISSIONS & FREE TRIAL SECTION
            ======================================================== */}
        <section id="admissions-section">
          <div className="wrap">
            <div className="contact">
              <div>
                <span className="eyebrow" style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}>
                  <span className="eyebrow-star">✦</span>
                  {isUrdu ? "مفت تعلیمی جائزہ و ٹرائل کلاس" : "Complimentary Assessment & Free Trial"}
                </span>

                <h2>{isUrdu ? "آج ہی مفت ٹرائل کلاس بک کریں" : "Book Your Free Trial Class Today"}</h2>
                <p>
                  {isUrdu
                    ? "مختصر فارم پُر کریں۔ ہماری تعلیمی ٹیم آپ سے رابطہ کر کے مناسب وقت پر ایک مفت ٹرائل سیشن کا اہتمام کرے گی۔"
                    : "Fill in the short form below. Our academic advisor will contact you to schedule a convenient free trial session."}
                </p>

                <div className="contact-lines">
                  <a href="tel:+923336519527" className="ltr-num">☎ 0333-6519527 / 0334-4323994</a>
                  <a href="mailto:umarwazir1989@gmail.com">✉ umarwazir1989@gmail.com</a>
                  <span>📍 {isUrdu ? "لاہور، پنجاب، پاکستان" : "Lahore, Punjab, Pakistan"}</span>
                </div>
              </div>

              {/* TRIAL FORM */}
              <form onSubmit={handleTrialSubmit}>
                <div className="form-row">
                  <label>
                    {isUrdu ? "طالب علم کا نام *" : "Student Name *"}
                    <input type="text" name="name" required placeholder={isUrdu ? "محمد ریان" : "e.g. Rayyan Khan"} />
                  </label>
                  <label>
                    {isUrdu ? "واٹس ایپ نمبر *" : "WhatsApp Number *"}
                    <input type="tel" name="phone" required placeholder="+44 7700 900000" className="ltr-num" />
                  </label>
                </div>

                <div className="form-row">
                  <label>
                    {isUrdu ? "ملک اور شہر *" : "Country & City *"}
                    <input type="text" name="country" required placeholder={isUrdu ? "لندن / مانچسٹر / ہیوسٹن" : "UK / USA / Pakistan"} />
                  </label>
                  <label>
                    {isUrdu ? "مطلوبہ کورس *" : "Course *"}
                    <select name="course" required>
                      <option value="Noorani Qaida">{isUrdu ? "نورانی قاعدہ" : "Noorani Qaida"}</option>
                      <option value="Nazra Quran with Tajweed">{isUrdu ? "ناظرہ قرآن مع تجوید" : "Nazra Quran with Tajweed"}</option>
                      <option value="Tajweed Mastery">{isUrdu ? "تجوید و قراءات کورس" : "Tajweed Mastery"}</option>
                      <option value="Hifz-ul-Quran">{isUrdu ? "حفظ القرآن الکریم" : "Hifz-ul-Quran"}</option>
                      <option value="Tafsir & Translation">{isUrdu ? "ترجمہ و تفسیر القرآن" : "Tafsir & Translation"}</option>
                      <option value="Salah & Islamic Studies">{isUrdu ? "نماز، سیرت و اسلامیات" : "Salah & Islamic Studies"}</option>
                    </select>
                  </label>
                </div>

                <label>
                  {isUrdu ? "استاد کی ترجیح اور پسندیدہ وقت:" : "Tutor Preference & Timing:"}
                  <input
                    type="text"
                    name="timeSlot"
                    placeholder={isUrdu ? "مرد استاد یا خاتون معلمہ / شام ۶ بجے" : "Male/Female tutor / e.g. 6 PM UK Time"}
                  />
                </label>

                <button type="submit" className="btn btn-gold" disabled={formBusy}>
                  {formBusy
                    ? isUrdu
                      ? "درخواست بھیجی جا رہی ہے..."
                      : "Submitting..."
                    : isUrdu
                    ? "✓ مفت ٹرائل درخواست بھیجیں"
                    : "✓ Submit Free Trial Application"}
                </button>

                {formStatus && <p className="form-status">{formStatus}</p>}
              </form>
            </div>
          </div>
        </section>

        {/* ========================================================
            ULTRA-MODERN LUXURY VISITOR ANALYTICS & REAL LIVE COUNTER
            ======================================================== */}
        
        {/* ========================================================
            COMPACT CREDIBILITY & REAL VISITOR ANALYTICS STRIP
            ======================================================== */}
        <section id="visitor-analytics-section" className="visitor-credibility-bar">
          <div className="wrap">
            <div style={{ textAlign: "center", marginBottom: "22px" }}>
              <span className="gold-badge" style={{ background: "rgba(198, 149, 47, 0.2)", color: "var(--gold-light)" }}>
                {isUrdu ? "عالمی برادری و لائیو ڈیٹا" : "Real-Time Verified Community"}
              </span>
              <h3 style={{ fontSize: "1.6rem", fontWeight: "800", color: "#ffffff", margin: "8px 0" }}>
                {isUrdu ? "42+ ممالک سے طلبہ و زائرین کا اوریجنل اعتماد" : "Trusted by Students Across 42+ Countries"}
              </h3>
            </div>

            <div className="analytics-hero-grid" style={{ marginTop: "16px" }}>
              {/* CARD 1: REAL LIVE ONLINE */}
              <div className="analytics-stat-card" style={{ padding: "18px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span className="pulse-radar"></span>
                  <span style={{ fontSize: "0.85rem", color: "#00e676", fontWeight: "700", marginRight: "6px" }}>
                    {isUrdu ? "لائیو آن لائن" : "Active Live"}
                  </span>
                </div>
                <div className="odometer-number" style={{ color: "#00e676", fontSize: "2.1rem" }}>
                  {liveOnlineVisitors}
                </div>
                <div className="analytics-label" style={{ fontSize: "0.82rem" }}>
                  {isUrdu ? "پورٹل پر موجود فعال افراد" : "Users currently online"}
                </div>
              </div>

              {/* CARD 2: REAL TOTAL VISITS */}
              <div className="analytics-stat-card" style={{ padding: "18px" }}>
                <div style={{ fontSize: "0.85rem", color: "var(--gold-light)", fontWeight: "700" }}>
                  {isUrdu ? "مجموعی وزٹرز" : "Total Visitors"}
                </div>
                <div className="odometer-number" style={{ fontSize: "2.1rem" }}>
                  {lifetimeVisitors.toLocaleString()}+
                </div>
                <div className="analytics-label" style={{ fontSize: "0.82rem" }}>
                  {isUrdu ? "ویب سائٹ کے مجموعی وزٹس" : "Total verified visits"}
                </div>
              </div>

              {/* CARD 3: TODAY VISITS */}
              <div className="analytics-stat-card" style={{ padding: "18px" }}>
                <div style={{ fontSize: "0.85rem", color: "#90caf9", fontWeight: "700" }}>
                  {isUrdu ? "آج کے وزٹرز" : "Today's Visits"}
                </div>
                <div className="odometer-number" style={{ color: "#90caf9", fontSize: "2.1rem" }}>
                  {todayVisitors.toLocaleString()}
                </div>
                <div className="analytics-label" style={{ fontSize: "0.82rem" }}>
                  {isUrdu ? "آج حاصل کی گئی رہنمائی" : "Visits recorded today"}
                </div>
              </div>

              {/* CARD 4: PERSONAL VISIT */}
              <div className="analytics-stat-card" style={{ padding: "18px" }}>
                <div style={{ fontSize: "0.85rem", color: "#ce93d8", fontWeight: "700" }}>
                  {isUrdu ? "آپ کا وزٹ نمبر" : "Your Visit #"}
                </div>
                <div className="odometer-number" style={{ color: "#ce93d8", fontSize: "2.1rem" }}>
                  #{mySessionVisits}
                </div>
                <div className="analytics-label" style={{ fontSize: "0.82rem" }}>
                  {isUrdu ? "خوش آمدید! آپ کا محفوظ کاؤنٹر" : "Your visits on this device"}
                </div>
              </div>
            </div>

            {/* LIVE TICKER */}
            <div className="live-feed-ticker" style={{ marginTop: "18px", padding: "8px 16px", fontSize: "0.85rem" }}>
              <span className="pulse-radar" style={{ margin: 0, width: "8px", height: "8px" }}></span>
              <strong>{isUrdu ? "تازہ ترین سرگرمی:" : "Live:"}</strong>
              <span>{recentLiveActivities[tickerIndex]}</span>
            </div>
          </div>
        </section>


      </main>

      {/* FOOTER */}
      <footer>
        <div className="wrap footer">
          <div className="brand">
            <Image src="/logo.jpg" alt="Farooqi Academy" width={42} height={42} />
            <span>
              <strong>{isUrdu ? "فاروقی آن لائن قرآن اکیڈمی" : "Farooqi Online Quran Academy"}</strong>
              <small>{isUrdu ? "لاہور · پاکستان" : "Lahore · Pakistan"}</small>
            </span>
          </div>
          <p>
            {isUrdu
              ? "تجوید، محبت اور اعتماد کے ساتھ دنیا بھر میں بچوں، خواتین اور بڑوں کے لیے معیاری آن لائن قرآن تعلیم۔"
              : "Quality online Quran education with Tajweed, care and confidence for learners worldwide."}
          </p>
          <div>
            <Link className="language" href={t.otherPath}>
              {t.other}
            </Link>
          </div>
        </div>
      </footer>

      
      {/* ========================================================
          SLEEK FLOATING SIDE DOCK: HARAMAIN 24/7 LIVE STREAM
          ======================================================== */}
      {/* FLOATING TRIGGER BUTTON ON THE SIDE */}
      <button
        type="button"
        className="haramain-floating-btn"
        onClick={() => setIsHaramainSideOpen(!isHaramainSideOpen)}
        aria-label="Toggle Haramain Live Stream"
      >
        <span className="pulse-radar" style={{ margin: 0 }}></span>
        <span>🕋 {isUrdu ? "حرمین شریفین 24/7 لائیو" : "Haramain Live 24/7"}</span>
        <span style={{ fontSize: "0.75rem", opacity: 0.8 }}>{isHaramainSideOpen ? "▼" : "▲"}</span>
      </button>

      {/* COMPACT SIDE DRAWER CARD */}
      {isHaramainSideOpen && (
        <aside className="haramain-side-drawer" aria-label="Haramain Live Side Dock">
          <div className="haramain-side-header">
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="pulse-radar" style={{ margin: 0 }}></span>
              <strong style={{ fontSize: "0.95rem", color: "var(--gold-light)" }}>
                {activeHaramainTab === "makkah-live" ? "مکہ مکرمہ لائیو (المسجد الحرام)" : "مدینہ منورہ لائیو (المسجد النبوی)"}
              </strong>
            </div>
            <button
              type="button"
              className="haramain-side-close"
              onClick={() => setIsHaramainSideOpen(false)}
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* DUAL CHANNEL TOGGLE */}
          <div style={{ display: "flex", background: "#062e24", padding: "6px 10px", gap: "6px" }}>
            <button
              type="button"
              onClick={() => setActiveHaramainTab("makkah-live")}
              style={{
                flex: 1,
                padding: "6px 8px",
                borderRadius: "8px",
                border: 0,
                fontSize: "0.78rem",
                fontWeight: "700",
                cursor: "pointer",
                background: activeHaramainTab === "makkah-live" ? "var(--gold)" : "rgba(255,255,255,0.1)",
                color: activeHaramainTab === "makkah-live" ? "#062e24" : "#ffffff"
              }}
            >
              🕋 مکہ مکرمہ
            </button>
            <button
              type="button"
              onClick={() => setActiveHaramainTab("madinah-live")}
              style={{
                flex: 1,
                padding: "6px 8px",
                borderRadius: "8px",
                border: 0,
                fontSize: "0.78rem",
                fontWeight: "700",
                cursor: "pointer",
                background: activeHaramainTab === "madinah-live" ? "var(--gold)" : "rgba(255,255,255,0.1)",
                color: activeHaramainTab === "madinah-live" ? "#062e24" : "#ffffff"
              }}
            >
              🕌 مدینہ منورہ
            </button>
          </div>

          {/* COMPACT VIDEO WRAPPER */}
          <div className="haramain-video-wrapper" style={{ maxHeight: "215px" }}>
            <iframe
              src={
                activeHaramainTab === "makkah-live"
                  ? "https://www.youtube-nocookie.com/embed/live_stream?channel=UC8h_bA1n0vJ3K8m9N0s0w1A"
                  : "https://www.youtube-nocookie.com/embed/live_stream?channel=UC4_rK2g_uL8d8W6q8x9y0zA"
              }
              title="Haramain Live Stream"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div style={{ padding: "8px 14px", background: "#062e24", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <small style={{ color: "#cfd8dc", fontSize: "0.75rem" }}>
              سعودی ٹی وی 24/7 باضابطہ ایچ ڈی نشریات
            </small>
            <a
              href={
                activeHaramainTab === "makkah-live"
                  ? "https://www.youtube.com/results?search_query=makkah+live+quran+tv"
                  : "https://www.youtube.com/results?search_query=madinah+live+sunnah+tv"
              }
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: "0.75rem", color: "var(--gold-light)", textDecoration: "underline" }}
            >
              یوٹیوب لنک ↗
            </a>
          </div>
        </aside>
      )}


      {/* FLOATING WHATSAPP BUTTON */}
      <a
        className="floating-whatsapp"
        href="https://wa.me/923336519527?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%DB%8C%DA%A9%D9%85!%20%D9%81%D8%A7%D8%B1%D9%88%D9%82%DB%8C%20%D9%82%D8%B1%D8%A2%D9%86%20%D8%A7%DA%A9%DB%8C%DA%88%D9%85%DB%8C%20%D9%85%DB%8C%DA%BA%20%D8%AF%D8%A7%D8%AE%D9%84%DB%92%20%DA%A9%DB%92%20%D8%A8%D8%A7%D8%B1%DB%92%20%D9%85%DB%8C%DA%BA%20%D9%85%D8%B9%D9%84%D9%88%D9%85%D8%A7%D8%AA%20%DA%86%D8%A7%DB%81%DB%8C%DB%92%DB%94"
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
      >
        <svg
          width="30"
          height="30"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.625.846 5.059 2.284 7.033l-1.492 5.448 5.601-1.469c1.912 1.044 4.103 1.638 6.433 1.638 6.627 0 12-5.373 12-12s-5.373-12-12-12z" />
        </svg>
      </a>
    
      {/* ========================================================
          HD WHATSAPP DAWAH GRAPHICS CARD MODAL
          ======================================================== */}
      {dawahModalData && (
        <div className="dawah-modal-overlay" onClick={() => setDawahModalData(null)}>
          <div className="dawah-modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2d7ba", paddingBottom: "12px", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "1.3rem" }}>🎨</span>
                <strong style={{ fontSize: "1.05rem", color: "var(--deep)" }}>
                  واٹس ایپ دعوتی کارڈ جنریٹر (HD Graphics)
                </strong>
              </div>
              <button
                type="button"
                onClick={() => setDawahModalData(null)}
                style={{ background: "none", border: 0, fontSize: "1.2rem", cursor: "pointer", color: "var(--muted)" }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: "0.82rem", color: "var(--muted)", margin: "0 0 14px 0" }}>
              یہ کارڈ فاروقی آن لائن قرآن اکیڈمی کے باضابطہ لوگو، فون نمبرز اور خوبصورت عربی خطاطی کے ساتھ خودکار طور پر تیار کر دیا گیا ہے:
            </p>

            {/* PREVIEW CANVAS */}
            <div style={{ textAlign: "center", background: "#062e24", padding: "16px", borderRadius: "16px", border: "2px solid var(--gold)" }}>
              <canvas
                id="dawahCardCanvas"
                width={800}
                height={800}
                style={{ maxWidth: "100%", height: "auto", borderRadius: "10px", boxShadow: "0 10px 30px rgba(0,0,0,0.4)" }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "16px" }}>
              <button
                type="button"
                onClick={renderAndDownloadDawahCanvas}
                className="btn btn-gold"
                style={{ fontSize: "0.85rem", padding: "10px" }}
              >
                📥 تصویر ڈاؤنلوڈ کریں
              </button>
              <button
                type="button"
                onClick={handleShareWhatsAppDawahImage}
                className="btn btn-primary"
                style={{ background: "#25d366", borderColor: "#25d366", fontSize: "0.85rem", padding: "10px" }}
              >
                💬 واٹس ایپ پر بھیجیں
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
