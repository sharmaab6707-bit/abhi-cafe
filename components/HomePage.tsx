"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useScroll, useSpring, useTransform } from "framer-motion";
import Lenis from "lenis";
import { ArrowRight, Instagram, MapPinned, Moon, Music2, Navigation, Phone, Play, Sparkles, Star, Sun } from "lucide-react";
import { ambience, coffees, foods, instagram, locationDetails, navLinks, offers, reasons, reviews, stats } from "@/data/cafe";

const fadeUp = {
  hidden: { opacity: 0, y: 34 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } }
};

export function HomePage() {
  const [night, setNight] = useState(false);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 28 });

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 1300);
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("night-mode", night);
  }, [night]);

  useEffect(() => {
    if (!soundOn) return;
    const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const gain = ctx.createGain();
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    osc.type = "sine";
    osc.frequency.value = 104;
    filter.type = "lowpass";
    filter.frequency.value = 360;
    gain.gain.value = 0.018;
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    return () => {
      osc.stop();
      ctx.close();
    };
  }, [soundOn]);

  return (
    <main className="grain relative min-h-screen overflow-hidden bg-cream text-coffee transition-colors duration-500 night:bg-[#160d09] night:text-cream">
      <AnimatePresence>{loading && <LoadingScreen />}</AnimatePresence>
      <motion.div className="fixed left-0 top-0 z-[70] h-1 origin-left bg-gold" style={{ scaleX: progress }} />
      <AromaParticles />
      <Navbar scrolled={scrolled} night={night} onNight={() => setNight((value) => !value)} soundOn={soundOn} onSound={() => setSoundOn((value) => !value)} />
      <Hero />
      <WhyChooseUs />
      <SignatureCoffee />
      <FoodSnacks />
      <Ambience />
      <CoffeePour />
      <Reviews />
      <InstagramGallery />
      <Offers />
      <Location />
      <ContactCta />
      <Footer />
    </main>
  );
}

function LoadingScreen() {
  return (
    <motion.div className="fixed inset-0 z-[90] grid place-items-center bg-coffee text-cream" exit={{ opacity: 0 }} transition={{ duration: 0.55 }}>
      <motion.div initial={{ scale: 0.86, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative grid place-items-center">
        <div className="coffee-steam absolute -top-10 h-28 w-28">
          <span />
          <span />
          <span />
        </div>
        <motion.div animate={{ rotate: [0, 9, -8, 0] }} transition={{ duration: 1.2, repeat: Infinity }} className="h-16 w-11 rounded-full bg-gold shadow-glow">
          <div className="mx-auto mt-2 h-11 w-px bg-coffee/50" />
        </motion.div>
        <p className="mt-8 font-display text-3xl">Story Cup Cafe</p>
      </motion.div>
    </motion.div>
  );
}

function Navbar({ scrolled, night, onNight, soundOn, onSound }: { scrolled: boolean; night: boolean; onNight: () => void; soundOn: boolean; onSound: () => void }) {
  return (
    <header className={`fixed inset-x-0 top-0 z-[80] transition-all duration-300 ${scrolled ? "bg-coffee/86 py-3 shadow-soft backdrop-blur-xl" : "bg-transparent py-5"}`}>
      <nav className="section-shell flex items-center justify-between gap-4">
        <a href="#" className="flex items-center gap-2 text-cream">
          <span className="grid h-10 w-10 place-items-center rounded-full border border-gold/45 bg-gold/15 font-display text-xl">SC</span>
          <span className="hidden font-display text-2xl sm:inline">Story Cup</span>
        </a>
        <div className="hidden items-center gap-6 rounded-full border border-cream/10 bg-cream/8 px-5 py-3 text-sm text-cream/82 backdrop-blur lg:flex">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="transition hover:text-gold">
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <IconButton label="Toggle ambient sound" onClick={onSound} active={soundOn}>
            <Music2 size={18} />
          </IconButton>
          <IconButton label="Toggle day and night cafe mode" onClick={onNight} active={night}>
            {night ? <Sun size={18} /> : <Moon size={18} />}
          </IconButton>
          <a href="#location" className="hidden rounded-full bg-gold px-5 py-3 text-sm font-semibold text-coffee shadow-glow transition hover:-translate-y-0.5 sm:inline-flex">
            Visit Us
          </a>
        </div>
      </nav>
    </header>
  );
}

function IconButton({ children, label, onClick, active }: { children: React.ReactNode; label: string; onClick: () => void; active?: boolean }) {
  return (
    <button aria-label={label} title={label} onClick={onClick} className={`grid h-11 w-11 place-items-center rounded-full border text-cream transition ${active ? "border-gold bg-gold/25" : "border-cream/15 bg-cream/10 hover:border-gold/60"}`}>
      {children}
    </button>
  );
}

function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden bg-coffee text-cream">
      <motion.div style={{ y }} className="absolute inset-0">
        <Image src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1800&q=86" alt="Warm premium cafe interior" fill priority sizes="100vw" className="object-cover opacity-72" />
      </motion.div>
      <div className="absolute inset-0 bg-[linear-gradient(130deg,rgba(20,10,6,.92)_0%,rgba(43,24,16,.7)_45%,rgba(20,10,6,.34)_100%)]" />
      <FloatingBeans />
      <div className="section-shell relative z-10 flex min-h-screen flex-col justify-center pb-24 pt-28">
        <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-3xl">
          <motion.div variants={fadeUp} className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/35 bg-cream/10 px-4 py-2 text-sm text-cream/88 backdrop-blur">
            <Sparkles size={16} className="text-gold" />
            Premium coffee house in Jaipur
          </motion.div>
          <motion.h1 variants={fadeUp} className="max-w-[10ch] font-display text-[clamp(4.1rem,18vw,9.5rem)] font-semibold leading-[0.84] tracking-normal">
            Every Cup Tells a Story
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-6 max-w-xl text-lg leading-8 text-cream/84 sm:text-2xl">
            Freshly Brewed Coffee, Delicious Food & Cozy Moments.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#location" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-gold px-7 font-semibold text-coffee shadow-glow transition hover:-translate-y-1">
              Visit Us <Navigation size={18} />
            </a>
            <a href="#coffee" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-cream/24 bg-cream/10 px-7 font-semibold text-cream backdrop-blur transition hover:border-gold">
              View Menu <ArrowRight size={18} />
            </a>
          </motion.div>
        </motion.div>
        <HeroCup />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-cream to-transparent night:from-[#160d09]" />
    </section>
  );
}

function FloatingBeans() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 opacity-80">
      {[["left-[76%] top-[21%]", "h-10 w-7"], ["left-[8%] top-[62%]", "h-8 w-6"], ["left-[84%] top-[70%]", "h-12 w-8"]].map(([position, size]) => (
        <div key={position} className={`bean absolute ${position} ${size} rounded-full bg-[linear-gradient(90deg,#5c2e25,#c8a96b_48%,#3b2418_52%,#2b1810)] shadow-glow`} />
      ))}
    </div>
  );
}

function HeroCup() {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.86, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.9 }} className="absolute bottom-20 right-4 hidden h-64 w-64 place-items-center rounded-full border border-gold/30 bg-cream/10 backdrop-blur-xl lg:grid">
      <div className="coffee-steam absolute inset-0">
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="relative h-28 w-40 rounded-b-[44px] rounded-t-[18px] bg-cream shadow-glow">
        <div className="absolute left-4 right-4 top-3 h-5 rounded-full bg-espresso" />
        <div className="absolute -right-10 top-8 h-14 w-12 rounded-r-full border-[10px] border-cream bg-transparent" />
        <div className="absolute -bottom-5 left-1/2 h-4 w-48 -translate-x-1/2 rounded-full bg-cream/70" />
      </div>
    </motion.div>
  );
}

function SectionHeader({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} className="mx-auto mb-10 max-w-2xl text-center">
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.26em] text-gold">{eyebrow}</p>
      <h2 className="font-display text-5xl font-semibold leading-tight sm:text-6xl">{title}</h2>
      <p className="mt-4 text-base leading-7 text-coffee/68 night:text-cream/70">{text}</p>
    </motion.div>
  );
}

function WhyChooseUs() {
  return (
    <section className="bg-cream py-20 night:bg-[#160d09]">
      <div className="section-shell">
        <SectionHeader eyebrow="Why choose us" title="Crafted for slow, beautiful moments." text="Premium ingredients, thoughtful service, and a cafe mood designed for first dates, deep work, and long conversations." />
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((item) => (
            <motion.article key={item.title} variants={fadeUp} whileHover={{ y: -8, scale: 1.02 }} className="premium-card rounded-lg p-6 transition">
              <item.icon className="mb-7 h-9 w-9 text-gold" />
              <h3 className="font-display text-2xl font-semibold">{item.title}</h3>
              <p className="mt-3 leading-7 text-coffee/68 night:text-cream/70">{item.text}</p>
            </motion.article>
          ))}
        </motion.div>
        <Stats />
      </div>
    </section>
  );
}

function Stats() {
  return (
    <div className="mt-12 grid grid-cols-2 gap-3 rounded-lg border border-gold/20 bg-coffee p-4 text-cream shadow-soft sm:grid-cols-4">
      {stats.map((stat) => (
        <CounterStat key={stat.label} {...stat} />
      ))}
    </div>
  );
}

function CounterStat({ icon: Icon, value, suffix, label }: { icon: React.ElementType; value: number; suffix: string; label: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1200;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setCount(value * (1 - Math.pow(1 - progress, 3)));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value]);

  const display = value < 10 ? count.toFixed(1) : Math.round(count).toLocaleString("en-IN");
  return (
    <div ref={ref} className="rounded-md border border-cream/10 bg-cream/7 p-4">
      <Icon className="mb-4 h-6 w-6 text-gold" />
      <p className="font-display text-3xl font-semibold">{display}{suffix}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-cream/62">{label}</p>
    </div>
  );
}

function SignatureCoffee() {
  return (
    <section id="coffee" className="bg-[#fff8ee] py-20 night:bg-[#1b100b]">
      <div className="section-shell">
        <SectionHeader eyebrow="Signature coffee" title="A menu that photographs beautifully and tastes better." text="From velvet cappuccinos to deep cold brews, every cup is balanced, polished, and made for repeat visits." />
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {coffees.map((coffee) => (
            <motion.article key={coffee.name} variants={fadeUp} whileHover={{ y: -8 }} className="premium-card overflow-hidden rounded-lg">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src={coffee.image} alt={coffee.name} fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition duration-700 hover:scale-110" />
              </div>
              <div className="p-5">
                <h3 className="font-display text-3xl font-semibold">{coffee.name}</h3>
                <p className="mt-2 leading-7 text-coffee/68 night:text-cream/70">{coffee.description}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FoodSnacks() {
  return (
    <section className="bg-cream py-20 night:bg-[#160d09]">
      <div className="section-shell">
        <SectionHeader eyebrow="Food and snacks" title="Comfort food, dressed for coffee." text="A warm, mobile-friendly spread for quick cravings, shared plates, and dessert-first evenings." />
        <div className="scrollbar-hide flex snap-x gap-4 overflow-x-auto pb-4">
          {foods.map((food) => (
            <motion.article key={food.name} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} whileHover={{ y: -6 }} className="premium-card min-w-[78%] snap-center rounded-lg p-6 sm:min-w-[280px]">
              <food.icon className="mb-8 h-10 w-10 text-rosewood night:text-gold" />
              <h3 className="font-display text-3xl font-semibold">{food.name}</h3>
              <p className="mt-3 leading-7 text-coffee/68 night:text-cream/70">{food.text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Ambience() {
  return (
    <section id="ambience" className="bg-coffee py-20 text-cream">
      <div className="section-shell">
        <SectionHeader eyebrow="Our ambience" title="Warm corners for every kind of visit." text="Indoor seating, outdoor evenings, quiet work tables, and a coffee bar that makes the whole room feel alive." />
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {ambience.map((item, index) => (
            <motion.figure key={item.title} variants={fadeUp} className="mb-4 break-inside-avoid overflow-hidden rounded-lg border border-gold/20 bg-cream/8">
              <div className={`relative ${index % 2 === 0 ? "h-80" : "h-60"}`}>
                <Image src={item.image} alt={item.title} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover transition duration-700 hover:scale-105" />
              </div>
              <figcaption className="p-4 font-display text-2xl">{item.title}</figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CoffeePour() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.45 });
  return (
    <section ref={ref} className="overflow-hidden bg-[#fff8ee] py-20 night:bg-[#1b100b]">
      <div className="section-shell grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.26em] text-gold">Coffee pour ritual</p>
          <h2 className="font-display text-5xl font-semibold leading-tight sm:text-6xl">A little theatre before the first sip.</h2>
          <p className="mt-5 max-w-xl leading-8 text-coffee/68 night:text-cream/70">The pour animation marks our signature ritual: precise extraction, warm aroma, and a cup that feels made for the moment.</p>
        </motion.div>
        <div className="premium-card relative mx-auto grid aspect-square w-full max-w-md place-items-center overflow-hidden rounded-lg">
          <svg viewBox="0 0 420 420" className="h-full w-full" aria-label="Animated coffee pour into cup">
            <defs>
              <linearGradient id="coffeeStream" x1="0" x2="0" y1="0" y2="1">
                <stop stopColor="#C8A96B" />
                <stop offset="1" stopColor="#3B2418" />
              </linearGradient>
            </defs>
            <motion.path d="M259 76 C290 113 270 143 236 158" fill="none" stroke="#C8A96B" strokeWidth="18" strokeLinecap="round" initial={{ pathLength: 0, opacity: 0 }} animate={inView ? { pathLength: 1, opacity: 1 } : {}} transition={{ duration: 1.2, ease: "easeOut" }} />
            <motion.rect x="205" y="134" width="22" height="118" rx="11" fill="url(#coffeeStream)" initial={{ scaleY: 0, opacity: 0 }} animate={inView ? { scaleY: 1, opacity: 1 } : {}} transition={{ delay: 0.65, duration: 1.15 }} style={{ originY: 0 }} />
            <path d="M105 238 H286 V293 C286 335 251 360 195 360 C139 360 105 335 105 293 Z" fill="#F5EBDD" />
            <path d="M286 254 C348 250 348 330 286 326" fill="none" stroke="#F5EBDD" strokeWidth="20" strokeLinecap="round" />
            <motion.path d="M125 252 H266 V288 C266 320 239 339 195 339 C151 339 125 320 125 288 Z" fill="#3B2418" initial={{ scaleY: 0.08 }} animate={inView ? { scaleY: 1 } : {}} transition={{ delay: 0.8, duration: 1.25 }} style={{ originY: 1 }} />
            <ellipse cx="195" cy="252" rx="72" ry="16" fill="#6C3B27" opacity="0.88" />
            <path d="M116 363 H276" stroke="#C8A96B" strokeWidth="10" strokeLinecap="round" opacity="0.55" />
          </svg>
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  const [active, setActive] = useState(0);
  const touch = useRef(0);
  useEffect(() => {
    const timer = window.setInterval(() => setActive((value) => (value + 1) % reviews.length), 4200);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <section className="bg-cream py-20 night:bg-[#160d09]">
      <div className="section-shell">
        <SectionHeader eyebrow="Guest reviews" title="Loved by regulars, visitors, and coffee people." text="A premium cafe should earn trust one cup at a time. These are the moments guests come back for." />
        <div className="premium-card mx-auto max-w-3xl overflow-hidden rounded-lg p-6" onTouchStart={(event) => (touch.current = event.touches[0].clientX)} onTouchEnd={(event) => {
          const delta = event.changedTouches[0].clientX - touch.current;
          if (Math.abs(delta) > 40) setActive((value) => (delta < 0 ? value + 1 : value + reviews.length - 1) % reviews.length);
        }}>
          <AnimatePresence mode="wait">
            <motion.article key={reviews[active].name} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.45 }}>
              <div className="mb-5 flex gap-1 text-gold">{Array.from({ length: 5 }).map((_, index) => <Star key={index} size={18} fill="currentColor" />)}</div>
              <p className="font-display text-3xl leading-tight sm:text-4xl">"{reviews[active].review}"</p>
              <div className="mt-7 flex items-center gap-4">
                <Image src={reviews[active].image} alt={reviews[active].name} width={58} height={58} className="h-14 w-14 rounded-full object-cover" />
                <div>
                  <p className="font-semibold">{reviews[active].name}</p>
                  <p className="text-sm text-coffee/60 night:text-cream/60">{reviews[active].role}</p>
                </div>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function InstagramGallery() {
  return (
    <section className="bg-[#fff8ee] py-20 night:bg-[#1b100b]">
      <div className="section-shell">
        <SectionHeader eyebrow="Instagram gallery" title="Made for the camera, remembered for the feeling." text="Warm cups, crisp pastry layers, polished corners, and the kind of table light that makes every frame glow." />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {instagram.map((src, index) => (
            <motion.a key={src} href="https://www.instagram.com/" target="_blank" rel="noreferrer" initial={{ opacity: 0, scale: 0.92 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.04 }} className="relative aspect-square overflow-hidden rounded-lg">
              <Image src={src} alt="Cafe Instagram moment" fill sizes="(min-width: 768px) 33vw, 50vw" className="object-cover transition duration-700 hover:scale-110" />
            </motion.a>
          ))}
        </div>
        <div className="mt-8 text-center">
          <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-coffee px-7 font-semibold text-cream transition hover:-translate-y-1 night:bg-gold night:text-coffee">
            <Instagram size={19} /> Follow Us on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}

function Offers() {
  return (
    <section id="offers" className="bg-coffee py-20 text-cream">
      <div className="section-shell">
        <SectionHeader eyebrow="Special offers" title="A little more reason to stay." text="Premium moments with thoughtful weekly rituals for friends, first dates, work breaks, and weekend cravings." />
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid gap-4 md:grid-cols-3">
          {offers.map((offer) => (
            <motion.article key={offer.title} variants={fadeUp} whileHover={{ y: -8 }} className="rounded-lg border border-gold/26 bg-cream/8 p-6 backdrop-blur">
              <p className="mb-8 inline-flex rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-gold">{offer.tag}</p>
              <h3 className="font-display text-4xl font-semibold">{offer.title}</h3>
              <p className="mt-4 leading-7 text-cream/70">{offer.detail}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Location() {
  return (
    <section id="location" className="bg-cream py-20 night:bg-[#160d09]">
      <div className="section-shell grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="overflow-hidden rounded-lg border border-gold/25 bg-coffee p-4 shadow-soft">
          <div className="relative min-h-[360px] overflow-hidden rounded-md bg-[#20130e]">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(200,169,107,.16)_1px,transparent_1px),linear-gradient(rgba(200,169,107,.16)_1px,transparent_1px)] bg-[size:42px_42px]" />
            <div className="absolute left-[22%] top-[24%] h-24 w-24 rounded-full bg-gold/20 blur-2xl" />
            <div className="absolute bottom-[22%] right-[16%] h-32 w-32 rounded-full bg-sage/25 blur-2xl" />
            <div className="absolute inset-0 grid place-items-center text-center text-cream">
              <div>
                <MapPinned className="mx-auto mb-4 h-12 w-12 text-gold" />
                <p className="font-display text-4xl">Google Map Placeholder</p>
                <p className="mt-2 text-cream/65">MI Road, Jaipur</p>
              </div>
            </div>
          </div>
        </div>
        <div className="premium-card rounded-lg p-6 sm:p-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.26em] text-gold">Location and timing</p>
          <h2 className="font-display text-5xl font-semibold leading-tight">Come for coffee. Stay for the mood.</h2>
          <div className="mt-8 space-y-4">
            {locationDetails.map((item) => (
              <div key={item.label} className="flex gap-4 rounded-md border border-gold/18 bg-white/35 p-4 night:bg-cream/5">
                <item.icon className="mt-1 h-5 w-5 shrink-0 text-gold" />
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-coffee/50 night:text-cream/50">{item.label}</p>
                  <p className="mt-1 leading-7">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <a href="tel:+911234567890" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-coffee px-6 font-semibold text-cream transition hover:-translate-y-1 night:bg-gold night:text-coffee">
              <Phone size={18} /> Call Now
            </a>
            <a href="https://maps.google.com/?q=MI+Road+Jaipur" target="_blank" rel="noreferrer" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-gold/50 px-6 font-semibold transition hover:-translate-y-1">
              <Navigation size={18} /> Get Directions
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactCta() {
  return (
    <section className="relative overflow-hidden bg-coffee py-20 text-cream">
      <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_20%_20%,#C8A96B_0,transparent_22%),radial-gradient(circle_at_80%_10%,#7F8D6A_0,transparent_18%),linear-gradient(135deg,#2B1810,#5C2E25)]" />
      <div className="section-shell relative z-10 text-center">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.26em] text-gold">Your next table</p>
          <h2 className="mx-auto max-w-3xl font-display text-5xl font-semibold leading-tight sm:text-7xl">Ready For Your Next Coffee Experience?</h2>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <a href="#location" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-gold px-8 font-semibold text-coffee shadow-glow transition hover:-translate-y-1">
              Visit Cafe <Navigation size={18} />
            </a>
            <a href="tel:+911234567890" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-cream/24 bg-cream/10 px-8 font-semibold text-cream backdrop-blur transition hover:border-gold">
              Call Now <Phone size={18} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#110a07] py-10 text-cream">
      <div className="section-shell flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-3xl">Story Cup Cafe</p>
          <p className="mt-2 text-sm text-cream/58">MI Road, Jaipur, Rajasthan</p>
        </div>
        <div className="flex items-center gap-3">
          <a aria-label="Instagram" href="https://www.instagram.com/" target="_blank" rel="noreferrer" className="grid h-11 w-11 place-items-center rounded-full border border-cream/12 transition hover:border-gold hover:text-gold">
            <Instagram size={18} />
          </a>
          <a aria-label="Call cafe" href="tel:+911234567890" className="grid h-11 w-11 place-items-center rounded-full border border-cream/12 transition hover:border-gold hover:text-gold">
            <Phone size={18} />
          </a>
        </div>
        <p className="text-sm text-cream/48">Copyright 2026 Story Cup Cafe. All rights reserved.</p>
      </div>
    </footer>
  );
}

function AromaParticles() {
  const [points, setPoints] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const idRef = useRef(0);

  useEffect(() => {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) return;
    const onMove = (event: MouseEvent) => {
      const id = idRef.current++;
      setPoints((value) => [...value.slice(-12), { x: event.clientX, y: event.clientY, id }]);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[65] hidden lg:block">
      <AnimatePresence>
        {points.map((point) => (
          <motion.span key={point.id} initial={{ opacity: 0.28, scale: 0.7, x: point.x, y: point.y }} animate={{ opacity: 0, scale: 1.8, y: point.y - 46 }} exit={{ opacity: 0 }} transition={{ duration: 1.1 }} className="absolute h-3 w-3 rounded-full bg-gold/40 blur-sm" />
        ))}
      </AnimatePresence>
    </div>
  );
}
