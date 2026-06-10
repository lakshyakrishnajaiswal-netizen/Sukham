"use client";

import { supabaseBrowser } from "@/lib/supabaseBrowser";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  CalendarCheck,
  Check,
  Clock,
  Download,
  Facebook,
  Filter,
  HeartPulse,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Navigation,
  Phone,
  Plus,
  Save,
  Search,
  Star,
  Upload,
  X,
  Youtube
} from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { Logo } from "@/components/Logo";
import { blogs, brand, experts, gallery, heroSlides, plans, reviews, services, workshops } from "@/lib/content";

const nav = ["Home", "Experts", "Plans", "Workshops", "Blogs", "Gallery"];
const STORAGE_KEY = "sukham-site-content-v1";

type SiteContent = {
  heroSlides: typeof heroSlides;
  reviews: typeof reviews;
  experts: typeof experts;
  workshops: typeof workshops;
  blogs: typeof blogs;
  gallery: typeof gallery;
  services: typeof services;
};

type AppointmentStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

type AppointmentEntry = {
  id: string;
  name: string;
  phone_number: string;
  email: string;
  service: string;
  preferred_date: string;
  preferred_time: string;
  message: string;
  status: AppointmentStatus;
  created_at: string;
};

const defaultContent: SiteContent = {
  heroSlides,
  reviews,
  experts,
  workshops,
  blogs,
  gallery,
  services
};

function useEditableContent() {
  const [content, setContent] = useState<SiteContent>(defaultContent);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) setContent({ ...defaultContent, ...JSON.parse(saved) });
  }, []);

  function commit(next: SiteContent) {
    setContent(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function updateImage(section: keyof SiteContent, index: number, image: string) {
    const next = structuredClone(content) as SiteContent;
    if (section === "gallery") {
      next.gallery[index] = image;
    } else {
      (next[section][index] as { image: string }).image = image;
    }
    commit(next);
  }

  function addItem(section: "workshops" | "blogs" | "reviews" | "experts", item: SiteContent[typeof section][number]) {
    const next = structuredClone(content) as SiteContent;
    (next[section] as Array<typeof item>).unshift(item);
    commit(next);
  }

  function updateExpert(index: number, fields: Partial<SiteContent["experts"][number]>) {
    const next = structuredClone(content) as SiteContent;
    next.experts[index] = { ...next.experts[index], ...fields };
    commit(next);
  }
  function addService(service: string) {
    const cleanService = service.trim();

    if (!cleanService) return;

    const next = structuredClone(content) as SiteContent;
    next.services = [cleanService, ...next.services];
    commit(next);
  }

  function removeService(index: number) {
    const next = structuredClone(content) as SiteContent;
    next.services = next.services.filter((_, serviceIndex) => serviceIndex !== index);
    commit(next);
  }
  function resetContent() {
    window.localStorage.removeItem(STORAGE_KEY);
    setContent(defaultContent);
  }

  return { content, updateImage, addItem, updateExpert, addService, removeService, resetContent };
}

function readImageFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function useAppointments() {
  const [appointments, setAppointments] = useState<AppointmentEntry[]>([]);

  async function loadAppointments() {
    const { data } = await supabaseBrowser.auth.getSession();
    const token = data.session?.access_token;

    const response = await fetch("/api/appointments", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const result = await response.json();

    if (result.ok) {
      setAppointments(result.appointments);
    }
  }

  useEffect(() => {
    loadAppointments();
  }, []);

  async function addAppointment(entry: Omit<AppointmentEntry, "id" | "status" | "created_at">) {
    const response = await fetch("/api/appointments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(entry)
    });

    const result = await response.json();

    if (result.ok) {
      await loadAppointments();
    }
  }

  async function updateAppointmentStatus(id: string, status: AppointmentStatus) {
    const { data } = await supabaseBrowser.auth.getSession();
    const token = data.session?.access_token;

    const response = await fetch(`/api/appointments/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });

    const result = await response.json();

    if (result.ok) {
      await loadAppointments();
    }
  }

  return { appointments, addAppointment, updateAppointmentStatus };
}

function ButtonLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-saffron px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-200 transition hover:-translate-y-0.5 hover:bg-plum"
    >
      {children}
      <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </a>
  );
}

function BreathingIntro({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const labels = ["Breathe In", "Hold", "Breathe Out", "Welcome to Sukham"];

  useEffect(() => {
    const timings = [3000, 3000, 3000, 2000];
    const timeout = window.setTimeout(() => {
      if (step < labels.length - 1) setStep((value) => value + 1);
      else onDone();
    }, timings[step]);
    return () => window.clearTimeout(timeout);
  }, [step, onDone, labels.length]);

  const scale = step === 0 ? 1.45 : step === 1 ? 1.45 : step === 2 ? 0.82 : 1;

  return (
    <motion.div
      className="fixed inset-0 z-[80] grid place-items-center bg-blush"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
    >
      <div className="grid place-items-center gap-8 text-center">
        <motion.div
          className={`grid place-items-center border border-gold/40 bg-white/80 shadow-wellness ${
            step === 3 ? "h-48 w-80 rounded-sukham px-8" : "h-44 w-44 rounded-full"
          }`}
          animate={{ scale }}
          transition={{ duration: step === 3 ? 0.8 : 3, ease: "easeInOut" }}
        >
          {step === 3 ? (
            <div className="relative h-28 w-full">
              <Image src="/images/sukham-logo.png" alt="Sukham Happy Healing" fill sizes="320px" className="object-contain" priority />
            </div>
          ) : (
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-petal to-orange-100" />
          )}
        </motion.div>
        <motion.p
          key={labels[step]}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-4xl font-bold text-plum"
        >
          {labels[step]}
        </motion.p>
      </div>
    </motion.div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-gold/20 bg-blush/92 backdrop-blur-xl">
        <div className="section-shell flex h-20 items-center justify-between">
          <a href="#home" aria-label="Sukham home">
            <Logo compact={false} />
          </a>
          <nav className="hidden items-center gap-7 xl:flex">
            {nav.map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-semibold text-ink/75 hover:text-plum">
                {item}
              </a>
            ))}
            <a href="/admin" className="text-sm font-semibold text-magenta hover:text-plum">
              Admin
            </a>
          </nav>
          <div className="hidden items-center gap-3 xl:flex">
            <a href={`tel:${brand.phone}`} className="inline-flex items-center gap-2 text-sm font-bold text-plum">
              <Phone className="h-4 w-4 text-saffron" aria-hidden="true" />
              {brand.phone}
            </a>
            <ButtonLink href="#appointment">Book</ButtonLink>
          </div>
          <button
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-full bg-white text-plum shadow-sm xl:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] overflow-y-auto bg-white xl:hidden"
          >
            <div className="flex min-h-screen w-full flex-col bg-white px-7 pb-8 pt-6">
              <div className="flex items-center justify-between gap-4">
                <Logo />
                <button aria-label="Close menu" onClick={() => setOpen(false)} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-blush text-plum">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="mt-10 grid gap-1">
                {nav.map((item) => (
                  <a
                    key={item}
                    onClick={() => setOpen(false)}
                    href={`#${item.toLowerCase()}`}
                    className="rounded-2xl px-3 py-4 text-2xl font-bold text-plum hover:bg-blush"
                  >
                    {item}
                  </a>
                ))}
                <a onClick={() => setOpen(false)} href="/admin" className="rounded-2xl px-3 py-4 text-2xl font-bold text-magenta hover:bg-blush">
                  Admin
                </a>
              </nav>
              <div className="mt-auto pt-8">
                <a
                  onClick={() => setOpen(false)}
                  href="#appointment"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-saffron px-6 py-4 text-base font-bold text-white shadow-lg shadow-orange-200"
                >
                  Book Appointment
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Hero({ slides }: { slides: typeof heroSlides }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setActive((value) => (value + 1) % slides.length), 5200);
    return () => window.clearInterval(timer);
  }, [slides.length]);
  const slide = slides[active] ?? slides[0];

  return (
    <section id="home" className="relative min-h-[92vh] overflow-hidden pt-20">
      <AnimatePresence mode="wait">
        <motion.div key={slide.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} className="absolute inset-0">
          <Image src={slide.image} alt="" fill priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/72 to-white/18" />
        </motion.div>
      </AnimatePresence>
      <div className="section-shell relative z-10 flex min-h-[calc(92vh-80px)] items-center py-16">
        <div className="max-w-3xl">
          <motion.p key={slide.eyebrow} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-4 inline-flex rounded-full bg-white/80 px-4 py-2 text-sm font-bold text-magenta shadow-sm">
            {slide.eyebrow}
          </motion.p>
          <motion.h1 key={slide.title} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="font-serif text-5xl font-bold leading-tight text-plum md:text-7xl">
            {slide.title}
          </motion.h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/76">{slide.copy}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="#appointment">{slide.cta}</ButtonLink>
            <a href="#services" className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-bold text-plum shadow-sm transition hover:-translate-y-0.5">
              View Services
            </a>
          </div>
          <div className="mt-10 flex gap-3">
            {slides.map((item, index) => (
              <button
                key={item.title}
                aria-label={`Show slide ${index + 1}`}
                onClick={() => setActive(index)}
                className={`h-2.5 rounded-full transition-all ${index === active ? "w-12 bg-saffron" : "w-2.5 bg-plum/25"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHeading({ eyebrow, title, copy }: { eyebrow: string; title: string; copy?: string }) {
  return (
    <div className="mb-10 max-w-3xl">
      <p className="text-sm font-bold uppercase text-saffron">{eyebrow}</p>
      <h2 className="mt-2 font-serif text-4xl font-bold text-plum md:text-5xl">{title}</h2>
      {copy && <p className="mt-4 text-lg leading-8 text-ink/70">{copy}</p>}
    </div>
  );
}

function Reviews({ items }: { items: typeof reviews }) {
  return (
    <section className="section-shell -mt-16 relative z-20 grid gap-4 md:grid-cols-3">
      {items.map((review) => (
        <article key={review.name} className="soft-card rounded-sukham p-6">
          <div className="flex items-center gap-4">
            <Image src={review.image} alt={review.name} width={58} height={58} className="h-14 w-14 rounded-full object-cover" />
            <div>
              <h3 className="font-bold text-plum">{review.name}</h3>
              <div className="flex text-gold" aria-label={`${review.rating} star rating`}>
                {Array.from({ length: review.rating }).map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-current" />
                ))}
              </div>
            </div>
          </div>
          <p className="mt-5 leading-7 text-ink/72">{review.review}</p>
        </article>
      ))}
    </section>
  );
}

function Experts({ items }: { items: typeof experts }) {
  return (
    <section id="experts" className="section-shell py-24">
      <SectionHeading eyebrow="Our Experts" title="Clinical care with a calm, human rhythm" copy="Every program starts with assessment and adapts to the individual, not the other way around." />
      <div className="grid gap-8 lg:grid-cols-2">
        {items.map((expert) => (
          <article key={expert.name} className="soft-card overflow-hidden rounded-sukham">
            <div className="relative h-80">
              <Image src={expert.image} alt={expert.name} fill className="object-cover" />
            </div>
            <div className="p-7">
              <p className="text-sm font-bold text-saffron">{expert.role}</p>
              <h3 className="mt-2 font-serif text-3xl font-bold text-plum">{expert.name}</h3>
              <p className="mt-4 leading-7 text-ink/72">{expert.bio}</p>
              <div className="mt-5 grid gap-3">
                {expert.details.map((detail) => (
                  <div key={detail} className="flex gap-3 text-sm font-semibold text-ink/75">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-leaf" /> {detail}
                  </div>
                ))}
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {expert.certificates.map((certificate) => (
                  <div key={certificate} className="rounded-2xl border border-gold/25 bg-blush p-4 text-sm font-bold text-plum">
                    {certificate}
                  </div>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Services({ items }: { items: string[] }) {
  return (
    <section id="services" className="bg-white/54 py-20">
      <div className="section-shell">
        <SectionHeading eyebrow="Services" title="Root-cause care across yoga, physiotherapy and wellness" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {items.map((service) => (
            <div key={service} className="rounded-2xl border border-petal bg-white px-4 py-4 text-sm font-bold text-plum shadow-sm">
              {service}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Plans() {
  return (
    <section id="plans" className="section-shell py-24">
      <SectionHeading eyebrow="Our Plans" title="Premium programs that can grow with the centre" copy="The admin can add, edit, remove and feature unlimited plans." />
      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <article key={plan.name} className={`rounded-sukham border p-7 shadow-wellness ${plan.featured ? "border-saffron bg-plum text-white" : "border-gold/20 bg-white"}`}>
            {plan.featured && <p className="mb-4 inline-flex rounded-full bg-saffron px-3 py-1 text-xs font-bold text-white">Featured</p>}
            <h3 className={`font-serif text-3xl font-bold ${plan.featured ? "text-white" : "text-plum"}`}>{plan.name}</h3>
            <p className={`mt-2 font-bold ${plan.featured ? "text-orange-100" : "text-saffron"}`}>{plan.price}</p>
            <div className="mt-7 grid gap-4">
              {plan.features.map((feature) => (
                <div key={feature} className="flex gap-3 text-sm font-semibold">
                  <Check className={`h-5 w-5 ${plan.featured ? "text-gold" : "text-leaf"}`} /> {feature}
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function WorkshopsAndBlogs({ items }: { items: typeof workshops }) {
  return (
    <section id="workshops" className="bg-white/58 py-24">
      <div className="section-shell">
        <SectionHeading eyebrow="Workshops" title="Upcoming learning experiences" />
        <div className="grid gap-6 md:grid-cols-2">
          {items.map((workshop) => (
            <article key={workshop.title} className="soft-card overflow-hidden rounded-sukham">
              <div className="relative h-64">
                <Image src={workshop.image} alt={workshop.title} fill className="object-cover" />
              </div>
              <div className="p-6">
                <h3 className="font-serif text-2xl font-bold text-plum">{workshop.title}</h3>
                <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold text-ink/70">
                  <span className="inline-flex items-center gap-2"><CalendarCheck className="h-4 w-4 text-saffron" /> {workshop.date}</span>
                  <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4 text-saffron" /> {workshop.time}</span>
                  <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-saffron" /> {workshop.location}</span>
                </div>
                <p className="mt-4 leading-7 text-ink/70">{workshop.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Blogs({ items }: { items: typeof blogs }) {
  return (
    <section id="blogs" className="section-shell py-24">
      <SectionHeading eyebrow="Blogs" title="Helpful reads for recovery and everyday wellness" />
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((blog) => (
          <article key={blog.title} className="soft-card overflow-hidden rounded-sukham">
            <div className="relative h-56">
              <Image src={blog.image} alt={blog.title} fill className="object-cover" />
            </div>
            <div className="p-6">
              <h3 className="font-serif text-2xl font-bold text-plum">{blog.title}</h3>
              <p className="mt-3 leading-7 text-ink/70">{blog.summary}</p>
              <button className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-saffron">
                Read More <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Gallery({ images }: { images: typeof gallery }) {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <section id="gallery" className="bg-white/58 py-24">
      <div className="section-shell">
        <SectionHeading eyebrow="Gallery" title="A bright look at Sukham experiences" copy="Yoga sessions, physiotherapy care, workshops, events and centre moments." />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {images.map((image, index) => (
            <button key={image} onClick={() => setSelected(image)} className="relative h-56 overflow-hidden rounded-sukham shadow-sm md:h-72">
              <Image src={image} alt={`Sukham gallery ${index + 1}`} fill className="object-cover transition duration-500 hover:scale-105" />
            </button>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {selected && (
          <motion.div className="fixed inset-0 z-[90] grid place-items-center bg-plum/82 p-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button aria-label="Close gallery image" onClick={() => setSelected(null)} className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white">
              <X className="h-5 w-5" />
            </button>
            <div className="relative h-[82vh] w-full max-w-5xl overflow-hidden rounded-sukham bg-white">
              <Image src={selected} alt="Selected Sukham gallery image" fill className="object-cover" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function WhatsappFloating() {
  return (
    <a
      href={`https://wa.me/${brand.whatsapp}?text=${encodeURIComponent("Hello Sukham, I have a question about my yoga journey.")}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Sukham on WhatsApp"
      className="fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl shadow-green-200 transition hover:-translate-y-1 md:h-16 md:w-16"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}

function WhatsappQuestion() {
  return (
    <section className="section-shell py-20">
      <div className="grid gap-6 rounded-sukham bg-white p-7 shadow-wellness md:grid-cols-[1fr_auto] md:items-center md:p-10">
        <div>
          <p className="text-sm font-bold uppercase text-saffron">Ask Sukham</p>
          <h2 className="mt-2 font-serif text-4xl font-bold text-plum">Have a question regarding your yoga journey?</h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-ink/70">Contact us right now on WhatsApp and our team will guide you toward the right yoga therapy, physiotherapy or wellness plan.</p>
        </div>
        <a
          href={`https://wa.me/${brand.whatsapp}?text=${encodeURIComponent("Hello Sukham, I have a question regarding my yoga journey.")}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-3 rounded-full bg-[#25D366] px-7 py-4 text-base font-bold text-white shadow-lg shadow-green-100"
        >
          <MessageCircle className="h-5 w-5" />
          WhatsApp Sukham
        </a>
      </div>
    </section>
  );
}

function LocateCentre() {
  return (
    <section className="bg-white/58 py-20">
      <div className="section-shell grid gap-6 rounded-sukham border border-gold/20 bg-blush p-7 md:grid-cols-[1fr_auto] md:items-center md:p-10">
        <div>
          <p className="text-sm font-bold uppercase text-saffron">Locate Our Centre</p>
          <h2 className="mt-2 font-serif text-4xl font-bold text-plum">Visit Sukham in JP Nagar 8th Phase</h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-ink/70">{brand.address}</p>
        </div>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(brand.mapsQuery)}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-3 rounded-full bg-plum px-7 py-4 text-base font-bold text-white shadow-lg shadow-purple-100"
        >
          <Navigation className="h-5 w-5" />
          Open Google Maps
        </a>
      </div>
    </section>
  );
}

function Appointment({ servicesList }: { servicesList: string[] }) {
  const [status, setStatus] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    
    try {
      await fetch("/api/appointments", { method: "POST", body: JSON.stringify(data) });
    } catch {
      // The prototype persists locally first; Supabase/API persistence can be wired later.
    }
    setStatus("Thank you. Your appointment request is pending admin review.");
    form.reset();
  }

  return (
    <section id="appointment" className="section-shell py-24">
      <div className="grid overflow-hidden rounded-sukham bg-plum shadow-wellness lg:grid-cols-[0.92fr_1.08fr]">
        <div className="p-8 text-white md:p-12">
          <p className="text-sm font-bold uppercase text-gold">Book Appointment</p>
          <h2 className="mt-3 font-serif text-4xl font-bold md:text-5xl">Start Your Healing Journey Today</h2>
          <p className="mt-5 leading-8 text-white/78">Tell us what you need help with. The team can review your goals and recommend a physiotherapy, yoga therapy or integrated program.</p>
          <div className="mt-8 grid gap-4 text-sm font-semibold text-white/86">
            <span className="inline-flex items-center gap-3"><Phone className="h-5 w-5 text-gold" /> {brand.phone}</span>
            <span className="inline-flex items-center gap-3"><Mail className="h-5 w-5 text-gold" /> {brand.email}</span>
            <span className="inline-flex items-center gap-3"><MapPin className="h-5 w-5 text-gold" /> {brand.area}</span>
          </div>
        </div>
        <form onSubmit={submit} className="grid gap-4 bg-white p-6 md:grid-cols-2 md:p-8">
          {["Name", "Phone Number", "Email"].map((field) => (
            <label key={field} className="grid gap-2 text-sm font-bold text-plum">
              {field}
              <input required name={field.toLowerCase().split(" ").join("_")} type={field === "Email" ? "email" : "text"} className="rounded-2xl border border-petal bg-blush px-4 py-3 outline-none focus:border-saffron" />
            </label>
          ))}
          <label className="grid gap-2 text-sm font-bold text-plum">
            Service
            <select required name="service" className="rounded-2xl border border-petal bg-blush px-4 py-3 outline-none focus:border-saffron">
              <option value="">Select service</option>
              {servicesList.map((service) => <option key={service}>{service}</option>)}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-bold text-plum">
            Preferred Date
            <input required name="preferred_date" type="date" className="rounded-2xl border border-petal bg-blush px-4 py-3 outline-none focus:border-saffron" />
          </label>
          <label className="grid gap-2 text-sm font-bold text-plum">
            Preferred Time
            <input required name="preferred_time" type="time" className="rounded-2xl border border-petal bg-blush px-4 py-3 outline-none focus:border-saffron" />
          </label>
          <label className="grid gap-2 text-sm font-bold text-plum md:col-span-2">
            Message
            <textarea name="message" rows={4} className="rounded-2xl border border-petal bg-blush px-4 py-3 outline-none focus:border-saffron" />
          </label>
          <button className="inline-flex items-center justify-center gap-2 rounded-full bg-saffron px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-200 md:col-span-2">
            <CalendarCheck className="h-5 w-5" /> Book Appointment
          </button>
          {status && <p className="text-sm font-semibold text-leaf md:col-span-2">{status}</p>}
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-white py-14">
      <div className="section-shell grid gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-md leading-7 text-ink/70">Premium holistic care where evidence-based physiotherapy meets therapeutic yoga for long-term healing and wellness.</p>
        </div>
        <div>
          <h3 className="font-bold text-plum">Quick Links</h3>
          <div className="mt-4 grid gap-2">
            {nav.map((item) => <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-semibold text-ink/68 hover:text-saffron">{item}</a>)}
          </div>
        </div>
        <div>
          <h3 className="font-bold text-plum">Contact</h3>
          <div className="mt-4 grid gap-3 text-sm font-semibold text-ink/68">
            <span>{brand.phone}</span>
            <span>{brand.email}</span>
            <span>{brand.address}</span>
          </div>
          <div className="mt-5 flex gap-3 text-plum">
            <a href={`https://www.instagram.com/${brand.instagram}/`} target="_blank" rel="noreferrer" aria-label="Sukham Instagram">
              <Instagram className="h-5 w-5" />
            </a>
            <a href={`https://www.facebook.com/search/top/?q=${encodeURIComponent(brand.facebook)}`} target="_blank" rel="noreferrer" aria-label="Sukham Facebook">
              <Facebook className="h-5 w-5" />
            </a>
            {[Youtube, Linkedin].map((Icon, index) => <Icon key={index} className="h-5 w-5" />)}
          </div>
          <div className="mt-3 grid gap-1 text-sm font-semibold text-ink/60">
            <span>Instagram: @{brand.instagram}</span>
            <span>Facebook: {brand.facebook}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function SukhamSite() {
  const [introDone, setIntroDone] = useState(false);
  const { content } = useEditableContent();
  return (
    <>
      <AnimatePresence>{!introDone && <BreathingIntro onDone={() => setIntroDone(true)} />}</AnimatePresence>
      <Header />
      <main>
        <Hero slides={content.heroSlides} />
        <Reviews items={content.reviews} />
        <Experts items={content.experts} />
        <Services items={content.services} />
        <Plans />
        <WorkshopsAndBlogs items={content.workshops} />
        <Blogs items={content.blogs} />
        <Gallery images={content.gallery} />
        <WhatsappQuestion />
        <LocateCentre />
        <Appointment servicesList={content.services} />
      </main>
      <Footer />
      <WhatsappFloating />
    </>
  );
}

function ImageUploadCard({
  title,
  subtitle,
  image,
  onChange,
  portrait = false
}: {
  title: string;
  subtitle?: string;
  image: string;
  onChange: (image: string) => void;
  portrait?: boolean;
}) {
  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    onChange(await readImageFile(file));
  }

  return (
    <article className="overflow-hidden rounded-sukham border border-gold/20 bg-white shadow-sm">
      <div className={`relative bg-blush ${portrait ? "h-52" : "h-40"}`}>
        <Image src={image} alt={title} fill className="object-cover" unoptimized={image.startsWith("data:")} />
      </div>
      <div className="p-4">
        <h3 className="font-serif text-xl font-bold text-plum">{title}</h3>
        {subtitle && <p className="mt-1 min-h-10 text-sm leading-5 text-ink/62">{subtitle}</p>}
        <label className="mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-saffron px-4 py-3 text-sm font-bold text-white shadow-lg shadow-orange-100">
          <Upload className="h-4 w-4" />
          Change Picture
          <input type="file" accept="image/*" className="sr-only" onChange={handleFile} />
        </label>
      </div>
    </article>
  );
}

function ImageSection({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8">
      <h2 className="font-serif text-3xl font-bold text-plum">{title}</h2>
      <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{children}</div>
    </section>
  );
}

function ImageManager({
  content,
  updateImage,
  resetContent
}: {
  content: SiteContent;
  updateImage: (section: keyof SiteContent, index: number, image: string) => void;
  resetContent: () => void;
}) {
  return (
    <section className="soft-card mb-8 rounded-sukham p-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-bold uppercase text-saffron">Picture Manager</p>
          <h2 className="mt-1 font-serif text-4xl font-bold text-plum">Change images everywhere</h2>
          <p className="mt-3 max-w-2xl leading-7 text-ink/68">Upload from your computer. Hero, expert, review, workshop, blog and gallery images update immediately and persist in this browser.</p>
        </div>
        <button type="button" onClick={resetContent} className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-bold text-plum shadow-sm">
          Reset All Content
        </button>
      </div>

      <ImageSection title="Hero slider">
        {content.heroSlides.map((slide, index) => (
          <ImageUploadCard
            key={slide.title}
            title={`Slide ${index + 1}`}
            subtitle={slide.title}
            image={slide.image}
            onChange={(image) => updateImage("heroSlides", index, image)}
          />
        ))}
      </ImageSection>

      <ImageSection title="Expert profiles">
        {content.experts.map((expert, index) => (
          <ImageUploadCard
            key={expert.name}
            title={expert.name}
            subtitle={expert.role}
            image={expert.image}
            portrait
            onChange={(image) => updateImage("experts", index, image)}
          />
        ))}
      </ImageSection>

      <ImageSection title="Customer reviews">
        {content.reviews.map((review, index) => (
          <ImageUploadCard
            key={review.name}
            title={review.name}
            subtitle="Client photo"
            image={review.image}
            portrait
            onChange={(image) => updateImage("reviews", index, image)}
          />
        ))}
      </ImageSection>

      <ImageSection title="Workshops">
        {content.workshops.map((workshop, index) => (
          <ImageUploadCard
            key={workshop.title}
            title={workshop.title}
            subtitle={`${workshop.date} · ${workshop.time}`}
            image={workshop.image}
            onChange={(image) => updateImage("workshops", index, image)}
          />
        ))}
      </ImageSection>

      <ImageSection title="Blogs">
        {content.blogs.map((blog, index) => (
          <ImageUploadCard
            key={blog.title}
            title={blog.title}
            subtitle={blog.summary}
            image={blog.image}
            onChange={(image) => updateImage("blogs", index, image)}
          />
        ))}
      </ImageSection>

      <ImageSection title="Gallery">
        {content.gallery.map((image, index) => (
          <ImageUploadCard
            key={`${image}-${index}`}
            title={`Gallery image ${index + 1}`}
            image={image}
            onChange={(nextImage) => updateImage("gallery", index, nextImage)}
          />
        ))}
      </ImageSection>
    </section>
  );
}

function Field({ label, name, type = "text", value, placeholder }: { label: string; name: string; type?: string; value?: string; placeholder?: string }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-plum">
      {label}
      <input name={name} type={type} defaultValue={value} placeholder={placeholder} className="rounded-2xl border border-petal bg-white px-4 py-3 text-sm outline-none focus:border-saffron" />
    </label>
  );
}

function TextAreaField({ label, name, value, placeholder }: { label: string; name: string; value?: string; placeholder?: string }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-plum">
      {label}
      <textarea name={name} defaultValue={value} placeholder={placeholder} rows={4} className="rounded-2xl border border-petal bg-white px-4 py-3 text-sm outline-none focus:border-saffron" />
    </label>
  );
}

function FormPanel({ title, children, onSubmit }: { title: string; children: React.ReactNode; onSubmit: (form: HTMLFormElement) => void }) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(event.currentTarget);
        event.currentTarget.reset();
      }}
      className="rounded-sukham border border-gold/20 bg-white p-5 shadow-sm"
    >
      <h3 className="font-serif text-2xl font-bold text-plum">{title}</h3>
      <div className="mt-5 grid gap-4">{children}</div>
      <button className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-plum px-5 py-3 text-sm font-bold text-white">
        <Plus className="h-4 w-4" />
        Add {title.replace("Add ", "")}
      </button>
    </form>
  );
}

function AdminContentManager({
  content,
  addItem,
  updateExpert
}: {
  content: SiteContent;
  addItem: (section: "workshops" | "blogs" | "reviews" | "experts", item: SiteContent["workshops"][number] | SiteContent["blogs"][number] | SiteContent["reviews"][number] | SiteContent["experts"][number]) => void;
  updateExpert: (index: number, fields: Partial<SiteContent["experts"][number]>) => void;
}) {
  return (
    <section className="soft-card mb-8 rounded-sukham p-6">
      <p className="text-sm font-bold uppercase text-saffron">Content Editor</p>
      <h2 className="mt-1 font-serif text-4xl font-bold text-plum">Add and edit site content</h2>
      <p className="mt-3 max-w-2xl leading-7 text-ink/68">These prototype forms save in this browser. Connect the same fields to Supabase tables for production.</p>

      <div className="mt-7 grid gap-5 lg:grid-cols-2">
        <FormPanel
          title="Add Workshop"
          onSubmit={(form) => {
            const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
            addItem("workshops", {
              title: data.title || "New Workshop",
              date: data.date || "Upcoming",
              time: data.time || "To be announced",
              location: data.location || brand.area,
              description: data.description || "Workshop details coming soon.",
              image: data.image || "https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=900&q=85"
            });
          }}
        >
          <Field label="Title" name="title" />
          <Field label="Date" name="date" placeholder="Every Saturday" />
          <Field label="Time" name="time" placeholder="8:00 AM" />
          <Field label="Location" name="location" value={brand.area} />
          <Field label="Image URL" name="image" />
          <TextAreaField label="Description" name="description" />
        </FormPanel>

        <FormPanel
          title="Add Blog"
          onSubmit={(form) => {
            const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
            addItem("blogs", {
              title: data.title || "New Blog",
              summary: data.summary || "Helpful wellness insight from Sukham.",
              image: data.image || "https://images.unsplash.com/photo-1593164842264-854604db2260?auto=format&fit=crop&w=900&q=85"
            });
          }}
        >
          <Field label="Title" name="title" />
          <Field label="Image URL" name="image" />
          <TextAreaField label="Summary" name="summary" />
        </FormPanel>

        <FormPanel
          title="Add Review"
          onSubmit={(form) => {
            const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
            addItem("reviews", {
              name: data.name || "Sukham Client",
              rating: Number(data.rating || 5),
              image: data.image || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
              review: data.review || "A warm and professional healing experience."
            });
          }}
        >
          <Field label="Client Name" name="name" />
          <Field label="Rating" name="rating" type="number" value="5" />
          <Field label="Client Image URL" name="image" />
          <TextAreaField label="Review" name="review" />
        </FormPanel>

        <FormPanel
          title="Add Expert"
          onSubmit={(form) => {
            const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
            addItem("experts", {
              name: data.name || "New Expert",
              role: data.role || "Sukham Wellness Expert",
              image: data.image || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=85",
              bio: data.bio || "Expert profile details coming soon.",
              details: (data.details || "Therapeutic care,Personal guidance").split(",").map((item) => item.trim()).filter(Boolean),
              certificates: (data.certificates || "Certification").split(",").map((item) => item.trim()).filter(Boolean)
            });
          }}
        >
          <Field label="Name" name="name" />
          <Field label="Role / Qualification" name="role" />
          <Field label="Image URL" name="image" />
          <TextAreaField label="Bio" name="bio" />
          <TextAreaField label="Specializations, comma separated" name="details" />
          <TextAreaField label="Certificates, comma separated" name="certificates" />
        </FormPanel>
      </div>

      <section className="mt-9">
        <h3 className="font-serif text-3xl font-bold text-plum">Edit expert information</h3>
        <div className="mt-4 grid gap-5 lg:grid-cols-2">
          {content.experts.map((expert, index) => (
            <form
              key={`${expert.name}-${index}`}
              onSubmit={(event) => {
                event.preventDefault();
                const data = Object.fromEntries(new FormData(event.currentTarget).entries()) as Record<string, string>;
                updateExpert(index, {
                  name: data.name,
                  role: data.role,
                  bio: data.bio,
                  details: data.details.split(",").map((item) => item.trim()).filter(Boolean),
                  certificates: data.certificates.split(",").map((item) => item.trim()).filter(Boolean)
                });
              }}
              className="rounded-sukham border border-gold/20 bg-white p-5 shadow-sm"
            >
              <div className="relative mb-5 h-48 overflow-hidden rounded-2xl bg-blush">
                <Image src={expert.image} alt={expert.name} fill className="object-cover" unoptimized={expert.image.startsWith("data:")} />
              </div>
              <div className="grid gap-4">
                <Field label="Name" name="name" value={expert.name} />
                <Field label="Role / Qualification" name="role" value={expert.role} />
                <TextAreaField label="Bio" name="bio" value={expert.bio} />
                <TextAreaField label="Specializations, comma separated" name="details" value={expert.details.join(", ")} />
                <TextAreaField label="Certificates, comma separated" name="certificates" value={expert.certificates.join(", ")} />
              </div>
              <button className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-saffron px-5 py-3 text-sm font-bold text-white">
                <Save className="h-4 w-4" />
                Save Expert Info
              </button>
            </form>
          ))}
        </div>
      </section>
    </section>
  );
}

function csvValue(value: string) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function exportAppointmentsCsv(appointments: AppointmentEntry[]) {
  const headers = ["Name", "Phone Number", "Email", "Service", "Preferred Date", "Preferred Time", "Message", "Status", "Submitted At"];
  const rows = appointments.map((appointment) => [
    appointment.name,
    appointment.phone_number,
    appointment.email,
    appointment.service,
    appointment.preferred_date,
    appointment.preferred_time,
    appointment.message,
    appointment.status,
    new Date(appointment.created_at).toLocaleString()
  ]);
  const csv = [headers, ...rows].map((row) => row.map(csvValue).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `sukham-patient-entries-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function AppointmentReviewSection({
  appointments,
  search,
  onSearch,
  onStatusChange
}: {
  appointments: AppointmentEntry[];
  search: string;
  onSearch: (value: string) => void;
  onStatusChange: (id: string, status: AppointmentStatus) => void;
}) {
  const filteredAppointments = appointments.filter((appointment) => {
    const haystack = [
      appointment.name,
      appointment.phone_number,
      appointment.email,
      appointment.service,
      appointment.status,
      appointment.preferred_date,
      appointment.preferred_time,
      appointment.message
    ].join(" ").toLowerCase();
    return haystack.includes(search.toLowerCase());
  });

  return (
    <section className="soft-card rounded-sukham p-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-bold uppercase text-saffron">Patient Entries</p>
          <h2 className="font-serif text-3xl font-bold text-plum">Appointment review</h2>
          <p className="mt-2 text-sm leading-6 text-ink/65">Review incoming booking requests, approve or reject them, and export all patient entries as a CSV spreadsheet.</p>
        </div>
        <button
          type="button"
          onClick={() => exportAppointmentsCsv(appointments)}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-saffron px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-100 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={appointments.length === 0}
        >
          <Download className="h-4 w-4" />
          CSV Data Export
        </button>
      </div>

      <div className="mt-5 md:hidden">
        <label className="grid gap-2 text-sm font-bold text-plum">
          Search appointments
          <input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Name, phone, service, status" className="h-12 rounded-full border border-petal bg-white px-5 text-sm outline-none focus:border-saffron" />
        </label>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[920px] text-left text-sm">
          <thead className="text-plum">
            <tr>
              <th className="py-3">Patient</th>
              <th>Contact</th>
              <th>Service</th>
              <th>Preferred Slot</th>
              <th>Message</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="text-ink/72">
            {filteredAppointments.map((appointment) => (
              <tr key={appointment.id} className="border-t border-petal align-top">
                <td className="py-4">
                  <div className="font-bold text-plum">{appointment.name}</div>
                  <div className="mt-1 text-xs text-ink/50">{new Date(appointment.created_at).toLocaleString()}</div>
                </td>
                <td className="py-4">
                  <div className="font-semibold">{appointment.phone_number}</div>
                  <div className="mt-1 text-xs">{appointment.email}</div>
                </td>
                <td className="py-4 font-semibold">{appointment.service}</td>
                <td className="py-4">
                  <div>{appointment.preferred_date}</div>
                  <div className="mt-1 text-xs">{appointment.preferred_time}</div>
                </td>
                <td className="max-w-[220px] py-4 leading-6">{appointment.message || "No message"}</td>
                <td className="py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      appointment.status === "Confirmed"
                        ? "bg-green-50 text-leaf"
                        : appointment.status === "Cancelled"
                          ? "bg-red-50 text-red-600"
                          : "bg-blush text-magenta"
                    }`}
                  >
                    {appointment.status}
                  </span>
                </td>
                <td className="py-4">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onStatusChange(appointment.id, "Confirmed")}
                      className="rounded-full bg-leaf px-3 py-2 text-xs font-bold text-white"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => onStatusChange(appointment.id, "Cancelled")}
                      className="rounded-full bg-white px-3 py-2 text-xs font-bold text-red-600 shadow-sm"
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredAppointments.length === 0 && (
              <tr className="border-t border-petal">
                <td colSpan={7} className="py-8 text-center text-ink/58">
                  No patient entries yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ServicesManager({
  services,
  addService,
  removeService
}: {
  services: string[];
  addService: (service: string) => void;
  removeService: (index: number) => void;
}) {
  const [newService, setNewService] = useState("");

  return (
    <section className="soft-card mb-8 rounded-sukham p-6">
      <p className="text-sm font-bold uppercase text-saffron">Services Manager</p>
      <h2 className="mt-1 font-serif text-4xl font-bold text-plum">Edit services</h2>
      <p className="mt-3 max-w-2xl leading-7 text-ink/68">
        Add or remove services shown on the homepage and appointment form.
      </p>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          addService(newService);
          setNewService("");
        }}
        className="mt-6 flex flex-col gap-3 md:flex-row"
      >
        <input
          value={newService}
          onChange={(event) => setNewService(event.target.value)}
          placeholder="Add new service"
          className="h-12 flex-1 rounded-full border border-petal bg-white px-5 text-sm outline-none focus:border-saffron"
        />

        <button className="inline-flex items-center justify-center rounded-full bg-plum px-6 py-3 text-sm font-bold text-white">
          Add Service
        </button>
      </form>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <div
            key={`${service}-${index}`}
            className="flex items-center justify-between gap-3 rounded-2xl border border-petal bg-white px-4 py-3"
          >
            <span className="text-sm font-bold text-plum">{service}</span>

            <button
              type="button"
              onClick={() => removeService(index)}
              className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export function AdminDashboard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const {
  content,
  updateImage,
  addItem,
  updateExpert,
  addService,
  removeService,
  resetContent
  } = useEditableContent();
  const { appointments, updateAppointmentStatus } = useAppointments();
  const [appointmentSearch, setAppointmentSearch] = useState("");
  const modules = useMemo(() => [
    ["Homepage", "Hero images, text and CTA buttons", content.heroSlides.length, Upload],
    ["Experts", "Profiles, certificates and qualifications", content.experts.length, HeartPulse],
    ["Plans", "Unlimited pricing plans and featured flag", plans.length, Check],
    ["Workshops", "Images, schedule and descriptions", content.workshops.length, CalendarCheck],
    ["Blogs", "Posts, summaries and featured images", content.blogs.length, ArrowRight],
    ["Gallery", "Upload, delete and reorder photos", content.gallery.length, Upload],
    ["Reviews", "Client image, rating and testimonial", content.reviews.length, Star],
    ["Appointments", "Search, export and approve/reject entries", appointments.length, Filter]
  ] as const, [content, appointments.length]);

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-blush">
        <Header />
        <main className="section-shell grid min-h-screen place-items-center pt-24">
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              setAuthError("");

            const { data, error } = await supabaseBrowser.auth.signInWithPassword({
              email,
              password
            });

            if (error) {
             setAuthError(error.message);
            return;
          }

          const userEmail = data.user?.email?.trim().toLowerCase();
          const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.trim().toLowerCase();

          if (userEmail !== adminEmail) {
            await supabaseBrowser.auth.signOut();
            setAuthError("This email is not allowed as admin.");
            return;
        }

          setAuthenticated(true);
}}
            className="soft-card w-full max-w-md rounded-sukham p-8"
          >
            <Logo />
            <p className="mt-8 text-sm font-bold uppercase text-saffron">Admin Login</p>
            <h1 className="mt-2 font-serif text-4xl font-bold text-plum">Secure content access</h1>
            <label className="mt-7 grid gap-2 text-sm font-bold text-plum">
              Email
              <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="rounded-2xl border border-petal bg-white px-4 py-3 outline-none focus:border-saffron" />
            </label>
            <label className="mt-4 grid gap-2 text-sm font-bold text-plum">
              Password
              <input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="rounded-2xl border border-petal bg-white px-4 py-3 outline-none focus:border-saffron" />
            </label>
            <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-plum px-5 py-3 text-sm font-bold text-white">
              Login to Dashboard
            </button>
            {authError && (
              <p className="mt-4 text-sm font-semibold text-red-600">
                {authError}
              </p>
              )}
            <p className="mt-4 text-xs leading-5 text-ink/58">Prototype login. Replace with Supabase Auth middleware and admin roles for production.</p>
          </form>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blush">
      <Header />
      <main className="section-shell pt-32 pb-20">
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase text-saffron">Secure Admin Panel</p>
            <h1 className="mt-2 font-serif text-5xl font-bold text-plum">Sukham Dashboard</h1>
            <p className="mt-4 max-w-2xl leading-8 text-ink/70">Use the upload controls below to physically replace pictures across the prototype. Changes are saved in this browser and immediately appear on the public site.</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-3.5 h-4 w-4 text-ink/45" />
              <input
                value={appointmentSearch}
                onChange={(event) => setAppointmentSearch(event.target.value)}
                placeholder="Search appointments"
                className="h-12 rounded-full border border-petal bg-white pl-11 pr-4 text-sm outline-none focus:border-saffron"
              />
            </div>
            <button className="grid h-12 w-12 place-items-center rounded-full bg-white text-plum shadow-sm" aria-label="Filter appointments">
              <Filter className="h-5 w-5" />
            </button>
          </div>
        </div>
        <ImageManager content={content} updateImage={updateImage} resetContent={resetContent} />
        <ServicesManager services={content.services} addService={addService} removeService={removeService} />
        <AdminContentManager content={content} addItem={addItem} updateExpert={updateExpert} />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {modules.map(([title, description, count, Icon]) => (
            <article key={title} className="soft-card rounded-sukham p-6">
              <div className="flex items-center justify-between">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-petal text-plum">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-saffron">{count} items</span>
              </div>
              <h2 className="mt-5 font-serif text-2xl font-bold text-plum">{title}</h2>
              <p className="mt-2 min-h-14 text-sm leading-6 text-ink/68">{description}</p>
              <button className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-plum px-4 py-3 text-sm font-bold text-white">
                Manage {title}
              </button>
            </article>
          ))}
        </div>
        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.72fr]">
          <AppointmentReviewSection
            appointments={appointments}
            search={appointmentSearch}
            onSearch={setAppointmentSearch}
            onStatusChange={updateAppointmentStatus}
          />
          <div className="soft-card rounded-sukham p-6">
            <h2 className="font-serif text-3xl font-bold text-plum">Supabase tables</h2>
            <div className="mt-5 grid gap-3">
              {["hero_slides", "experts", "certificates", "plans", "workshops", "blogs", "gallery", "reviews", "appointments"].map((table) => (
                <div key={table} className="rounded-2xl bg-white px-4 py-3 text-sm font-bold text-ink/72">{table}</div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
