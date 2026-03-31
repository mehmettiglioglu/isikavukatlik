import type { ComponentType } from "react";
import { KidemTazminati, IhbarTazminati, YillikIzin } from "./IsHukukuCalc";
import { NafakaTahmini, MirasPaylasimi } from "./AileHukukuCalc";
import { IcraGiderleri, GecikmeGaizi, VekaletUcreti } from "./IcraFinansCalc";
import { AdliParaCezasi, KiraArtis } from "./CezaHukukuCalc";
import { IsKazasiTazminati, TrafikTazminati, AracDegerKaybi } from "./TazminatCalc";
import { IslahHarci, ETebligat } from "./EkCalc";

export const CALC_COMPONENT_MAP: Record<string, ComponentType> = {
  "kidem-tazminati":    KidemTazminati,
  "ihbar-tazminati":    IhbarTazminati,
  "yillik-izin":        YillikIzin,
  "is-kazasi-tazminati": IsKazasiTazminati,
  "nafaka":             NafakaTahmini,
  "miras-paylasimi":    MirasPaylasimi,
  "icra-masrafi":       IcraGiderleri,
  "gecikme-faizi":      GecikmeGaizi,
  "vekalet-ucreti":     VekaletUcreti,
  "islah-harci":        IslahHarci,
  "trafik-tazminati":   TrafikTazminati,
  "arac-deger-kaybi":   AracDegerKaybi,
  "adli-para-cezasi":   AdliParaCezasi,
  "kira-artis":         KiraArtis,
  "e-tebligat":         ETebligat,
};
