import { GovScheme } from '../types';

/**
 * Pure helper function to determine if a citizen is eligible for a specific welfare scheme.
 */
export function calculateSchemeEligibility(
  scheme: GovScheme,
  criteria: { age: number; income: number; gender: string; profession: string }
): { eligible: boolean; reasons: string[] } {
  const reasons: string[] = [];
  let eligible = true;

  const { age, income, gender, profession } = criteria;
  const { eligibility } = scheme;

  if (!eligibility) {
    return { eligible: true, reasons: ['Matches all basic central government parameters!'] };
  }

  // Gender Match
  if (eligibility.gender && eligibility.gender !== 'All' && gender !== 'All' && eligibility.gender !== gender) {
    eligible = false;
    reasons.push(`Scheme targeted exclusively for ${eligibility.gender} beneficiaries`);
  }

  // Income Limit Match
  if (eligibility.incomeLimit && income > eligibility.incomeLimit) {
    eligible = false;
    reasons.push(`Annual income exceeds limit of ₹${eligibility.incomeLimit.toLocaleString()}`);
  }

  // Age Limits Match
  if (eligibility.minAge && age < eligibility.minAge) {
    eligible = false;
    reasons.push(`Minimum age required is ${eligibility.minAge} years`);
  }
  if (eligibility.maxAge && age > eligibility.maxAge) {
    eligible = false;
    reasons.push(`Maximum eligible age is ${eligibility.maxAge} years`);
  }

  // Profession Match
  if (eligibility.professions && eligibility.professions.length > 0 && !eligibility.professions.includes(profession)) {
    eligible = false;
    reasons.push(`Profession '${profession}' is not listed in target categories (${eligibility.professions.join(', ')})`);
  }

  if (eligible) {
    reasons.push('Matches all basic central government parameters!');
  }

  return { eligible, reasons };
}

/**
 * Returns Tailwind text and background colors based on AQI air quality status.
 */
export function getAqiColor(status: string): string {
  switch (status) {
    case 'Good':
      return 'bg-emerald-500 text-white';
    case 'Moderate':
      return 'bg-amber-500 text-white';
    case 'Poor':
      return 'bg-orange-500 text-white';
    case 'Severe':
      return 'bg-red-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
}

/**
 * Calculates distance between two GPS coordinates using the Haversine formula (in meters).
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth's radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c); // returns distance in meters
}
