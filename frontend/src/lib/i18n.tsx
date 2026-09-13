import { createContext, useContext, useState, type ReactNode } from "react";

// ─── Supported languages ────────────────────────────────────────────────────
export type Lang = "en" | "ta" | "ml" | "kn";

export const LANGUAGES: { code: Lang; label: string; nativeLabel: string }[] = [
  { code: "en", label: "English",   nativeLabel: "English" },
  { code: "ta", label: "Tamil",     nativeLabel: "தமிழ்" },
  { code: "ml", label: "Malayalam", nativeLabel: "മലയാളം" },
  { code: "kn", label: "Kannada",   nativeLabel: "ಕನ್ನಡ" },
];

// ─── Translation strings ─────────────────────────────────────────────────────
export type TranslationKey =
  | "dashboard"
  | "liveRiskMap"
  | "aiPrediction"
  | "earlyWarning"
  | "adminDesk"
  | "settings"
  | "systemBrand"
  | "systemSubtitle"
  | "prototypeBuild"
  | "mockTelemetry"
  | "criticalAlerts"
  | "highRiskZones"
  | "activeWarnings"
  | "avgConfidence"
  | "recentAlerts"
  | "viewAll"
  | "details"
  | "locate"
  | "quickAIPrediction"
  | "predictRisk"
  | "district"
  | "rainfall3d"
  | "rainfall7d"
  | "language"
  | "selectLanguage"
  | "systemSettings"
  | "saveConfig"
  | "systemInformation"
  | "telemetrySensors"
  | "riskThresholds"
  | "administration"
  | "modelConfidence"
  | "openFullReport"
  | "rainfallTrendTitle"
  | "monitoredZones"
  | "filterByRisk"
  | "allRiskLevels"
  | "low"
  | "moderate"
  | "high"
  | "critical"
  | "situationOverview"
  | "reviewWarnings"
  | "dashboardDescription"
  | "recentAlertsDesc"
  | "quickPredictionDesc"
  | "criticalAlertsHint"
  | "highRiskZonesHint"
  | "activeWarningsHint"
  | "avgConfidenceHint"
  // Map page
  | "geospatialMonitoring"
  | "mapDescription"
  | "searchHotspotsPlaceholder"
  | "legend"
  | "hotspotsShown"
  | "monitoredHotspots"
  | "noHotspotsMatch"
  | "modelledFailureProbability"
  | "elevation"
  | "slope"
  | "soilMoisture"
  | "population"
  | "criticalRoads"
  | "villagesInZone"
  // Alerts page
  | "warningDesk"
  | "alertsDescription"
  | "allDistricts"
  | "noAlertsMatch"
  | "affectedVillages"
  | "roadsAtRisk"
  | "emergencyLines"
  | "readyBroadcasts"
  | "broadcastDesc"
  | "copyMessage"
  | "chars"
  // Prediction page
  | "modelStudio"
  | "predictionDescription"
  | "inputParameters"
  | "inputSubtitle"
  | "slopeDegrees"
  | "elevationM"
  | "distanceToRoadM"
  | "runPredictionBtn"
  | "resetBtn"
  | "noPredictionYet"
  | "noPredictionDesc"
  | "landslideProbability"
  | "riskClass"
  | "topContributingFactors"
  | "factorShare"
  | "featureWeightsTitle"
  | "factor"
  | "value"
  | "threshold"
  | "weight"
  | "contribution"
  | "status"
  | "thresholdExceeded"
  | "withinRange"
  | "soilType"
  | "algorithmEngine"
  | "randomForestEnsemble"
  | "weightedHeuristic"
  | "featureImportance"
  | "engineComparison"
  | "dominantFactor"
  | "terrain"
  | "of"
  | "thresholdReference"
  | "rainfallTrendSubtitle"
  | "active"
  | "monitoring"
  | "closed"
  | "alert"
  | "liveData"
  | "days"
  | "probability"
  | "confidence"
  | "resetDefaults"
  | "severeMonsoonPreset"
  | "highSensitivityPreset"
  | "standardImdPreset"
  | "sensorHealthOverview";

type Translations = Record<TranslationKey, string>;
type I18nMap = Record<Lang, Translations>;

export const translations: I18nMap = {
  en: {
    dashboard:        "Dashboard",
    liveRiskMap:      "Live Risk Map",
    aiPrediction:     "AI Prediction",
    earlyWarning:     "Early Warning",
    adminDesk:        "Admin EOC Desk",
    settings:         "Settings",
    systemBrand:      "Western Ghats",
    systemSubtitle:   "Hyperlocal Landslide EWS",
    prototypeBuild:   "Prototype build v0.9.3",
    mockTelemetry:    "Mock telemetry · not for operational use",
    criticalAlerts:   "Critical Alerts",
    highRiskZones:    "High Risk Zones",
    activeWarnings:   "Active Warnings",
    avgConfidence:    "Avg Confidence",
    recentAlerts:     "Recent Alerts",
    viewAll:          "View all",
    details:          "Details",
    locate:           "Locate",
    quickAIPrediction:"Quick AI Prediction",
    predictRisk:      "Predict Risk",
    district:         "District",
    rainfall3d:       "3-day Rainfall (mm)",
    rainfall7d:       "7-day Rainfall (mm)",
    language:         "Language",
    selectLanguage:   "Select Language",
    systemSettings:   "System Settings",
    saveConfig:       "Save configuration",
    systemInformation:"System Information",
    telemetrySensors: "Telemetry & Sensor Nodes",
    riskThresholds:   "Risk Thresholds",
    administration:   "Administration",
    modelConfidence:  "Model confidence",
    openFullReport:   "Open full explainable report",
    rainfallTrendTitle:"Cumulative Rainfall Trend (mm/day)",
    monitoredZones:   "Monitored Zones",
    filterByRisk:     "Filter by risk",
    allRiskLevels:    "All",
    low:              "Low",
    moderate:         "Moderate",
    high:             "High",
    critical:         "Critical",
    situationOverview:"Situation Overview",
    reviewWarnings:   "Review warnings",
    dashboardDescription: "Hyperlocal susceptibility monitoring across Western Ghats and North-East hill districts. Telemetry refreshed every 15 minutes.",
    recentAlertsDesc: "Latest issuances from the district warning pipeline",
    quickPredictionDesc: "Uses representative terrain for the selected district",
    criticalAlertsHint: "Red-alert grade, evacuation advised",
    highRiskZonesHint: "monitored hotspots",
    activeWarningsHint: "Broadcast to district control rooms",
    avgConfidenceHint: "Mean model confidence across alerts",

    // Map page
    geospatialMonitoring: "Geospatial Monitoring",
    mapDescription: "Colour-coded susceptibility markers for monitored hotspots. Select a marker to open the detailed terrain and rainfall panel.",
    searchHotspotsPlaceholder: "Search village, town or ghat road (e.g. Mundakkai, NH 766)",
    legend: "Legend:",
    hotspotsShown: "hotspots shown",
    monitoredHotspots: "Monitored hotspots",
    noHotspotsMatch: "No hotspots match this filter.",
    modelledFailureProbability: "modelled failure probability",
    elevation: "Elevation",
    slope: "Slope",
    soilMoisture: "Soil moisture",
    population: "Population",
    criticalRoads: "Critical roads",
    villagesInZone: "Villages in exposure zone",

    // Alerts page
    warningDesk: "Warning Desk",
    alertsDescription: "Issued warnings with incident briefs, exposure lists, emergency lines and pre-formatted broadcast drafts for SMS and WhatsApp.",
    allDistricts: "All districts",
    noAlertsMatch: "No alerts match these filters.",
    affectedVillages: "Affected villages",
    roadsAtRisk: "Roads at risk",
    emergencyLines: "Emergency lines",
    readyBroadcasts: "Ready-to-send broadcasts",
    broadcastDesc: "Pre-formatted for the state SMS gateway and WhatsApp control group",
    copyMessage: "Copy Message",
    chars: "chars",

    // Prediction page
    modelStudio: "Model Studio",
    predictionDescription: "Weighted heuristic susceptibility model with explainable factor attribution. Adjust terrain and rainfall inputs, then run the prediction.",
    inputParameters: "Input Parameters",
    inputSubtitle: "Values are typical of ghat-slope monitoring stations",
    slopeDegrees: "Slope (degrees)",
    elevationM: "Elevation (m)",
    distanceToRoadM: "Distance to Road (m)",
    runPredictionBtn: "Run Prediction",
    resetBtn: "Reset",
    noPredictionYet: "No prediction yet",
    noPredictionDesc: "Set the terrain and rainfall parameters, then run the model to see probability, risk class and factor attribution.",
    landslideProbability: "Landslide Probability",
    riskClass: "Risk Class",
    topContributingFactors: "Top 3 Contributing Factors",
    factorShare: "Share of the total weighted hazard score",
    featureWeightsTitle: "Feature Weights & Threshold Comparison",
    factor: "Factor",
    value: "Value",
    threshold: "Threshold",
    weight: "Weight",
    contribution: "Contribution",
    status: "Status",
    thresholdExceeded: "Threshold exceeded",
    withinRange: "Within range",
    soilType: "Soil Type (Static Geology)",
    algorithmEngine: "Model Algorithm Engine",
    randomForestEnsemble: "Random Forest Ensemble (ML - 100 Trees)",
    weightedHeuristic: "Deterministic Weighted Heuristic",
    featureImportance: "ML Feature Importance Distribution",
    engineComparison: "Dual-Engine Comparison & Model Variance",
    dominantFactor: "Dominant factor",
    terrain: "terrain",
    of: "of",
    thresholdReference: "Threshold reference",
    rainfallTrendSubtitle: "Daily precipitation across monitored Western Ghats hill stations (IMD AWS)",
    active: "Active",
    monitoring: "Monitoring",
    closed: "Closed",
    alert: "Alert",
    liveData: "Live Telemetry",
    days: "days",
    probability: "Probability",
    confidence: "Confidence",
    resetDefaults: "Reset Defaults",
    severeMonsoonPreset: "Severe Monsoon",
    highSensitivityPreset: "High Sensitivity",
    standardImdPreset: "IMD Standard",
    sensorHealthOverview: "Sensor Health Overview",
  },

  ta: {
    dashboard:        "டாஷ்போர்டு",
    liveRiskMap:      "நேரடி அபாய வரைபடம்",
    aiPrediction:     "AI கணிப்பு",
    earlyWarning:     "முன்னறிவிப்பு",
    adminDesk:        "நிர்வாக மையம்",
    settings:         "அமைப்புகள்",
    systemBrand:      "மேற்கு தொடர்ச்சி மலை",
    systemSubtitle:   "நிலச்சரிவு எச்சரிக்கை அமைப்பு",
    prototypeBuild:   "முன்மாதிரி v0.9.3",
    mockTelemetry:    "பரிசோதனை தரவு · நேரடி பயன்பாட்டிற்கு அல்ல",
    criticalAlerts:   "அவசர எச்சரிக்கைகள்",
    highRiskZones:    "அதிக அபாய மண்டலங்கள்",
    activeWarnings:   "செயல்பாட்டு எச்சரிக்கைகள்",
    avgConfidence:    "சராசரி நம்பகத்தன்மை",
    recentAlerts:     "சமீபத்திய எச்சரிக்கைகள்",
    viewAll:          "அனைத்தையும் காண்க",
    details:          "விவரங்கள்",
    locate:           "இடம் காண்",
    quickAIPrediction:"விரைவு AI கணிப்பு",
    predictRisk:      "அபாயம் கணி",
    district:         "மாவட்டம்",
    rainfall3d:       "3-நாள் மழை (மி.மீ)",
    rainfall7d:       "7-நாள் மழை (மி.மீ)",
    language:         "மொழி",
    selectLanguage:   "மொழியை தேர்வு செய்க",
    systemSettings:   "கணினி அமைப்புகள்",
    saveConfig:       "சேமி",
    systemInformation:"கணினி தகவல்",
    telemetrySensors: "தொலை அளவீடு & சென்சார்கள்",
    riskThresholds:   "அபாய வரம்புகள்",
    administration:   "நிர்வாகம்",
    modelConfidence:  "மாதிரி நம்பகத்தன்மை",
    openFullReport:   "முழு அறிக்கை திற",
    rainfallTrendTitle:"மழை அளவு போக்கு (மி.மீ/நாள்)",
    monitoredZones:   "கண்காணிப்பு மண்டலங்கள்",
    filterByRisk:     "அபாயத்தின்படி வடிகட்டு",
    allRiskLevels:    "அனைத்தும்",
    low:              "குறைவு",
    moderate:         "மிதமான",
    high:             "அதிகம்",
    critical:         "அவசரநிலை",
    situationOverview:"சூழ்நிலை கண்ணோட்டம்",
    reviewWarnings:   "எச்சரிக்கைகளை பார்",
    dashboardDescription: "மேற்கு தொடர்ச்சி மலை மற்றும் வடகிழக்கு மலை மாவட்டங்களுக்கான தீவிர நிலச்சரிவு கண்காணிப்பு. தகவல் 15 நிமிடங்களுக்கு ஒருமுறை புதுப்பிக்கப்படுகிறது.",
    recentAlertsDesc: "மாவட்ட எச்சரிக்கை பிரிவிலிருந்து சமீபத்திய அறிவிப்புகள்",
    quickPredictionDesc: "தேர்ந்தெடுக்கப்பட்ட மாவட்டத்தின் மாதிரி நிலப்பரப்பை பயன்படுத்துகிறது",
    criticalAlertsHint: "சிவப்பு எச்சரிக்கை நிலை, வெளியேற்றம் பரிந்துரைக்கப்படுகிறது",
    highRiskZonesHint: "கண்காணிக்கப்படும் பகுதிகள்",
    activeWarningsHint: "மாவட்ட கட்டுப்பாட்டு அறைகளுக்கு ஒளிபரப்பப்பட்டது",
    avgConfidenceHint: "எச்சரிக்கைகளின் சராசரி மாதிரி நம்பகத்தன்மை",

    // Map page
    geospatialMonitoring: "புவிசார் கண்காணிப்பு",
    mapDescription: "கண்காணிக்கப்படும் பகுதிகளுக்கான வண்ணக் குறியீட்டு வரைபடம். விரிவான தகவல்களைப் பெற வரைபடக் குறியீட்டைத் தேர்வு செய்யவும்.",
    searchHotspotsPlaceholder: "கிராமம், நகரம் அல்லது மலைப்பாதை தேடுக (எ.கா. முண்டக்கை, NH 766)",
    legend: "விளக்கம்:",
    hotspotsShown: "பகுதிகள் காட்டப்பட்டுள்ளன",
    monitoredHotspots: "கண்காணிக்கப்படும் பகுதிகள்",
    noHotspotsMatch: "இந்த வடிகட்டலுக்கு ஏற்ற பகுதிகள் இல்லை.",
    modelledFailureProbability: "கணிக்கப்பட்ட சரிவு சாத்தியக்கூறு",
    elevation: "உயரம்",
    slope: "சாய்வு",
    soilMoisture: "மண் ஈரப்பதம்",
    population: "மக்கள் தொகை",
    criticalRoads: "முக்கிய சாலைகள்",
    villagesInZone: "பாதிக்கப்படக்கூடிய கிராமங்கள்",

    // Alerts page
    warningDesk: "எச்சரிக்கை மையம்",
    alertsDescription: "சம்பவக் குறிப்புகள், பாதிக்கப்பட்ட பகுதிகள், அவசர எண்கள் மற்றும் SMS, WhatsApp ஒளிபரப்பு வரைவுகளுடன் கூடிய எச்சரிக்கைகள்.",
    allDistricts: "அனைத்து மாவட்டங்கள்",
    noAlertsMatch: "இந்த வடிகட்டலுக்கு ஏற்ற எச்சரிக்கைகள் இல்லை.",
    affectedVillages: "பாதிக்கப்பட்ட கிராமங்கள்",
    roadsAtRisk: "அபாயத்தில் உள்ள சாலைகள்",
    emergencyLines: "அவசர தொடர்பு எண்கள்",
    readyBroadcasts: "அனுப்பத் தயாரான எச்சரிக்கை செய்திகள்",
    broadcastDesc: "மாநில SMS நுழைவாயில் மற்றும் WhatsApp குழுவிற்காக வடிவமைக்கப்பட்டது",
    copyMessage: "செய்தியை நகலெடு",
    chars: "எழுத்துக்கள்",

    // Prediction page
    modelStudio: "மாதிரி ஆய்வகம்",
    predictionDescription: "காரணிகள் விளக்கத்துடன் கூடிய நிலச்சரிவு முன்னறிவிப்பு மாதிரி. நிலப்பரப்பு மற்றும் மழை அளவுகளை மாற்றி கணிப்பை இயக்கவும்.",
    inputParameters: "உள்ளீட்டு அளவுருக்கள்",
    inputSubtitle: "மலைச்சரிவு கண்காணிப்பு நிலையங்களின் பொதுவான மதிப்புகள்",
    slopeDegrees: "சாய்வு (பாகை)",
    elevationM: "உயரம் (மீட்டர்)",
    distanceToRoadM: "சாலைக்கான தூரம் (மீட்டர்)",
    runPredictionBtn: "கணிப்பை இயக்கு",
    resetBtn: "மீட்டமை",
    noPredictionYet: "இன்னும் கணிக்கப்படவில்லை",
    noPredictionDesc: "நிலப்பரப்பு மற்றும் மழை அளவுருக்களை அமைத்து, அபாய சாத்தியக்கூறு மற்றும் காரணிகளை காண மாதிரியை இயக்கவும்.",
    landslideProbability: "நிலச்சரிவு சாத்தியக்கூறு",
    riskClass: "அபாய பிரிவு",
    topContributingFactors: "முதன்மையான 3 காரணிகள்",
    factorShare: "மொத்த அபாய மதிப்பெண்ணில் இதன் பங்கு",
    featureWeightsTitle: "அளவுருக்களின் எடைகள் & வரம்பு ஒப்பீடு",
    factor: "காரணி",
    value: "மதிப்பு",
    threshold: "வரம்பு",
    weight: "எடை",
    contribution: "பங்களிப்பு",
    status: "நிலை",
    thresholdExceeded: "வரம்பு தாண்டியது",
    withinRange: "வரம்பிற்குள் உள்ளது",
    soilType: "மண் வகை (நிலவியல்)",
    algorithmEngine: "மாதிரி அல்காரிதம் என்ஜின்",
    randomForestEnsemble: "ரேண்டம் ஃபாரஸ்ட் குழுமம் (ML - 100 மரங்கள்)",
    weightedHeuristic: "நிலையான எடையிடப்பட்ட முறை",
    featureImportance: "ML முக்கியத்துவ பங்கீடு",
    engineComparison: "இரட்டை இயந்திர ஒப்பீடு & மாதிரி மாறுபாடு",
    dominantFactor: "முக்கிய காரணி",
    terrain: "நிலப்பரப்பு",
    of: "மொத்த",
    thresholdReference: "அளவு வரம்பு ஒப்பீடு",
    rainfallTrendSubtitle: "கண்காணிக்கப்படும் மேற்குத் தொடர்ச்சி மலைப்பகுதிகளின் தினசரி மழைப்பொழிவு (IMD AWS)",
    active: "செயலில்",
    monitoring: "கண்காணிப்பில்",
    closed: "முடிந்தது",
    alert: "எச்சரிக்கை",
    liveData: "நேரலை தரவு",
    days: "நாட்கள்",
    probability: "சாத்தியக்கூறு",
    confidence: "நம்பிக்கை",
    resetDefaults: "இயல்புநிலை அமைப்புகள்",
    severeMonsoonPreset: "தீவிர பருவமழை",
    highSensitivityPreset: "அதிநுட்ப உணர்திறன்",
    standardImdPreset: "IMD வழக்கமான அளவு",
    sensorHealthOverview: "சென்சார் சுகாதார கண்ணோட்டம்",
  },

  ml: {
    dashboard:        "ഡാഷ്‌ബോർഡ്",
    liveRiskMap:      "തൽസമയ അപകടസ്ഥാന ഭൂപടം",
    aiPrediction:     "AI പ്രവചനം",
    earlyWarning:     "മുൻകൂർ മുന്നറിയിപ്പ്",
    adminDesk:        "അഡ്മിൻ കൺട്രോൾ",
    settings:         "ക്രമീകരണങ്ങൾ",
    systemBrand:      "പശ്ചിമഘട്ടം",
    systemSubtitle:   "ഉരുൾപൊട്ടൽ മുന്നറിയിപ്പ് സംവിധാനം",
    prototypeBuild:   "പ്രോട്ടോടൈപ്പ് v0.9.3",
    mockTelemetry:    "പരീക്ഷണ ഡേറ്റ · ഔദ്യോഗിക ഉപയോഗത്തിന് അല്ല",
    criticalAlerts:   "അടിയന്തര മുന്നറിയിപ്പുകൾ",
    highRiskZones:    "ഉയർന്ന അപകട മേഖലകൾ",
    activeWarnings:   "സജീവ മുന്നറിയിപ്പുകൾ",
    avgConfidence:    "ശരാശരി ആത്മവിശ്വാസം",
    recentAlerts:     "സമീപകാല മുന്നറിയിപ്പുകൾ",
    viewAll:          "എല്ലാം കാണുക",
    details:          "വിശദാംശങ്ങൾ",
    locate:           "സ്ഥാനം കാണുക",
    quickAIPrediction:"ദ്രുത AI പ്രവചനം",
    predictRisk:      "അപകടം പ്രവചിക്കുക",
    district:         "ജില്ല",
    rainfall3d:       "3-ദിന മഴ (മി.മീ)",
    rainfall7d:       "7-ദിന മഴ (മി.മീ)",
    language:         "ഭാഷ",
    selectLanguage:   "ഭാഷ തിരഞ്ഞെടുക്കുക",
    systemSettings:   "സിസ്റ്റം ക്രമീകരണങ്ങൾ",
    saveConfig:       "സംരക്ഷിക്കുക",
    systemInformation:"സിസ്റ്റം വിവരം",
    telemetrySensors: "ടെലിമെട്രി & സെൻസർ നോഡുകൾ",
    riskThresholds:   "അപകട പരിധികൾ",
    administration:   "ഭരണനിർവ്വഹണം",
    modelConfidence:  "മോഡൽ ആത്മവിശ്വാസം",
    openFullReport:   "പൂർണ്ണ റിപ്പോർട്ട് തുറക്കുക",
    rainfallTrendTitle:"മഴ ട്രെൻഡ് (മി.മീ/ദിവസം)",
    monitoredZones:   "നിരീക്ഷണ മേഖലകൾ",
    filterByRisk:     "അപകടമനുസരിച്ച് ഫിൽട്ടർ",
    allRiskLevels:    "എല്ലാം",
    low:              "കുറഞ്ഞത്",
    moderate:         "മിതമായ",
    high:             "ഉയർന്നത്",
    critical:         "നിർണ്ണായകം",
    situationOverview:"സാഹചര്യ അവലോകനം",
    reviewWarnings:   "മുന്നറിയിപ്പുകൾ കാണുക",
    dashboardDescription: "പശ്ചിമഘട്ട, വടക്കുകിഴക്കൻ മലയോര ജില്ലകളിലെ അതിസൂക്ഷ്മ നിരീക്ഷണം. വിവരങ്ങൾ ഓരോ 15 മിനിറ്റിലും പുതുക്കുന്നു.",
    recentAlertsDesc: "ജില്ലാ മുന്നറിയിപ്പ് വിഭാഗത്തിൽ നിന്നുള്ള ഏറ്റവും പുതിയ അറിയിപ്പുകൾ",
    quickPredictionDesc: "തിരഞ്ഞെടുത്ത ജില്ലയ്ക്കായുള്ള മാതൃകാ ഭൂപ്രകൃതി ഉപയോഗിക്കുന്നു",
    criticalAlertsHint: "റെഡ് അലർട്ട് തലം, ഒഴിപ്പിക്കൽ ശുപാർശ ചെയ്യുന്നു",
    highRiskZonesHint: "നിരീക്ഷണ മേഖലകൾ",
    activeWarningsHint: "ജില്ലാ കൺട്രോൾ റൂമുകളിലേക്ക് അറിയിച്ചു",
    avgConfidenceHint: "ശരാശരി മോഡൽ ആത്മവിശ്വാസം",

    // Map page
    geospatialMonitoring: "ഭൗമ നിരീക്ഷണം",
    mapDescription: "നിരീക്ഷണ മേഖലകൾക്കായുള്ള കളർ-കോഡഡ് മാപ്പ്. ഭൂപ്രകൃതിയും മഴയും സംബന്ധിച്ച വിശദാംശങ്ങൾ കാണാൻ മാർക്കർ തിരഞ്ഞെടുക്കുക.",
    searchHotspotsPlaceholder: "ഗ്രാമം, പട്ടണം അല്ലെങ്കിൽ ചുരം റോഡ് തിരയുക (ഉദാ: മുണ്ടക്കൈ, NH 766)",
    legend: "സൂചിക:",
    hotspotsShown: "മേഖലകൾ കാണിച്ചിരിക്കുന്നു",
    monitoredHotspots: "നിരീക്ഷണ മേഖലകൾ",
    noHotspotsMatch: "ഈ ഫിൽട്ടറുമായി പൊരുത്തപ്പെടുന്ന മേഖലകൾ ഇല്ല.",
    modelledFailureProbability: "മോഡൽ ചെയ്ത അപകട സാധ്യത",
    elevation: "ഉയരം",
    slope: "ചരിവ്",
    soilMoisture: "മണ്ണിലെ ഈർപ്പം",
    population: "ജനസംഖ്യ",
    criticalRoads: "പ്രധാന റോഡുകൾ",
    villagesInZone: "അപകട സാധ്യതയുള്ള ഗ്രാമങ്ങൾ",

    // Alerts page
    warningDesk: "മുന്നറിയിപ്പ് കേന്ദ്രം",
    alertsDescription: "സംഭവ വിവരണങ്ങൾ, അപകട സാധ്യതയുള്ള പ്രദേശങ്ങൾ, അടിയന്തര നമ്പറുകൾ, എസ്എംഎസ്/വാട്ട്സാപ്പ് സന്ദേശങ്ങൾ എന്നിവ ഉൾപ്പെടുന്ന മുന്നറിയിപ്പുകൾ.",
    allDistricts: "എല്ലാ ജില്ലകളും",
    noAlertsMatch: "ഈ ഫിൽട്ടറുമായി പൊരുത്തപ്പെടുന്ന മുന്നറിയിപ്പുകൾ ഇല്ല.",
    affectedVillages: "ബാധിക്കപ്പെട്ട ഗ്രാമങ്ങൾ",
    roadsAtRisk: "അപകടസാധ്യതയുള്ള റോഡുകൾ",
    emergencyLines: "അടിയന്തര നമ്പറുകൾ",
    readyBroadcasts: "അയക്കാൻ തയ്യാറായ അറിയിപ്പുകൾ",
    broadcastDesc: "സ്റ്റേറ്റ് എസ്എംഎസ് ഗേറ്റ്‌വേയ്ക്കും വാട്ട്‌സ്ആപ്പ് ഗ്രൂപ്പിനും മുൻകൂട്ടി തയ്യാറാക്കിയത്",
    copyMessage: "സന്ദേശം പകർത്തുക",
    chars: "അക്ഷരങ്ങൾ",

    // Prediction page
    modelStudio: "മോഡൽ സ്റ്റുഡിയോ",
    predictionDescription: "കാരണങ്ങളുടെ വിശദീകരണത്തോടുകൂടിയ ഉരുൾപൊട്ടൽ പ്രവചന മാതൃക. ഭൂപ്രകൃതിയും മഴയും ക്രമീകരിച്ച് പ്രവചനം പ്രവർത്തിപ്പിക്കുക.",
    inputParameters: "ഇൻപുട്ട് ഘടകങ്ങൾ",
    inputSubtitle: "ചുരം നിരീക്ഷണ കേന്ദ്രങ്ങളിലെ സാധാരണ മൂല്യങ്ങൾ",
    slopeDegrees: "ചരിവ് (ഡിഗ്രി)",
    elevationM: "ഉയരം (മീറ്റർ)",
    distanceToRoadM: "റോഡിലേക്കുള്ള ദൂരം (മീറ്റർ)",
    runPredictionBtn: "പ്രവചനം നടത്തുക",
    resetBtn: "പുനഃക്രമീകരിക്കുക",
    noPredictionYet: "പ്രവചനം നടത്തിയിട്ടില്ല",
    noPredictionDesc: "ഭൂപ്രകൃതിയും മഴയും ക്രമീകരിച്ച് അപകട സാധ്യതയും കാരണങ്ങളും കാണാൻ മോഡൽ പ്രവർത്തിപ്പിക്കുക.",
    landslideProbability: "ഉരുൾപൊട്ടൽ സാധ്യത",
    riskClass: "അപകട തരം",
    topContributingFactors: "ഏറ്റവും പ്രധാനപ്പെട്ട 3 ഘടകങ്ങൾ",
    factorShare: "മൊത്തം അപകട സ്കോറിലെ പങ്ക്",
    featureWeightsTitle: "ഫീച്ചർ വെയിറ്റുകളും പരിധി താരതമ്യവും",
    factor: "ഘടകം",
    value: "മൂല്യം",
    threshold: "പരിധി",
    weight: "വെയിറ്റ്",
    contribution: "പങ്കാളിത്തം",
    status: "നില",
    thresholdExceeded: "പരിധി ലംഘിച്ചു",
    withinRange: "പരിധിക്കുള്ളിൽ",
    soilType: "മണ്ണ് തരം (ഭൂമിശാസ്ത്രം)",
    algorithmEngine: "മോഡൽ അൽഗോരിതം എഞ്ചിൻ",
    randomForestEnsemble: "റാൻഡം ഫോറസ്റ്റ് എൻസെംബിൾ (ML - 100 മരങ്ങൾ)",
    weightedHeuristic: "ഭാരപ്പെടുത്തിയ ഹ്യൂറിസ്റ്റിക്",
    featureImportance: "ML ഫീച്ചർ പ്രാധാന്യം",
    engineComparison: "ഡ്യുവൽ-എഞ്ചിൻ താരതമ്യവും വ്യത്യാസവും",
    dominantFactor: "പ്രധാന ഘടകം",
    terrain: "ഭൂപ്രകൃതി",
    of: "ൽ",
    thresholdReference: "മാനദണ്ഡ റഫറൻസ്",
    rainfallTrendSubtitle: "നിരീക്ഷിക്കപ്പെടുന്ന പശ്ചിമഘട്ട മലയോര കേന്ദ്രങ്ങളിലെ ദൈനംദിന മഴ (IMD AWS)",
    active: "സജീവം",
    monitoring: "നിരീക്ഷണത്തിൽ",
    closed: "പൂർത്തിയായി",
    alert: "അലർട്ട്",
    liveData: "തത്സമയ ഡാറ്റ",
    days: "ദിവസങ്ങൾ",
    probability: "സാധ്യത",
    confidence: "കൃത്യത",
    resetDefaults: "ഡീഫോൾട്ട് പുനഃസ്ഥാപിക്കുക",
    severeMonsoonPreset: "തീവ്ര മൺസൂൺ",
    highSensitivityPreset: "ഉയർന്ന സെൻസിറ്റിവിറ്റി",
    standardImdPreset: "IMD സ്റ്റാൻഡേർഡ്",
    sensorHealthOverview: "സെൻസർ ആരോഗ്യ അവലോകനം",
  },

  kn: {
    // Nav & Shell
    dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    liveRiskMap: "ಲೈವ್ ಅಪಾಯ ನಕ್ಷೆ",
    aiPrediction: "AI ಮುನ್ಸೂಚನೆ",
    earlyWarning: "ಮುನ್ನೆಚ್ಚರಿಕೆ",
    adminDesk: "ನಿರ್ವಾಹಕ ಡೆಸ್ಕ್",
    settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    systemBrand: "ಪಶ್ಚಿಮ ಘಟ್ಟಗಳ LEWAS",
    systemSubtitle: "ಭೂಕುಸಿತ ಮುನ್ನೆಚ್ಚರಿಕೆ ವ್ಯವಸ್ಥೆ",
    prototypeBuild: "ಪ್ರೋಟೋಟೈಪ್ v1.0",
    mockTelemetry: "ಲೈವ್ ಸಿಮ್ಯುಲೇಟೆಡ್ ಟೆಲಿಮೆಟ್ರಿ",

    // Dashboard metrics
    criticalAlerts: "ತೀವ್ರ ತುರ್ತು ಎಚ್ಚರಿಕೆಗಳು",
    highRiskZones: "ಹೆಚ್ಚಿನ ಅಪಾಯದ ವಲಯಗಳು",
    activeWarnings: "ಸಕ್ರಿಯ ಎಚ್ಚರಿಕೆಗಳು",
    avgConfidence: "ಸರಾಸರಿ ನಿಖರತೆ",
    recentAlerts: "ಇತ್ತೀಚಿನ ಎಚ್ಚರಿಕೆಗಳು",
    viewAll: "ಎಲ್ಲವನ್ನೂ ವೀಕ್ಷಿಸಿ",
    details: "ವಿವರಗಳು",
    locate: "ಗುರುತಿಸಿ",
    quickAIPrediction: "ತ್ವರಿತ AI ಮುನ್ಸೂಚನೆ",
    predictRisk: "ಅಪಾಯವನ್ನು ಊಹಿಸಿ",
    district: "ಜಿಲ್ಲೆ",
    rainfall3d: "೩-ದಿನಗಳ ಮಳೆ (ಮಿಮೀ)",
    rainfall7d: "೭-ದಿನಗಳ ಮಳೆ (ಮಿಮೀ)",
    language: "ಭಾಷೆ",
    selectLanguage: "ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    systemSettings: "ವ್ಯವಸ್ಥೆಯ ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    saveConfig: "ಸಂರಚನೆಯನ್ನು ಉಳಿಸಿ",
    systemInformation: "ವ್ಯವಸ್ಥೆಯ ಮಾಹಿತಿ",
    telemetrySensors: "ಟೆಲಿಮೆಟ್ರಿ ಸಂವೇದಕಗಳು",
    riskThresholds: "ಅಪಾಯ ಮಿತಿಗಳು",
    administration: "ಆಡಳಿತ",
    modelConfidence: "ಮಾದರಿ ನಿಖರತೆ",
    openFullReport: "ಸಂಪೂರ್ಣ ವರದಿ ವೀಕ್ಷಿಸಿ",
    rainfallTrendTitle: "ಮಳೆಯ ಪ್ರವೃತ್ತಿ (ಕಳೆದ ೭ ದಿನಗಳು)",
    monitoredZones: "ವೀಕ್ಷಿಸಲಾದ ಹಾಟ್‌ಸ್ಪಾಟ್‌ಗಳು",
    filterByRisk: "ಅಪಾಯ ಮಟ್ಟದಿಂದ ಫಿಲ್ಟರ್ ಮಾಡಿ",
    allRiskLevels: "ಎಲ್ಲಾ ಅಪಾಯ ಮಟ್ಟಗಳು",
    low: "ಕಡಿಮೆ",
    moderate: "ಮಧ್ಯಮ",
    high: "ಹೆಚ್ಚು",
    critical: "ತೀವ್ರ ತುರ್ತು",

    situationOverview: "ಪರಿಸ್ಥಿತಿಯ ಅವಲೋಕನ",
    reviewWarnings: "ಎಚ್ಚರಿಕೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ",
    dashboardDescription: "ವಯನಾಡ್, ಇಡುಕ್ಕಿ, ನೀಲಗಿರಿ ಮತ್ತು ಕೊಡಗು ಪ್ರದೇಶಗಳಿಗೆ ನೈಜ-ಸಮಯದ ಭೂಕುಸಿತ ಅಪಾಯ ಟೆಲಿಮೆಟ್ರಿ.",
    recentAlertsDesc: "ಸ್ವಾಯತ್ತ AI ಏಜೆಂಟ್‌ಗಳಿಂದ ದಾಖಲಾದ ಇತ್ತೀಚಿನ ಎಚ್ಚರಿಕೆಗಳು",
    quickPredictionDesc: "ಮಳೆ ಪ್ರಮಾಣ ಮತ್ತು ಭೂಪ್ರದೇಶ ನಿಯತಾಂಕಗಳ ಆಧಾರದ ಮೇಲೆ ಅಪಾಯವನ್ನು ಊಹಿಸಿ",
    criticalAlertsHint: "ತಕ್ಷಣದ ಸ್ಥಳಾಂತರ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ",
    highRiskZonesHint: "ವೀಕ್ಷಿಸಲಾದ ಹಾಟ್‌ಸ್ಪಾಟ್‌ಗಳಲ್ಲಿ ಅಪಾಯದಲ್ಲಿದೆ",
    activeWarningsHint: "ಜಿಲ್ಲಾ ತುರ್ತು ನಿಯಂತ್ರಣ ಕೊಠಡಿಗಳಿಗೆ ರವಾನಿಸಲಾಗಿದೆ",
    avgConfidenceHint: "ರಾಂಡಮ್ ಫಾರೆಸ್ಟ್ ಮತ್ತು ಗಣಿತ ಹೋಲಿಕೆ ಆಧಾರಿತ",

    // Map page
    geospatialMonitoring: "ಭೂವ್ಯೋಮ ನಿಗಾ",
    mapDescription: "ಹಾಟ್‌ಸ್ಪಾಟ್‌ಗಳ ಬಣ್ಣ-ಸಂಕೇತಿತ ನಕ್ಷೆ. ಭೂಪ್ರದೇಶ ಮತ್ತು ಮಳೆಯ ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಲು ಮಾರ್ಕರ್ ಕ್ಲಿಕ್ ಮಾಡಿ.",
    searchHotspotsPlaceholder: "ಗ್ರಾಮ, ಪಟ್ಟಣ ಅಥವಾ ಘಾಟ್ ರಸ್ತೆಯನ್ನು ಹುಡುಕಿ (ಉದಾ: ಜೋಡುಪಾಲ, ಭಾಗಮಂಡಲ)",
    legend: "ಸೂಚ್ಯಂಕ:",
    hotspotsShown: "ತೋರಿಸಲಾದ ವಲಯಗಳು",
    monitoredHotspots: "ವೀಕ್ಷಿಸಲಾದ ಹಾಟ್‌ಸ್ಪಾಟ್‌ಗಳು",
    noHotspotsMatch: "ಈ ಫಿಲ್ಟರ್‌ಗೆ ಯಾವುದೇ ಹಾಟ್‌ಸ್ಪಾಟ್‌ಗಳು ಹೊಂದಿಕೆಯಾಗುತ್ತಿಲ್ಲ.",
    modelledFailureProbability: "ಮಾದರಿ ವಿಫಲತೆಯ ಸಂಭವನೀಯತೆ",
    elevation: "ಎತ್ತರ",
    slope: "ಇಳಿಜಾರು",
    soilMoisture: "ಮಣ್ಣಿನ ತೇವಾಂಶ",
    population: "ಜನಸಂಖ್ಯೆ",
    criticalRoads: "ಪ್ರಮುಖ ರಸ್ತೆಗಳು",
    villagesInZone: "ಅಪಾಯದಲ್ಲಿರುವ ಗ್ರಾಮಗಳು",

    // Alerts page
    warningDesk: "ಮುನ್ನೆಚ್ಚರಿಕೆ ಡೆಸ್ಕ್",
    alertsDescription: "ಸ್ಥಳ ವಿವರಗಳು, ಅಪಾಯಕಾರಿ ರಸ್ತೆಗಳು, ತುರ್ತು ಸಹಾಯವಾಣಿಗಳು ಮತ್ತು ಸಿದ್ಧಪಡಿಸಿದ SMS/WhatsApp ಸಂದೇಶಗಳು.",
    allDistricts: "ಎಲ್ಲಾ ಜಿಲ್ಲೆಗಳು",
    noAlertsMatch: "ಯಾವುದೇ ಸಕ್ರಿಯ ಎಚ್ಚರಿಕೆಗಳು ಲಭ್ಯವಿಲ್ಲ.",
    affectedVillages: "ಬಾಧಿತ ಗ್ರಾಮಗಳು",
    roadsAtRisk: "ಅಪಾಯದಲ್ಲಿರುವ ರಸ್ತೆಗಳು",
    emergencyLines: "ತುರ್ತು ಸಹಾಯವಾಣಿಗಳು",
    readyBroadcasts: "ರವಾನೆಗೆ ಸಿದ್ಧವಾಗಿರುವ ಎಚ್ಚರಿಕೆಗಳು",
    broadcastDesc: "ರಾಜ್ಯ SMS ಗೇಟ್‌ವೇ ಮತ್ತು WhatsApp ಗುಂಪುಗಳಿಗೆ ಮುಂಚಿತವಾಗಿ ರಚಿಸಲಾಗಿದೆ",
    copyMessage: "ಸಂದೇಶವನ್ನು ನಕಲಿಸಿ",
    chars: "ಅಕ್ಷರಗಳು",

    // Prediction page
    modelStudio: "ಮಾದರಿ ಸ್ಟುಡಿಯೋ",
    predictionDescription: "ಕಾರಣಗಳ ವಿವರಣೆಯೊಂದಿಗೆ ಭೂಕುಸಿತ ಸಂಭವನೀಯತೆಯ ಮುನ್ಸೂಚನೆ. ಭೂಪ್ರದೇಶ ಮತ್ತು ಮಳೆ ನಿಯತಾಂಕಗಳನ್ನು ಹೊಂದಿಸಿ ಲೆಕ್ಕಾಚಾರ ಮಾಡಿ.",
    inputParameters: "ಇನ್‌ಪುಟ್ ನಿಯತಾಂಕಗಳು",
    inputSubtitle: "ಪಶ್ಚಿಮ ಘಟ್ಟಗಳ ಸಂವೇದಕ ಕೇಂದ್ರಗಳ ವಿಶಿಷ್ಟ ಮೌಲ್ಯಗಳು",
    slopeDegrees: "ಇಳಿಜಾರು ಕೋನ (ಡಿಗ್ರಿ)",
    elevationM: "ಎತ್ತರ (ಮೀಟರ್)",
    distanceToRoadM: "ರಸ್ತೆಯಿಂದ ಅಂತರ (ಮೀಟರ್)",
    runPredictionBtn: "ಮುನ್ಸೂಚನೆ ಚಲಾಯಿಸಿ",
    resetBtn: "ಮರುಹೊಂದಿಸಿ",
    noPredictionYet: "ಇನ್ನೂ ಯಾವುದೇ ಮುನ್ಸೂಚನೆ ಚಲಾಯಿಸಲಾಗಿಲ್ಲ",
    noPredictionDesc: "ಅಪಾಯದ ಸಂಭವನೀಯತೆ ಮತ್ತು ಕಾರಣಗಳನ್ನು ತಿಳಿಯಲು ಇನ್‌ಪುಟ್‌ಗಳನ್ನು ನಮೂದಿಸಿ.",
    landslideProbability: "ಭೂಕುಸಿತ ಸಂಭವನೀಯತೆ",
    riskClass: "ಅಪಾಯದ ವರ್ಗ",
    topContributingFactors: "ಪ್ರಮುಖ ೩ ಪ್ರಭಾವಿ ಅಂಶಗಳು",
    factorShare: "ಒಟ್ಟು ಅಪಾಯ ಸ್ಕೋರಿನ ಪಾಲು",
    featureWeightsTitle: "ವೈಶಿಷ್ಟ್ಯ ತೂಕ ಮತ್ತು ಮಿತಿ ವಿಶ್ಲೇಷಣೆ",
    factor: "ಅಂಶ",
    value: "ಮೌಲ್ಯ",
    threshold: "ಮಿತಿ",
    weight: "ತೂಕ",
    contribution: "ಕೊಡುಗೆ",
    status: "ಸ್ಥಿತಿ",
    thresholdExceeded: "ಮಿತಿ ಮೀರಿದೆ",
    withinRange: "ಸಾಮಾನ್ಯ ವ್ಯಾಪ್ತಿಯಲ್ಲಿದೆ",
    soilType: "ಮಣ್ಣಿನ ವಿಧ",
    algorithmEngine: "ಅಲ್ಗಾರಿದಮ್ ಎಂಜಿನ್",
    randomForestEnsemble: "ರಾಂಡಮ್ ಫಾರೆಸ್ಟ್ (ML - 100 ಮರಗಳು)",
    weightedHeuristic: "ತೂಕದ ಹ್ಯೂರಿಸ್ಟಿಕ್ ಎಂಜಿನ್",
    featureImportance: "ML ವೈಶಿಷ್ಟ್ಯ ಪ್ರಾಮುಖ್ಯತೆ",
    engineComparison: "ಡ್ಯುಯಲ್ ಎಂಜಿನ್ ಹೋಲಿಕೆ",
    dominantFactor: "ಪ್ರಮುಖ ಅಂಶ",
    terrain: "ಭೂಪ್ರದೇಶ",
    of: "ನಲ್ಲಿ",
    thresholdReference: "ಮಿತಿ ಉಲ್ಲೇಖ",
    rainfallTrendSubtitle: "ವೀಕ್ಷಿಸಲಾದ ಪಶ್ಚಿಮ ಘಟ್ಟಗಳ ಗಿರಿಧಾಮಗಳ ದೈನಂದಿನ ಮಳೆ ಪ್ರಮಾಣ (IMD AWS)",
    active: "ಸಕ್ರಿಯ",
    monitoring: "ವೀಕ್ಷಣೆಯಲ್ಲಿದೆ",
    closed: "ಮುಕ್ತಾಯಗೊಂಡಿದೆ",
    alert: "ಎಚ್ಚರಿಕೆ",
    liveData: "ನೈಜ-ಸಮಯದ ಡೇಟಾ",
    days: "ದಿನಗಳು",
    probability: "ಸಂಭವನೀಯತೆ",
    confidence: "ನಿಖರತೆ",
    resetDefaults: "ಡೀಫಾಲ್ಟ್‌ಗಳಿಗೆ ಮರುಹೊಂದಿಸಿ",
    severeMonsoonPreset: "ತೀವ್ರ ಮಾನ್ಸೂನ್",
    highSensitivityPreset: "ಹೆಚ್ಚಿನ ಸಂವೇದನೆ",
    standardImdPreset: "IMD ಗುಣಮಟ್ಟ",
    sensorHealthOverview: "ಸಂವೇದಕ ಆರೋಗ್ಯ ಅವಲೋಕನ",
  },
};

// ─── Multilingual Regional Dictionaries ──────────────────────────────────────
export const DISTRICT_TRANSLATIONS: Record<Lang, Record<string, string>> = {
  en: {
    Wayanad: "Wayanad",
    Idukki: "Idukki",
    Nilgiris: "Nilgiris",
    Kodagu: "Kodagu (Coorg)",
    Senapati: "Senapati",
    Churachandpur: "Churachandpur",
  },
  ta: {
    Wayanad: "வயநாடு",
    Idukki: "இடுக்கி",
    Nilgiris: "நீலகிரி",
    Kodagu: "குடகு (கூர்க்)",
    Senapati: "சேனாபதி",
    Churachandpur: "சுராசந்த்பூர்",
  },
  ml: {
    Wayanad: "വയനാട്",
    Idukki: "ഇടുക്കി",
    Nilgiris: "നീലഗിരി",
    Kodagu: "കുടക് (കൊടക്)",
    Senapati: "സേനാപതി",
    Churachandpur: "ചുരാചന്ദ്പൂർ",
  },
  kn: {
    Wayanad: "ವಯನಾಡ್",
    Idukki: "ಇಡುಕ್ಕಿ",
    Nilgiris: "ನೀಲಗಿರಿ",
    Kodagu: "ಕೊಡಗು (ಕೂರ್ಗ್)",
    Senapati: "ಸೇನಾಪತಿ",
    Churachandpur: "ಚುರಾಚಾಂದ್‌ಪುರ",
  },
};

export const ALERT_TRANSLATIONS: Record<
  Lang,
  Record<string, { headline: string; location?: string }>
> = {
  en: {
    "ALT-2091": { headline: "Debris-flow imminent — evacuate downslope hamlets", location: "Chooralmala, Meppadi Panchayat" },
    "ALT-2088": { headline: "High susceptibility on estate slopes above Pettimudi", location: "Munnar — Nallathanni & Pettimudi" },
    "ALT-2090": { headline: "Severe slope saturation and mudflow risk along Sampaje Ghat (NH 275)", location: "Madikeri — Jodupala & Makkanduru" },
    "ALT-2085": { headline: "Cut-slope failure risk along NH 181 Hillgrove stretch", location: "Coonoor — Hubbathalai & Yedapalli" },
    "ALT-2081": { headline: "NH 766 shoulder instability near Meppadi bypass", location: "Meppadi & Kalladi, Wayanad" },
    "ALT-2076": { headline: "Watch advisory for Kotagiri ghat road", location: "Kotagiri — Aravenu" },
    "ALT-2070": { headline: "NH 2 corridor watch after 176 mm spell", location: "Senapati Ridge, NH 2 corridor" },
  },
  ta: {
    "ALT-2091": { headline: "சூரல்மலை பாறை/சேற்றுப் பாய்வு அபாயம் — குடியிருப்புகளை வெளியேற்றவும்", location: "சூரல்மலை, மேப்பாடி பஞ்சாயத்து" },
    "ALT-2088": { headline: "பெட்டிமுடி தேயிலைத் தோட்ட சரிவுகளில் அதிக நிலச்சரிவு வாய்ப்பு", location: "மூணார் — நல்லத்தண்ணி & பெட்டிமுடி" },
    "ALT-2090": { headline: "சம்பாஜே மலைப்பாதை (NH 275) நிலச்சரிவு மற்றும் மண் பாயும் அபாயம்", location: "மடிக்கேரி — ஜோடுபால & மக்கந்தூரு" },
    "ALT-2085": { headline: "NH 181 ஹில்குரோவ் மலைச்சரிவு பாறை உருளும் அபாயம்", location: "குன்னூர் — ஹுப்பத்தலை & ஏடப்பள்ளி" },
    "ALT-2081": { headline: "NH 766 மேப்பாடி பைபாஸ் சாலை ஓர சரிவு அபாயம்", location: "மேப்பாடி & கல்லாடி, வயநாடு" },
    "ALT-2076": { headline: "கோத்தகிரி மலைப்பாதை தீவிர கண்காணிப்பு எச்சரிக்கை", location: "கோத்தகிரி — அரவேணு" },
    "ALT-2070": { headline: "NH 2 நெடுஞ்சாலை தொடர் மழை கண்காணிப்பு", location: "சேனாபதி மலைத்தொடர், NH 2" },
  },
  ml: {
    "ALT-2091": { headline: "ചൂരൽമല ഉരുൾപൊട്ടൽ സാധ്യത അതീവ ഗുരുതരം — ആളുകളെ ഒഴിപ്പിക്കുക", location: "ചൂരൽമല, മേപ്പാടി പഞ്ചായത്ത്" },
    "ALT-2088": { headline: "പെട്ടിമുടി തോട്ടം മേഖലയിൽ കനത്ത മണ്ണിടിച്ചിൽ സാധ്യത", location: "മൂന്നാർ — നല്ലതണ്ണി & പെട്ടിമുടി" },
    "ALT-2090": { headline: "സമ്പാജെ ചുരം (NH 275) റോഡിൽ കനത്ത മണ്ണിടിച്ചിൽ സാധ്യത", location: "മടിക്കേരി — ജോഡുപാല & മക്കന്തൂർ" },
    "ALT-2085": { headline: "NH 181 ഹിൽഗ്രോവ് റോഡിൽ മണ്ണിടിച്ചിൽ സാധ്യത", location: "കുന്നൂർ — ഹുബ്ബത്തല & എടപ്പള്ളി" },
    "ALT-2081": { headline: "മേപ്പാടി ബൈപാസ് NH 766 റോഡ് തകർച്ച സാധ്യത", location: "മേപ്പാടി & കല്ലാടി, വയനാട്" },
    "ALT-2076": { headline: "കോത്തഗിരി ചുരം റോഡിൽ ജാഗ്രതാ നിർദ്ദേശം", location: "കോത്തഗിരി — അരവേണു" },
    "ALT-2070": { headline: "NH 2 റോഡിൽ മഴയെത്തുടർന്നുള്ള നിരീക്ഷണം", location: "സേനാപതി മലനിരകൾ, NH 2" },
  },
  kn: {
    "ALT-2091": { headline: "ಚೂರಲ್‌ಮಲಾ ತೀವ್ರ ಕೆಸರು ಕುಸಿತದ ಅಪಾಯ — ತಕ್ಷಣ ತೆರವುಗೊಳಿಸಿ", location: "ಚೂರಲ್‌ಮಲಾ, ಮೇಪ್ಪಾಡಿ ಪಂಚಾಯಿತಿ" },
    "ALT-2088": { headline: "ಪೆಟ್ಟಿಮುಡಿ ತೋಟದ ಇಳಿಜಾರಿನಲ್ಲಿ ಹೆಚ್ಚಿನ ಭೂಕುಸಿತ ಸಂಭವನೀಯತೆ", location: "ಮೂನ್ನಾರ್ — ನಲ್ಲತಣ್ಣಿ & ಪೆಟ್ಟಿಮುಡಿ" },
    "ALT-2090": { headline: "ಸಂಪಾಜೆ ಘಾಟ್ (ಎನ್‌ಎಚ್ ೨೭೫) ರಸ್ತೆಯಲ್ಲಿ ತೀವ್ರ ಮಣ್ಣು ಕುಸಿತದ ಅಪಾಯ", location: "ಮಡಿಕೇರಿ — ಜೋಡುಪಾಲ & ಮಕ್ಕಂದೂರು" },
    "ALT-2085": { headline: "ಎನ್‌ಎಚ್ ೧೮೧ ಹಿಲ್‌ಗ್ರೋವ್ ಘಾಟ್ ರಸ್ತೆಯಲ್ಲಿ ಭೂಕುಸಿತದ ಅಪಾಯ", location: "ಕೂನೂರ್ — ಹುಬ್ಬತ್ತಲೈ & ಯೆಡಪಳ್ಳಿ" },
    "ALT-2081": { headline: "ಮೇಪ್ಪಾಡಿ ಬೈಪಾಸ್ ಬಳಿ ಎನ್‌ಎಚ್ ೭೬೬ ರಸ್ತೆ ಬದಿಯ ಅಸ್ಥಿರತೆ", location: "ಮೇಪ್ಪಾಡಿ & ಕಲ್ಲಾಡಿ, ವಯನಾಡ್" },
    "ALT-2076": { headline: "ಕೋಟಗಿರಿ ಘಾಟ್ ರಸ್ತೆ ವೀಕ್ಷಣಾ ಎಚ್ಚರಿಕೆ", location: "ಕೋಟಗಿರಿ — ಅರವೇಣು" },
    "ALT-2070": { headline: "ಎನ್‌ಎಚ್ ೨ ಹೆದ್ದಾರಿ ಮಳೆ ನಂತರದ ವೀಕ್ಷಣೆ", location: "ಸೇನಾಪತಿ ಪರ್ವತ, ಎನ್‌ಎಚ್ ೨" },
  },
};

export const FACTOR_TRANSLATIONS: Record<Lang, Record<string, string>> = {
  en: {
    "3-day cumulative rainfall": "3-day cumulative rainfall",
    "7-day antecedent rainfall": "7-day antecedent rainfall",
    "Slope angle": "Terrain slope angle",
    "Soil saturation": "Soil saturation",
    "Distance to road cut": "Distance to road excavation",
    "Elevation": "Elevation above MSL",
    "Soil type vulnerability": "Soil type vulnerability",
  },
  ta: {
    "3-day cumulative rainfall": "3-நாள் ஒட்டுமொத்த மழைப்பொழிவு",
    "7-day antecedent rainfall": "7-நாள் முந்தைய மழை அளவு",
    "Slope angle": "நிலப்பரப்பு சரிவு கோணம்",
    "Soil saturation": "மண் ஈரப்பதம் செறிவூட்டல்",
    "Distance to road cut": "சாலை வெட்டுப் பகுதி தூரம்",
    "Elevation": "கடல் மட்டத்திலிருந்து உயரம்",
    "Soil type vulnerability": "மண் வகை பாதிப்பு தன்மை",
  },
  ml: {
    "3-day cumulative rainfall": "3-ദിവസത്തെ ആകെ മഴ",
    "7-day antecedent rainfall": "7-ദിവസത്തെ മുൻകാല മഴ",
    "Slope angle": "ഭൂപ്രകൃതി ചരിവ് കോൺ",
    "Soil saturation": "മണ്ണിലെ ഈർപ്പ സാന്ദ്രത",
    "Distance to road cut": "റോഡ് കട്ടിംഗിലേക്കുള്ള ദൂരം",
    "Elevation": "സമുദ്രനിരപ്പിൽ നിന്നുള്ള ഉയരം",
    "Soil type vulnerability": "മണ്ണിന്റെ അപകടസാധ്യത",
  },
  kn: {
    "3-day cumulative rainfall": "೩-ದಿನಗಳ ಒಟ್ಟು ಮಳೆ ಪ್ರಮಾಣ",
    "7-day antecedent rainfall": "೭-ದಿನಗಳ ಹಿಂದಿನ ಮಳೆ ಶೇಖರಣೆ",
    "Slope angle": "ಭೂಪ್ರದೇಶದ ಇಳಿಜಾರು ಕೋನ",
    "Soil saturation": "ಮಣ್ಣಿನ ತೇವಾಂಶ ಸಾಂದ್ರತೆ",
    "Distance to road cut": "ರಸ್ತೆ ಅಗೆತಕ್ಕೆ ಇರುವ ಅಂತರ",
    "Elevation": "ಸಮುದ್ರ ಮಟ್ಟದಿಂದ ಎತ್ತರ",
    "Soil type vulnerability": "ಮಣ್ಣಿನ ವಿಧದ ಸೂಕ್ಷ್ಮತೆ",
  },
};

export const HOTSPOT_TRANSLATIONS: Record<Lang, Record<string, string>> = {
  en: {
    "Chooralmala / Meppadi": "Chooralmala / Meppadi",
    "Meppadi Tea Division": "Meppadi Tea Division",
    "Munnar Gap Road": "Munnar Gap Road",
    "Devikulam Ghat": "Devikulam Ghat",
    "Adimali": "Adimali",
    "Coonoor Ghat": "Coonoor Ghat",
    "Kotagiri": "Kotagiri",
    "Ooty (Udhagamandalam)": "Ooty (Udhagamandalam)",
    "Madikeri Hills (Jodupala)": "Madikeri Hills (Jodupala)",
    "Bhagamandala Foothills": "Bhagamandala Foothills",
    "Senapati Ridge": "Senapati Ridge",
    "Churachandpur Slopes": "Churachandpur Slopes",
  },
  ta: {
    "Chooralmala / Meppadi": "சூரல்மலை / மேப்பாடி",
    "Meppadi Tea Division": "மேப்பாடி தேயிலைத் தோட்டம்",
    "Munnar Gap Road": "மூணார் கேப் ரோடு",
    "Devikulam Ghat": "தேவிகுளம் மலைப்பாதை",
    "Adimali": "அடிமாலி",
    "Coonoor Ghat": "குன்னூர் மலைப்பாதை",
    "Kotagiri": "கோத்தகிரி",
    "Ooty (Udhagamandalam)": "ஊட்டி (உதகமண்டலம்)",
    "Madikeri Hills (Jodupala)": "மடிக்கேரி குன்றுகள் (ஜோடுபால)",
    "Bhagamandala Foothills": "பாகமண்டலா அடிவாரம்",
    "Senapati Ridge": "சேனாபதி மலைத்தொடர்",
    "Churachandpur Slopes": "சுராசந்த்பூர் சரிவுகள்",
  },
  ml: {
    "Chooralmala / Meppadi": "ചൂരൽമല / മേപ്പാടി",
    "Meppadi Tea Division": "മേപ്പാടി ടീ ഡിവിഷൻ",
    "Munnar Gap Road": "മൂന്നാർ ഗ്യാപ് റോഡ്",
    "Devikulam Ghat": "ദേവികുളം ചുരം",
    "Adimali": "അടിമാലി",
    "Coonoor Ghat": "കുന്നൂർ ചുരം",
    "Kotagiri": "കോത്തഗിരി",
    "Ooty (Udhagamandalam)": "ഊട്ടി (ഉദഗമണ്ഡലം)",
    "Madikeri Hills (Jodupala)": "മടിക്കേരി കുന്നുകൾ (ജോഡുപാല)",
    "Bhagamandala Foothills": "ഭാഗമണ്ഡല താഴ്‌വര",
    "Senapati Ridge": "സേനാപതി റിഡ്ജ്",
    "Churachandpur Slopes": "ചുരാചന്ദ്പൂർ ചരിവുകൾ",
  },
  kn: {
    "Chooralmala / Meppadi": "ಚೂರಲ್‌ಮಲಾ / ಮೇಪ್ಪಾಡಿ",
    "Meppadi Tea Division": "ಮೇಪ್ಪಾಡಿ ಚಹಾ ವಿಭಾಗ",
    "Munnar Gap Road": "ಮೂನ್ನಾರ್ ಗ್ಯಾಪ್ ರಸ್ತೆ",
    "Devikulam Ghat": "ದೇವಿಕುಲಂ ಘಾಟ್",
    "Adimali": "ಅಡಿಮಾಲಿ",
    "Coonoor Ghat": "ಕೂನೂರ್ ಘಾಟ್",
    "Kotagiri": "ಕೋಟಗಿರಿ",
    "Ooty (Udhagamandalam)": "ಊಟಿ (ಉದಕಮಂಡಲ)",
    "Madikeri Hills (Jodupala)": "ಮಡಿಕೇರಿ ಬೆಟ್ಟಗಳು (ಜೋಡುಪಾಲ)",
    "Bhagamandala Foothills": "ಭಾಗಮಂಡಲ ತಪ್ಪಲು",
    "Senapati Ridge": "ಸೇನಾಪತಿ ಪರ್ವತಶ್ರೇಣಿ",
    "Churachandpur Slopes": "ಚುರಾಚಾಂದ್‌ಪುರ ಇಳಿಜಾರುಗಳು",
  },
};

// ─── Context ─────────────────────────────────────────────────────────────────
interface I18nContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TranslationKey) => string;
  tDistrict: (districtName: string) => string;
  tAlertHeadline: (alertId: string, fallback: string) => string;
  tAlertLocation: (alertId: string, fallback: string) => string;
  tFactor: (factorName: string) => string;
  tHotspotName: (name: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem("ews-lang");
      if (saved === "en" || saved === "ta" || saved === "ml" || saved === "kn") return saved;
    } catch {}
    return "en";
  });

  function handleSetLang(l: Lang) {
    setLang(l);
    try { localStorage.setItem("ews-lang", l); } catch {}
  }

  function t(key: TranslationKey): string {
    return translations[lang]?.[key] ?? translations.en[key] ?? key;
  }

  function tDistrict(districtName: string): string {
    return DISTRICT_TRANSLATIONS[lang]?.[districtName] ?? DISTRICT_TRANSLATIONS.en[districtName] ?? districtName;
  }

  function tAlertHeadline(alertId: string, fallback: string): string {
    return ALERT_TRANSLATIONS[lang]?.[alertId]?.headline ?? fallback;
  }

  function tAlertLocation(alertId: string, fallback: string): string {
    return ALERT_TRANSLATIONS[lang]?.[alertId]?.location ?? fallback;
  }

  function tFactor(factorName: string): string {
    return FACTOR_TRANSLATIONS[lang]?.[factorName] ?? FACTOR_TRANSLATIONS.en[factorName] ?? factorName;
  }

  function tHotspotName(name: string): string {
    return HOTSPOT_TRANSLATIONS[lang]?.[name] ?? HOTSPOT_TRANSLATIONS.en[name] ?? name;
  }

  return (
    <I18nContext.Provider
      value={{
        lang,
        setLang: handleSetLang,
        t,
        tDistrict,
        tAlertHeadline,
        tAlertLocation,
        tFactor,
        tHotspotName,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <LanguageProvider>");
  return ctx;
}
