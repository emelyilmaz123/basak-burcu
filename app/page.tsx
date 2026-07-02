"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

/* ── Yıldız + Kayan Yıldız Arka Planı ── */
function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const stars = Array.from({ length: 250 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 1.8 + 0.3,
      speed: Math.random() * 0.12 + 0.04,
      twinkle: Math.random() * Math.PI * 2,
      color: Math.random() > 0.8 ? "167,139,250" : "240,208,96",
    }));

    type Shooter = { x: number; y: number; vx: number; vy: number; life: number; maxLife: number };
    const shooters: Shooter[] = [];
    let frame = 0;

    const spawnShooter = () => {
      const angle = (Math.random() * 30 + 15) * Math.PI / 180;
      const speed = Math.random() * 12 + 8;
      shooters.push({
        x: Math.random() * canvas.width * 0.7,
        y: Math.random() * canvas.height * 0.4,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0, maxLife: 60,
      });
    };

    const draw = () => {
      frame++;
      ctx.fillStyle = "rgba(13,5,32,0.3)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Yıldızlar
      for (const s of stars) {
        s.twinkle += 0.025;
        const opacity = 0.4 + 0.6 * Math.sin(s.twinkle);
        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 3);
        g.addColorStop(0, `rgba(${s.color},${opacity})`);
        g.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.fillStyle = g;
        ctx.arc(s.x, s.y, s.size * 3, 0, Math.PI * 2);
        ctx.fill();
        s.y += s.speed;
        if (s.y > canvas.height) { s.y = 0; s.x = Math.random() * canvas.width; }
      }

      // Kayan yıldızlar
      if (frame % 120 === 0) spawnShooter();
      for (let i = shooters.length - 1; i >= 0; i--) {
        const sh = shooters[i];
        const progress = sh.life / sh.maxLife;
        const opacity = progress < 0.3 ? progress / 0.3 : 1 - (progress - 0.3) / 0.7;
        const tailLen = 80;
        const grad = ctx.createLinearGradient(
          sh.x - sh.vx * tailLen / sh.maxLife * sh.life,
          sh.y - sh.vy * tailLen / sh.maxLife * sh.life,
          sh.x, sh.y
        );
        grad.addColorStop(0, "transparent");
        grad.addColorStop(1, `rgba(240,220,120,${opacity * 0.9})`);
        ctx.beginPath();
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.moveTo(sh.x - sh.vx * 5, sh.y - sh.vy * 5);
        ctx.lineTo(sh.x, sh.y);
        ctx.stroke();
        // Baş parlak nokta
        const hg = ctx.createRadialGradient(sh.x, sh.y, 0, sh.x, sh.y, 4);
        hg.addColorStop(0, `rgba(255,240,180,${opacity})`);
        hg.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.fillStyle = hg;
        ctx.arc(sh.x, sh.y, 4, 0, Math.PI * 2);
        ctx.fill();
        sh.x += sh.vx; sh.y += sh.vy; sh.life++;
        if (sh.life >= sh.maxLife) shooters.splice(i, 1);
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
}

/* ── Scroll Animasyonu ── */
const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: "easeOut" as const },
  }),
};

/* ── Veri ── */
const traits = [
  { icon: "🔬", title: "Analitik", desc: "Her şeyi detaylıca inceler, mantıksal sonuçlara ulaşır." },
  { icon: "⚡", title: "Çalışkan", desc: "Hedeflerine ulaşmak için hiç yorulmadan çalışır." },
  { icon: "🎯", title: "Mükemmeliyetçi", desc: "En iyisini yapmak için sürekli kendini zorlar." },
  { icon: "🌿", title: "Pratik", desc: "Hayallerini gerçekçi adımlarla hayata geçirir." },
  { icon: "🤝", title: "Güvenilir", desc: "Söz verdiğinde tutar, her zaman yanında olur." },
  { icon: "📚", title: "Bilgisever", desc: "Öğrenmekten, araştırmaktan asla vazgeçmez." },
];

const strengths = [
  "Detayları kaçırmaz, her şeyi titizlikle yapar",
  "Güçlü analitik düşünce yeteneği",
  "Her koşulda güvenilir ve sadık",
  "Sorunlara pratik ve akılcı çözümler üretir",
  "Sağlıklı yaşama büyük önem verir",
  "Organizasyon ve planlama konusunda üstün",
];

const weaknesses = [
  "Kendine ve çevresine aşırı eleştirel",
  "Mükemmeliyetçilik bazen hareketsizliğe iter",
  "Endişe ve kaygıya yatkın yapı",
  "Değişime direnç gösterebilir",
  "Başkalarının hatalarını bağışlamakta zorlanır",
  "Aşırı analize girip kararsız kalabilir",
];

const compatible = [
  { sign: "♉ Boğa", level: 95, color: "#4ade80" },
  { sign: "♑ Oğlak", level: 90, color: "#4ade80" },
  { sign: "♋ Yengeç", level: 80, color: "#facc15" },
  { sign: "♏ Akrep", level: 75, color: "#facc15" },
  { sign: "♐ Yay", level: 35, color: "#f87171" },
  { sign: "♊ İkizler", level: 30, color: "#f87171" },
];

const careers = [
  {
    role: "Doktor / Hemşire", icon: "⚕️",
    detail: "Aile hekimliği, dahiliye veya cerrahi — titizliği ve empatiyle hasta bakımında mükemmelleşir.",
  },
  {
    role: "Bilim İnsanı", icon: "🔭",
    detail: "Biyolog, kimyager veya fizikçi olarak araştırma laboratuvarlarında parlar; detay odaklı yapısıyla en karmaşık verileri çözer.",
  },
  {
    role: "Muhasebeci", icon: "📊",
    detail: "Mali müşavir veya denetçi olarak rakamlar arasında kaybolmaz; hata payını sıfıra indirir.",
  },
  {
    role: "Editör / Yazar", icon: "✍️",
    detail: "İçerik editörü, gazeteci veya yazar olarak kelimelerle ustalıkla oynar; en küçük dil hatasını bile yakalar.",
  },
  {
    role: "Araştırmacı", icon: "🔍",
    detail: "Akademisyen, pazar araştırmacısı veya veri analisti olarak derinlemesine inceler; yüzeyin altındaki gerçeği bulur.",
  },
  {
    role: "Mühendis", icon: "⚙️",
    detail: "Yazılım, makine veya biyomedikal mühendisliğinde — sistematik düşüncesiyle karmaşık sorunlara zarif çözümler üretir.",
  },
  {
    role: "Psikolog", icon: "🧠",
    detail: "Terapist veya danışman olarak insan davranışını analiz eder; dinleme yeteneği ve sabrıyla güven yaratır.",
  },
  {
    role: "Veteriner", icon: "🐾",
    detail: "Hayvanlara duyduğu sevgi ve titiz muayene becerisiyle hem klinik hem de araştırma alanında öne çıkar.",
  },
];

/* ── Günlük Yorum Verisi ── */
const dailyPool = {
  genel: [
    "Bugün sezgilerinize güvenin. Mantığınız sizi doğru yöne yönlendirecek; küçük detaylar büyük farklar yaratacak.",
    "Bir miktar karmaşa sizi bunaltabilir. Öncelikleri belirleyin ve adım adım ilerleyin; panik değil plan.",
    "Yeni bilgiler öğrenmek için mükemmel bir gün. Merakınızı serbest bırakın, zihniniz bugün çok açık.",
    "Çevrenizdekilere yardım etme isteğiniz güçlü ama önce kendinize bakın; boş bir kap dolduramaz.",
    "İç sesinizi dinleyin; aradığınız cevap düşündüğünüzden çok daha yakın.",
    "Sabırsızlık tuzağına düşmeyin. Her şeyin zamanı var, aceleniz sizi yanıltmasın.",
    "Bugün farkına varmadan insanlara ilham veriyorsunuz. Sessiz gücünüzü hafife almayın.",
  ],
  ask: [
    "Sevdiğinize küçük ama anlamlı bir jest yapın bugün; büyük jestler değil, gerçek dikkat önemlidir.",
    "Duygularınızı ifade etmek bugün normalden kolay. O sözleri söyleme vaktiniz geldi.",
    "Yeni bir tanışıklık beklenmedik bir yerde gelişebilir. Açık olun, kendinizi kapatmayın.",
    "İlişkinizde açık iletişim bugün her şeyi çözebilir. Varsayımlarla değil, kelimelerle konuşun.",
    "Geçmişteki bir kırgınlığı bırakmak için doğru an; affetmek onlar için değil, sizin için.",
    "Partnerinizle kaliteli zaman geçirmek için ideal bir gün. Telefonu bırakın, gerçekten orada olun.",
    "Kendinizi önce sevmeyi unutmayın; huzur içten dışa akar.",
  ],
  kariyer: [
    "Uzun süredir beklediğiniz bir fırsat kapınızı çalabilir. Hazırlıklı olun, şans hazıra gelir.",
    "Ekip çalışması bugün tek başına çalışmaktan çok daha verimli. Güvenin ve iş bölümü yapın.",
    "Detaylı bir analiz yapmanız gereken bir karar karşınıza çıkacak. Aceleden kaçının.",
    "Yaratıcılığınızı işe katın; sıradan çözümler bugün yetmeyecek, farklı düşünün.",
    "Sabırlı olun; emeğinizin karşılığı gecikmeli de olsa kesinlikle gelecek.",
    "Bir meslektaşınızdan gelen geri bildirim sizi şaşırtabilir. Dinleyin, savunmacı olmayın.",
    "Bugün bir projeyi tamamlamak için güçlü bir enerji var. O son adımı atın.",
  ],
  saglik: [
    "Bolca su içmeyi ve kısa molalar vermeyi unutmayın. Bedeniniz bunları hak ediyor.",
    "Doğada geçireceğiniz 20 dakika bile enerjinizi tamamen yenileyecek.",
    "Stres yönetimine odaklanın; derin nefes egzersizleri düşündüğünüzden çok işe yarar.",
    "Uyku düzeninize dikkat edin; vücut onarım için zamana ihtiyaç duyuyor.",
    "Hafif bir egzersiz hem bedeninize hem zihninize iyi gelecek. Küçük bir yürüyüş bile yeterli.",
    "Dijital detoks zamanı. Ekrandan uzaklaşmak zihni düşündüğünüzden hızlı dinlendiriyor.",
    "Sağlıklı beslenme bugün normalden daha önemli. Vücudunuz size mesaj veriyor, dinleyin.",
  ],
  tavsiye: [
    "Mükemmeli beklerken iyiyi kaçırmayın.",
    "Her şeyi kontrol etmeye çalışmak yorucu; bazı şeyleri akışına bırakın.",
    "Bugün 'hayır' demek de bir güçtür.",
    "Şükran listesi yazmak perspektifinizi tamamen değiştirebilir.",
    "Bir şeyi erteliyorsanız, işte bugün başlama günü.",
    "Kendinize karşı nazik olun; hata yapmak insani.",
    "Küçük adımlar, büyük hedeflere götürür.",
  ],
  sayi: [3, 6, 7, 14, 17, 22, 25, 33],
  renk: ["Zeytin Yeşili", "Lacivert", "Altın Sarısı", "Gri", "Kahverengi", "Bej", "Koyu Yeşil"],
  enerji: [6, 7, 8, 9, 7, 8, 6, 9, 8, 7],
};

function getDailyContent() {
  const today = new Date();
  const day = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  return {
    genel:   dailyPool.genel[day % dailyPool.genel.length],
    ask:     dailyPool.ask[( day + 1) % dailyPool.ask.length],
    kariyer: dailyPool.kariyer[(day + 2) % dailyPool.kariyer.length],
    saglik:  dailyPool.saglik[(day + 3) % dailyPool.saglik.length],
    tavsiye: dailyPool.tavsiye[(day + 4) % dailyPool.tavsiye.length],
    sayi:    dailyPool.sayi[day % dailyPool.sayi.length],
    renk:    dailyPool.renk[day % dailyPool.renk.length],
    enerji:  dailyPool.enerji[day % dailyPool.enerji.length],
    tarih:   today.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }),
  };
}

const famous = [
  "Beyoncé", "Michael Jackson", "Freddie Mercury",
  "Keanu Reeves", "Zendaya", "Tim Burton",
  "Mother Teresa", "Warren Buffett",
];

/* ── Ana Sayfa ── */
export default function Home() {
  const [glitch, setGlitch] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const t = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 300);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => setMouse({
      x: (e.clientX - window.innerWidth / 2) / window.innerWidth,
      y: (e.clientY - window.innerHeight / 2) / window.innerHeight,
    });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="relative min-h-screen">
      <StarField />

      {/* Nebula arka plan */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="blob absolute top-1/4 left-1/6 w-[600px] h-[600px] rounded-full bg-purple-900/25 blur-[130px]" />
        <div className="blob absolute bottom-1/4 right-1/6 w-[500px] h-[500px] rounded-full bg-emerald-900/20 blur-[110px]" style={{ animationDelay: "4s" }} />
        <div className="blob absolute top-2/3 left-1/2 w-[400px] h-[400px] rounded-full bg-indigo-900/20 blur-[100px]" style={{ animationDelay: "8s" }} />
        <div className="blob absolute top-1/2 right-1/3 w-[350px] h-[350px] rounded-full bg-violet-900/15 blur-[90px]" style={{ animationDelay: "2s" }} />
      </div>

      {/* ── HERO ── */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">

        {/* Yüzen burç sembolleri */}
        {["♈","♉","♊","♋","♌","♎","♏","♐","♑","♒","♓"].map((z, i) => (
          <div
            key={z}
            className="drift absolute select-none pointer-events-none text-[#c8a951]/20 text-2xl"
            style={{
              left: `${5 + (i * 9) % 90}%`,
              top: `${10 + (i * 13) % 80}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${7 + (i % 4)}s`,
              fontSize: `${1.2 + (i % 3) * 0.4}rem`,
            }}
          >
            {z}
          </div>
        ))}

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }}
          className="retro text-[#c8a951]/40 text-sm tracking-[4px] mb-10"
        >
          ✦ ASTRAL ARŞİVLER · BURÇ ANALİZ SİSTEMİ v2.3 ✦
        </motion.p>

        {/* Dönen halka + sembol — parallax */}
        <div
          className="relative mb-8"
          style={{ transform: `translate(${mouse.x * 20}px, ${mouse.y * 20}px)`, transition: "transform 0.08s ease-out" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, type: "spring" }}
            className="relative inline-flex items-center justify-center"
          >
            {/* Dönen dış halka */}
            <div
              className="absolute w-48 h-48 rounded-full border border-[#c8a951]/20 spin-slow"
              style={{ borderStyle: "dashed" }}
            />
            <div
              className="absolute w-36 h-36 rounded-full border border-[#c8a951]/10 spin-slow"
              style={{ animationDirection: "reverse", borderStyle: "dotted" }}
            />
            {/* Sembol */}
            <span
              className="text-9xl float pulse-glow select-none"
              style={{ fontFamily: "Georgia, serif", lineHeight: 1 }}
            >
              ♍
            </span>
          </motion.div>
        </div>

        {/* Başlık */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className={`text-[5rem] md:text-[8rem] font-bold tracking-[16px] gold-shimmer mb-4 ${glitch ? "glitch" : ""}`}
          style={{ fontFamily: "Playfair Display, Georgia, serif" }}
        >
          BAŞAK
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
          className="retro text-[#c8a951]/70 text-lg tracking-[6px] mb-6"
        >
          ── 23 AĞUSTOS · 22 EYLÜL ──
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}
          className="text-[#e8d5a3]/90 text-lg max-w-lg leading-relaxed mb-12 italic"
        >
          Toprak elementinin en titiz, en analitik ruhu.
          Merkür&apos;ün rehberliğinde mükemmelliği arayan gizli kahraman.
        </motion.p>

        {/* Info kartları */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {[
            ["Element", "♁ Toprak"],
            ["Gezegen", "☿ Merkür"],
            ["Renk", "◈ Yeşil · Kahve"],
            ["Taş", "◇ Safir"],
          ].map(([label, value]) => (
            <div key={label} className="card px-5 py-3 rounded-lg text-center">
              <div className="retro text-[#c8a951]/45 text-sm tracking-widest">{label}</div>
              <div className="retro text-[#e8d5a3] text-sm mt-1">{value}</div>
            </div>
          ))}
        </motion.div>

        <motion.div
          animate={{ opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 2, repeat: Infinity, delay: 2.5 }}
          className="absolute bottom-10 retro text-[#c8a951]/50 text-sm tracking-[4px]"
        >
          ↓ KAYDIR ↓
        </motion.div>
      </section>

      {/* ── GÜNLÜK YORUM ── */}
      {(() => {
        const d = getDailyContent();
        return (
          <section className="relative z-10 py-24 px-6 max-w-5xl mx-auto">
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="section-divider"
            >
              <span className="retro text-[#c8a951] text-3xl tracking-widest">GÜNLÜK YORUM</span>
            </motion.div>

            {/* Tarih başlığı */}
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="card rounded-2xl p-8 mb-6 text-center"
            >
              <div className="retro text-[#c8a951]/50 text-sm tracking-[4px] mb-2">♍ BUGÜN · {d.tarih}</div>
              <p className="text-[#e8d5a3] text-base leading-relaxed italic max-w-2xl mx-auto">{d.genel}</p>
            </motion.div>

            {/* 4 kategori */}
            <div className="grid sm:grid-cols-2 gap-5 mb-6">
              {[
                { icon: "💖", label: "AŞK", text: d.ask },
                { icon: "💼", label: "KARİYER", text: d.kariyer },
                { icon: "🌿", label: "SAĞLIK", text: d.saglik },
                { icon: "✨", label: "GÜNÜN TAVSİYESİ", text: d.tavsiye },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="card rounded-xl p-6"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="retro text-[#c8a951] text-sm tracking-widest">{item.label}</span>
                  </div>
                  <p className="text-[#e8d5a3]/90 text-base leading-relaxed">{item.text}</p>
                </motion.div>
              ))}
            </div>

            {/* Şanslı bilgiler + enerji */}
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="card rounded-xl p-6"
            >
              <div className="grid sm:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="retro text-[#c8a951]/50 text-sm tracking-widest mb-1">ŞANSLI SAYI</div>
                  <div className="retro text-[#f0d060] text-4xl">{d.sayi}</div>
                </div>
                <div className="text-center">
                  <div className="retro text-[#c8a951]/50 text-sm tracking-widest mb-1">ŞANSLI RENK</div>
                  <div className="retro text-[#e8d5a3] text-xl mt-1">{d.renk}</div>
                </div>
                <div className="text-center">
                  <div className="retro text-[#c8a951]/50 text-sm tracking-widest mb-2">ENERJİ SEVİYESİ</div>
                  <div className="retro text-[#e8d5a3] text-xl mb-2">{d.enerji} / 10</div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${d.enerji * 10}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-[#c8a951] to-[#f0d060]"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </section>
        );
      })()}

      {/* ── KİŞİLİK ÖZELLİKLERİ ── */}
      <section className="relative z-10 py-24 px-6 max-w-5xl mx-auto">
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="section-divider"
        >
          <span className="retro text-[#c8a951] text-3xl tracking-widest">KİŞİLİK ÖZELLİKLERİ</span>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {traits.map((t, i) => (
            <motion.div
              key={t.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="card rounded-xl p-6"
            >
              <div className="text-4xl mb-4">{t.icon}</div>
              <h3 className="retro text-[#c8a951] text-2xl tracking-widest mb-2">{t.title}</h3>
              <p className="text-[#e8d5a3]/90 text-base leading-relaxed">{t.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── GÜÇLÜ & ZAYIF ── */}
      <section className="relative z-10 py-24 px-6 max-w-5xl mx-auto">
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="section-divider"
        >
          <span className="retro text-[#c8a951] text-3xl tracking-widest">IŞIK & GÖLGE</span>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Güçlü */}
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="card rounded-xl p-7"
          >
            <div className="retro text-emerald-400 text-xl tracking-widest mb-6 flex items-center gap-3">
              <span className="text-2xl">✦</span> GÜÇLÜ YÖNLER
            </div>
            <ul className="space-y-3">
              {strengths.map((s, i) => (
                <motion.li
                  key={i}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="flex items-start gap-3 text-[#e8d5a3]/90 text-base leading-relaxed"
                >
                  <span className="text-emerald-400 mt-0.5 shrink-0">▸</span>
                  {s}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Zayıf */}
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            custom={1}
            className="card rounded-xl p-7"
          >
            <div className="retro text-rose-400 text-xl tracking-widest mb-6 flex items-center gap-3">
              <span className="text-2xl">✧</span> ZAYIF YÖNLER
            </div>
            <ul className="space-y-3">
              {weaknesses.map((w, i) => (
                <motion.li
                  key={i}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="flex items-start gap-3 text-[#e8d5a3]/90 text-base leading-relaxed"
                >
                  <span className="text-rose-400 mt-0.5 shrink-0">▸</span>
                  {w}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* ── AŞK & UYUM ── */}
      <section className="relative z-10 py-24 px-6 max-w-5xl mx-auto">
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="section-divider"
        >
          <span className="retro text-[#c8a951] text-3xl tracking-widest">AŞK & UYUM</span>
        </motion.div>

        <motion.p
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-[#e8d5a3]/90 text-base leading-relaxed max-w-2xl mx-auto text-center mb-12 italic"
        >
          Başak, sevgisini büyük jestlerle değil; küçük, özenli dokunuşlarla gösterir.
          Güven onu açar, sabırsızlık onu kapatır.
        </motion.p>

        <div className="space-y-4 max-w-2xl mx-auto">
          {compatible.map((c, i) => (
            <motion.div
              key={c.sign}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="card rounded-lg px-5 py-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="retro text-[#e8d5a3] text-lg tracking-widest">{c.sign}</span>
                <span className="retro text-sm" style={{ color: c.color }}>{c.level}%</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${c.level}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: i * 0.1, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${c.color}88, ${c.color})` }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── KARİYER ── */}
      <section className="relative z-10 py-24 px-6 max-w-5xl mx-auto">
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="section-divider"
        >
          <span className="retro text-[#c8a951] text-3xl tracking-widest">KARİYER YOLLARI</span>
        </motion.div>

        <motion.p
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-[#e8d5a3]/90 text-base leading-relaxed max-w-2xl mx-auto text-center mb-12 italic"
        >
          Analitik zekası ve titizliğiyle Başak, bilim, sağlık ve iletişim alanlarında
          parlayan bir yıldıza dönüşür.
        </motion.p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {careers.map((c, i) => (
            <motion.div
              key={c.role}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover="hovered"
              className="card rounded-xl p-5 text-center cursor-default relative overflow-hidden"
            >
              {/* Normal görünüm */}
              <motion.div
                variants={{ hovered: { opacity: 0, y: -10 } }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-4xl mb-3">{c.icon}</div>
                <div className="retro text-[#e8d5a3]/95 text-sm tracking-wider leading-tight">{c.role}</div>
              </motion.div>

              {/* Hover açıklaması */}
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center p-4"
                initial={{ opacity: 0, y: 15 }}
                variants={{ hovered: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.25 }}
              >
                <div className="text-2xl mb-2">{c.icon}</div>
                <div className="retro text-[#c8a951] text-sm tracking-wider mb-2">{c.role}</div>
                <p className="text-[#e8d5a3]/90 text-sm leading-relaxed">{c.detail}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── ÜNLÜ BAŞAKLAR ── */}
      <section className="relative z-10 py-24 px-6 max-w-5xl mx-auto">
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="section-divider"
        >
          <span className="retro text-[#c8a951] text-3xl tracking-widest">ÜNLÜ BAŞAKLAR</span>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4">
          {famous.map((name, i) => (
            <motion.div
              key={name}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="card px-6 py-3 rounded-full"
            >
              <span className="retro text-[#e8d5a3] text-sm tracking-widest">♍ {name}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 py-16 text-center border-t border-[#c8a951]/10">
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
        >
          <div className="text-5xl mb-4 flicker">♍</div>
          <p className="retro text-[#c8a951]/30 text-sm tracking-[4px]">
            ✦ ASTRAL ARŞİVLER · TÜM ZAMANLAR SAKLIDI ✦
          </p>
        </motion.div>
      </footer>
    </div>
  );
}
