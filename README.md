# Farooqi Online Quran Academy — English Primary + Urdu

یہ مکمل Next.js App Router پروجیکٹ ہے، جو GitHub کے ذریعے Vercel پر deploy ہونے کے لیے تیار ہے۔

## شامل خصوصیات

- مرکزی English ویب سائٹ `/en` اور ثانوی اردو ویب سائٹ `/ur`
- روٹ `/` خودکار طور پر `/en` پر منتقل ہوتا ہے
- مکمل RTL/LTR support
- responsive mobile navigation
- SEO metadata, Open Graph, sitemap اور robots
- Free Trial form
- فارم submit ہونے کے بعد WhatsApp message تیار
- accessibility labels اور keyboard focus
- Vercel-ready API route

## 1) کمپیوٹر پر چلائیں

Node.js 20.9 یا اس سے جدید ورژن نصب کریں، پھر پروجیکٹ فولڈر میں Terminal کھولیں:

```bash
npm install
npm run dev
```

Browser میں کھولیں:

```text
http://localhost:3000
```

Production build چیک کریں:

```bash
npm run build
```

## 2) اپنی معلومات تبدیل کریں

اہم مواد یہاں ہے:

```text
components/AcademySite.tsx
```

فون، ای میل، کورسز، فیس پلان، اردو اور English متن اسی فائل میں تبدیل کریں۔

لوگو:

```text
public/logo.jpg
```

## 3) Environment Variables

`.env.example` کی copy بنا کر `.env.local` نام رکھیں:

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_WHATSAPP_NUMBER=923336519527
CONTACT_RECEIVER_EMAIL=umarwazir1989@gmail.com
```

WhatsApp نمبر country code کے ساتھ لکھیں، مگر `+` نہ لگائیں۔

## 4) GitHub پر اپلوڈ

GitHub پر نیا خالی repository بنائیں، مثلاً:

```text
farooqi-online-quran-academy
```

پھر اس فولڈر کے Terminal میں:

```bash
git init
git add .
git commit -m "Initial bilingual Quran academy website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/farooqi-online-quran-academy.git
git push -u origin main
```

`YOUR-USERNAME` کو اپنے GitHub username سے تبدیل کریں۔

## 5) Vercel پر Live کریں

1. Vercel میں GitHub کے ذریعے sign in کریں۔
2. **Add New → Project** منتخب کریں۔
3. GitHub repository import کریں۔
4. Framework خود **Next.js** detect ہوگا۔
5. Environment Variables میں `.env.example` والی values شامل کریں۔
6. **Deploy** دبائیں۔

ہر نئی GitHub push کے بعد Vercel خود نئی deployment کرے گا۔

## 6) Custom Domain

Vercel project میں:

```text
Settings → Domains → Add Domain
```

اپنا domain شامل کریں اور Vercel کی دی ہوئی DNS records domain provider میں لگائیں۔ SSL/HTTPS خود فعال ہوگا۔

## فارم کے متعلق اہم نوٹ

موجودہ API route درخواست کو Vercel logs میں دکھاتا ہے اور فوراً WhatsApp کھول دیتا ہے۔ مستقل database، email یا Google Sheet کے لیے `app/api/contact/route.ts` میں Supabase یا Resend جوڑا جا سکتا ہے۔
