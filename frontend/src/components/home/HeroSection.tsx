export default function HeroSection() {
  return (
    <section
      aria-label="Işık Hukuk Bürosu tanıtım videosu"
      className="relative h-screen w-full overflow-hidden"
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="/justice.jpg"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/isik-hukuk.mp4" type="video/mp4" />
      </video>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
