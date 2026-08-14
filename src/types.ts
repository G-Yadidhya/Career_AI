export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  targetRole?: string;
  experienceLevel?: 'Student' | 'Entry Level' | 'Mid Level' | 'Senior';
  avatarUrl?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface ScoreDetail {
  score: number; // 0-100
  reason: string;
  evidence: string; // Specific textual evidence from the source document supporting this evaluation
  confidence: number; // 0.0-1.0
  recommendation: string;
}

export interface ActionVerbsAnalysis {
  scoreDetail: ScoreDetail;
  detectedVerbs: string[];
  weakVerbsFound: string[];
  suggestedActionVerbs: string[];
}

export interface KeywordDensityAnalysis {
  scoreDetail: ScoreDetail;
  keywordsFound: Record<string, number>;
  totalWordCount: number;
  densityPercentage: number;
}

export interface GrammarAnalysis {
  scoreDetail: ScoreDetail;
  grammarSuggestions: GrammarFix[];
}

export interface DuplicateDetectionAnalysis {
  scoreDetail: ScoreDetail;
  duplicateBulletPoints: string[];
  repeatedPhrases: string[];
}

export interface AchievementDetectionAnalysis {
  scoreDetail: ScoreDetail;
  quantifiedAchievements: string[];
  unquantifiedBulletPoints: string[];
}

export interface StandardizedScores {
  atsScore: ScoreDetail;
  formattingScore: ScoreDetail;
  readabilityScore: ScoreDetail;
  keywordDensityScore: ScoreDetail;
  grammarScore: ScoreDetail;
  actionVerbsScore: ScoreDetail;
  duplicateDetectionScore: ScoreDetail;
  achievementScore: ScoreDetail;
}

export interface ParsedResume {
  rawText: string;
  candidateName: string;
  email: string;
  phone: string;
  summary: string;
  skills: string[];
  categorizedSkills?: {
    category: string;
    skills: string[];
  }[];
  projects: {
    title: string;
    description: string;
    technologies: string[];
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
    gpa?: string;
  }[];
  experience: {
    role: string;
    company: string;
    duration: string;
    highlights: string[];
  }[];
  certifications: string[];
  achievements: string[];
}

export interface ATSBreakdown {
  formattingScore: number;
  keywordScore: number;
  experienceScore: number;
  skillsMatchScore: number;
  readabilityScore: number;
}

export interface GrammarFix {
  originalText: string;
  suggestedText: string;
  reason: string;
  type: 'grammar' | 'formatting' | 'impact';
}

export interface ResumeAnalysis {
  id: string;
  fileName: string;
  uploadedAt: string;
  atsScore: number;
  parsedResume: ParsedResume;
  atsBreakdown: ATSBreakdown;
  detailedScores: StandardizedScores;
  actionVerbs: ActionVerbsAnalysis;
  keywordDensity: KeywordDensityAnalysis;
  grammarAnalysis: GrammarAnalysis;
  duplicateDetection: DuplicateDetectionAnalysis;
  achievementDetection: AchievementDetectionAnalysis;
  resumeSummary: string;
  strengths: string[];
  weaknesses: string[];
  grammarSuggestions: GrammarFix[];
  formattingSuggestions: string[];
  missingKeywords: string[];
  missingSkills: string[];
  improvementSuggestions: string[];
  resumeOptimizationTips?: string[];
  ragSourcesUsed: string[];
}

export interface SkillSimilarityDetail {
  scoreDetail: ScoreDetail;
  matchedCount: number;
  missingCount: number;
  matchedSkillsList: string[];
  missingSkillsList: string[];
}

export interface SemanticSimilarityDetail {
  scoreDetail: ScoreDetail;
  vectorCosineDistance: number;
  vectorCosineSimilarity: number;
  vectorDimension: number;
}

export interface TechnologySimilarityDetail {
  scoreDetail: ScoreDetail;
  matchedTechnologies: string[];
  missingTechnologies: string[];
  techCoveragePercentage: number;
}

export interface ExperienceGapDetail {
  scoreDetail: ScoreDetail;
  requiredYears: number;
  candidateYears: number;
  gapYears: number;
  gapSeverity: 'None' | 'Minor' | 'Moderate' | 'Significant';
}

export interface HiringProbabilityDetail {
  scoreDetail: ScoreDetail;
  probabilityPercentage: number;
  tier: 'Low' | 'Moderate' | 'High' | 'Very High';
  keyDrivers: string[];
  riskFactors: string[];
}

export interface SalaryEstimationDetail {
  scoreDetail: ScoreDetail;
  currency: string;
  minSalary: number;
  maxSalary: number;
  medianSalary: number;
  recommendedTargetSalary: number;
  marketTier: 'Entry Level' | 'Mid Level' | 'Senior Level' | 'Lead/Executive';
  benchmarkExplanation: string;
}

export interface JobMatchResult {
  id: string;
  jobTitle: string;
  companyName?: string;
  jobDescriptionText: string;
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  missingKeywords: string[];
  missingTechnologies: string[];
  overallMatchScore: ScoreDetail;
  skillSimilarity: SkillSimilarityDetail;
  semanticSimilarity: SemanticSimilarityDetail;
  technologySimilarity: TechnologySimilarityDetail;
  experienceGap: ExperienceGapDetail;
  hiringProbability: HiringProbabilityDetail;
  salaryEstimation: SalaryEstimationDetail;
  skillGapAnalysis: {
    category: string;
    missingCount: number;
    items: string[];
    importance: 'High' | 'Medium' | 'Low';
  }[];
  personalizedSuggestions: string[];
  resumeOptimizationTips: string[];
  analyzedAt: string;
}

export interface CourseResource {
  title: string;
  provider: string;
  url?: string;
  duration?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface BookResource {
  title: string;
  author: string;
  focusArea: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface VideoResource {
  title: string;
  platform: string;
  channelOrSpeaker: string;
  duration?: string;
  topic: string;
}

export interface CertificationResource {
  name: string;
  issuer: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  prepTimeWeeks?: number;
  careerImpact: string;
}

export interface WeeklyRoadmapStep {
  weekNumber: number;
  title: string;
  phaseName: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  focusTopics: string[];
  weeklyObjectives: string[];
  handsOnProject: {
    title: string;
    description: string;
    techStack: string[];
  };
  recommendedCourses?: CourseResource[];
  recommendedBooks?: BookResource[];
  recommendedVideos?: VideoResource[];
  estimatedHours: number;
}

export interface MonthlyPlanStep {
  month: number;
  title: string;
  focusArea: string;
  objectives: string[];
  recommendedCourses: { title: string; provider: string; url?: string }[];
  keyMilestones: string[];
}

export interface ProjectIdea {
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  techStack: string[];
  description: string;
  keyFeatures: string[];
  portfolioImpact: string;
}

export interface CareerRoadmap {
  id: string;
  targetRole: string;
  currentSkills: string[];
  timelineWeeks: number;
  difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  resumeMatchScore?: number;
  personalizedSummary: string;
  skillGapsToBridge: string[];
  existingStrengths: string[];
  
  weeklyRoadmap: WeeklyRoadmapStep[];
  recommendedProjects: ProjectIdea[];
  courses: CourseResource[];
  books: BookResource[];
  videos: VideoResource[];
  certifications: CertificationResource[];
  
  careerPaths: {
    title: string;
    description: string;
    matchScore: number;
    avgSalaryRange: string;
    growthDemand: string;
  }[];
  
  // Legacy compatibility fields
  learningRoadmap?: MonthlyPlanStep[];
  requiredSkills?: string[];
  portfolioImprovements?: string[];
  generatedAt: string;
}

export type TargetRoleType = 
  | 'Software Engineer' 
  | 'ML Engineer' 
  | 'Data Scientist' 
  | 'Backend' 
  | 'Frontend' 
  | 'DevOps' 
  | 'Product Manager';

export interface TechnicalSkillCategory {
  category: string;
  skills: string[];
}

export interface ExperienceItem {
  id?: string;
  title: string;
  company: string;
  location: string;
  dates: string;
  bulletPoints: string[];
}

export interface ProjectItem {
  id?: string;
  title: string;
  techStack: string[];
  link?: string;
  bulletPoints: string[];
}

export interface EducationItem {
  id?: string;
  degree: string;
  institution: string;
  year: string;
  gpa?: string;
}

export interface CertificationItem {
  id?: string;
  name: string;
  issuer: string;
  year: string;
}

export type WritingStyleType = 
  | 'Professional & Confident'
  | 'Technical & Direct'
  | 'Persuasive & Storytelling'
  | 'Executive & Strategic'
  | 'Creative & Enthusiastic';

export interface CoverLetterResult {
  candidateName: string;
  targetRole: string;
  companyName: string;
  writingStyle?: WritingStyleType;
  openingParagraph: string;
  bodyParagraphs: string[];
  closingParagraph: string;
  fullMarkdownText: string;
  highlightedKeywords: string[];
  matchAlignmentScore: number;
}

export interface GeneratedResumeData {
  contactInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    portfolio?: string;
  };
  executiveSummary: string;
  technicalSkills: TechnicalSkillCategory[];
  professionalExperience: ExperienceItem[];
  projects: ProjectItem[];
  education: EducationItem[];
  certifications?: CertificationItem[];
  formattedMarkdown?: string;
}

export type InterviewType = 'Behavioral' | 'Technical' | 'Coding' | 'HR' | 'System Design' | 'Domain Specific';

export interface QuestionItem {
  id: number;
  question: string;
  category: InterviewType;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  targetSkill?: string;
  idealKeyPoints?: string[];
}

export interface StarMetricDetail {
  scoreDetail: ScoreDetail;
  breakdown: string;
}

export interface ImprovementStep {
  stepNumber: number;
  title: string;
  action: string;
  expectedOutcome: string;
}

export interface AnswerEvaluation {
  questionId: number;
  questionText: string;
  userAnswer: string;
  category?: InterviewType;
  // Primitive numbers for quick access & backward compatibility
  score: number; // 0-100
  confidenceScore: number; // 0-100
  communicationScore: number; // 0-100
  technicalScore: number; // 0-100
  grammarScore: number; // 0-100
  
  // Explainable ScoreDetails for every evaluation metric
  overallScoreDetail?: ScoreDetail;
  confidenceDetail?: ScoreDetail;
  grammarDetail?: ScoreDetail;
  communicationDetail?: ScoreDetail;
  technicalDepthDetail?: ScoreDetail;

  // STAR framework breakdown
  star?: {
    overall: ScoreDetail;
    situation: StarMetricDetail;
    task: StarMetricDetail;
    action: StarMetricDetail;
    result: StarMetricDetail;
  };

  // Structured Feedback Items
  strengths: string[];
  weaknesses: string[];
  areasToImprove: string[];
  followUpQuestions: string[];
  improvementPlan: ImprovementStep[];
  
  suggestedBetterAnswer: string;
  audioFeedbackUrl?: string;
  evaluatedAt: string;
}

export interface InterviewSession {
  id: string;
  type: InterviewType;
  targetRole: string;
  jobDescriptionContext?: string;
  questions: QuestionItem[];
  evaluations: Record<number, AnswerEvaluation>;
  overallScore: number;
  overallFeedback: string;
  status: 'In Progress' | 'Completed';
  startedAt: string;
  completedAt?: string;
}

export interface DatasetItem {
  id: string;
  name: string;
  category: 'Resume' | 'Job Description' | 'HR Q&A' | 'Tech Q&A' | 'Behavioral Q&A' | 'O*NET Taxonomy' | 'ESCO Taxonomy';
  recordCount: number;
  lastUpdated: string;
  status: 'Active' | 'Preprocessing' | 'Indexed';
}

export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARNING' | 'ERROR';
  module: string;
  message: string;
  user?: string;
}

export interface RAGSource {
  title: string;
  category: string;
  confidence: number;
  snippet: string;
}

export interface CollegeDocSection {
  id: string;
  num: number;
  title: string;
  content: string;
  subpoints?: string[];
  diagramCode?: string;
}

export interface MemoryResumeRecord {
  id: string;
  title: string;
  uploadDate: string;
  topSkills: string[];
  summary: string;
  atsScoreSnapshot: number;
  targetRole?: string;
}

export interface MemoryInterviewRecord {
  id: string;
  date: string;
  role: string;
  totalQuestions: number;
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  topSTARFeedback?: string;
}

export interface MemoryFeedbackRecord {
  id: string;
  date: string;
  category: 'resume' | 'interview' | 'cover-letter' | 'career';
  title: string;
  summary: string;
  actionItems: string[];
}

export interface AIMemoryProfile {
  userId: string;
  lastUpdated: string;
  pastResumes: MemoryResumeRecord[];
  careerGoals: {
    id: string;
    primaryTargetRole: string;
    targetSalary?: string;
    targetTimelineWeeks: number;
    preferredIndustries?: string[];
    keySkillsToDevelop: string[];
    updatedAt: string;
  };
  interviewHistory: MemoryInterviewRecord[];
  previousFeedback: MemoryFeedbackRecord[];
  learningProgress: {
    completedWeekNumbers: number[];
    masteredSkills: string[];
    completedProjects: string[];
    overallProgressPct: number;
    lastActiveDate: string;
  };
}
