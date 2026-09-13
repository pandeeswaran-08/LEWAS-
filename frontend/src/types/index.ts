export type RiskLevel = "Low" | "Moderate" | "High" | "Critical";

export type District =
  | "Wayanad"
  | "Idukki"
  | "Nilgiris"
  | "Kodagu"
  | "Senapati"
  | "Churachandpur";

export interface Hotspot {
  id: string;
  name: string;
  district: District;
  state: string;
  lat: number;
  lng: number;
  elevation: number;
  slope: number;
  criticalRoads: string[];
  rainfall3d: number;
  rainfall7d: number;
  risk: RiskLevel;
  probability: number;
  villages: string[];
  population: number;
  soilMoisture: number;
}

export interface Alert {
  id: string;
  hotspotId: string;
  location: string;
  district: District;
  severity: RiskLevel;
  issuedAt: string;
  headline: string;
  details: string;
  affectedVillages: string[];
  roadsAtRisk: string[];
  confidence: number;
  contacts: { label: string; number: string }[];
  smsEn: string;
  smsMl: string;
  smsTa?: string;
  smsKn?: string;
  whatsapp: string;
  status: "Active" | "Monitoring" | "Closed";
}

export type SoilType =
  | "Lateritic"
  | "Clayey_Loam"
  | "Colluvium"
  | "Gneissic_Overburden"
  | "Sandy_Loam";

export type PredictionEngine = "random_forest" | "heuristic";

export interface PredictionInput {
  district: District;
  slope: number;
  elevation: number;
  distanceToRoad: number;
  rainfall3d: number;
  rainfall7d: number;
  soil_type?: SoilType;
  engine?: PredictionEngine;
}

export interface FactorContribution {
  factor: string;
  contribution: number;
  value: string;
  threshold: string;
  exceeded: boolean;
  weight?: number;
}

export interface PredictionComparison {
  mlProbability: number;
  heuristicProbability: number;
  variance: number;
}

export interface PredictionResult {
  probability: number;
  riskClass: RiskLevel;
  confidence: number;
  factors: FactorContribution[];
  narrative?: string;
  engine?: string;
  featureImportances?: Record<string, number>;
  comparison?: PredictionComparison;
  metrics?: {
    accuracy: number;
    f1Score: number;
    oobError: number;
    consensusAgreement: number;
  };
}
