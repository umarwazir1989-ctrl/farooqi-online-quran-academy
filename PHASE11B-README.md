# Phase 11B — Digital Quran Teacher

This phase expands Phase 11A into a structured 17-lesson Noorani Qaida engine.

## Included

- 17 lesson index
- dynamic lesson route `/portal/student/qaida/[slug]`
- reusable lesson player
- audio mapping layer
- Qamar Apps CC BY-SA attribution
- HifzPal/Qamar audio extraction helper
- real-reciter-only policy
- responsive UI

## Audio research result

Qamar Apps' Noorani Qaida / Al Qaida Al Nooraniya is published under CC BY-SA 4.0.
Its audio is recited by Mufti Mohammed Ghiyas Mohiuddin.
HifzPal states that it bundles 75 of those drill recordings and keeps them under CC BY-SA 4.0.

## Install

Copy all project folders into your project root.

Append:

`phase11b-qaida.css`

to:

`app/globals.css`

Then:

```powershell
npm run build
```

## Import licensed audio from a downloaded APK

If you have a legally obtained HifzPal/Qamar APK:

```powershell
.\scripts\extract-audio-from-apk.ps1 -ApkPath "C:\Path\to\app.apk"
```

This extracts audio to `public/audio/qaida/qamar`.

Because APK asset filenames may not match our semantic names, inspect the clips and map them in `lib/qaidaAudio.ts`.

## License

Any Qamar audio included in your build remains CC BY-SA 4.0.
Keep `public/audio/qaida/qamar/ATTRIBUTION.txt`.
