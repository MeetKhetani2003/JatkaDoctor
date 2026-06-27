export const LUCKNOW_ZONES = {
  "Central Lucknow Zone": [
    "Hazratganj",
    "Aminabad",
    "Kaiserbagh",
    "Lalbagh",
    "Wazirganj",
    "Chowk",
    "Charbagh",
    "Gautam Buddha Marg",
    "Naka Hindola"
  ],
  "Gomti Nagar Zone": [
    "Gomti Nagar Extension",
    "Gomti Nagar",
    "Patrakarpuram",
    "Vibhuti Khand",
    "Vivek Khand",
    "Vinay Khand",
    "Shaheed Path (Gomti Side)",
    "Malhaur",
    "Gwari Crossing"
  ],
  "Indira Nagar Zone": [
    "Indira Nagar",
    "Bhootnath Market",
    "Munshipulia",
    "Sector 8",
    "Sector 9",
    "Sector 14",
    "Takrohi",
    "Chinhat (Inner Area)",
    "Ring Road Indira Nagar"
  ],
  "Alambagh / Airport Zone": [
    "Alambagh",
    "Ashiyana",
    "Krishna Nagar",
    "Singar Nagar",
    "Manas Nagar",
    "Amausi Airport Area",
    "Amausi Airport",
    "Airport",
    "Transport Nagar",
    "Kanpur Road",
    "Dubagga Road Side"
  ],
  "North / Outer Lucknow Zone": [
    "Aliganj",
    "Jankipuram Extension",
    "Jankipuram",
    "Engineering College Area",
    "Engineering College",
    "Kapoorthala",
    "Chandralok",
    "Dubagga",
    "Rajajipuram",
    "Balaganj",
    "Thakurganj",
    "Telibagh",
    "Raebareli Road",
    "PGI Area",
    "PGI",
    "Vrindavan Yojna",
    "Vrindavan Yojana",
    "South City",
    "Sushant Golf City"
  ]
};

export function detectZone(address) {
  if (!address || typeof address !== 'string') return null;
  
  const normalizedAddress = address.toLowerCase();
  
  // Create a flat list of all locations, sorting by length descending to match specific locations
  // (e.g. "Gomti Nagar Extension") before general ones ("Gomti Nagar")
  const allLocations = [];
  for (const [zone, locations] of Object.entries(LUCKNOW_ZONES)) {
    for (const loc of locations) {
      allLocations.push({ zone, location: loc, length: loc.length });
    }
  }
  
  allLocations.sort((a, b) => b.length - a.length);
  
  for (const item of allLocations) {
    const locLower = item.location.toLowerCase();
    if (normalizedAddress.includes(locLower)) {
      return item.zone;
    }
  }
  
  return null;
}
