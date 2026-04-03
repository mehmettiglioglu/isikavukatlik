export default function HeroSection() {
  return (
    <section
      aria-label="Işık Hukuk Bürosu tanıtım videosu"
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Masaüstü / tablet yatay video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="/justice.jpg"
        className="absolute left-1/2 top-1/2 hidden min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 md:block"
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
        className="absolute left-1/2 top-1/2 block min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 md:hidden"
      >
        <source src="/isik-hukuk-dikey.mp4" type="video/mp4" />
      </video>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
