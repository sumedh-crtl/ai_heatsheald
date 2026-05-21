// Mock data for demo purposes

export const hourlyPredictions = Array.from({ length: 24 }, (_, i) => {
  const hour = i;
  const isPeak = hour >= 12 && hour <= 16;
  const basetemp = 28 + Math.sin((hour - 6) * Math.PI / 12) * 8;
  return {
    hour: `${hour.toString().padStart(2, '0')}:00`,
    temperature: Math.round((basetemp + (Math.random() * 2 - 1)) * 10) / 10,
    feelsLike: Math.round((basetemp + 2 + (Math.random() * 2 - 1)) * 10) / 10,
    humidity: Math.round(65 - (isPeak ? 15 : 0) + (Math.random() * 10 - 5)),
    confidence: Math.round((0.92 - Math.abs(hour - 12) * 0.01) * 100),
  };
});

export const weeklyPredictions = [
  { day: 'Today', high: 38, low: 26, condition: 'Extreme Heat', risk: 'extreme' },
  { day: 'Tomorrow', high: 36, low: 25, condition: 'Very Hot', risk: 'high' },
  { day: 'Wed', high: 34, low: 24, condition: 'Hot', risk: 'high' },
  { day: 'Thu', high: 31, low: 23, condition: 'Warm', risk: 'moderate' },
  { day: 'Fri', high: 29, low: 21, condition: 'Pleasant', risk: 'low' },
  { day: 'Sat', high: 30, low: 22, condition: 'Warm', risk: 'moderate' },
  { day: 'Sun', high: 33, low: 24, condition: 'Hot', risk: 'high' },
];

export const monthlyTrends = Array.from({ length: 12 }, (_, i) => ({
  month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
  avgTemp: [22, 24, 27, 30, 33, 36, 38, 37, 34, 30, 26, 22][i],
  maxTemp: [26, 28, 32, 36, 38, 41, 43, 42, 39, 35, 30, 26][i],
  heatIndex: [18, 20, 24, 28, 32, 36, 40, 39, 35, 30, 24, 19][i],
}));

export const energyData = Array.from({ length: 7 }, (_, i) => ({
  day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
  cooling: Math.round(3000 + Math.random() * 1500),
  heating: Math.round(500 + Math.random() * 300),
  total: Math.round(4500 + Math.random() * 2000),
}));

export const zoneComparison = [
  { zone: 'Downtown', temp: 38.5, greenery: 8.5 },
  { zone: 'Financial', temp: 36.2, greenery: 10.2 },
  { zone: 'Midtown', temp: 35.8, greenery: 12.0 },
  { zone: 'Upper East', temp: 32.1, greenery: 22.5 },
  { zone: 'Central Park', temp: 28.3, greenery: 72.0 },
  { zone: 'Brooklyn', temp: 33.4, greenery: 18.0 },
  { zone: 'Queens', temp: 34.7, greenery: 15.0 },
  { zone: 'Harlem', temp: 31.5, greenery: 25.0 },
];

export const chatResponses: Record<string, string> = {
  default: "I'm your HeatShield AI assistant. I can provide real-time heat safety tips, environmental recommendations, and city climate insights. How can I help you today?",
  heat: "During extreme heat events: Stay indoors between 12 PM–4 PM, drink water every 20 minutes, wear light clothing, and check on elderly neighbors. Cooling centers are available at city halls and libraries.",
  tips: "Top 5 heat safety tips:\n1. Hydrate with at least 3L of water daily\n2. Use reflective window films to reduce indoor heat\n3. Plant drought-resistant trees for natural shading\n4. Set AC to 24°C for optimal efficiency\n5. Avoid strenuous outdoor activity during peak hours (12-4 PM)",
  trees: "Urban trees can reduce surrounding temperatures by 2-8°C through evapotranspiration. Native species like Oak, Maple, and Elm provide 40-60% more cooling than non-native varieties. We recommend planting on south and west sides of buildings for maximum benefit.",
  prediction: "Based on current atmospheric data and ML models, tomorrow will see peak temperatures of 36°C between 1-3 PM in the downtown area. Probability of heat stress incidents: 78%. Recommended precautions: activate cooling centers, increase water distribution points.",
  roof: "Cool roofs with reflective coatings can reduce rooftop temperatures by 28-33°C and indoor temperatures by 2-5°C. This translates to 10-30% reduction in cooling energy costs. White or light-colored surfaces with high solar reflectance (>0.65) are most effective.",
  air: "Current AQI in Downtown: 78 (Moderate). Elevated ozone and particulate matter due to high temperatures and traffic. Sensitive groups (children, elderly, respiratory conditions) should limit outdoor exposure. Expected to improve after 7 PM when temperatures drop.",
  energy: "Urban heat islands increase cooling energy demand by 5-10%. The city currently uses 58,420 kWh in peak summer hours. Smart grid optimization and cool roofs could reduce this by 18%. Solar panels on reflective rooftops provide double benefit: energy generation + heat reduction.",
};

export function getChatResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('heat') || lower.includes('hot') || lower.includes('temperature')) return chatResponses.heat;
  if (lower.includes('tip') || lower.includes('safe') || lower.includes('protect')) return chatResponses.tips;
  if (lower.includes('tree') || lower.includes('plant') || lower.includes('green')) return chatResponses.trees;
  if (lower.includes('predict') || lower.includes('forecast') || lower.includes('tomorrow')) return chatResponses.prediction;
  if (lower.includes('roof') || lower.includes('building') || lower.includes('cool roof')) return chatResponses.roof;
  if (lower.includes('air') || lower.includes('quality') || lower.includes('aqi') || lower.includes('pollution')) return chatResponses.air;
  if (lower.includes('energy') || lower.includes('power') || lower.includes('electricity')) return chatResponses.energy;
  return chatResponses.default;
}

export const insightCards = [
  {
    title: "Heat Island Intensity",
    value: "+4.8°C",
    change: "+0.3°C vs last year",
    trend: "up",
    description: "Downtown is 4.8°C hotter than rural surroundings",
  },
  {
    title: "Carbon Sequestration",
    value: "1,240 t",
    change: "+8% with new trees",
    trend: "up",
    description: "Annual CO2 absorbed by urban vegetation",
  },
  {
    title: "Heat-Related ER Visits",
    value: "312",
    change: "-12% with interventions",
    trend: "down",
    description: "This summer compared to 5-year average",
  },
  {
    title: "Cooling Energy Saved",
    value: "2.4 GWh",
    change: "Via green infrastructure",
    trend: "up",
    description: "Energy savings from cool roofs and trees",
  },
];
