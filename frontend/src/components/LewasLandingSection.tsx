import * as React from "react";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  AlertOctagon,
  AlertTriangle,
  ArrowRight,
  Bell,
  Bot,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronRight,
  CloudRain,
  Compass,
  Cpu,
  Database,
  Droplets,
  ExternalLink,
  Eye,
  Flame,
  Gauge,
  Globe2,
  Layers,
  MapPin,
  Mountain,
  Radar,
  RadioTower,
  Satellite,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Waves,
  Wind,
  Zap,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

// ── Region Coverage Data with Enhanced Color Palette ─────────────────────────
const COVERAGE_REGIONS = [
  {
    id: "wayanad",
    name: "Wayanad",
    state: "Kerala",
    risk: "Critical",
    riskColor: "text-rose-400 bg-rose-500/15 border-rose-500/30",
    gradient: "from-rose-500/20 via-orange-500/10 to-transparent",
    glowColor: "group-hover:border-rose-500/50 shadow-rose-500/10",
    badgeBg: "bg-rose-500 text-white shadow-rose-500/30",
    description:
      "Vulnerable tea terraces and steep ghat corridors. Massive southwest monsoon accumulation on colluvium and weathered gneiss.",
    rainfall3d: "310 mm",
    slope: "38°",
    elevation: "1,250 m",
    vulnerability: "Maximum",
    hotspots: ["Chooralmala", "Meppadi", "Mundakkai", "Vythiri Pass"],
    coord: "11.6854° N, 76.1320° E",
  },
  {
    id: "idukki",
    name: "Idukki",
    state: "Kerala",
    risk: "High",
    riskColor: "text-amber-400 bg-amber-500/15 border-amber-500/30",
    gradient: "from-amber-500/20 via-yellow-500/10 to-transparent",
    glowColor: "group-hover:border-amber-500/50 shadow-amber-500/10",
    badgeBg: "bg-amber-500 text-black shadow-amber-500/30",
    description:
      "High-altitude rocky escarpments, Pettimudi debris-flow basin & Munnar valley. Rapid pore-pressure buildup under torrential cloudbursts.",
    rainfall3d: "265 mm",
    slope: "42°",
    elevation: "1,520 m",
    vulnerability: "High",
    hotspots: ["Pettimudi Basin", "Cheeyappara Falls", "Rajamala", "Kallar Valley"],
    coord: "9.8494° N, 76.9710° E",
  },
  {
    id: "nilgiris",
    name: "Nilgiris",
    state: "Tamil Nadu",
    risk: "Moderate",
    riskColor: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30",
    gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
    glowColor: "group-hover:border-emerald-500/50 shadow-emerald-500/10",
    badgeBg: "bg-emerald-500 text-black shadow-emerald-500/30",
    description:
      "Steep mountain passes and railway corridors. High moisture absorption in deep weathered laterite along Ooty and Coonoor ghat roads.",
    rainfall3d: "195 mm",
    slope: "34°",
    elevation: "2,240 m",
    vulnerability: "Moderate-High",
    hotspots: ["Coonoor Ghat Road", "Gudalur Valley", "Lovedale", "Kotagiri Bench"],
    coord: "11.4102° N, 76.6950° E",
  },
  {
    id: "kodagu",
    name: "Kodagu (Coorg)",
    state: "Karnataka",
    risk: "High",
    riskColor: "text-cyan-400 bg-cyan-500/15 border-cyan-500/30",
    gradient: "from-cyan-500/20 via-blue-500/10 to-transparent",
    glowColor: "group-hover:border-cyan-500/50 shadow-cyan-500/10",
    badgeBg: "bg-cyan-500 text-black shadow-cyan-500/30",
    description:
      "Continuous Western Ghat ridges with dense coffee plantations. History of deep-seated rotational slides in Jodupala and Bhagamandala.",
    rainfall3d: "280 mm",
    slope: "36°",
    elevation: "910 m",
    vulnerability: "High",
    hotspots: ["Jodupala Corridor", "Bhagamandala", "Talacauvery Ghat", "Madikeri Ridge"],
    coord: "12.4244° N, 75.7382° E",
  },
];

// ── Multi-Agent AI Agents with Vibrant Gradient Accents ───────────────────────
const AGENTS = [
  {
    id: "weather",
    name: "Weather Agent",
    icon: CloudRain,
    category: "Atmospheric Telemetry",
    status: "Active · Low Latency",
    tagColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
    iconBg: "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-cyan-500/20",
    glowBorder: "hover:border-cyan-500/50 hover:shadow-cyan-500/10",
    desc: "Ingests continuous precipitation rates from automatic weather stations (AWS), Doppler radar indices, and computes rolling 3-day and 7-day cumulative rainfall.",
    metrics: "15-min cycle · IMD AWS Telemetry",
  },
  {
    id: "soil",
    name: "Soil & Moisture Agent",
    icon: Droplets,
    category: "Subsurface Telemetry",
    status: "Active · In Situ",
    tagColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    iconBg: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-emerald-500/20",
    glowBorder: "hover:border-emerald-500/50 hover:shadow-emerald-500/10",
    desc: "Tracks volumetric water content (VWC), matric suction, and pore-water pressure across deployed IoT piezoelectric sensors to detect slope fluidization.",
    metrics: "88.4% Saturation · 12 Nodes",
  },
  {
    id: "terrain",
    name: "Terrain Agent",
    icon: Mountain,
    category: "Geomorphological Modeling",
    status: "Active · GIS Engine",
    tagColor: "text-teal-400 bg-teal-500/10 border-teal-500/30",
    iconBg: "bg-teal-500/15 text-teal-300 border border-teal-500/30 shadow-teal-500/20",
    glowBorder: "hover:border-teal-500/50 hover:shadow-teal-500/10",
    desc: "Computes digital elevation models (DEM), slope gradients, curvature concavity, road-cut slope destabilization, and catchment drainage accumulation.",
    metrics: "Cartosat-1 30m DEM Resolution",
  },
  {
    id: "satellite",
    name: "Satellite Agent",
    icon: Satellite,
    category: "Earth Observation (EO)",
    status: "Active · SAR Radar Feed",
    tagColor: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
    iconBg: "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 shadow-indigo-500/20",
    glowBorder: "hover:border-indigo-500/50 hover:shadow-indigo-500/10",
    desc: "Ingests Sentinel-1 C-band SAR interferometric coherence (InSAR) for millimetric ground subsidence and Sentinel-2 MSI multispectral moisture indices.",
    metrics: "Sentinel-1/2 Hub Live Feed",
  },
  {
    id: "prediction",
    name: "Risk Prediction Agent",
    icon: BrainCircuit,
    category: "Machine Learning Core",
    status: "Active · 98.2% Accuracy",
    tagColor: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    iconBg: "bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-amber-500/20",
    glowBorder: "hover:border-amber-500/50 hover:shadow-amber-500/10",
    desc: "Runs 100-estimator Random Forest & Gradient Boosted classifiers trained on historical Western Ghats landslide inventories to compute probability and hazard classes.",
    metrics: "100 Trees · Gini Impurity Model",
  },
  {
    id: "alert",
    name: "Alert & Reasoning Agent",
    icon: Bell,
    category: "Autonomous Action",
    status: "Active · Groq Cloud LPU",
    tagColor: "text-rose-400 bg-rose-500/10 border-rose-500/30",
    iconBg: "bg-rose-500/15 text-rose-300 border border-rose-500/30 shadow-rose-500/20",
    glowBorder: "hover:border-rose-500/50 hover:shadow-rose-500/10",
    desc: "Leverages Groq Cloud Llama-3.3-70B for zero-latency deterministic reasoning, automated CAP broadcast generation, and multilingual evacuation bulletins (EN, TA, ML).",
    metrics: "< 350ms Reasoning SLA",
  },
];

// ── Features List ────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: Activity,
    title: "Real-Time Monitoring",
    desc: "Continuous 24/7 telemetry streams capturing precipitation, pore-water pressure, and slope velocity across critical ghat sectors.",
    accent: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  },
  {
    icon: BrainCircuit,
    title: "AI-Based Prediction",
    desc: "Machine-learning risk scoring balancing geotechnical safety factors, rainfall thresholds, and historical landslide footprints.",
    accent: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    icon: Bot,
    title: "Multi-Agent Intelligence",
    desc: "Autonomous agent pipeline where specialized sensing, prediction, reasoning, and action agents collaborate with zero human bottleneck.",
    accent: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
  },
  {
    icon: Satellite,
    title: "Satellite Data Integration",
    desc: "Direct integration with ESA Copernicus Sentinel-1 radar and Sentinel-2 optical imagery for terrain deformation telemetry.",
    accent: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  },
  {
    icon: RadioTower,
    title: "Sensor-Based Detection",
    desc: "Mesh network of localized IoT soil moisture probes, rain gauges, and piezoelectric sensors deployed at vulnerable slopes.",
    accent: "text-teal-400 bg-teal-500/10 border-teal-500/20",
  },
  {
    icon: Zap,
    title: "Automated Early Alerts",
    desc: "Sub-second broadcast dispatching SMS bulletins, police station alarms, and community radio warnings when risk crosses 80%.",
    accent: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  },
  {
    icon: Layers,
    title: "Risk Visualization",
    desc: "Interactive GIS maps rendering topographic contours, landslide vulnerability zoning, and live sensor health feeds.",
    accent: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  },
  {
    icon: Compass,
    title: "Regional Monitoring",
    desc: "Hyperlocal hazard classification targeted specifically to the complex microclimates of Wayanad, Idukki, Nilgiris, and Kodagu.",
    accent: "text-rose-400 bg-rose-500/10 border-rose-500/20",
  },
];

export function LewasLandingSection() {
  const { t } = useI18n();
  const [activeRegion, setActiveRegion] = React.useState<string>("wayanad");
  const defaultRegion = COVERAGE_REGIONS[0] as (typeof COVERAGE_REGIONS)[number];
  const selectedRegion = COVERAGE_REGIONS.find((r) => r.id === activeRegion) ?? defaultRegion;

  return (
    <div id="lewas" className="w-full space-y-24 py-10 font-sans text-foreground transition-colors">
      {/* ────────────────────────────────────────────────────────────────────────
          1. HERO SECTION — Modern Dark-Tech + Nature-Inspired Theme
          ──────────────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl border border-emerald-500/25 bg-gradient-to-br from-[#091522] via-[#0d1d2e] to-[#08121e] p-6 shadow-2xl backdrop-blur-2xl sm:p-10 lg:p-14">
        {/* Ambient bioluminescent glows */}
        <div className="pointer-events-none absolute -top-32 -left-32 size-[450px] rounded-full bg-emerald-500/15 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 size-[450px] rounded-full bg-cyan-500/15 blur-[120px]" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] rounded-full bg-primary/10 blur-[160px]" />
        {/* Fine topographical grid pattern overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] opacity-[0.06] [background-size:24px_24px]" />

        <div className="relative z-10 grid gap-10 lg:grid-cols-12 lg:items-center">
          {/* Hero Left Content */}
          <div className="space-y-6 lg:col-span-7">
            {/* Status Pill Badge */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-300 backdrop-blur-md shadow-xs">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
              </span>
              <span className="tracking-wide">Autonomous Multi-Agent AI System</span>
              <span className="h-3 w-px bg-emerald-500/30" />
              <span className="font-mono text-[11px] font-bold text-emerald-400 uppercase tracking-widest">
                v1.0 Live
              </span>
            </div>

            {/* Brand Title with Display Typography */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="font-['Outfit',sans-serif] text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-sm">
                  LEWAS
                </span>
                <span className="h-8 w-px bg-emerald-500/40" />
                <span className="font-['Outfit',sans-serif] text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 sm:text-sm">
                  Western Ghats Early Warning
                </span>
              </div>
              <h1 className="font-['Outfit',sans-serif] text-2xl font-extrabold tracking-tight text-slate-100 sm:text-4xl lg:text-5xl leading-[1.12]">
                Western Ghats Multi-Agent{" "}
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  Landslide Early Warning System
                </span>
              </h1>
            </div>

            {/* Tagline */}
            <p className="max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base lg:text-lg">
              AI-powered real-time landslide monitoring, prediction, and early warning for
              vulnerable regions of the Western Ghats — covering Wayanad, Idukki, Nilgiris, and Kodagu.
            </p>

            {/* Telemetry Stats Bar */}
            <div className="grid grid-cols-3 gap-3 border-y border-slate-700/60 py-4 max-w-xl">
              <div>
                <p className="font-mono text-xl font-extrabold text-white sm:text-2xl">4 Districts</p>
                <p className="text-xs text-slate-400 mt-0.5">Vulnerable Zones</p>
              </div>
              <div>
                <p className="font-mono text-xl font-extrabold text-emerald-400 sm:text-2xl">6 Agents</p>
                <p className="text-xs text-slate-400 mt-0.5">Autonomous Pipeline</p>
              </div>
              <div>
                <p className="font-mono text-xl font-extrabold text-cyan-400 sm:text-2xl">&lt; 350ms</p>
                <p className="text-xs text-slate-400 mt-0.5">Inference SLA</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <a
                href="#lewas-workflow"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:from-emerald-400 hover:to-teal-400 hover:shadow-xl hover:shadow-emerald-500/35 hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <Compass className="size-4" />
                Explore System
              </a>
              <Link
                to="/alerts"
                search={{ alert: undefined }}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/80 px-6 py-3.5 text-sm font-semibold text-slate-200 backdrop-blur-md transition-all duration-200 hover:bg-slate-800 hover:border-amber-500/40 hover:text-white active:scale-95 cursor-pointer shadow-md"
              >
                <AlertTriangle className="size-4 text-amber-400" />
                View Live Alerts
              </Link>
            </div>
          </div>

          {/* Hero Right: LEWAS Logo Card Showcase */}
          <div className="flex flex-col items-center justify-center lg:col-span-5">
            <div className="group relative flex w-full max-w-md flex-col items-center rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-slate-900/95 to-slate-950/95 p-6 shadow-2xl backdrop-blur-2xl transition-all duration-300 hover:border-emerald-400/60 hover:shadow-emerald-500/15">
              {/* Outer Glowing halo */}
              <div className="pointer-events-none absolute -inset-2 rounded-3xl bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-teal-500/20 opacity-40 blur-2xl transition-opacity group-hover:opacity-80" />

              {/* Logo Frame */}
              <div className="relative w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/90 p-5 shadow-inner flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="LEWAS Official Logo"
                  className="size-72 object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Verified Badge Under Logo */}
              <div className="mt-4 flex w-full items-center justify-between px-1 text-xs">
                <span className="flex items-center gap-1.5 font-semibold text-emerald-300">
                  <ShieldCheck className="size-4 text-emerald-400" />
                  Sentinel Hub & IMD Verified
                </span>
                <span className="font-mono text-[11px] font-bold text-slate-400">
                  LEWAS Core Architecture
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────────
          2. LOCATION / COVERAGE SECTION
          ──────────────────────────────────────────────────────────────────────── */}
      <section className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-500">
              <MapPin className="size-3.5" />
              Regional Priority Monitoring
            </div>
            <h2 className="font-['Outfit',sans-serif] text-2xl font-black tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              Vulnerable Western Ghats Coverage
            </h2>
            <p className="text-sm text-muted-foreground">
              Targeted geomorphic modeling and IoT sensor density across four disaster-prone districts.
            </p>
          </div>
          <span className="font-mono text-xs font-bold text-muted-foreground bg-muted/60 px-3 py-1.5 rounded-lg">
            Active Grid: 4 Districts · 16 Hotspots
          </span>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {COVERAGE_REGIONS.map((region) => (
            <div
              key={region.id}
              onClick={() => setActiveRegion(region.id)}
              className={cn(
                "group relative flex flex-col justify-between rounded-2xl border p-5 backdrop-blur-md transition-all duration-200 cursor-pointer hover:-translate-y-1 shadow-sm",
                activeRegion === region.id
                  ? "border-emerald-500 bg-gradient-to-b from-emerald-500/10 via-card to-card shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/50"
                  : "border-border/80 bg-card/60 hover:border-emerald-500/40 hover:bg-card/90"
              )}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    <Mountain className="size-5" />
                  </div>
                  <span
                    className={cn(
                      "rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase shadow-xs",
                      region.riskColor
                    )}
                  >
                    {region.risk} Hazard
                  </span>
                </div>

                <div className="mt-4">
                  <h3 className="font-['Outfit',sans-serif] text-xl font-bold text-foreground group-hover:text-emerald-400 transition-colors">
                    {region.name}
                  </h3>
                  <p className="text-xs font-semibold text-muted-foreground">{region.state}</p>
                  <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground/90">
                    {region.description}
                  </p>
                </div>
              </div>

              <div className="mt-5 border-t border-border/60 pt-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-muted-foreground">3D Rain Accum:</span>
                  <span className="font-bold text-foreground">{region.rainfall3d}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-muted-foreground">Mean Slope:</span>
                  <span className="font-bold text-foreground">{region.slope}</span>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5 pt-1">
                  {region.hotspots.slice(0, 2).map((h) => (
                    <span
                      key={h}
                      className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────────
          3. HOW LEWAS WORKS (WORKFLOW PIPELINE)
          ──────────────────────────────────────────────────────────────────────── */}
      <section
        id="lewas-workflow"
        className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-b from-card/80 to-card/40 p-6 backdrop-blur-xl sm:p-10 shadow-xl"
      >
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-500">
            <Zap className="size-3.5" />
            Autonomous Pipeline Workflow
          </div>
          <h2 className="font-['Outfit',sans-serif] text-2xl font-black tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            How LEWAS Works in Real-Time
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            End-to-end automated pipeline from ground sensors and spaceborne radar to community broadcast.
          </p>
        </div>

        {/* 6 Sequential Steps */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {[
            {
              step: "01",
              name: "Sensors",
              icon: RadioTower,
              desc: "Rain gauges, tiltmeters & soil pore pressure sensors.",
              accent: "text-blue-400 bg-blue-500/10 border-blue-500/30",
            },
            {
              step: "02",
              name: "Data Collection",
              icon: Database,
              desc: "IMD AWS feeds, Sentinel-1 InSAR & Cartosat-1 30m DEM.",
              accent: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
            },
            {
              step: "03",
              name: "Multi-Agent AI",
              icon: BrainCircuit,
              desc: "Coordinated Sensing, Weather, Soil & Satellite agents.",
              accent: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
            },
            {
              step: "04",
              name: "Risk Prediction",
              icon: Activity,
              desc: "100-tree Random Forest & ML probabilistic classifier.",
              accent: "text-amber-400 bg-amber-500/10 border-amber-500/30",
            },
            {
              step: "05",
              name: "Early Warning",
              icon: AlertTriangle,
              desc: "Deterministic threshold evaluation (Probability ≥ 80%).",
              accent: "text-orange-400 bg-orange-500/10 border-orange-500/30",
            },
            {
              step: "06",
              name: "User Alert",
              icon: Bell,
              desc: "Sub-second SMS, police sirens, and CAP broadcasts.",
              accent: "text-rose-400 bg-rose-500/10 border-rose-500/30",
            },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-background/90 p-5 shadow-xs transition-all duration-200 hover:border-emerald-500/50 hover:shadow-md hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-extrabold text-muted-foreground/60">
                      STEP {item.step}
                    </span>
                    <div
                      className={cn(
                        "flex size-10 items-center justify-center rounded-xl border shadow-xs",
                        item.accent
                      )}
                    >
                      <Icon className="size-4" />
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-['Outfit',sans-serif] font-bold text-sm text-foreground">
                      {item.name}
                    </h4>
                    <p className="mt-1.5 text-xs text-muted-foreground leading-snug">
                      {item.desc}
                    </p>
                  </div>
                </div>

                {index < 5 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-muted-foreground/40">
                    <ChevronRight className="size-4 text-emerald-500/60" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────────
          4. MULTI-AGENT AI SECTION
          ──────────────────────────────────────────────────────────────────────── */}
      <section className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-500">
              <Bot className="size-3.5" />
              Agentic AI Ecosystem
            </div>
            <h2 className="font-['Outfit',sans-serif] text-2xl font-black tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              Coordinated Autonomous Agents
            </h2>
            <p className="text-sm text-muted-foreground">
              Six specialized micro-agents running synchronously to eliminate human response bottleneck.
            </p>
          </div>
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400">
            ● 6 / 6 Agents Operational
          </span>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {AGENTS.map((agent) => {
            const Icon = agent.icon;
            return (
              <div
                key={agent.id}
                className={cn(
                  "group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-gradient-to-br from-card to-card/60 p-6 shadow-xs backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl",
                  agent.glowBorder
                )}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className={cn("flex size-12 items-center justify-center rounded-2xl", agent.iconBg)}>
                      <Icon className="size-6" />
                    </div>
                    <span className="rounded-md bg-muted/80 px-2 py-0.5 font-mono text-[10px] font-semibold text-muted-foreground">
                      {agent.status}
                    </span>
                  </div>

                  <div className="mt-5">
                    <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                      {agent.category}
                    </p>
                    <h3 className="font-['Outfit',sans-serif] mt-1 text-lg font-bold text-foreground group-hover:text-emerald-400 transition-colors">
                      {agent.name}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {agent.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-3.5 text-[11px]">
                  <span className="font-mono text-muted-foreground">{agent.metrics}</span>
                  <span className="flex items-center gap-1 font-semibold text-emerald-500 group-hover:translate-x-1 transition-transform">
                    View Agent <ArrowRight className="size-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────────
          5. LIVE RISK DASHBOARD PREVIEW
          ──────────────────────────────────────────────────────────────────────── */}
      <section className="rounded-3xl border border-slate-700/60 bg-gradient-to-b from-[#091522] via-card to-background p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        <div className="flex flex-col gap-3 border-b border-border/80 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <Gauge className="size-3.5" />
              Telemetry Cockpit
            </div>
            <h2 className="font-['Outfit',sans-serif] text-xl font-extrabold tracking-tight text-white sm:text-2xl lg:text-3xl">
              Live Risk Telemetry Dashboard Preview
            </h2>
            <p className="text-xs text-slate-400">
              Simulated real-time sensor snapshot for Wayanad & Idukki monitoring stations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-rose-500/15 border border-rose-500/40 px-3.5 py-1 text-xs font-bold text-rose-400 animate-pulse">
              ● LIVE HAZARD ALERT
            </span>
            <Link
              to="/prediction"
              className="rounded-xl bg-emerald-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-xs"
            >
              Open Studio
            </Link>
          </div>
        </div>

        {/* Dashboard Preview Cards Grid */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {/* Card 1: Risk Level */}
          <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs text-rose-400 font-semibold">
              <span>Risk Level</span>
              <AlertOctagon className="size-4" />
            </div>
            <p className="font-mono mt-2 text-2xl font-black text-rose-400">CRITICAL</p>
            <p className="mt-1 text-[10px] text-slate-400">Tier 4 Evacuation Alarm</p>
          </div>

          {/* Card 2: Cumulative Rainfall */}
          <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Rainfall (3D / 7D)</span>
              <CloudRain className="size-4 text-cyan-400" />
            </div>
            <p className="font-mono mt-2 text-2xl font-black text-white">310 / 520</p>
            <p className="mt-1 text-[10px] text-cyan-400">mm (Threshold Breached)</p>
          </div>

          {/* Card 3: Soil Moisture */}
          <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Soil Moisture</span>
              <Droplets className="size-4 text-teal-400" />
            </div>
            <p className="font-mono mt-2 text-2xl font-black text-white">88.4%</p>
            <p className="mt-1 text-[10px] text-rose-400 font-semibold">Saturation Threshold Crossed</p>
          </div>

          {/* Card 4: Slope Stability */}
          <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Slope Stability</span>
              <Mountain className="size-4 text-amber-400" />
            </div>
            <p className="font-mono mt-2 text-2xl font-black text-white">1.08 FoS</p>
            <p className="mt-1 text-[10px] text-amber-400 font-semibold">Factor of Safety &lt; 1.20</p>
          </div>

          {/* Card 5: Landslide Probability */}
          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold">
              <span>ML Probability</span>
              <BrainCircuit className="size-4" />
            </div>
            <p className="font-mono mt-2 text-2xl font-black text-emerald-400">89.2%</p>
            <p className="mt-1 text-[10px] text-slate-400">Confidence: 94%</p>
          </div>

          {/* Card 6: Active Alerts */}
          <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Active Alerts</span>
              <Bell className="size-4 text-rose-400" />
            </div>
            <p className="font-mono mt-2 text-2xl font-black text-white">3 Live</p>
            <p className="mt-1 text-[10px] text-slate-400">Chooralmala & Pettimudi</p>
          </div>
        </div>

        {/* Telemetry Status Strip */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-xs text-slate-400">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 font-semibold text-slate-200">
              <Satellite className="size-3.5 text-indigo-400" />
              Sentinel-1 InSAR Coherence: 0.28 (Deformation Detected)
            </span>
            <span className="hidden sm:inline text-slate-700">|</span>
            <span className="flex items-center gap-1.5">
              <RadioTower className="size-3.5 text-emerald-400" />
              12 / 12 Ground Stations Transmitting
            </span>
          </div>
          <Link
            to="/map"
            search={{ hotspot: undefined }}
            className="font-semibold text-emerald-400 hover:underline flex items-center gap-1"
          >
            Open Live Risk Map <ExternalLink className="size-3" />
          </Link>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────────
          6. EARLY WARNING SECTION
          ──────────────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl border border-rose-500/30 bg-gradient-to-b from-rose-950/25 via-card to-background p-6 shadow-2xl sm:p-10">
        <div className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-rose-500/10 blur-[120px]" />

        <div className="relative z-10 text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/40 bg-rose-500/10 px-4 py-1.5 text-xs font-bold text-rose-400 uppercase tracking-widest animate-pulse">
            <AlertOctagon className="size-4" />
            Crucial Life Safety Protocol
          </div>
          <h2 className="font-['Outfit',sans-serif] text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            EARLY WARNING SAVES LIVES
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            In steep mountain terrains, 30 minutes of advance notice is the difference between safe evacuation
            and catastrophic loss. LEWAS translates complex geophysical signals into 4 standardized action tiers.
          </p>
        </div>

        {/* 4 Alert Levels with Distinct Visual States */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Level 1: Low */}
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 transition-transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-400 uppercase">
                Tier 1
              </span>
              <span className="size-2.5 rounded-full bg-emerald-500" />
            </div>
            <h3 className="font-['Outfit',sans-serif] mt-3 text-lg font-black text-emerald-400">
              LOW (Green)
            </h3>
            <p className="mt-1 text-xs text-muted-foreground leading-snug">
              Routine background monitoring. Stable pore-water metrics. Normal rainfall under threshold.
            </p>
            <div className="mt-4 border-t border-emerald-500/20 pt-3 text-[11px] text-muted-foreground">
              <span className="font-semibold text-foreground">Action:</span> Normal routine operations; telemetry baseline collection.
            </div>
          </div>

          {/* Level 2: Moderate */}
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 transition-transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <span className="rounded-md bg-amber-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-400 uppercase">
                Tier 2
              </span>
              <span className="size-2.5 rounded-full bg-amber-500" />
            </div>
            <h3 className="font-['Outfit',sans-serif] mt-3 text-lg font-black text-amber-400">
              MODERATE (Yellow)
            </h3>
            <p className="mt-1 text-xs text-muted-foreground leading-snug">
              Continuous rain above 120mm/3d. Soil saturation reaching 65%. Watch advisory initiated.
            </p>
            <div className="mt-4 border-t border-amber-500/20 pt-3 text-[11px] text-muted-foreground">
              <span className="font-semibold text-foreground">Action:</span> Dispatch alerts to district emergency cells; monitor road cuts.
            </div>
          </div>

          {/* Level 3: High */}
          <div className="rounded-2xl border border-orange-500/30 bg-orange-500/5 p-5 transition-transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <span className="rounded-md bg-orange-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-orange-400 uppercase">
                Tier 3
              </span>
              <span className="size-2.5 rounded-full bg-orange-500" />
            </div>
            <h3 className="font-['Outfit',sans-serif] mt-3 text-lg font-black text-orange-400">
              HIGH (Orange)
            </h3>
            <p className="mt-1 text-xs text-muted-foreground leading-snug">
              Trigger threshold breached. Probability &gt; 65%. Ground tilt detected on piezoelectric nodes.
            </p>
            <div className="mt-4 border-t border-orange-500/20 pt-3 text-[11px] text-muted-foreground">
              <span className="font-semibold text-foreground">Action:</span> Pre-evacuation of vulnerable tea estate workers and ghat roads.
            </div>
          </div>

          {/* Level 4: Critical */}
          <div className="relative rounded-2xl border border-rose-500 bg-rose-500/15 p-5 shadow-lg shadow-rose-500/15 ring-1 ring-rose-500/50 transition-transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <span className="rounded-md bg-rose-500 px-2.5 py-0.5 font-mono text-[10px] font-bold text-white uppercase shadow-sm">
                Tier 4
              </span>
              <span className="size-3 rounded-full bg-rose-500 animate-ping" />
            </div>
            <h3 className="font-['Outfit',sans-serif] mt-3 text-lg font-black text-rose-400">
              CRITICAL (Red)
            </h3>
            <p className="mt-1 text-xs text-foreground/95 leading-snug font-medium">
              Imminent debris-flow or slope failure. ML probability ≥ 80%, confidence ≥ 75%.
            </p>
            <div className="mt-4 border-t border-rose-500/30 pt-3 text-[11px] text-foreground font-semibold">
              <span className="text-rose-400">Action:</span> Instant automated CAP broadcast; mandatory evacuation orders.
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────────
          7. MAP SECTION (INTERACTIVE WESTERN GHATS CONCEPT)
          ──────────────────────────────────────────────────────────────────────── */}
      <section className="rounded-3xl border border-border bg-card p-6 shadow-xl backdrop-blur-xl sm:p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-500">
              <Globe2 className="size-3.5" />
              Geospatial Intelligence
            </div>
            <h2 className="font-['Outfit',sans-serif] text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              Western Ghats Geospatial Risk Map
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Click on any hotspot to inspect telemetry data, slope angle, and predicted probability.
            </p>
          </div>
          <Link
            to="/map"
            search={{ hotspot: undefined }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground hover:bg-accent hover:border-emerald-500/50 transition-colors shadow-xs"
          >
            Open Fullscreen GIS Map <ExternalLink className="size-3.5" />
          </Link>
        </div>

        {/* Map Visual Concept Grid */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Map canvas container */}
          <div className="relative min-h-[380px] overflow-hidden rounded-2xl border border-slate-800 bg-[#060e18] p-5 lg:col-span-8 flex flex-col justify-between shadow-inner">
            {/* Topography Grid lines & background visual */}
            <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] opacity-[0.08] [background-size:24px_24px]" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Simulated Ghat Topographic Contours / Waypoint Overlay */}
            <div className="relative z-10 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-[11px] text-emerald-400 font-bold flex items-center gap-2">
                <Radar className="size-4 animate-spin text-emerald-400" />
                Live Sentinel-1 SAR Telemetry Feed Active
              </span>
              <span className="font-mono text-[11px] text-slate-400">
                11.6854° N, 76.1320° E (Nilgiri Biosphere)
              </span>
            </div>

            {/* Map Hotspot Nodes */}
            <div className="relative z-10 my-auto grid grid-cols-2 gap-4 sm:grid-cols-4 py-6">
              {COVERAGE_REGIONS.map((region) => {
                const isSelected = activeRegion === region.id;
                return (
                  <button
                    key={region.id}
                    onClick={() => setActiveRegion(region.id)}
                    className={cn(
                      "group relative flex flex-col items-center justify-center rounded-2xl p-4 text-center transition-all duration-200 cursor-pointer shadow-sm",
                      isSelected
                        ? "bg-emerald-500/20 border-2 border-emerald-400 shadow-xl shadow-emerald-500/20 scale-105"
                        : "bg-slate-900/80 border border-slate-700/80 hover:border-emerald-500/50 hover:bg-slate-800/90"
                    )}
                  >
                    <span className="relative flex size-3.5 mb-2.5">
                      <span
                        className={cn(
                          "absolute inline-flex h-full w-full animate-ping rounded-full",
                          region.risk === "Critical"
                            ? "bg-rose-400"
                            : region.risk === "High"
                            ? "bg-amber-400"
                            : "bg-emerald-400"
                        )}
                      />
                      <span
                        className={cn(
                          "relative inline-flex size-3.5 rounded-full shadow-xs",
                          region.risk === "Critical"
                            ? "bg-rose-500"
                            : region.risk === "High"
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                        )}
                      />
                    </span>
                    <span className="font-['Outfit',sans-serif] text-sm font-bold text-white">
                      {region.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">{region.state}</span>
                    <span
                      className={cn(
                        "mt-1.5 rounded px-1.5 py-0.2 font-mono text-[9px] font-bold uppercase",
                        region.riskColor
                      )}
                    >
                      {region.risk} Risk
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Map Legend */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/80 pt-3 text-[11px] font-mono text-slate-400">
              <div className="flex items-center gap-3.5">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-emerald-400" /> &lt; 30% Low
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-amber-400" /> 30–65% Moderate
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-orange-400" /> 65–80% High
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-rose-500" /> &gt; 80% Critical
                </span>
              </div>
              <span className="text-emerald-400/80">Interactive Telemetry Grid</span>
            </div>
          </div>

          {/* Selected Node Detail Inspector */}
          <div className="flex flex-col justify-between rounded-2xl border border-border bg-card/90 p-5 shadow-sm lg:col-span-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Station Inspector
                </span>
                <span
                  className={cn(
                    "rounded-md border px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase",
                    selectedRegion.riskColor
                  )}
                >
                  {selectedRegion.risk} Hazard
                </span>
              </div>

              <div className="mt-4">
                <h3 className="font-['Outfit',sans-serif] text-2xl font-black text-foreground">
                  {selectedRegion.name}
                </h3>
                <p className="text-xs font-semibold text-muted-foreground">
                  {selectedRegion.state} · {selectedRegion.coord}
                </p>
                <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">
                  {selectedRegion.description}
                </p>
              </div>

              <div className="mt-5 space-y-2.5 border-y border-border/60 py-3.5 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">3-Day Cumulative:</span>
                  <span className="font-bold text-foreground">{selectedRegion.rainfall3d}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mean Slope Angle:</span>
                  <span className="font-bold text-foreground">{selectedRegion.slope}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Elevation:</span>
                  <span className="font-bold text-foreground">{selectedRegion.elevation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Priority Vulnerability:</span>
                  <span className="font-bold text-rose-400">{selectedRegion.vulnerability}</span>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <Link
                to="/map"
                search={{ hotspot: undefined }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3 text-xs font-bold text-slate-950 shadow-md hover:from-emerald-400 hover:to-teal-400 transition-all"
              >
                Inspect {selectedRegion.name} On Full Map <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────────
          8. FEATURES SECTION
          ──────────────────────────────────────────────────────────────────────── */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-500">
            <ShieldCheck className="size-3.5" />
            Cutting-Edge Capabilities
          </div>
          <h2 className="font-['Outfit',sans-serif] text-2xl font-black tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            Engineered for Disaster Preparedness
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            A comprehensive suite of geophysical and artificial intelligence features built for state and district authorities.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="group rounded-2xl border border-border/80 bg-card/60 p-5 backdrop-blur-xs transition-all duration-200 hover:border-emerald-500/50 hover:bg-card hover:shadow-lg hover:-translate-y-1"
              >
                <div className={cn("flex size-11 items-center justify-center rounded-xl border transition-transform group-hover:scale-105", feat.accent)}>
                  <Icon className="size-5" />
                </div>
                <h3 className="font-['Outfit',sans-serif] mt-4 text-base font-bold text-foreground group-hover:text-emerald-400 transition-colors">
                  {feat.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────────
          9. CTA SECTION
          ──────────────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl border border-emerald-500/40 bg-gradient-to-r from-[#091522] via-[#0d1f30] to-[#07131e] p-8 shadow-2xl backdrop-blur-xl sm:p-12 text-center">
        <div className="pointer-events-none absolute -left-20 -bottom-20 size-80 rounded-full bg-emerald-500/15 blur-[120px]" />
        <div className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-cyan-500/15 blur-[120px]" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          {/* Mini logo badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-slate-900/80 px-3.5 py-1.5 text-xs font-semibold text-slate-200 shadow-md">
            <img src="/logo.png" alt="LEWAS Logo" className="size-5 object-contain" />
            <span>Western Ghats Disaster Mitigation Initiative</span>
          </div>

          <h2 className="font-['Outfit',sans-serif] text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
            Protect Communities. Predict Landslides. Save Lives.
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Experience the next generation of autonomous geophysical intelligence. Test live predictions or review active hazard warnings now.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-7 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/30 transition-all duration-200 hover:from-emerald-400 hover:to-teal-400 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Gauge className="size-4" />
              Launch LEWAS Dashboard
            </Link>
            <Link
              to="/prediction"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/90 px-6 py-3.5 text-sm font-semibold text-slate-200 transition-all duration-200 hover:bg-slate-800 hover:border-emerald-500/40 hover:text-white"
            >
              <BrainCircuit className="size-4 text-emerald-400" />
              Run AI Prediction Model
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
