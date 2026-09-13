/**
 * Sentinel Hub API Service.
 * Manages OAuth2 token acquisition and live Sentinel-1/Sentinel-2 layer processing.
 */

import { SENTINEL_HUB_CONFIG } from "../config/constants.js";

let cachedToken = null;
let tokenExpiresAt = 0;

/**
 * Retrieves an active OAuth2 Bearer token from Sentinel Hub using Client ID & Secret.
 * Uses native fetch (Node.js 18+).
 */
export async function getSentinelHubAuthToken() {
  const now = Date.now();
  if (cachedToken && now < tokenExpiresAt - 60000) {
    return { token: cachedToken, cached: true };
  }

  const { CLIENT_ID, CLIENT_SECRET, AUTH_TOKEN_URL } = SENTINEL_HUB_CONFIG;

  try {
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", CLIENT_ID);
    params.append("client_secret", CLIENT_SECRET);

    const response = await fetch(AUTH_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const errText = await response.text();
      return {
        success: false,
        error: `Sentinel Hub token acquisition returned ${response.status}: ${errText}`,
        simulated: true,
      };
    }

    const data = await response.json();
    cachedToken = data.access_token;
    tokenExpiresAt = now + (data.expires_in || 3600) * 1000;

    return {
      success: true,
      token: cachedToken,
      expiresIn: data.expires_in,
      cached: false,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      simulatedFallback: true,
    };
  }
}

/**
 * Returns available Sentinel-1 and Sentinel-2 satellite configurations for Western Ghats.
 */
export function getSentinelLayers() {
  return [
    {
      id: "S1_SAR_COHERENCE",
      satellite: "Sentinel-1A / 1B",
      sensor: "C-Band Synthetic Aperture Radar (SAR)",
      mode: "Interferometric Wide (IW) Single Look Complex",
      polarization: "VV + VH",
      resolution: "10 m",
      revisitTime: "6 - 12 days",
      capability: "Cloud-penetrating all-weather ground displacement and moisture tracking",
      status: "OPERATIONAL",
    },
    {
      id: "S2_MSI_DNDVI",
      satellite: "Sentinel-2A / 2B",
      sensor: "Multi-Spectral Instrument (MSI)",
      spectralBands: ["B04 (Red)", "B08 (NIR)", "B11 (SWIR)"],
      resolution: "10 m - 20 m",
      revisitTime: "5 days",
      capability: "Vegetation scar detection, sediment washouts, and debris flow boundaries",
      status: "OPERATIONAL",
    },
  ];
}
