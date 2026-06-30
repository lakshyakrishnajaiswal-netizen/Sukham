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
  Twitter,
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
const socialLinks = {
  instagram: "https://www.instagram.com/sukham_yoga_physiotherapy?igsh=NGc3NDNuZXV0d3lo",
  facebook: "https://www.facebook.com/profile.php?id=61590299987244",
  youtube: "https://www.youtube.com/@SukhamCentre",
  twitter: "https://x.com/SukhamCentre"
};
const STORAGE_KEY = "sukham-site-content-v1";
type ServiceItem = {
  title: string;
  image: string;
};
type ServiceCategory = {
  title: string;
  services: ServiceItem[];
};
type ProblemItem = {
    title: string;
    image: string;
  };

type ProblemCategory = {
    title: string;
    problems: ProblemItem[];
  };

const defaultServiceImage =
  "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=85";

const defaultServiceCategories: ServiceCategory[] = [
  {
    title: "Postural Disorders",
    services: [
      { title: "Posture Assessment", image: defaultServiceImage },
      { title: "Posture Correction", image: defaultServiceImage },
      { title: "Desk Ergonomics Training", image: defaultServiceImage },
      { title: "Spine Alignment Exercises", image: defaultServiceImage },
      { title: "Mobility Reset Sessions", image: defaultServiceImage },
    ],
  },
  {
    title: "Musculoskeletal Disorders",
    services: [
      { title: "Orthopedic Rehabilitation", image: defaultServiceImage },
      { title: "Sports Injury Rehab", image: defaultServiceImage },
      { title: "Post-Surgical Rehab", image: defaultServiceImage },
      { title: "Pain Management", image: defaultServiceImage },
      { title: "Corrective Exercises", image: defaultServiceImage },
    ],
  },
  {
    title: "Neurological & Psychological Disorders",
    services: [
      { title: "Neurological Rehabilitation", image: defaultServiceImage },
      { title: "Balance Training", image: defaultServiceImage },
      { title: "Stress Management", image: defaultServiceImage },
      { title: "Breathing Training", image: defaultServiceImage },
      { title: "Therapeutic Yoga", image: defaultServiceImage },
    ],
  },
  {
    title: "Cardiovascular-Respiratory Disorders",
    services: [
      { title: "Breathwork Therapy", image: defaultServiceImage },
      { title: "Stamina Building", image: defaultServiceImage },
      { title: "Cardio-Respiratory Conditioning", image: defaultServiceImage },
      { title: "Gentle Fitness Recovery", image: defaultServiceImage },
      { title: "Lifestyle Wellness Sessions", image: defaultServiceImage },
    ],
  },
  {
    title: "Digestive & Endocrine Disorders",
    services: [
      { title: "Weight Management", image: defaultServiceImage },
      { title: "Nutrition Guidance", image: defaultServiceImage },
      { title: "Lifestyle Disorder Management", image: defaultServiceImage },
      { title: "Metabolic Wellness Support", image: defaultServiceImage },
      { title: "Yoga for Digestion", image: defaultServiceImage },
    ],
  },
  {
    title: "Urogenital & Gynecological Disorders",
    services: [
      { title: "Prenatal Yoga", image: defaultServiceImage },
      { title: "Postnatal Yoga", image: defaultServiceImage },
      { title: "Pelvic Floor Support", image: defaultServiceImage },
      { title: "Women’s Wellness Therapy", image: defaultServiceImage },
      { title: "Senior Citizen Mobility", image: defaultServiceImage },
    ],
  },
  {
    title: "Autoimmune Disorders",
    services: [
      { title: "Gentle Mobility Therapy", image: defaultServiceImage },
      { title: "Pain Flare-Up Support", image: defaultServiceImage },
      { title: "Joint Stiffness Care", image: defaultServiceImage },
      { title: "Energy Conservation Training", image: defaultServiceImage },
      { title: "Long-Term Wellness Program", image: defaultServiceImage },
    ],
  },
];

type SiteContent = {
  heroSlides: typeof heroSlides;
  reviews: typeof reviews;
  experts: typeof experts;
  workshops: typeof workshops;
  blogs: typeof blogs;
  gallery: typeof gallery;
  serviceCategories: ServiceCategory[];
  plans: typeof plans;
  certificates: string[];
  journeys: JourneyItem[];
  problemCategories: ProblemCategory[];
};

type AppointmentStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

type JourneyItem = {
  title: string;
  copy: string;
  beforeImage: string;
  afterImage: string;
};

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

const defaultJourneyImage =
  "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=85";

const defaultJourneys: JourneyItem[] = [
  {
    title: "Posture Correction Journey",
    copy: "A guided recovery journey focused on alignment, mobility and awareness to help improve everyday posture and comfort.",
    beforeImage: defaultJourneyImage,
    afterImage: defaultJourneyImage
  },
  {
    title: "Pain Relief Journey",
    copy: "A personalized approach combining physiotherapy and therapeutic movement to reduce pain and restore confidence.",
    beforeImage: defaultJourneyImage,
    afterImage: defaultJourneyImage
  },
  {
    title: "Mobility Improvement Journey",
    copy: "A steady progression of strength, flexibility and guided practice to support smoother, safer movement.",
    beforeImage: defaultJourneyImage,
    afterImage: defaultJourneyImage
  },
  {
    title: "Yoga Transformation Journey",
    copy: "A mindful journey from stiffness and stress toward greater breath awareness, balance and inner calm.",
    beforeImage: defaultJourneyImage,
    afterImage: defaultJourneyImage
  },
  {
    title: "Rehabilitation Journey",
    copy: "A structured rehabilitation pathway built around assessment, corrective exercises and progress tracking.",
    beforeImage: defaultJourneyImage,
    afterImage: defaultJourneyImage
  },
  {
    title: "Wellness Lifestyle Journey",
    copy: "A holistic shift toward sustainable wellness through movement, nutrition and daily lifestyle guidance.",
    beforeImage: defaultJourneyImage,
    afterImage: defaultJourneyImage
  }
];
const defaultProblemImage =
  "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=85";

const defaultProblemCategories: ProblemCategory[] = [
  {
    title: "Postural Disorders",
    problems: [
      { title: "Poor posture", image: defaultProblemImage },
      { title: "Rounded shoulders", image: defaultProblemImage },
      { title: "Forward neck posture", image: defaultProblemImage },
      { title: "Back stiffness", image: defaultProblemImage },
      { title: "Work-from-desk strain", image: defaultProblemImage },
    ],
  },
  {
    title: "Musculoskeletal Disorders",
    problems: [
      { title: "Neck pain", image: defaultProblemImage },
      { title: "Shoulder pain", image: defaultProblemImage },
      { title: "Lower back pain", image: defaultProblemImage },
      { title: "Knee pain", image: defaultProblemImage },
      { title: "Sports injuries", image: defaultProblemImage },
    ],
  },
  {
    title: "Neurological & Psychological Disorders",
    problems: [
      { title: "Stress and anxiety", image: defaultProblemImage },
      { title: "Sleep disturbance", image: defaultProblemImage },
      { title: "Post-stroke movement issues", image: defaultProblemImage },
      { title: "Balance problems", image: defaultProblemImage },
      { title: "Low confidence after injury", image: defaultProblemImage },
    ],
  },
  {
    title: "Cardiovascular-Respiratory Disorders",
    problems: [
      { title: "Low stamina", image: defaultProblemImage },
      { title: "Breathing difficulty", image: defaultProblemImage },
      { title: "Post-illness weakness", image: defaultProblemImage },
      { title: "Reduced endurance", image: defaultProblemImage },
      { title: "Lifestyle-related fatigue", image: defaultProblemImage },
    ],
  },
  {
    title: "Digestive & Endocrine Disorders",
    problems: [
      { title: "Weight management concerns", image: defaultProblemImage },
      { title: "Lifestyle imbalance", image: defaultProblemImage },
      { title: "Low energy levels", image: defaultProblemImage },
      { title: "Digestive discomfort", image: defaultProblemImage },
      { title: "Metabolic health support", image: defaultProblemImage },
    ],
  },
  {
    title: "Urogenital & Gynecological Disorders",
    problems: [
      { title: "Prenatal discomfort", image: defaultProblemImage },
      { title: "Postnatal recovery", image: defaultProblemImage },
      { title: "Pelvic floor weakness", image: defaultProblemImage },
      { title: "Menstrual health support", image: defaultProblemImage },
      { title: "Women’s wellness care", image: defaultProblemImage },
    ],
  },
  {
    title: "Autoimmune Disorders",
    problems: [
      { title: "Joint stiffness", image: defaultProblemImage },
      { title: "Chronic fatigue", image: defaultProblemImage },
      { title: "Mobility limitation", image: defaultProblemImage },
      { title: "Pain flare-up support", image: defaultProblemImage },
      { title: "Long-term wellness management", image: defaultProblemImage },
    ],
  },
];
const defaultContent: SiteContent = {
  heroSlides,
  reviews,
  experts,
  workshops,
  blogs,
  gallery,
  plans,
  certificates: [],
  journeys: defaultJourneys,
  problemCategories: defaultProblemCategories,
  serviceCategories: defaultServiceCategories,
};

function isLocalImageData(value: unknown) {
  return typeof value === "string" && value.startsWith("data:image");
}

function prepareContentForStorage(content: SiteContent) {
  const next = structuredClone(content) as SiteContent;

  next.heroSlides = next.heroSlides.map((slide, index) => ({
    ...slide,
    image: isLocalImageData(slide.image)
      ? defaultContent.heroSlides[index]?.image || defaultContent.heroSlides[0].image
      : slide.image
  }));

  next.reviews = next.reviews.map((review, index) => ({
    ...review,
    image: isLocalImageData(review.image)
      ? defaultContent.reviews[index]?.image || defaultContent.reviews[0].image
      : review.image
  }));

  next.experts = next.experts.map((expert, index) => ({
    ...expert,
    image: isLocalImageData(expert.image)
      ? defaultContent.experts[index]?.image || defaultContent.experts[0].image
      : expert.image
  }));

  next.workshops = next.workshops.map((workshop, index) => ({
    ...workshop,
    image: isLocalImageData(workshop.image)
      ? defaultContent.workshops[index]?.image || defaultContent.workshops[0].image
      : workshop.image
  }));

  next.blogs = next.blogs.map((blog, index) => ({
    ...blog,
    image: isLocalImageData(blog.image)
      ? defaultContent.blogs[index]?.image || defaultContent.blogs[0].image
      : blog.image
  }));

  next.gallery = next.gallery.filter((image) => !isLocalImageData(image));
  next.certificates = next.certificates.filter((image) => !isLocalImageData(image));

  next.journeys = next.journeys.map((journey) => ({
    ...journey,
    beforeImage: isLocalImageData(journey.beforeImage) ? defaultJourneyImage : journey.beforeImage,
    afterImage: isLocalImageData(journey.afterImage) ? defaultJourneyImage : journey.afterImage
  }));

  next.problemCategories = next.problemCategories.map((category) => ({
    ...category,
    problems: category.problems.map((problem) => ({
      ...problem,
      image: isLocalImageData(problem.image) ? defaultProblemImage : problem.image
    }))
  }));

  next.serviceCategories = next.serviceCategories.map((category) => ({
    ...category,
    services: category.services.map((service) => ({
      ...service,
      image: isLocalImageData(service.image) ? defaultServiceImage : service.image
    }))
  }));

  return next;
}

function useEditableContent() {
  const [content, setContent] = useState<SiteContent>(defaultContent);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
    try {
      const parsedContent = JSON.parse(saved);

      const parsed = {
        ...defaultContent,
        ...parsedContent,
        problemCategories:
          parsedContent.problemCategories || defaultContent.problemCategories,
        serviceCategories:
          parsedContent.serviceCategories || defaultContent.serviceCategories,
      };
        setContent(parsed);

      parsed.reviews = parsed.reviews.map((review: typeof reviews[number] & { video?: string }) => ({
        ...review,
        video: review.video || ""
      }));

      parsed.services = parsed.services.map((service: string | ServiceItem) =>
        typeof service === "string"
          ? { title: service, image: defaultServiceImage }
          : service
      );

      setContent(parsed);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
      setContent(defaultContent);
    }
  };
  }, []);

  function commit(next: SiteContent) {
    setContent(next);
    const storageContent = prepareContentForStorage(next);

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(storageContent));
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(storageContent));
    }
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
  function addGalleryImage(image: string) {
    const cleanImage = image.trim();

    if (!cleanImage) return;

    const next = structuredClone(content) as SiteContent;
    next.gallery = [cleanImage, ...next.gallery];
    commit(next);
  }

  function removeGalleryImage(index: number) {
    const next = structuredClone(content) as SiteContent;
    next.gallery = next.gallery.filter((_, imageIndex) => imageIndex !== index);
    commit(next);
  }
  function removeWorkshop(index: number) {
  const next = structuredClone(content) as SiteContent;
  next.workshops = next.workshops.filter((_, workshopIndex) => workshopIndex !== index);
  commit(next);
}

function removeBlog(index: number) {
  const next = structuredClone(content) as SiteContent;
  next.blogs = next.blogs.filter((_, blogIndex) => blogIndex !== index);
  commit(next);
}
  function addPlan(plan: SiteContent["plans"][number]) {
    const next = structuredClone(content) as SiteContent;
    next.plans = [plan, ...next.plans];
    commit(next);
  }

  function updatePlan(index: number, fields: Partial<SiteContent["plans"][number]>) {
    const next = structuredClone(content) as SiteContent;
    next.plans[index] = { ...next.plans[index], ...fields };
    commit(next);
  }

  function removePlan(index: number) {
    const next = structuredClone(content) as SiteContent;
    next.plans = next.plans.filter((_, planIndex) => planIndex !== index);
    commit(next);
  }
  function addCertificate(image: string) {
    const cleanImage = image.trim();

    if (!cleanImage) return;

    const next = structuredClone(content) as SiteContent;
    next.certificates = [cleanImage, ...next.certificates];
    commit(next);
  }

  function removeCertificate(index: number) {
    const next = structuredClone(content) as SiteContent;
    next.certificates = next.certificates.filter((_, certificateIndex) => certificateIndex !== index);
    commit(next);
  }
  function updateReview(index: number, fields: Partial<SiteContent["reviews"][number]>) {
    const next = structuredClone(content) as SiteContent;
    next.reviews[index] = {
      ...next.reviews[index],
      ...fields
    };
    commit(next);
  }
  function addJourney(journey: JourneyItem) {
    const next = structuredClone(content) as SiteContent;
    next.journeys = [journey, ...next.journeys];
    commit(next);
  }

  function updateJourney(index: number, fields: Partial<JourneyItem>) {
    const next = structuredClone(content) as SiteContent;
    next.journeys[index] = {
      ...next.journeys[index],
      ...fields
    };
    commit(next);
  }

  function removeJourney(index: number) {
    const next = structuredClone(content) as SiteContent;
    next.journeys = next.journeys.filter((_, journeyIndex) => journeyIndex !== index);
    commit(next);
  }
  function addProblemCategory() {
    commit({
      ...content,
      problemCategories: [
        ...content.problemCategories,
        {
          title: "New Problem Category",
          problems: [
            {
              title: "New problem",
              image: defaultProblemImage,
            },
          ],
        },
      ],
    });
  }

  function updateProblemCategory(categoryIndex: number, title: string) {
    commit({
      ...content,
      problemCategories: content.problemCategories.map((category, index) =>
        index === categoryIndex ? { ...category, title } : category
      ),
    });
  }

  function removeProblemCategory(categoryIndex: number) {
    commit({
      ...content,
      problemCategories: content.problemCategories.filter(
        (_, index) => index !== categoryIndex
      ),
    });
  }

  function addProblem(categoryIndex: number) {
    commit({
      ...content,
      problemCategories: content.problemCategories.map((category, index) =>
        index === categoryIndex
          ? {
              ...category,
              problems: [
                ...category.problems,
                {
                  title: "New problem",
                  image: defaultProblemImage,
                },
              ],
            }
          : category
      ),
    });
  }

  function updateProblem(
    categoryIndex: number,
    problemIndex: number,
    fields: Partial<ProblemItem>
  ) {
    commit({
      ...content,
      problemCategories: content.problemCategories.map((category, index) =>
        index === categoryIndex
          ? {
              ...category,
              problems: category.problems.map((problem, innerIndex) =>
                innerIndex === problemIndex ? { ...problem, ...fields } : problem
              ),
            }
          : category
      ),
    });
  }

  function removeProblem(categoryIndex: number, problemIndex: number) {
    commit({
      ...content,
      problemCategories: content.problemCategories.map((category, index) =>
        index === categoryIndex
          ? {
              ...category,
              problems: category.problems.filter(
                (_, innerIndex) => innerIndex !== problemIndex
              ),
            }
          : category
      ),
    });
  }
  function addServiceCategory() {
  commit({
    ...content,
    serviceCategories: [
      ...content.serviceCategories,
      {
        title: "New Service Department",
        services: [
          {
            title: "New service",
            image: defaultServiceImage,
          },
        ],
      },
    ],
  });
}

function updateServiceCategory(categoryIndex: number, title: string) {
  commit({
    ...content,
    serviceCategories: content.serviceCategories.map((category, index) =>
      index === categoryIndex ? { ...category, title } : category
    ),
  });
}

function removeServiceCategory(categoryIndex: number) {
  commit({
    ...content,
    serviceCategories: content.serviceCategories.filter(
      (_, index) => index !== categoryIndex
    ),
  });
}

function addService(categoryIndex: number) {
  commit({
    ...content,
    serviceCategories: content.serviceCategories.map((category, index) =>
      index === categoryIndex
        ? {
            ...category,
            services: [
              ...category.services,
              {
                title: "New service",
                image: defaultServiceImage,
              },
            ],
          }
        : category
    ),
  });
}

function updateService(
  categoryIndex: number,
  serviceIndex: number,
  fields: Partial<ServiceItem>
) {
  commit({
    ...content,
    serviceCategories: content.serviceCategories.map((category, index) =>
      index === categoryIndex
        ? {
            ...category,
            services: category.services.map((service, innerIndex) =>
              innerIndex === serviceIndex ? { ...service, ...fields } : service
            ),
          }
        : category
    ),
  });
}

function removeService(categoryIndex: number, serviceIndex: number) {
  commit({
    ...content,
    serviceCategories: content.serviceCategories.map((category, index) =>
      index === categoryIndex
        ? {
            ...category,
            services: category.services.filter(
              (_, innerIndex) => innerIndex !== serviceIndex
            ),
          }
        : category
    ),
  });
}

  function resetContent() {
    window.localStorage.removeItem(STORAGE_KEY);
    setContent(defaultContent);
  }

  return {
    content,
    updateImage,
    addItem,
    updateExpert,
    addServiceCategory,
    updateServiceCategory,
    removeServiceCategory,
    addService,
    updateService,
    removeService,
    addGalleryImage,
    removeGalleryImage,
    removeWorkshop,
    removeBlog,
    addPlan,
    updatePlan,
    removePlan,
    addCertificate,
    removeCertificate,
    updateReview,
    addJourney,
    updateJourney,
    removeJourney,
    addProblemCategory,
    updateProblemCategory,
    removeProblemCategory,
    addProblem,
    updateProblem,
    removeProblem,
    resetContent
  };
}
async function uploadImageFile(file: File, bucket = "gallery") {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("bucket", bucket);

  const response = await fetch("/api/upload-image", {
    method: "POST",
    body: formData
  });

  const result = await response.json();

  if (!result.ok) {
    throw new Error(result.error || "Image upload failed");
  }

  return result.url as string;
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
            <ButtonLink href="#services">{slide.cta}</ButtonLink>
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
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  return (
    <section className="section-shell -mt-16 relative z-20">
      <div className="mb-5">
        <p className="text-sm font-bold uppercase text-saffron">Reviews & Testimonials</p>
        <h2 className="font-serif text-4xl font-bold text-plum">Stories of healing and progress</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {items.map((review) => (
          <article key={review.name} className="soft-card rounded-sukham p-6">
            <div className="flex items-center gap-4">
              <Image
                src={review.image}
                alt={review.name}
                width={58}
                height={58}
                className="h-14 w-14 rounded-full object-cover"
                unoptimized={review.image.startsWith("data:")}
              />

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

            {review.video && (
              <button
                type="button"
                onClick={() => setSelectedVideo(review.video)}
                className="mt-5 flex w-full items-center justify-between rounded-2xl border border-petal bg-blush px-4 py-3 text-left text-sm font-bold text-plum transition hover:border-saffron hover:bg-white"
              >
                <span>Watch video testimonial</span>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-saffron text-white">
                  ▶
                </span>
              </button>
            )}
          </article>
        ))}
      </div>

      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            className="fixed inset-0 z-[95] grid place-items-center bg-plum/82 p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              aria-label="Close testimonial video"
              onClick={() => setSelectedVideo(null)}
              className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white text-plum"
            >
              <X className="h-5 w-5" />
            </button>

            <motion.div
              initial={{ scale: 0.94, rotate: -1, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.94, rotate: 1, opacity: 0 }}
              className="w-full max-w-4xl overflow-hidden rounded-sukham bg-black shadow-wellness"
            >
              <video
                src={selectedVideo}
                controls
                autoPlay
                playsInline
                className="aspect-video w-full"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
function HealingJourneys({ items }: { items: JourneyItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="section-shell py-24">
      <SectionHeading
        eyebrow="Journeys of Healing"
        title="Healing journeys at Sukham"
        copy="Every transformation begins with assessment, guidance and consistent progress."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {items.map((journey, index) => (
          <article
            key={`${journey.title}-${index}`}
            className="soft-card grid gap-5 rounded-sukham p-5 md:grid-cols-[0.92fr_1.08fr] md:p-6"
          >
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="mb-2 text-xs font-bold uppercase text-saffron">Before</p>
                <div className="relative h-44 overflow-hidden rounded-2xl bg-blush">
                  <Image
                    src={journey.beforeImage}
                    alt={`${journey.title} before`}
                    fill
                    className="object-cover"
                    unoptimized={journey.beforeImage.startsWith("data:")}
                  />
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-bold uppercase text-leaf">After</p>
                <div className="relative h-44 overflow-hidden rounded-2xl bg-blush">
                  <Image
                    src={journey.afterImage}
                    alt={`${journey.title} after`}
                    fill
                    className="object-cover"
                    unoptimized={journey.afterImage.startsWith("data:")}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <h3 className="font-serif text-3xl font-bold text-plum">
                {journey.title}
              </h3>

              <p className="mt-4 leading-7 text-ink/70">
                {journey.copy}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function SukhamPhilosophy() {
  const affectedSystems = [
    "Postural Disorders",
    "Musculoskeletal Disorders",
    "Neurological & Psychological Disorders",
    "Cardiovascular-Respiratory Disorders",
    "Digestive & Endocrine Disorders",
    "Urogenital & Gynecological Disorders",
    "Autoimmune Disorders"
  ];

  const pillars = [
    {
      title: "Practical Yoga & Functional Training",
      copy:
        "Yoga is the science of harmony between body, mind and breath. Through mindful movement, postures and awareness, it enhances strength, flexibility, inner balance and overall wellbeing."
    },
    {
      title: "Physiotherapy & Rehabilitation",
      copy:
        "Physiotherapy restores movement, reduces pain and improves physical function through evidence-based rehabilitation, helping individuals recover, strengthen and live more actively."
    },
    {
      title: "Ayurveda Medicine & Natural Therapy",
      copy:
        "Ayurveda is India's ancient system of holistic healing that promotes balance through personalized nutrition, lifestyle practices and natural therapies, supporting long-term health and wellness."
    },
    {
      title: "Internal Medicine & Specialist Care",
      copy:
        "Internal Medicine focuses on the prevention, diagnosis and management of adult health conditions. Through comprehensive medical care, it supports overall health, early detection and long-term wellbeing."
    },
    {
      title: "Clinical Dietetics & Sports Nutrition",
      copy:
        "Nutrition forms the foundation of health and vitality. Personalized dietary guidance supports healing, energy, disease prevention and sustainable lifestyle transformation."
    },
    {
      title: "Psychological Counselling & Mind Wellbeing",
      copy:
        "Psychological support nurtures emotional resilience and mental wellbeing. Through professional guidance and therapeutic interventions, individuals can better manage stress, improve relationships and achieve personal growth."
    }
  ];

  const aims = [
    "Heal and balance the body according to body type",
    "Maintain health with respect to individual body type",
    "Understand true potential and passion with respect to body type"
  ];

  const focus = ["In-depth assessment", "Accurate diagnosis", "Treating the root cause", "Sustainable healing and recovery", "Long-term wellbeing and balance"];

  const goals = [
    "Improve mobility, strength, flexibility and stability",
    "Heal, enhance and maintain quality of life",
    "Recovery with happiness"
  ];

  const missions = [
    "Provide right health education to every individual",
    "Provide a holistic treatment approach",
    "Achieve desirable results naturally with scientifically proven methods"
  ];

  const visions = [
    "Support physical, mental, emotional, spiritual and environmental wellbeing",
    "Maintain the progress achieved in treatment",
    "Create a community of happy, healthy and aware individuals",
  ];

  return (
    <section className="section-shell py-24">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div className="sticky top-28 rounded-sukham bg-plum p-8 text-white shadow-wellness">
          <p className="text-sm font-bold uppercase text-gold">Sukham Philosophy</p>

          <h2 className="mt-3 font-serif text-4xl font-bold leading-tight md:text-5xl">
            Ancient wisdom with the integrity of modern intelligence
          </h2>

          <p className="mt-5 leading-8 text-white/78">
            Modern lifestyle, traumatic diseases and disorders can affect quality of life across
            multiple systems of the body. Sukham brings yoga, physiotherapy and nutrition together
            to support holistic healing, recovery and balance.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {affectedSystems.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold text-white/86"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-6">
          <div className="soft-card rounded-sukham p-7">
            <p className="text-sm font-bold uppercase text-saffron">Introduction</p>

            <h3 className="mt-2 font-serif text-3xl font-bold text-plum">
              An Integrated Approach to Holistic Health
            </h3>

            <p className="mt-4 leading-8 text-ink/72">
              Sukham combines the wisdom of traditional healing systems with modern healthcare practices to support complete wellbeing. Through Practical Yoga, Functional Training, Physiotherapy, Ayurveda, Natural Therapy, Internal Medicine, Clinical Dietetics, Sports Nutrition Psychological Counselling and Mind Wellbeing, we provide personalized care for the body, mind and lifestyle of every individual.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {pillars.map((pillar) => (
                <article
                  key={pillar.title}
                  className="flex min-h-[220px] flex-col items-center justify-center rounded-sukham border border-petal bg-blush px-7 py-8 text-center shadow-sm"
                >
                  <h4 className="font-serif text-3xl font-bold leading-tight text-plum">
                    {pillar.title}
                  </h4>

                  <p className="mt-4 max-w-md text-base leading-8 text-ink/72">
                    {pillar.copy}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <InfoList title="Sukham's Aim" items={aims} />
            <InfoList title="We Aim On" items={focus} />
            <InfoList title="Our Goals" items={goals} />
            <InfoList title="Our Mission" items={missions} />
          </div>

          <div className="soft-card rounded-sukham p-6 md:p-8">
            <p className="text-sm font-bold uppercase text-saffron">Sukham's Vision</p>

            <h3 className="mt-2 font-serif text-3xl font-bold text-plum">
              Building a blissful balance in life
            </h3>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {visions.map((vision) => (
                <div
                  key={vision}
                  className="rounded-2xl border border-gold/20 bg-white px-4 py-4 text-sm font-bold leading-6 text-plum shadow-sm"
                >
                  {vision}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
function InfoList({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="soft-card rounded-sukham p-6">
      <h3 className="font-serif text-2xl font-bold text-plum">{title}</h3>

      <div className="mt-5 grid gap-3">
        {items.map((item) => (
          <div key={item} className="flex gap-3 text-sm font-semibold leading-6 text-ink/72">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-leaf" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </article>
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
function Certificates({ images }: { images: string[] }) {
  const [selected, setSelected] = useState<string | null>(null);

  if (images.length === 0) {
    return null;
  }

  return (
    <section id="certificates" className="bg-white/58 py-24">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Certificates"
          title="Credentials, training and trusted expertise"
          copy="A transparent look at Sukham's professional certifications and learning milestones."
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              onClick={() => setSelected(image)}
              className="relative h-64 overflow-hidden rounded-sukham border border-gold/20 bg-white shadow-sm md:h-80"
            >
              <Image
                src={image}
                alt={`Sukham certificate ${index + 1}`}
                fill
                className="object-contain p-3 transition duration-500 hover:scale-105"
                unoptimized={image.startsWith("data:")}
              />
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-[90] grid place-items-center bg-plum/82 p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              aria-label="Close certificate image"
              onClick={() => setSelected(null)}
              className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative h-[82vh] w-full max-w-4xl overflow-hidden rounded-sukham bg-white">
              <Image
                src={selected}
                alt="Selected Sukham certificate"
                fill
                className="object-contain p-5"
                unoptimized={selected.startsWith("data:")}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
function ProblemsWeTreat({
  categories,
}: {
  categories: ProblemCategory[];
}) {
  if (!categories.length) return null;

  return (
    <section id="problems" className="section-shell py-24">
      <SectionHeading
        eyebrow="Problems We Treat"
        title="Root-cause healing for modern lifestyle concerns"
        copy="Sukham supports recovery from everyday pain, posture issues, movement limitations and lifestyle-related health concerns through yoga, physiotherapy and holistic care."
      />

      <div className="mt-10 space-y-12">
        {categories.map((category) => (
          <div key={category.title}>
            <h3 className="font-serif text-3xl font-bold text-plum">
              {category.title}
            </h3>

            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {category.problems.map((problem) => (
                <article
                  key={problem.title}
                  className="overflow-hidden rounded-sukham border border-petal bg-white shadow-soft"
                >
                  <div className="relative h-36 bg-blush">
                    <Image
                      src={problem.image}
                      alt={problem.title}
                      fill
                      className="object-cover"
                      unoptimized={problem.image.startsWith("data:")}
                    />
                  </div>

                  <div className="flex min-h-[86px] items-center justify-center px-4 py-5 text-center">
                    <h4 className="text-sm font-bold leading-6 text-plum">
                      {problem.title}
                    </h4>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Services({
  categories,
}: {
  categories: ServiceCategory[];
}) {
  if (!categories.length) return null;

  return (
    <section id="services" className="section-shell py-24">
      <SectionHeading
        eyebrow="Services"
        title="Care pathways sorted by condition"
        copy="Explore Sukham’s yoga, physiotherapy and wellness services grouped by the kind of healing support you need."
      />

      <div className="mt-10 space-y-12">
        {categories.map((category) => (
          <div key={category.title}>
            <h3 className="font-serif text-3xl font-bold text-plum">
              {category.title}
            </h3>

            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {category.services.map((service) => (
                <article
                  key={service.title}
                  className="overflow-hidden rounded-sukham border border-petal bg-white shadow-soft"
                >
                  <div className="relative h-36 bg-blush">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover"
                      unoptimized={service.image.startsWith("data:")}
                    />
                  </div>

                  <div className="flex min-h-[86px] items-center justify-center px-4 py-5 text-center">
                    <h4 className="text-sm font-bold leading-6 text-plum">
                      {service.title}
                    </h4>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
function SukhamFlowchart() {
  const steps = [
    {
      title: "Full Body Assessment",
      copy: "We assess posture, pain, mobility, strength and health history before planning care.",
    },
    {
      title: "Customized Yoga Program",
      copy: "A safe yoga plan is designed around your body type, condition and personal goals.",
    },
    {
      title: "Demonstration & Corrections",
      copy: "Experts guide each movement with alignment correction and safe execution.",
    },
    {
      title: "Goal-Oriented Outcomes",
      copy: "Progress is reviewed regularly with feedback and treatment modifications.",
    },
    {
      title: "Consistency Tracking",
      copy: "Your routine, recovery and improvements are tracked through the journey.",
    },
    {
      title: "Psychological Counselling",
      copy: "Stress, emotional wellbeing and mindset support are included where needed.",
    },
    {
      title: "Nutrition & Diet Guidance",
      copy: "Food and lifestyle guidance supports healing, energy and long-term wellness.",
    },
  ];

  return (
    <section className="section-shell py-24">
      <div className="rounded-sukham border border-petal bg-white px-5 py-10 shadow-soft md:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-orange">
            Your Journey At Sukham
          </p>

          <h2 className="mt-3 font-serif text-4xl font-bold leading-tight text-plum md:text-6xl">
            Your Healing Roadmap
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-ink/70 md:text-lg">
            A guided care journey from assessment to long-term healing,
            combining yoga, physiotherapy, counselling and nutrition.
          </p>
        </div>

        <div className="mx-auto mt-14 max-w-5xl">
          <div className="relative space-y-8 before:absolute before:left-7 before:top-0 before:h-full before:w-[4px] before:rounded-full before:bg-orange/70">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                className="relative grid grid-cols-[64px_1fr] gap-4"
              >
                <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border-[5px] border-white bg-gold text-xl font-black text-plum shadow-soft">
                  {index + 1}
                </div>

                <article className="rounded-[28px] border border-petal bg-blush/45 p-6 shadow-sm">
                  <h3 className="font-serif text-2xl font-bold leading-tight text-plum md:text-3xl">
                    {step.title}
                  </h3>

                  <p className="mt-3 max-w-2xl text-sm leading-7 text-ink/68 md:text-base">
                    {step.copy}
                  </p>
                </article>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Plans({ items }: { items: typeof plans }) {
  return (
    <section id="plans" className="section-shell py-24">
      <SectionHeading
        eyebrow="Our Plans"
        title="Premium programs that can grow with the centre"
        copy="Choose a focused wellness, recovery or complete healing plan based on your goals."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {items.map((plan) => (
          <article
            key={plan.name}
            className={`rounded-sukham border p-7 shadow-wellness ${
              plan.featured ? "border-saffron bg-plum text-white" : "border-gold/20 bg-white"
            }`}
          >
            {plan.featured && (
              <p className="mb-4 inline-flex rounded-full bg-saffron px-3 py-1 text-xs font-bold text-white">
                Featured
              </p>
            )}

            <h3 className={`font-serif text-3xl font-bold ${plan.featured ? "text-white" : "text-plum"}`}>
              {plan.name}
            </h3>

            <p className={`mt-3 text-3xl font-black ${plan.featured ? "text-gold" : "text-saffron"}`}>
              Rs {plan.price}/-
            </p>

            <p className={`mt-2 font-bold ${plan.featured ? "text-orange-100" : "text-saffron"}`}>
              {plan.priceLabel}
            </p>

            <div className="mt-7 grid gap-4">
              {plan.features.map((feature) => (
                <div key={feature} className="flex gap-3 text-sm font-semibold">
                  <Check className={`h-5 w-5 ${plan.featured ? "text-gold" : "text-leaf"}`} />
                  {feature}
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

function Appointment({ serviceCategories }: { serviceCategories: ServiceCategory[] }) {
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
              {serviceCategories.flatMap((category) =>
                category.services.map((service) => (
                  <option key={`${category.title}-${service.title}`} value={service.title}>
                    {service.title}
                  </option>
                ))
              )}
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
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Sukham Instagram"
              className="grid h-10 w-10 place-items-center rounded-full bg-blush transition hover:bg-petal hover:text-saffron"
            >
              <Instagram className="h-5 w-5" />
            </a>

            <a
              href={socialLinks.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Sukham Facebook"
              className="grid h-10 w-10 place-items-center rounded-full bg-blush transition hover:bg-petal hover:text-saffron"
            >
              <Facebook className="h-5 w-5" />
            </a>

            <a
              href={socialLinks.youtube}
              target="_blank"
              rel="noreferrer"
              aria-label="Sukham YouTube"
              className="grid h-10 w-10 place-items-center rounded-full bg-blush transition hover:bg-petal hover:text-saffron"
            >
              <Youtube className="h-5 w-5" />
            </a>

            <a
              href={socialLinks.twitter}
              target="_blank"
              rel="noreferrer"
              aria-label="Sukham X"
              className="grid h-10 w-10 place-items-center rounded-full bg-blush transition hover:bg-petal hover:text-saffron"
            >
              <Twitter className="h-5 w-5" />
            </a>
          </div>
          <div className="mt-3 grid gap-1 text-sm font-semibold text-ink/60">
            <a href={socialLinks.instagram} target="_blank" rel="noreferrer" className="hover:text-saffron">
              Instagram: @sukham_yoga_physiotherapy
            </a>

            <a href={socialLinks.facebook} target="_blank" rel="noreferrer" className="hover:text-saffron">
              Facebook: Sukham Centre
            </a>

            <a href={socialLinks.youtube} target="_blank" rel="noreferrer" className="hover:text-saffron">
              YouTube: @SukhamCentre
            </a>

            <a href={socialLinks.twitter} target="_blank" rel="noreferrer" className="hover:text-saffron">
              X: @SukhamCentre
            </a>
          </div>
        </div>
      </div>
      <div className="section-shell mt-10 border-t border-petal pt-5 text-center">
        <p className="text-xs leading-6 text-ink/45">
          Website made and maintained by Lakshya Krishna Jaiswal under Sukham. For queries, please contact{" "}
          <a href="tel:+918252185300" className="font-semibold text-ink/60 hover:text-saffron">
            +91 8252185300
          </a>{" "}
          or mail at{" "}
          <a
            href="mailto:lakshyakrishnajaiswal@gmail.com"
            className="font-semibold text-ink/60 hover:text-saffron"
          >
            lakshyakrishnajaiswal@gmail.com
          </a>
        </p>
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
        <HealingJourneys items={content.journeys} />
        <SukhamPhilosophy />
        <ProblemsWeTreat categories={content.problemCategories} />
        <Services categories={content.serviceCategories} />
        <SukhamFlowchart />
        <Plans items={content.plans} />
        <Experts items={content.experts} />
        <Certificates images={content.certificates} />
        <WorkshopsAndBlogs items={content.workshops} />
        <Blogs items={content.blogs} />
        <Gallery images={content.gallery} />
        <WhatsappQuestion />
        <LocateCentre />
        <Appointment serviceCategories={content.serviceCategories} />
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
  bucket = "gallery",
  portrait = false
}: {
  title: string;
  subtitle?: string;
  image: string;
  onChange: (image: string) => void;
  bucket?: string;
  portrait?: boolean;
}) {
  const [imageUrl, setImageUrl] = useState("");
  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    onChange(await uploadImageFile(file, bucket));
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
        <form
          onSubmit={(event) => {
            event.preventDefault();

            const cleanUrl = imageUrl.trim();

            if (!cleanUrl) return;

            onChange(cleanUrl);
            setImageUrl("");
          }}
          className="mt-3 grid gap-2"
        >
          <input
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
            placeholder="Paste Supabase image URL"
            className="h-11 rounded-full border border-petal bg-blush px-4 text-xs outline-none focus:border-saffron"
          />

          <button
            type="submit"
            className="rounded-full bg-white px-4 py-2 text-xs font-bold text-plum shadow-sm"
          >
            Use URL
          </button>
        </form>
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
  addGalleryImage,
  removeGalleryImage,
  resetContent
}: {
  content: SiteContent;
  updateImage: (section: keyof SiteContent, index: number, image: string) => void;
  addGalleryImage: (image: string) => void;
  removeGalleryImage: (index: number) => void;
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
        <button type="button" onClick={() => {
          const confirmed = window.confirm(
            "Are you sure you want to reset all website content? This will remove your edited homepage, services, problems, gallery, plans, blogs, workshops and reviews."
          );

          if (confirmed) {
            resetContent();
          }
        }}
        className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-bold text-plum shadow-sm">
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
            bucket="hero"
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
            bucket="experts"
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
            bucket="reviews"
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
            bucket="workshops"
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
            bucket="blogs"
            onChange={(image) => updateImage("blogs", index, image)}
          />
        ))}
      </ImageSection>

      <ImageSection title="Gallery">
        <form
          onSubmit={async (event) => {
            event.preventDefault();

            const form = event.currentTarget;

            const galleryUrlInput = form.elements.namedItem("gallery_url") as HTMLInputElement;
            const galleryUrl = galleryUrlInput.value.trim();

            if (galleryUrl) {
              addGalleryImage(galleryUrl);
              form.reset();
              return;
            }

            const fileInput = form.elements.namedItem("gallery_file") as HTMLInputElement;
            const imageFile = fileInput.files?.[0];

            if (!imageFile) return;

            addGalleryImage(await uploadImageFile(imageFile, "gallery"));
            form.reset();
          }}
          className="rounded-sukham border border-gold/20 bg-white p-5 shadow-sm"
        >
          <h3 className="font-serif text-xl font-bold text-plum">Add gallery image</h3>

          <input
            name="gallery_url"
            placeholder="Paste Supabase image URL"
            className="mt-4 h-12 w-full rounded-full border border-petal bg-blush px-5 text-sm outline-none focus:border-saffron"
          />

          <input
            name="gallery_file"
            type="file"
            accept="image/*"
            className="mt-3 h-12 w-full rounded-full border border-petal bg-blush px-5 text-sm outline-none focus:border-saffron"
          />

          <button className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-plum px-5 py-3 text-sm font-bold text-white">
            Add Image
          </button>
        </form>
        {content.gallery.map((image, index) => (
          <div key={`${image}-${index}`} className="grid gap-3">
            <ImageUploadCard
              title={`Gallery image ${index + 1}`}
              image={image}
              bucket="gallery"
              onChange={(nextImage) => updateImage("gallery", index, nextImage)}
            />

            <button
              type="button"
              onClick={() => removeGalleryImage(index)}
              className="rounded-full bg-red-50 px-4 py-2 text-xs font-bold text-red-600"
            >
              Remove Gallery Image
            </button>
          </div>
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
function EditableField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-[0.18em] text-ink/50">
        {label}
      </span>

      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-petal bg-white px-4 py-3 text-sm font-semibold text-plum outline-none transition focus:border-orange"
      />
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
function ImageFileField({ label }: { label: string }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-plum">
      {label}
      <input
        name="image_file"
        type="file"
        accept="image/*"
        className="rounded-2xl border border-petal bg-white px-4 py-3 text-sm outline-none focus:border-saffron"
      />
    </label>
  );
}

async function getUploadedImage(
  form: HTMLFormElement,
  bucket: string,
  fallbackImage: string
) {
  const urlInput = form.elements.namedItem("image") as HTMLInputElement | null;
  const pastedUrl = urlInput?.value.trim();

  if (pastedUrl) return pastedUrl;

  const fileInput = form.elements.namedItem("image_file") as HTMLInputElement;
  const imageFile = fileInput.files?.[0];

  if (!imageFile) return fallbackImage;

  return uploadImageFile(imageFile, bucket);
}

function FormPanel({
  title,
  children,
  onSubmit
}: {
  title: string;
  children: React.ReactNode;
  onSubmit: (form: HTMLFormElement) => void | Promise<void>;
}) {
  return (
    <form
      onSubmit={async(event) => {
        event.preventDefault();
        await onSubmit(event.currentTarget);
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
  updateExpert,
  removeWorkshop,
  removeBlog
}: {
  content: SiteContent;
  addItem: (
    section: "workshops" | "blogs" | "reviews" | "experts",
    item:
      | SiteContent["workshops"][number]
      | SiteContent["blogs"][number]
      | SiteContent["reviews"][number]
      | SiteContent["experts"][number]
  ) => void;
  updateExpert: (index: number, fields: Partial<SiteContent["experts"][number]>) => void;
  removeWorkshop: (index: number) => void;
  removeBlog: (index: number) => void;
}) {
  return (
    <section className="soft-card mb-8 rounded-sukham p-6">
      <p className="text-sm font-bold uppercase text-saffron">Content Editor</p>
      <h2 className="mt-1 font-serif text-4xl font-bold text-plum">Add and edit site content</h2>
      <p className="mt-3 max-w-2xl leading-7 text-ink/68">These prototype forms save in this browser. Connect the same fields to Supabase tables for production.</p>

      <div className="mt-7 grid gap-5 lg:grid-cols-2">
        <FormPanel
          title="Add Workshop"
          onSubmit={async(form) => {
            const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
            addItem("workshops", {
              title: data.title || "New Workshop",
              date: data.date || "Upcoming",
              time: data.time || "To be announced",
              location: data.location || brand.area,
              description: data.description || "Workshop details coming soon.",
              image: await getUploadedImage(
                form,
                "workshops",
                "https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=900&q=85"
              )
            });
          }}
        >
          <Field label="Supabase Image URL" name="image" />
          <Field label="Title" name="title" />
          <Field label="Date" name="date" placeholder="Every Saturday" />
          <Field label="Time" name="time" placeholder="8:00 AM" />
          <Field label="Location" name="location" value={brand.area} />
          <ImageFileField label="Workshop Image" />
          <TextAreaField label="Description" name="description" />
        </FormPanel>
        <section className="rounded-sukham border border-gold/20 bg-white p-5 shadow-sm">
            <h3 className="font-serif text-2xl font-bold text-plum">Delete Workshops</h3>

            <div className="mt-5 grid gap-3">
              {content.workshops.map((workshop, index) => (
                <div
                  key={`${workshop.title}-${index}`}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-petal bg-blush px-4 py-3"
                >
                  <span className="text-sm font-bold text-plum">{workshop.title}</span>

                  <button
                    type="button"
                    onClick={() => removeWorkshop(index)}
                    className="rounded-full bg-red-50 px-3 py-2 text-xs font-bold text-red-600"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </section>

        <FormPanel
          title="Add Blog"
          onSubmit={async(form) => {
            const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
            addItem("blogs", {
              title: data.title || "New Blog",
              summary: data.summary || "Helpful wellness insight from Sukham.",
              image: await getUploadedImage(
                form,
                "blogs",
                "https://images.unsplash.com/photo-1593164842264-854604db2260?auto=format&fit=crop&w=900&q=85"
              )
            });
          }}
        >
          <Field label="Supabase Image URL" name="image" />
          <Field label="Title" name="title" />
          <ImageFileField label="Blog Image" />
          <TextAreaField label="Summary" name="summary" />
        </FormPanel>
        <section className="rounded-sukham border border-gold/20 bg-white p-5 shadow-sm">
          <h3 className="font-serif text-2xl font-bold text-plum">Delete Blogs</h3>

          <div className="mt-5 grid gap-3">
            {content.blogs.map((blog, index) => (
              <div
                key={`${blog.title}-${index}`}
                className="flex items-center justify-between gap-3 rounded-2xl border border-petal bg-blush px-4 py-3"
              >
                <span className="text-sm font-bold text-plum">{blog.title}</span>

                <button
                  type="button"
                  onClick={() => removeBlog(index)}
                  className="rounded-full bg-red-50 px-3 py-2 text-xs font-bold text-red-600"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </section>

        <FormPanel
          title="Add Review"
          onSubmit={async(form) => {
            const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
            addItem("reviews", {
              name: data.name || "Sukham Client",
              rating: Number(data.rating || 5),
              image: await getUploadedImage(
                form,
                "reviews",
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80"
              )
              ,review: data.review || "A warm and professional healing experience."
              ,video: data.video || ""
            });
          }}
        >
          <Field label="Supabase Image URL" name="image" />
          <Field label="Supabase Video URL" name="video" />
          <Field label="Client Name" name="name" />
          <Field label="Rating" name="rating" type="number" value="5" />
          <ImageFileField label="Client Image" />
          <TextAreaField label="Review" name="review" />
        </FormPanel>

        <FormPanel
          title="Add Expert"
          onSubmit={async(form) => {
            const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
            addItem("experts", {
              name: data.name || "New Expert",
              role: data.role || "Sukham Wellness Expert",
              image: await getUploadedImage(
                form,
                "experts",
                "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=85"
              ),
              bio: data.bio || "Expert profile details coming soon.",
              details: (data.details || "Therapeutic care,Personal guidance").split(",").map((item) => item.trim()).filter(Boolean),
              certificates: (data.certificates || "Certification").split(",").map((item) => item.trim()).filter(Boolean)
            });
          }}
        >
          <Field label="Supabase Image URL" name="image" />
          <Field label="Name" name="name" />
          <Field label="Role / Qualification" name="role" />
          <ImageFileField label="Expert Image" />
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
  statusFilter,
  onSearch,
  onStatusChange
}: {
  appointments: AppointmentEntry[];
  search: string;
  statusFilter: "All" | AppointmentStatus;
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
  ]
    .join(" ")
    .toLowerCase();

  const matchesSearch = haystack.includes(search.trim().toLowerCase());
  const matchesStatus = statusFilter === "All" || appointment.status === statusFilter;

  return matchesSearch && matchesStatus;
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
  categories,
  addServiceCategory,
  updateServiceCategory,
  removeServiceCategory,
  addService,
  updateService,
  removeService,
}: {
  categories: ServiceCategory[];
  addServiceCategory: () => void;
  updateServiceCategory: (categoryIndex: number, title: string) => void;
  removeServiceCategory: (categoryIndex: number) => void;
  addService: (categoryIndex: number) => void;
  updateService: (
    categoryIndex: number,
    serviceIndex: number,
    fields: Partial<ServiceItem>
  ) => void;
  removeService: (categoryIndex: number, serviceIndex: number) => void;
}) {
  return (
    <div className="soft-card rounded-sukham p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-2xl font-bold text-plum">
            Services
          </h3>
          <p className="mt-1 text-sm text-ink/60">
            Edit service departments, service names and Supabase image URLs.
          </p>
        </div>

        <button
          type="button"
          onClick={addServiceCategory}
          className="rounded-full bg-orange px-5 py-3 text-sm font-bold text-white shadow-soft"
        >
          Add Service Department
        </button>
      </div>

      <div className="mt-6 space-y-6">
        {categories.map((category, categoryIndex) => (
          <div
            key={`${category.title}-${categoryIndex}`}
            className="rounded-3xl border border-petal bg-blush/40 p-5"
          >
            <div className="grid gap-4 md:grid-cols-[1fr_auto]">
              <EditableField
                label="Department Name"
                value={category.title}
                onChange={(value) =>
                  updateServiceCategory(categoryIndex, value)
                }
              />

              <button
                type="button"
                onClick={() => removeServiceCategory(categoryIndex)}
                className="self-end rounded-full border border-red-200 px-5 py-3 text-sm font-bold text-red-600"
              >
                Delete Department
              </button>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {category.services.map((service, serviceIndex) => (
                <div
                  key={`${service.title}-${serviceIndex}`}
                  className="rounded-2xl border border-petal bg-white p-4"
                >
                  <EditableField
                    label="Service Name"
                    value={service.title}
                    onChange={(value) =>
                      updateService(categoryIndex, serviceIndex, {
                        title: value,
                      })
                    }
                  />

                  <div className="mt-4">
                    <EditableField
                      label="Service Image Supabase URL"
                      value={service.image}
                      onChange={(value) =>
                        updateService(categoryIndex, serviceIndex, {
                          image: value,
                        })
                      }
                    />
                  </div>

                  {service.image && (
                    <div className="relative mt-4 h-36 overflow-hidden rounded-2xl bg-blush">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover"
                        unoptimized={service.image.startsWith("data:")}
                      />
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      removeService(categoryIndex, serviceIndex)
                    }
                    className="mt-4 rounded-full border border-red-200 px-4 py-2 text-sm font-bold text-red-600"
                  >
                    Delete Service
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => addService(categoryIndex)}
              className="mt-5 rounded-full border border-orange px-5 py-3 text-sm font-bold text-orange"
            >
              Add Service
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function PlansManager({
  plans,
  addPlan,
  updatePlan,
  removePlan
}: {
  plans: SiteContent["plans"];
  addPlan: (plan: SiteContent["plans"][number]) => void;
  updatePlan: (index: number, fields: Partial<SiteContent["plans"][number]>) => void;
  removePlan: (index: number) => void;
}) {
  return (
    <section className="soft-card mb-8 rounded-sukham p-6">
      <p className="text-sm font-bold uppercase text-saffron">Plans Manager</p>
      <h2 className="mt-1 font-serif text-4xl font-bold text-plum">Edit plans and pricing</h2>
      <p className="mt-3 max-w-2xl leading-7 text-ink/68">
        Add, edit, feature or remove plans shown on the homepage.
      </p>

      <form
        onSubmit={(event) => {
          event.preventDefault();

          const form = event.currentTarget;
          const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;

          addPlan({
            name: data.name || "New Plan",
            price: data.price || "0",
            priceLabel: data.priceLabel || "Custom Program",
            featured: data.featured === "on",
            features: data.features
              .split(",")
              .map((feature) => feature.trim())
              .filter(Boolean)
          });

          form.reset();
        }}
        className="mt-6 rounded-sukham border border-gold/20 bg-white p-5 shadow-sm"
      >
        <h3 className="font-serif text-2xl font-bold text-plum">Add Plan</h3>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Field label="Plan Name" name="name" />
          <Field label="Price" name="price" placeholder="4999" />
          <Field label="Price Label" name="priceLabel" placeholder="Recovery Focus" />

          <label className="flex items-center gap-3 rounded-2xl border border-petal bg-blush px-4 py-3 text-sm font-bold text-plum">
            <input type="checkbox" name="featured" />
            Featured Plan
          </label>

          <label className="grid gap-2 text-sm font-bold text-plum md:col-span-2">
            Features, comma separated
            <textarea
              name="features"
              rows={4}
              placeholder="Initial assessment, Yoga sessions, Progress tracking"
              className="rounded-2xl border border-petal bg-blush px-4 py-3 text-sm outline-none focus:border-saffron"
            />
          </label>
        </div>

        <button className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-plum px-5 py-3 text-sm font-bold text-white">
          Add Plan
        </button>
      </form>

      <div className="mt-7 grid gap-5">
        {plans.map((plan, index) => (
          <form
            key={`${plan.name}-${index}`}
            onSubmit={(event) => {
              event.preventDefault();

              const form = event.currentTarget;
              const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;

              updatePlan(index, {
                name: data.name,
                price: data.price,
                priceLabel: data.priceLabel,
                featured: data.featured === "on",
                features: data.features
                  .split(",")
                  .map((feature) => feature.trim())
                  .filter(Boolean)
              });
            }}
            className="rounded-sukham border border-gold/20 bg-white p-5 shadow-sm"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Plan Name" name="name" value={plan.name} />
              <Field label="Price" name="price" value={plan.price} />
              <Field label="Price Label" name="priceLabel" value={plan.priceLabel} />

              <label className="flex items-center gap-3 rounded-2xl border border-petal bg-blush px-4 py-3 text-sm font-bold text-plum">
                <input type="checkbox" name="featured" defaultChecked={plan.featured} />
                Featured Plan
              </label>

              <label className="grid gap-2 text-sm font-bold text-plum md:col-span-2">
                Features, comma separated
                <textarea
                  name="features"
                  rows={4}
                  defaultValue={plan.features.join(", ")}
                  className="rounded-2xl border border-petal bg-blush px-4 py-3 text-sm outline-none focus:border-saffron"
                />
              </label>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button className="inline-flex flex-1 items-center justify-center rounded-full bg-saffron px-5 py-3 text-sm font-bold text-white">
                Save Plan
              </button>

              <button
                type="button"
                onClick={() => removePlan(index)}
                className="inline-flex flex-1 items-center justify-center rounded-full bg-red-50 px-5 py-3 text-sm font-bold text-red-600"
              >
                Delete Plan
              </button>
            </div>
          </form>
        ))}
      </div>
    </section>
  );
}
function CertificatesManager({
  certificates,
  addCertificate,
  removeCertificate
}: {
  certificates: string[];
  addCertificate: (image: string) => void;
  removeCertificate: (index: number) => void;
}) {
  const [certificateUrl, setCertificateUrl] = useState("");

  return (
    <section className="soft-card mb-8 rounded-sukham p-6">
      <p className="text-sm font-bold uppercase text-saffron">Certificates Manager</p>

      <h2 className="mt-1 font-serif text-4xl font-bold text-plum">
        Edit certificates
      </h2>

      <p className="mt-3 max-w-2xl leading-7 text-ink/68">
        Add certificate images using Supabase public URLs. These appear on the homepage after the experts section.
      </p>

      <form
        onSubmit={(event) => {
          event.preventDefault();

          addCertificate(certificateUrl);
          setCertificateUrl("");
        }}
        className="mt-6 rounded-sukham border border-gold/20 bg-white p-5 shadow-sm"
      >
        <h3 className="font-serif text-2xl font-bold text-plum">
          Add Certificate
        </h3>

        <input
          value={certificateUrl}
          onChange={(event) => setCertificateUrl(event.target.value)}
          placeholder="Paste Supabase certificate image URL"
          className="mt-4 h-12 w-full rounded-full border border-petal bg-blush px-5 text-sm outline-none focus:border-saffron"
        />

        <button className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-plum px-5 py-3 text-sm font-bold text-white">
          Add Certificate
        </button>
      </form>

      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {certificates.map((certificate, index) => (
          <article
            key={`${certificate}-${index}`}
            className="overflow-hidden rounded-sukham border border-gold/20 bg-white shadow-sm"
          >
            <div className="relative h-64 bg-blush">
              <Image
                src={certificate}
                alt={`Certificate ${index + 1}`}
                fill
                className="object-contain p-3"
                unoptimized={certificate.startsWith("data:")}
              />
            </div>

            <div className="p-4">
              <button
                type="button"
                onClick={() => removeCertificate(index)}
                className="inline-flex w-full items-center justify-center rounded-full bg-red-50 px-4 py-2 text-xs font-bold text-red-600"
              >
                Remove Certificate
              </button>
            </div>
          </article>
        ))}

        {certificates.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gold/30 bg-white px-5 py-8 text-center text-sm font-semibold text-ink/55">
            No certificates added yet.
          </div>
        )}
      </div>
    </section>
  );
}
function ReviewsManager({
  reviews,
  updateReview
}: {
  reviews: SiteContent["reviews"];
  updateReview: (index: number, fields: Partial<SiteContent["reviews"][number]>) => void;
}) {
  return (
    <section className="soft-card mb-8 rounded-sukham p-6">
      <p className="text-sm font-bold uppercase text-saffron">Testimonials Manager</p>
      <h2 className="mt-1 font-serif text-4xl font-bold text-plum">Edit review videos</h2>
      <p className="mt-3 max-w-2xl leading-7 text-ink/68">
        Paste Supabase public video URLs to attach video testimonials to written reviews.
      </p>

      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {reviews.map((review, index) => (
          <article key={`${review.name}-${index}`} className="rounded-sukham border border-petal bg-white p-5 shadow-sm">
            <h3 className="font-serif text-2xl font-bold text-plum">{review.name}</h3>
            <p className="mt-2 text-sm leading-6 text-ink/65">{review.review}</p>

            <input
              value={review.video || ""}
              onChange={(event) => updateReview(index, { video: event.target.value })}
              placeholder="Paste Supabase video URL"
              className="mt-4 h-12 w-full rounded-full border border-petal bg-blush px-4 text-sm outline-none focus:border-saffron"
            />

            {review.video && (
              <video src={review.video} controls className="mt-4 aspect-video w-full rounded-2xl bg-black" />
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
function JourneysManager({
  journeys,
  addJourney,
  updateJourney,
  removeJourney
}: {
  journeys: JourneyItem[];
  addJourney: (journey: JourneyItem) => void;
  updateJourney: (index: number, fields: Partial<JourneyItem>) => void;
  removeJourney: (index: number) => void;
}) {
  return (
    <section className="soft-card mb-8 rounded-sukham p-6">
      <p className="text-sm font-bold uppercase text-saffron">Before & After Manager</p>
      <h2 className="mt-1 font-serif text-4xl font-bold text-plum">
        Edit healing journeys
      </h2>
      <p className="mt-3 max-w-2xl leading-7 text-ink/68">
        Add and edit before/after images, headings and journey descriptions.
      </p>

      <form
        onSubmit={(event) => {
          event.preventDefault();

          const form = event.currentTarget;
          const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;

          addJourney({
            title: data.title || "New Healing Journey",
            copy: data.copy || "Journey details coming soon.",
            beforeImage: data.beforeImage || defaultJourneyImage,
            afterImage: data.afterImage || defaultJourneyImage
          });

          form.reset();
        }}
        className="mt-6 rounded-sukham border border-gold/20 bg-white p-5 shadow-sm"
      >
        <h3 className="font-serif text-2xl font-bold text-plum">Add Journey</h3>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Field label="Heading" name="title" />
          <Field label="Before Image URL" name="beforeImage" />
          <Field label="After Image URL" name="afterImage" />

          <label className="grid gap-2 text-sm font-bold text-plum md:col-span-2">
            Journey Content
            <textarea
              name="copy"
              rows={4}
              className="rounded-2xl border border-petal bg-blush px-4 py-3 text-sm outline-none focus:border-saffron"
            />
          </label>
        </div>

        <button className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-plum px-5 py-3 text-sm font-bold text-white">
          Add Journey
        </button>
      </form>

      <div className="mt-7 grid gap-5">
        {journeys.map((journey, index) => (
          <form
            key={`${journey.title}-${index}`}
            onSubmit={(event) => {
              event.preventDefault();

              const form = event.currentTarget;
              const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;

              updateJourney(index, {
                title: data.title,
                copy: data.copy,
                beforeImage: data.beforeImage,
                afterImage: data.afterImage
              });
            }}
            className="rounded-sukham border border-gold/20 bg-white p-5 shadow-sm"
          >
            <div className="grid gap-4 lg:grid-cols-[0.7fr_1fr]">
              <div className="grid grid-cols-2 gap-3">
                <div className="relative h-40 overflow-hidden rounded-2xl bg-blush">
                  <Image
                    src={journey.beforeImage}
                    alt={`${journey.title} before`}
                    fill
                    className="object-cover"
                    unoptimized={journey.beforeImage.startsWith("data:")}
                  />
                </div>

                <div className="relative h-40 overflow-hidden rounded-2xl bg-blush">
                  <Image
                    src={journey.afterImage}
                    alt={`${journey.title} after`}
                    fill
                    className="object-cover"
                    unoptimized={journey.afterImage.startsWith("data:")}
                  />
                </div>
              </div>

              <div className="grid gap-4">
                <Field label="Heading" name="title" value={journey.title} />
                <Field label="Before Image URL" name="beforeImage" value={journey.beforeImage} />
                <Field label="After Image URL" name="afterImage" value={journey.afterImage} />

                <label className="grid gap-2 text-sm font-bold text-plum">
                  Journey Content
                  <textarea
                    name="copy"
                    rows={4}
                    defaultValue={journey.copy}
                    className="rounded-2xl border border-petal bg-blush px-4 py-3 text-sm outline-none focus:border-saffron"
                  />
                </label>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button className="inline-flex flex-1 items-center justify-center rounded-full bg-saffron px-5 py-3 text-sm font-bold text-white">
                Save Journey
              </button>

              <button
                type="button"
                onClick={() => removeJourney(index)}
                className="inline-flex flex-1 items-center justify-center rounded-full bg-red-50 px-5 py-3 text-sm font-bold text-red-600"
              >
                Delete Journey
              </button>
            </div>
          </form>
        ))}
      </div>
    </section>
  );
}
function ProblemsManager({
  categories,
  addProblemCategory,
  updateProblemCategory,
  removeProblemCategory,
  addProblem,
  updateProblem,
  removeProblem,
}: {
  categories: ProblemCategory[];
  addProblemCategory: () => void;
  updateProblemCategory: (categoryIndex: number, title: string) => void;
  removeProblemCategory: (categoryIndex: number) => void;
  addProblem: (categoryIndex: number) => void;
  updateProblem: (
    categoryIndex: number,
    problemIndex: number,
    fields: Partial<ProblemItem>
  ) => void;
  removeProblem: (categoryIndex: number, problemIndex: number) => void;
}) {
  return (
    <div className="soft-card rounded-sukham p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-2xl font-bold text-plum">
            Problems We Treat
          </h3>
          <p className="mt-1 text-sm text-ink/60">
            Edit problem departments, problem names and Supabase image URLs.
          </p>
        </div>

        <button
          type="button"
          onClick={addProblemCategory}
          className="rounded-full bg-orange px-5 py-3 text-sm font-bold text-white shadow-soft"
        >
          Add Department
        </button>
      </div>

      <div className="mt-6 space-y-6">
        {categories.map((category, categoryIndex) => (
          <div
            key={`${category.title}-${categoryIndex}`}
            className="rounded-3xl border border-petal bg-blush/40 p-5"
          >
            <div className="grid gap-4 md:grid-cols-[1fr_auto]">
              <EditableField
                label="Department Name"
                value={category.title}
                onChange={(value) =>
                  updateProblemCategory(categoryIndex, value)
                }
              />

              <button
                type="button"
                onClick={() => removeProblemCategory(categoryIndex)}
                className="self-end rounded-full border border-red-200 px-5 py-3 text-sm font-bold text-red-600"
              >
                Delete Department
              </button>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {category.problems.map((problem, problemIndex) => (
                <div
                  key={`${problem.title}-${problemIndex}`}
                  className="rounded-2xl border border-petal bg-white p-4"
                >
                  <EditableField
                    label="Problem Name"
                    value={problem.title}
                    onChange={(value) =>
                      updateProblem(categoryIndex, problemIndex, {
                        title: value,
                      })
                    }
                  />

                  <div className="mt-4">
                    <EditableField
                      label="Problem Image Supabase URL"
                      value={problem.image}
                      onChange={(value) =>
                        updateProblem(categoryIndex, problemIndex, {
                          image: value,
                        })
                      }
                    />
                  </div>

                  {problem.image && (
                    <div className="relative mt-4 h-36 overflow-hidden rounded-2xl bg-blush">
                      <Image
                        src={problem.image}
                        alt={problem.title}
                        fill
                        className="object-cover"
                        unoptimized={problem.image.startsWith("data:")}
                      />
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      removeProblem(categoryIndex, problemIndex)
                    }
                    className="mt-4 rounded-full border border-red-200 px-4 py-2 text-sm font-bold text-red-600"
                  >
                    Delete Problem
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => addProblem(categoryIndex)}
              className="mt-5 rounded-full border border-orange px-5 py-3 text-sm font-bold text-orange"
            >
              Add Problem
            </button>
          </div>
        ))}
      </div>
    </div>
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
  addServiceCategory,
  updateServiceCategory,
  removeServiceCategory,
  addService,
  updateService,
  removeService,
  addGalleryImage,
  removeGalleryImage,
  removeWorkshop,
  removeBlog,
  addPlan,
  updatePlan,
  removePlan,
  addCertificate,
  removeCertificate,
  updateReview,
  addJourney,
  updateJourney,
  removeJourney,
  addProblemCategory,
  updateProblemCategory,
  removeProblemCategory,
  addProblem,
  updateProblem,
  removeProblem,
  resetContent
  } = useEditableContent();
  const { appointments, updateAppointmentStatus } = useAppointments();
  const [appointmentSearch, setAppointmentSearch] = useState("");
  const [appointmentStatusFilter, setAppointmentStatusFilter] =
  useState<"All" | AppointmentStatus>("All");
  
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
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-sukham border border-petal bg-white p-5 shadow-soft">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange">
              Admin Shortcut
            </p>
            <h2 className="mt-1 font-serif text-2xl font-bold text-plum">
              Need to review bookings?
            </h2>
          </div>

          <a
            href="#admin-appointments"
            className="inline-flex items-center justify-center rounded-full bg-[#ff7a1a] px-6 py-3 text-sm font-black text-white shadow-[0_14px_30px_rgba(255,122,26,0.28)] transition hover:bg-[#e86608]"
          >
            Go to Appointments
          </a>
        </div>
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
             <select
                value={appointmentStatusFilter}
                onChange={(event) =>
                  setAppointmentStatusFilter(event.target.value as "All" | AppointmentStatus)
                }
                className="h-12 rounded-full border border-petal bg-white px-4 text-sm font-bold text-plum outline-none focus:border-saffron"
              >
                <option value="All">All</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </button>
          </div>
        </div>
        <ImageManager
          content={content}
          updateImage={updateImage}
          addGalleryImage={addGalleryImage}
          removeGalleryImage={removeGalleryImage}
          resetContent={resetContent}
        />
        <ReviewsManager
          reviews={content.reviews}
          updateReview={updateReview}
        />
        <JourneysManager
          journeys={content.journeys}
          addJourney={addJourney}
          updateJourney={updateJourney}
          removeJourney={removeJourney}
        />
        <CertificatesManager
          certificates={content.certificates}
          addCertificate={addCertificate}
          removeCertificate={removeCertificate}
        />
        <ProblemsManager
          categories={content.problemCategories}
          addProblemCategory={addProblemCategory}
          updateProblemCategory={updateProblemCategory}
          removeProblemCategory={removeProblemCategory}
          addProblem={addProblem}
          updateProblem={updateProblem}
          removeProblem={removeProblem}
        />
        <ServicesManager
          categories={content.serviceCategories}
          addServiceCategory={addServiceCategory}
          updateServiceCategory={updateServiceCategory}
          removeServiceCategory={removeServiceCategory}
          addService={addService}
          updateService={updateService}
          removeService={removeService}
        />
        <PlansManager
          plans={content.plans}
          addPlan={addPlan}
          updatePlan={updatePlan}
          removePlan={removePlan}
        />
        <AdminContentManager
  content={content}
  addItem={addItem}
  updateExpert={updateExpert}
  removeWorkshop={removeWorkshop}
  removeBlog={removeBlog}
/>

        <div id="admin-appointments" className="scroll-mt-28">
  <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.72fr]">
                <AppointmentReviewSection
                  appointments={appointments}
                  search={appointmentSearch}
                  statusFilter={appointmentStatusFilter}
                  onSearch={setAppointmentSearch}
                  onStatusChange={updateAppointmentStatus}
                />

                <div className="soft-card rounded-sukham p-6">
                  <h2 className="font-serif text-3xl font-bold text-plum">
                    Supabase tables
                  </h2>

                  <div className="mt-5 grid gap-3">
                    {[
                      "hero_slides",
                      "experts",
                      "certificates",
                      "plans",
                      "workshops",
                      "blogs",
                      "gallery",
                      "reviews",
                      "appointments",
                    ].map((table) => (
                      <div
                        key={table}
                        className="rounded-2xl bg-white px-4 py-3 text-sm font-bold text-ink/72"
                      >
                        {table}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
      </main>
    </div>
  );
}
