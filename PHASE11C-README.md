# Phase 11C — User-supplied APK Audio Integration

The supplied APK was inspected successfully.

- APK: `android-comqpmadaniqaidanooranikidslearningholyquran-10.apk`
- MP3 files found: **426**
- Extracted location in this package:
  `public/audio/qaida/source-app/`
- Original APK filenames are preserved.
- `audio-manifest.json` lists every extracted MP3.

## Important mapping policy

This package intentionally maps only filenames that are reasonably obvious from the APK names.
Some transliterations are ambiguous (for example heavy letters and similar Arabic sounds), so those clips should be listened to and verified by a qualified teacher before production use.

## Install

Copy these folders into the project root:

- `public/audio/qaida/source-app/`
- `lib/qaidaAudio.ts`

If Phase 11B is already installed, this replaces its `lib/qaidaAudio.ts`.

Then run:

```powershell
npm run build
```

## Current mapped examples

- alif.mp3
- baa.mp3
- taa.mp3
- geem.mp3
- khaa.mp3
- daal.mp3
- zaal.mp3
- seen.mp3
- sheen.mp3
- saad.mp3
- zaad.mp3
- qaaf.mp3
- kaaf.mp3
- laam.mp3
- meem.mp3
- noon.mp3
- yaa.mp3
- zaraba.mp3

## Next

Teacher-verification pass:
1. Play each candidate clip.
2. Confirm exact Arabic target.
3. Update `lib/qaidaAudio.ts`.
4. Then wire the verified clips into the full Qaida curriculum.
