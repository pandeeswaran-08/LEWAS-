import { useState, useRef, useEffect } from "react";
import {
  Bot,
  ChevronDown,
  Globe,
  Loader2,
  MapPin,
  Radio,
  Send,
  ShieldAlert,
  Sparkles,
  X,
} from "lucide-react";
import { sendDecisionAgentChat } from "@/lib/api";
import { useI18n, type Lang } from "@/lib/i18n";
import { LanguageDropdown } from "@/components/LanguageDropdown";
import { sensorNodes } from "@/data/mockData";

interface Message {
  id: string;
  sender: "user" | "agent";
  text: string;
  timestamp: string;
  actionTag?: "RECOMMEND_AUTO_BROADCAST" | "MANUAL_OFFICER_REVIEW" | "ROUTINE_MONITORING";
}

const MONITORED_HOTSPOTS = [
  {
    id: "WYD-01",
    name: "Chooralmala",
    district: "Wayanad",
    state: "Kerala",
    slope: 38,
    elevation: 980,
    road_distance: 120,
    soil_type: "Colluvium",
    rain_3d: 372,
    rain_7d: 618,
    probability: 91,
    confidence: 88,
    risk_level: "Critical",
    action: "RECOMMEND_AUTO_BROADCAST" as const,
  },
  {
    id: "WYD-02",
    name: "Mundakkai",
    district: "Wayanad",
    state: "Kerala",
    slope: 41,
    elevation: 1120,
    road_distance: 140,
    soil_type: "Colluvium",
    rain_3d: 341,
    rain_7d: 590,
    probability: 88,
    confidence: 85,
    risk_level: "Critical",
    action: "RECOMMEND_AUTO_BROADCAST" as const,
  },
  {
    id: "IDK-02",
    name: "Pettimudi",
    district: "Idukki",
    state: "Kerala",
    slope: 43,
    elevation: 1650,
    road_distance: 180,
    soil_type: "Colluvium",
    rain_3d: 310,
    rain_7d: 540,
    probability: 86,
    confidence: 82,
    risk_level: "Critical",
    action: "RECOMMEND_AUTO_BROADCAST" as const,
  },
  {
    id: "IDK-01",
    name: "Munnar Gap Rd",
    district: "Idukki",
    state: "Kerala",
    slope: 36,
    elevation: 1520,
    road_distance: 25,
    soil_type: "Gneissic_Overburden",
    rain_3d: 295,
    rain_7d: 512,
    probability: 79,
    confidence: 81,
    risk_level: "High",
    action: "MANUAL_OFFICER_REVIEW" as const,
  },
  {
    id: "NIL-01",
    name: "Coonoor Ghat",
    district: "Nilgiris",
    state: "Tamil Nadu",
    slope: 34,
    elevation: 1780,
    road_distance: 35,
    soil_type: "Lateritic",
    rain_3d: 215,
    rain_7d: 380,
    probability: 68,
    confidence: 76,
    risk_level: "High",
    action: "MANUAL_OFFICER_REVIEW" as const,
  },
  {
    id: "KDG-01",
    name: "Madikeri",
    district: "Kodagu",
    state: "Karnataka",
    slope: 33,
    elevation: 1150,
    road_distance: 90,
    soil_type: "Lateritic",
    rain_3d: 240,
    rain_7d: 410,
    probability: 71,
    confidence: 77,
    risk_level: "High",
    action: "MANUAL_OFFICER_REVIEW" as const,
  },
];

export function DecisionAgentWidget() {
  const { lang, setLang } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState(MONITORED_HOTSPOTS[0]!);
  const [inputQuery, setInputQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "agent",
      text:
        lang === "ta"
          ? `வணக்கம்! நான் மேற்குத் தொடர்ச்சி மலை பேரிடர் முடிவெடுக்கும் உதவி முகவர். தற்போது ${selectedHotspot.name}-ல் நிலச்சரிவு சாத்தியக்கூறு ${selectedHotspot.probability}% (${selectedHotspot.risk_level}). பரிந்துரைக்கப்பட்ட நடவடிக்கை: Auto-Broadcast. ஏதேனும் விளக்கம் அல்லது SMS தேவையா?`
          : lang === "ml"
          ? `നമസ്കാരം! ഞാൻ പശ്ചിമഘട്ട ഉരുൾപൊട്ടൽ തീരുമാന സഹായി ഏജന്റാണ്. ഇപ്പോൾ ${selectedHotspot.name}-ൽ സാധ്യത ${selectedHotspot.probability}% (${selectedHotspot.risk_level}). എന്ത് സഹായമാണ് വേണ്ടത്?`
          : lang === "kn"
          ? `ನಮಸ್ಕಾರ! ನಾನು ಪಶ್ಚಿಮ ಘಟ್ಟಗಳ ಭೂಕುಸಿತ ನಿರ್ಧಾರ ಬೆಂಬಲ AI ಏಜೆಂಟ್. ಪ್ರಸ್ತುತ ${selectedHotspot.name}-ನಲ್ಲಿ ಅಪಾಯದ ಮಟ್ಟ ${selectedHotspot.probability}% (${selectedHotspot.risk_level}). ಶಿಫಾರಸು ಕ್ರಮ: ತುರ್ತು ಪ್ರಸಾರ (Auto-Broadcast). ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?`
          : `Hello, Field Officer! I am the Western Ghats Decision Support Agent. Currently monitoring ${selectedHotspot.name} (${selectedHotspot.probability}% probability, ${selectedHotspot.confidence}% confidence). Recommended Action: Immediate Auto-Broadcast. How can I assist?`,
      timestamp: "Now",
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (customText?: string) => {
    const text = (customText || inputQuery).trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputQuery("");
    setIsLoading(true);

    try {
      const res = await sendDecisionAgentChat({
        hotspot: selectedHotspot,
        user_message: text,
        language: lang as Lang,
      });

      const replyText =
        res && res.reply
          ? typeof res.reply === "string"
            ? res.reply
            : JSON.stringify(res.reply, null, 2)
          : "Response received from Decision Support Engine.";

      const agentMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "agent",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        actionTag: selectedHotspot.action,
      };

      setMessages((prev) => [...prev, agentMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "agent",
          text:
            lang === "ta"
              ? `${selectedHotspot.name} நிலச்சரிவு சாத்தியக்கூறு: ${selectedHotspot.probability}%, நம்பிக்கை: ${selectedHotspot.confidence}%. நடவடிக்கை: ${selectedHotspot.action}.`
              : lang === "kn"
              ? `${selectedHotspot.name} ಭೂಕುಸಿತದ ಅಪಾಯ: ${selectedHotspot.probability}% ಸಂಭವನೀಯತೆ, ${selectedHotspot.confidence}% ಸಂವೇದಕ ನಿಖರತೆ. ಕ್ರಮ: ${selectedHotspot.action}.`
              : `${selectedHotspot.name} Landslide Risk: ${selectedHotspot.probability}% probability. Action: ${selectedHotspot.action}.`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          actionTag: selectedHotspot.action,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickChips = [
    {
      label:
        lang === "ta"
          ? "ரிஸ்க் காரணம்"
          : lang === "kn"
          ? "ಅಪಾಯ ಕಾರಣ"
          : lang === "ml"
          ? "അപകട കാരണം"
          : "Explain Risk",
      query:
        lang === "ta"
          ? `${selectedHotspot.name} risk explain பண்ணு`
          : lang === "kn"
          ? `${selectedHotspot.name} ಭೂಕುಸಿತ ಅಪಾಯದ ಕಾರಣಗಳನ್ನು ವಿವರಿಸಿ`
          : `${selectedHotspot.name} risk explanation`,
    },
    {
      label:
        lang === "ta"
          ? "தமிழ் SMS"
          : lang === "kn"
          ? "ಕನ್ನಡ SMS"
          : lang === "ml"
          ? "മലയാളം SMS"
          : "SMS Alert",
      query:
        lang === "ta"
          ? `${selectedHotspot.name}-க்கு Tamil SMS generate பண்ணு`
          : lang === "kn"
          ? `${selectedHotspot.name}-ಗೆ ಕನ್ನಡ ತುರ್ತು SMS ರಚಿಸಿ`
          : `Generate emergency SMS for ${selectedHotspot.name}`,
    },
    {
      label:
        lang === "ta"
          ? "+50mm மழை பெய்தால்?"
          : lang === "kn"
          ? "+50mm ಮಳೆಯಾದರೆ?"
          : "+50mm Rain?",
      query: `If 50 mm more rain comes in next 6 hours in ${selectedHotspot.name}, what will happen?`,
    },
  ];

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-2.5 rounded-full bg-primary px-4 py-3 text-primary-foreground shadow-xl transition-all duration-200 hover:scale-105 hover:bg-primary/95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Open Decision Support Agent"
          >
            <span className="relative flex size-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex size-3 rounded-full bg-red-500"></span>
            </span>
            <Bot className="size-5" />
            <span className="text-sm font-semibold tracking-wide">
              {lang === "ta"
                ? "முடிவெடுக்கும் AI முகவர்"
                : lang === "kn"
                ? "ನಿರ್ಧಾರ AI ಏಜೆಂಟ್"
                : lang === "ml"
                ? "തീരുമാന AI ഏജന്റ്"
                : "Decision Agent"}
            </span>
          </button>
        </div>
      )}

      {/* Slide-Up Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 flex h-[580px] w-[95vw] max-w-[420px] flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden transition-all animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-card p-0.5 border border-border shadow-xs">
                <img src="/logo.png" alt="LEWS Logo" className="size-full object-contain rounded-lg" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-semibold text-foreground">LEWS Decision Agent</h3>
                  <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                    Llama-3.3
                  </span>
                  <span className="rounded bg-blue-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                    RF-100 ML
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Western Ghats Disaster Support • LPU Fast Inference
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Close"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Hotspot & Language Context Bar */}
          <div className="flex items-center justify-between gap-2 border-b border-border/80 bg-background/80 px-3 py-2 text-xs">
            <div className="flex items-center gap-1.5 min-w-0">
              <MapPin className="size-3.5 text-primary shrink-0" />
              <select
                aria-label="Select hotspot"
                value={selectedHotspot.id}
                onChange={(e) => {
                  const found = MONITORED_HOTSPOTS.find((h) => h.id === e.target.value);
                  if (found) setSelectedHotspot(found);
                }}
                className="max-w-[170px] truncate rounded border border-border bg-card px-2 py-1 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                {MONITORED_HOTSPOTS.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name} ({h.probability}%)
                  </option>
                ))}
              </select>
              <span className="hidden sm:inline-block rounded bg-muted/80 px-1.5 py-0.5 text-[10px] text-muted-foreground font-medium">
                {selectedHotspot.slope}° • {selectedHotspot.soil_type}
              </span>
            </div>

            {/* Enhanced Language Dropdown Selector */}
            <LanguageDropdown variant="compact" />
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 space-y-3 overflow-y-auto p-4 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 shadow-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "border border-border bg-muted/30 text-foreground rounded-bl-none"
                  }`}
                >
                  {msg.text}

                  {/* Recommendation badge if present */}
                  {msg.actionTag && (
                    <div className="mt-2.5 flex items-center gap-1.5 border-t border-border/60 pt-2 font-mono text-[10px]">
                      <Radio className="size-3 text-red-500 animate-pulse" />
                      <span className="font-semibold text-foreground">Rule Action:</span>
                      <span
                        className={`rounded px-1.5 py-0.5 font-bold ${
                          msg.actionTag === "RECOMMEND_AUTO_BROADCAST"
                            ? "bg-red-500/20 text-red-600 dark:text-red-400"
                            : "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        {msg.actionTag}
                      </span>
                    </div>
                  )}
                </div>
                <span className="mt-1 px-1 text-[10px] text-muted-foreground">{msg.timestamp}</span>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="size-4 animate-spin text-primary" />
                <span className="text-xs">Agent evaluating rules & telemetry...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Query Chips */}
          <div className="flex gap-1.5 overflow-x-auto border-t border-border/60 bg-muted/20 px-3 py-2 scrollbar-none">
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                disabled={isLoading}
                onClick={() => handleSendMessage(chip.query)}
                className="shrink-0 rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-foreground hover:border-primary/50 hover:bg-accent disabled:opacity-50"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 border-t border-border bg-card p-3"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={
                lang === "ta"
                  ? "கேள்வி அல்லது SMS கேட்கவும்..."
                  : "Ask about risk, what-if, or draft SMS..."
              }
              className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              aria-label="Send query"
            >
              <Send className="size-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
