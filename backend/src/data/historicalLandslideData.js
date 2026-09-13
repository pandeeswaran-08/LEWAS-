/**
 * Historical Landslide and Non-Landslide Ground-Truth Dataset for the Western Ghats.
 * Sourced from Geological Survey of India (GSI), Kerala State Disaster Management Authority (KSDMA),
 * and NASA Global Landslide Catalog for major events across Wayanad, Idukki, Nilgiris, and Kodagu.
 *
 * Features:
 * - rainfall_3d: 3-day cumulative rainfall (mm)
 * - rainfall_7d: 7-day cumulative antecedent rainfall (mm)
 * - slope: terrain inclination (degrees)
 * - elevation: altitude (meters above sea level)
 * - road_distance: proximity to cut-slope / road excavation (meters)
 * - soil_type: Lateritic | Clayey_Loam | Colluvium | Gneissic_Overburden | Sandy_Loam
 * - landslide: 1 (Failure/Debris Flow Occurred), 0 (Stable Slope / Negative Control)
 */

export const SOIL_TYPES = [
  "Lateritic",
  "Clayey_Loam",
  "Colluvium",
  "Gneissic_Overburden",
  "Sandy_Loam",
];

export const HISTORICAL_LANDSLIDE_DATASET = [
  // ─── 1. Major Historic Landslides (Positive Class: landslide = 1) ───
  { id: "EV-001", location: "Chooralmala", district: "Wayanad", year: 2024, rainfall_3d: 372, rainfall_7d: 618, slope: 38, elevation: 1080, road_distance: 140, soil_type: "Colluvium", landslide: 1 },
  { id: "EV-002", location: "Mundakkai", district: "Wayanad", year: 2024, rainfall_3d: 341, rainfall_7d: 590, slope: 41, elevation: 1210, road_distance: 110, soil_type: "Colluvium", landslide: 1 },
  { id: "EV-003", location: "Punchirimattom", district: "Wayanad", year: 2024, rainfall_3d: 395, rainfall_7d: 640, slope: 44, elevation: 1350, road_distance: 350, soil_type: "Gneissic_Overburden", landslide: 1 },
  { id: "EV-004", location: "Pettimudi", district: "Idukki", year: 2020, rainfall_3d: 310, rainfall_7d: 540, slope: 43, elevation: 1420, road_distance: 190, soil_type: "Lateritic", landslide: 1 },
  { id: "EV-005", location: "Kavalappara", district: "Malappuram", year: 2019, rainfall_3d: 360, rainfall_7d: 510, slope: 39, elevation: 890, road_distance: 220, soil_type: "Clayey_Loam", landslide: 1 },
  { id: "EV-006", location: "Puthumala", district: "Wayanad", year: 2019, rainfall_3d: 315, rainfall_7d: 495, slope: 35, elevation: 1150, road_distance: 160, soil_type: "Colluvium", landslide: 1 },
  { id: "EV-007", location: "Coonoor Marappalam", district: "Nilgiris", year: 2009, rainfall_3d: 380, rainfall_7d: 520, slope: 36, elevation: 1680, road_distance: 45, soil_type: "Lateritic", landslide: 1 },
  { id: "EV-008", location: "Kotagiri Ghat", district: "Nilgiris", year: 2009, rainfall_3d: 320, rainfall_7d: 460, slope: 33, elevation: 1540, road_distance: 60, soil_type: "Lateritic", landslide: 1 },
  { id: "EV-009", location: "Madikeri Makkanduru", district: "Kodagu", year: 2018, rainfall_3d: 290, rainfall_7d: 480, slope: 37, elevation: 1050, road_distance: 130, soil_type: "Clayey_Loam", landslide: 1 },
  { id: "EV-010", location: "Munnar Gap Road", district: "Idukki", year: 2018, rainfall_3d: 285, rainfall_7d: 510, slope: 42, elevation: 1600, road_distance: 25, soil_type: "Gneissic_Overburden", landslide: 1 },
  { id: "EV-011", location: "Kattippara", district: "Kozhikode", year: 2018, rainfall_3d: 295, rainfall_7d: 470, slope: 34, elevation: 760, road_distance: 180, soil_type: "Clayey_Loam", landslide: 1 },
  { id: "EV-012", location: "Cheeyappara Falls", district: "Idukki", year: 2013, rainfall_3d: 260, rainfall_7d: 430, slope: 38, elevation: 920, road_distance: 15, soil_type: "Gneissic_Overburden", landslide: 1 },
  { id: "EV-013", location: "Kallar Valley", district: "Idukki", year: 2021, rainfall_3d: 245, rainfall_7d: 410, slope: 36, elevation: 1100, road_distance: 95, soil_type: "Colluvium", landslide: 1 },
  { id: "EV-014", location: "Meppadi Chembra Slope", district: "Wayanad", year: 2024, rainfall_3d: 310, rainfall_7d: 520, slope: 39, elevation: 1250, road_distance: 210, soil_type: "Colluvium", landslide: 1 },
  { id: "EV-015", location: "Lovedale Junction", district: "Nilgiris", year: 2023, rainfall_3d: 230, rainfall_7d: 390, slope: 32, elevation: 1950, road_distance: 50, soil_type: "Lateritic", landslide: 1 },
  { id: "EV-016", location: "Jodupala", district: "Kodagu", year: 2018, rainfall_3d: 330, rainfall_7d: 550, slope: 40, elevation: 880, road_distance: 40, soil_type: "Clayey_Loam", landslide: 1 },
  { id: "EV-017", location: "Rajamala Colony", district: "Idukki", year: 2020, rainfall_3d: 325, rainfall_7d: 560, slope: 44, elevation: 1520, road_distance: 280, soil_type: "Gneissic_Overburden", landslide: 1 },
  { id: "EV-018", location: "Gudalur Ghat", district: "Nilgiris", year: 2019, rainfall_3d: 275, rainfall_7d: 440, slope: 35, elevation: 1180, road_distance: 35, soil_type: "Lateritic", landslide: 1 },
  { id: "EV-019", location: "Vythiri Pass", district: "Wayanad", year: 2018, rainfall_3d: 260, rainfall_7d: 420, slope: 33, elevation: 840, road_distance: 30, soil_type: "Colluvium", landslide: 1 },
  { id: "EV-020", location: "Bhagamandala", district: "Kodagu", year: 2020, rainfall_3d: 310, rainfall_7d: 490, slope: 34, elevation: 910, road_distance: 140, soil_type: "Clayey_Loam", landslide: 1 },
  { id: "EV-021", location: "Attamala Hillside", district: "Wayanad", year: 2024, rainfall_3d: 355, rainfall_7d: 580, slope: 39, elevation: 1140, road_distance: 190, soil_type: "Colluvium", landslide: 1 },
  { id: "EV-022", location: "Mananthavady Ghat", district: "Wayanad", year: 2019, rainfall_3d: 250, rainfall_7d: 390, slope: 31, elevation: 890, road_distance: 70, soil_type: "Lateritic", landslide: 1 },
  { id: "EV-023", location: "Kunjithanny", district: "Idukki", year: 2018, rainfall_3d: 270, rainfall_7d: 450, slope: 35, elevation: 980, road_distance: 120, soil_type: "Colluvium", landslide: 1 },
  { id: "EV-024", location: "Ooty–Mettupalayam Road", district: "Nilgiris", year: 2021, rainfall_3d: 220, rainfall_7d: 360, slope: 32, elevation: 1450, road_distance: 20, soil_type: "Lateritic", landslide: 1 },
  { id: "EV-025", location: "Somwarpet Ridge", district: "Kodagu", year: 2018, rainfall_3d: 280, rainfall_7d: 460, slope: 36, elevation: 1020, road_distance: 110, soil_type: "Clayey_Loam", landslide: 1 },

  // ─── 2. Stable / Non-Landslide Reference Points (Negative Class: landslide = 0) ───
  // Points with steep slope but low rainfall, or high rainfall on flat slopes/sandy loam with no failure
  { id: "ST-001", location: "Sulthan Bathery Plateau", district: "Wayanad", year: 2024, rainfall_3d: 210, rainfall_7d: 340, slope: 14, elevation: 920, road_distance: 550, soil_type: "Sandy_Loam", landslide: 0 },
  { id: "ST-002", location: "Kalpetta Town Ridge", district: "Wayanad", year: 2024, rainfall_3d: 230, rainfall_7d: 360, slope: 18, elevation: 860, road_distance: 380, soil_type: "Lateritic", landslide: 0 },
  { id: "ST-003", location: "Munnar Tea Valley", district: "Idukki", year: 2023, rainfall_3d: 140, rainfall_7d: 240, slope: 22, elevation: 1510, road_distance: 420, soil_type: "Lateritic", landslide: 0 },
  { id: "ST-004", location: "Devikulam Terrace", district: "Idukki", year: 2022, rainfall_3d: 160, rainfall_7d: 280, slope: 19, elevation: 1600, road_distance: 600, soil_type: "Clayey_Loam", landslide: 0 },
  { id: "ST-005", location: "Ooty Botanical Garden", district: "Nilgiris", year: 2023, rainfall_3d: 120, rainfall_7d: 210, slope: 15, elevation: 2240, road_distance: 500, soil_type: "Lateritic", landslide: 0 },
  { id: "ST-006", location: "Kotagiri Tea Bench", district: "Nilgiris", year: 2022, rainfall_3d: 170, rainfall_7d: 290, slope: 20, elevation: 1780, road_distance: 460, soil_type: "Lateritic", landslide: 0 },
  { id: "ST-007", location: "Kushalnagar Plains", district: "Kodagu", year: 2023, rainfall_3d: 110, rainfall_7d: 180, slope: 8, elevation: 820, road_distance: 750, soil_type: "Sandy_Loam", landslide: 0 },
  { id: "ST-008", location: "Virajpet Flatlands", district: "Kodagu", year: 2022, rainfall_3d: 190, rainfall_7d: 310, slope: 16, elevation: 870, road_distance: 600, soil_type: "Clayey_Loam", landslide: 0 },
  { id: "ST-009", location: "Mananthavady Plateau", district: "Wayanad", year: 2023, rainfall_3d: 180, rainfall_7d: 320, slope: 17, elevation: 790, road_distance: 480, soil_type: "Sandy_Loam", landslide: 0 },
  { id: "ST-010", location: "Nedumkandam Escarpment Base", district: "Idukki", year: 2022, rainfall_3d: 195, rainfall_7d: 340, slope: 21, elevation: 1040, road_distance: 410, soil_type: "Lateritic", landslide: 0 },
  { id: "ST-011", location: "Wellington Valley", district: "Nilgiris", year: 2022, rainfall_3d: 130, rainfall_7d: 230, slope: 16, elevation: 1820, road_distance: 520, soil_type: "Lateritic", landslide: 0 },
  { id: "ST-012", location: "Gonikoppal Estate", district: "Kodagu", year: 2023, rainfall_3d: 150, rainfall_7d: 260, slope: 12, elevation: 850, road_distance: 800, soil_type: "Sandy_Loam", landslide: 0 },
  { id: "ST-013", location: "Panamaram River Basin", district: "Wayanad", year: 2024, rainfall_3d: 270, rainfall_7d: 410, slope: 9, elevation: 740, road_distance: 900, soil_type: "Sandy_Loam", landslide: 0 },
  { id: "ST-014", location: "Kumily Terrace", district: "Idukki", year: 2023, rainfall_3d: 160, rainfall_7d: 270, slope: 18, elevation: 880, road_distance: 350, soil_type: "Lateritic", landslide: 0 },
  { id: "ST-015", location: "Ketti Valley Floor", district: "Nilgiris", year: 2023, rainfall_3d: 140, rainfall_7d: 250, slope: 14, elevation: 1890, road_distance: 650, soil_type: "Clayey_Loam", landslide: 0 },
  { id: "ST-016", location: "Ponnampet Lowlands", district: "Kodagu", year: 2022, rainfall_3d: 175, rainfall_7d: 300, slope: 11, elevation: 860, road_distance: 720, soil_type: "Sandy_Loam", landslide: 0 },
  { id: "ST-017", location: "Ambalavayal Farm Zone", district: "Wayanad", year: 2022, rainfall_3d: 165, rainfall_7d: 280, slope: 15, elevation: 940, road_distance: 510, soil_type: "Lateritic", landslide: 0 },
  { id: "ST-018", location: "Vandiperiyar Plain", district: "Idukki", year: 2022, rainfall_3d: 185, rainfall_7d: 310, slope: 17, elevation: 820, road_distance: 430, soil_type: "Clayey_Loam", landslide: 0 },
  { id: "ST-019", location: "Adikaratti Gentle Slope", district: "Nilgiris", year: 2023, rainfall_3d: 155, rainfall_7d: 270, slope: 19, elevation: 1750, road_distance: 490, soil_type: "Lateritic", landslide: 0 },
  { id: "ST-020", location: "Napoklu Plain", district: "Kodagu", year: 2023, rainfall_3d: 160, rainfall_7d: 280, slope: 13, elevation: 890, road_distance: 680, soil_type: "Sandy_Loam", landslide: 0 },
  { id: "ST-021", location: "Kaniyambetta Bench", district: "Wayanad", year: 2023, rainfall_3d: 170, rainfall_7d: 290, slope: 16, elevation: 810, road_distance: 580, soil_type: "Lateritic", landslide: 0 },
  { id: "ST-022", location: "Peermade Plantation", district: "Idukki", year: 2022, rainfall_3d: 205, rainfall_7d: 350, slope: 20, elevation: 980, road_distance: 370, soil_type: "Lateritic", landslide: 0 },
  { id: "ST-023", location: "Pykara Lake Margin", district: "Nilgiris", year: 2023, rainfall_3d: 135, rainfall_7d: 240, slope: 15, elevation: 2080, road_distance: 850, soil_type: "Clayey_Loam", landslide: 0 },
  { id: "ST-024", location: "Suntikoppa Undulating", district: "Kodagu", year: 2022, rainfall_3d: 180, rainfall_7d: 310, slope: 17, elevation: 950, road_distance: 420, soil_type: "Clayey_Loam", landslide: 0 },
  { id: "ST-025", location: "Muttil Terrace", district: "Wayanad", year: 2024, rainfall_3d: 220, rainfall_7d: 370, slope: 18, elevation: 870, road_distance: 490, soil_type: "Sandy_Loam", landslide: 0 },
];
