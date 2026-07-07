export type CivicState =
  | 'Delhi'
  | 'Punjab'
  | 'Kerala'
  | 'Tamil Nadu'
  | 'Bihar'
  | 'West Bengal'
  | 'North East';

export interface StateTheme {
  id: CivicState;
  stateName: string;
  hindiName: string;
  primaryColor: string; // Tailwind class (e.g. 'indigo-600')
  gradientFrom: string; // e.g. 'from-blue-600'
  gradientTo: string;   // e.g. 'to-cyan-500'
  accentColor: string;  // e.g. 'border-blue-400'
  culturalPattern: string; // SVG or CSS background description
  illustrationType: 'skyline' | 'temple' | 'nature' | 'art' | 'mountains';
  weatherTemp: string;
  weatherStatus: string;
  aqi: number;
  aqiStatus: 'Good' | 'Moderate' | 'Poor' | 'Severe';
  localCapital: string;
  trendingScheme: string;
  emergencyContact: string;
}

export interface UserProfile {
  uid: string;
  fullName: string;
  phoneNumber: string;
  state: CivicState;
  city: string;
  aadhaarLastFour: string;
  digitalCardId: string;
  savedDocuments: {
    id: string;
    name: string;
    type: 'Aadhaar' | 'PAN' | 'Ration Card' | 'Driving License';
    docNumber: string;
    verified: boolean;
    issueDate: string;
  }[];
}

export interface CivicComplaint {
  id: string;
  userId: string;
  title: string;
  category: 'Roads & Potholes' | 'Water Supply' | 'Electricity & Lights' | 'Garbage & Sanitation' | 'Stray Animals' | 'Security & Policing';
  description: string;
  locationName: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  state: CivicState;
  createdAt: string;
  status: 'Filed' | 'In Progress' | 'Dispatched' | 'Resolved';
  timeline: {
    status: string;
    date: string;
    comment: string;
  }[];
  upvotes: number;
  hasUpvoted?: boolean;
}

export interface GovScheme {
  id: string;
  name: string;
  department: string;
  description: string;
  benefits: string[];
  eligibility: {
    minAge?: number;
    maxAge?: number;
    incomeLimit?: number; // annual
    professions?: string[];
    gender?: 'All' | 'Female' | 'Male';
  };
  documentsRequired: string[];
  status: 'Available' | 'Applied' | 'Approved' | 'Rejected';
  applicationId?: string;
  appliedDate?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isVoice?: boolean;
  docDetails?: {
    schemeName?: string;
    missingDocs?: string[];
    nextSteps?: string[];
  };
}

export interface CivicJob {
  id: string;
  title: string;
  department: string;
  salary: string;
  experience: string;
  location: string;
  type: string; // "Full Time" | "Contract"
  deadline: string;
  applied?: boolean;
}

export interface DistrictSummary {
  population: string;
  area: string;
  activeComplaints: number;
  resolvedComplaints: number;
  municipalBudget: string;
  citizenSatisfaction: string;
}
