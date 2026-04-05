export default function HeroSection() {
  return (
    <section
      aria-label="Işık Hukuk Bürosu tanıtım videosu"
      className="relative h-dvh w-full overflow-hidden bg-black"
    >
      {/* Masaüstü / tablet yatay video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="/justice.jpg"
        className="absolute inset-0 hidden h-full w-full object-cover md:block"
      >
        <source src="/isik-hukuk.mp4" type="video/mp4" />
      </video>

      {/* Mobil dikey video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="/justice.jpg"
        className="absolute inset-0 block h-full w-full object-cover md:hidden"
      >
        <source src="/isik-hukuk-dikey.mp4" type="video/mp4" />
      </video>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white/80 to-transparent" />
    </section>
  );
}
