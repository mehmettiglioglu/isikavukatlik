import { motion } from "framer-motion";
import { GraduationCap, Scale, Award, Users } from "lucide-react";
import { fadeUp, staggerContainer } from "@/components/ui/MotionDiv";
import PageHead from "@/components/seo/PageHead";

export default function HakkimizdaPage() {
  const partners = [
    {
      name: "Av. Mustafa Çağatay IŞIK",
      university: "Çankaya Üniversitesi Hukuk Fakültesi",
      since: "2014",
      description:
        "2014 yılından bu yana Konya'da serbest avukatlık yapmaktadır. İş hukuku, ticaret hukuku ve icra-iflas hukuku alanlarında yoğunlaşmaktadır.",
    },
    {
      name: "Av. Havva Nur IŞIK",
      university: "Ankara Üniversitesi Hukuk Fakültesi",
      since: "2018",
      description:
        "2018 yılından bu yana Konya'da serbest avukatlık yapmaktadır. Aile hukuku, gayrimenkul hukuku ve tüketici hukuku alanlarında yoğunlaşmaktadır.",
    },
  ];

  const values = [
    { icon: Scale, title: "Hukukun Üstünlüğü", description: "Her davada hukuki gerçeği esas alarak müvekkillerimizin haklarını en etkin biçimde savunuyoruz." },
    { icon: Users, title: "Müvekkil Odaklılık", description: "Her müvekkilin durumunu bireysel olarak değerlendiriyor, ihtiyaca özgü çözümler üretiyoruz." },
    { icon: Award, title: "Mesleki Etik", description: "Barolar Birliği'nin meslek kurallarına sıkı bağlılık ve şeffaf iletişim temel çalışma ilkemizdir." },
    { icon: GraduationCap, title: "Sürekli Gelişim", description: "Hukuktaki güncel gelişmeleri yakından takip ederek müvekkillerimize en güncel danışmanlığı sunuyoruz." },
  ];

  return (
    <main>
      <PageHead
        title="Hakkımızda"
        description="Konya'da faaliyet gösteren Işık Hukuk Bürosu hakkında bilgi edinin."
        canonical="/hakkimizda"
      />
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy py-24">
        <div className="absolute inset-0 z-0">
          <img src="/justice3.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-15" />
          <div className="absolute inset-0 bg-linear-to-r from-navy/90 to-navy/60" />
        </div>
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mb-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold">
              <span className="h-px w-6 bg-gold" aria-hidden="true" />
              Kurumsal
            </p>
            <h1 className="font-serif text-5xl font-light leading-snug text-white">
              Işık Hukuk Bürosu
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-300">
              Konya'da faaliyet gösteren büromuz, Konya ili başta olmak üzere Türkiye genelinde
              hukuki danışmanlık, dava takibi ve avukatlık hizmetini sunan saygın bir hukuk
              bürosudur.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Açıklama */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="mb-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-gold">
                <span className="h-px w-6 bg-gold" aria-hidden="true" />
                Kimiz
              </p>
              <h2 className="font-serif text-3xl font-light text-navy leading-snug">
                Hukukta Güvenilir<br />Bir Ortak
              </h2>
              <div className="mt-6 space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Konya'da faaliyet gösteren Işık Hukuk Bürosu, Konya ili başta olmak üzere
                  Türkiye genelinde hukuki danışmanlık, dava takibi ve avukatlık hizmetini sunan
                  saygın bir hukuk bürosudur.
                </p>
                <p>
                  İş Hukuku, İcra ve İflas Hukuku, Tazminat Hukuku, Gayrimenkul Hukuku, Kira
                  Hukuku, Boşanma ve Aile Hukuku, Tüketici Hukuku, Yabancılar Hukuku gibi
                  hukukun farklı alanlarında profesyonel danışmanlık ve temsil hizmeti
                  sunmaktayız.
                </p>
                <p>
                  Büromuzun temel ilkesi; müvekkillerimizin hukuki ihtiyaçlarını doğru şekilde
                  analiz ederek onlar için en uygun çözümleri sunmak ve en etkili şekilde sonuç
                  almayı sağlamaktır.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="relative aspect-4/3 overflow-hidden">
                <img
                  src="/justice2.jpg"
                  alt="Hukuk bürosu"
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-linear-to-t from-navy/60 via-navy/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="font-serif text-base font-light italic leading-relaxed text-white/90">
                    "Müvekkillerimizin haklarını en etkin biçimde korumak temel görevimizdir."
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-widest text-gold">Işık Hukuk Bürosu</p>
                </div>
              </div>
              <div aria-hidden="true" className="absolute -bottom-3 -right-3 h-2/3 w-2/3 border-b-2 border-r-2 border-gold/35 -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Kurucu Ortaklar */}
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-5xl px-6">
          <motion.header initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-12">
            <p className="mb-3 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-gold">
              <span className="h-px w-6 bg-gold" aria-hidden="true" />
              Ekibimiz
            </p>
            <h2 className="font-serif text-3xl font-light text-navy">Kurucu Ortaklar</h2>
          </motion.header>

          <motion.div className="grid gap-8 sm:grid-cols-2" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
            {partners.map((partner) => (
              <motion.div key={partner.name} variants={fadeUp} className="bg-white p-8 border-l-2 border-gold">
                <div className="mb-4 flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-navy/5">
                    <Scale size={20} className="text-gold" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-medium text-navy">{partner.name}</h3>
                    <p className="mt-1 text-xs text-gold uppercase tracking-wider">
                      Kurucu Ortak · {partner.since}'den beri
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3 text-sm text-gray-500">
                  <GraduationCap size={14} className="text-gold shrink-0" />
                  {partner.university}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{partner.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* İlkelerimiz */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-6">
          <motion.header initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-12">
            <p className="mb-3 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-gold">
              <span className="h-px w-6 bg-gold" aria-hidden="true" />
              Değerlerimiz
            </p>
            <h2 className="font-serif text-3xl font-light text-navy">Çalışma İlkelerimiz</h2>
          </motion.header>

          <motion.div className="grid gap-6 sm:grid-cols-2" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
            {values.map(({ icon: Icon, title, description }) => (
              <motion.div key={title} variants={fadeUp} className="flex items-start gap-4 p-6 border border-gray-100 hover:border-gold/30 transition-colors">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-surface">
                  <Icon size={18} className="text-gold" />
                </div>
                <div>
                  <h3 className="font-medium text-navy">{title}</h3>
                  <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">{description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </main>
  );
}
