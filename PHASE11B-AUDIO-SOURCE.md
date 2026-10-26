# Phase 11B — Audio source verification

Online research found a source suitable for legal reuse:

- Qamar Apps publishes Al Qaida Al Nooraniya / Noorani Qaida.
- The app uses professionally recorded audio by Mufti Mohammed Ghiyas Mohiuddin.
- Qamar Apps states the publication is licensed under CC BY-SA 4.0.
- HifzPal independently states that its 75 bundled Qaida drill recordings are from Qamar Apps and remain CC BY-SA 4.0.

## Why the ZIP does not silently contain copied binaries

The public source pages verify the license and attribution, but they do not expose stable direct per-clip MP3 URLs in the pages available to this build environment. Therefore the package does not pretend to contain audio files that were not actually retrieved.

Instead this version contains:
- attribution/license files,
- a complete audio mapping layer,
- an APK audio extractor,
- a folder importer,
- a 17-lesson Qaida engine ready to consume verified clips.

If you download the HifzPal/Qamar app package to your PC, run:

```powershell
.\scripts\extract-audio-from-apk.ps1 -ApkPath "C:\Path\to\app.apk"
```

Then inspect/match the copied clips and rename/map them in `lib/qaidaAudio.ts`.

Because the source license is ShareAlike, keep the attribution and license notice with distributed audio derivatives.
