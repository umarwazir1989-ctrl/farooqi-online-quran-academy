export const QAIDA_AUDIO_BASE = "/audio/qaida/source-app";

const AUDIO_MAP: Record<string, string> = {
  alif: "alif.mp3",
  baa: "baa.mp3",
  taa: "taa.mp3",
  thaa: "saa.mp3",
  jeem: "geem.mp3",
  haa_halq: "haa.mp3",
  khaa: "khaa.mp3",
  daal: "daal.mp3",
  dhaal: "zaal.mp3",
  raa: "raa1.mp3",
  zay: "zayi1.mp3",
  seen: "seen.mp3",
  sheen: "sheen.mp3",
  saad: "saad.mp3",
  daad: "zaad.mp3",
  ain: "aaen.mp3",
  ghain: "gaen.mp3",
  faa: "faa.mp3",
  qaaf: "qaaf.mp3",
  kaaf: "kaaf.mp3",
  laam: "laam.mp3",
  meem: "meem.mp3",
  noon: "noon.mp3",
  waaw: "waaweewoo.mp3",
  haa: "ha1.mp3",
  yaa: "yaa.mp3",

  // Common harakah / drill examples found in the APK:
  taa_long: "taateetoo.mp3",
  faa_long: "faafeefoo.mp3",
  haa_long: "haaheehoo.mp3",
  khaa_drill: "khaa1.mp3",
  ghain_drill: "ghagheghoo.mp3",
  yaa_long: "yaayeeyoo.mp3",
  waaw_long: "waaweewoo.mp3",

  // Word example used in prototype:
  daraba: "zaraba.mp3",
};

export function qaidaAudioUrl(key?: string) {
  if (!key) return null;
  const file = AUDIO_MAP[key];
  return file ? `${QAIDA_AUDIO_BASE}/${file}` : null;
}

export const QAIDA_SOURCE_NOTE =
  "Audio extracted from the APK supplied by the user. Filenames are preserved from res/raw. Only obvious mappings are enabled; ambiguous clips should be teacher-verified before use.";
