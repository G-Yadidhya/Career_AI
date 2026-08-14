import { DatasetItem, QuestionItem, RAGSource, SystemLog } from '../types';

export const RAG_KNOWLEDGE_DOCUMENTS: RAGSource[] = [
  {
    title: "O*NET OnLine Competency Model (2026)",
    category: "O*NET Taxonomy",
    confidence: 0.98,
    snippet: "Technical competencies for AI Engineers and Full Stack Software Developers require proficiency in Python 3.12+, TypeScript, RESTful/GraphQL API design, Docker containerization, Vector Databases (ChromaDB, Pinecone), PyTorch/TensorFlow, and Cloud Deployment (GCP/AWS)."
  },
  {
    title: "ESCO European Skills Classification Matrix v1.2",
    category: "ESCO Taxonomy",
    confidence: 0.96,
    snippet: "Core industry capabilities for modern tech roles: Software Architecture, Clean Code/SOLID Principles, CI/CD Pipeline Configuration, Unit/Integration Testing, Agile Methods, and System Security Hardening."
  },
  {
    title: "Harvard & MIT Resume & ATS Compatibility Guidelines",
    category: "ATS Standards",
    confidence: 0.99,
    snippet: "Optimal ATS formatting requires standard 1-inch margins, clear section headers (Summary, Education, Work Experience, Technical Skills, Projects), action verbs starting each bullet point (e.g., Spearheaded, Architected, Optimized), quantified results (e.g. 'boosted efficiency by 35%'), and strict avoidance of multi-column tables or header graphics."
  },
  {
    title: "FAANG & Tech Enterprise Interview Benchmarks",
    category: "Tech Q&A",
    confidence: 0.95,
    snippet: "Technical assessment benchmarks: Systems design (scalability, microservices, database choice), algorithmic optimization (Time/Space Complexity Big-O), state management, error boundaries, and defensive security measures (JWT, CORS, SQL/Prompt Injection defense)."
  },
  {
    title: "STAR Method Behavioral Framework Standard",
    category: "Behavioral Q&A",
    confidence: 0.97,
    snippet: "Structure behavioral responses using Situation, Task, Action, and Result (STAR). Emphasize team leadership, conflict resolution, ownership under deadline pressure, and measurable quantitative outcomes."
  }
];

export const INITIAL_DATASETS: DatasetItem[] = [
  { id: "ds-1", name: "O*NET 2026 Technical Skills Standard", category: "O*NET Taxonomy", recordCount: 14250, lastUpdated: "2026-07-15", status: "Indexed" },
  { id: "ds-2", name: "ESCO European Skills & Qualifications", category: "ESCO Taxonomy", recordCount: 18900, lastUpdated: "2026-07-20", status: "Indexed" },
  { id: "ds-3", name: "FAANG & Fortune 500 ATS Resume Corpus", category: "Resume", recordCount: 5200, lastUpdated: "2026-08-01", status: "Indexed" },
  { id: "ds-4", name: "Global Tech Job Descriptions (2026)", category: "Job Description", recordCount: 8400, lastUpdated: "2026-08-02", status: "Indexed" },
  { id: "ds-5", name: "HR Behavioral Question Bank with STAR Metrics", category: "HR Q&A", recordCount: 3100, lastUpdated: "2026-07-10", status: "Indexed" },
  { id: "ds-6", name: "Software & AI Engineering Technical Question Bank", category: "Tech Q&A", recordCount: 6500, lastUpdated: "2026-08-04", status: "Indexed" }
];

export const MOCK_INTERVIEW_BANK: QuestionItem[] = [
  {
    id: 1,
    question: "Walk me through your background. How have your past projects prepared you for a role as a Full Stack / AI Engineer?",
    category: "HR",
    difficulty: "Easy",
    targetSkill: "Self Introduction & Alignment",
    idealKeyPoints: ["Brief overview of degree/background", "Key technical stack highlights", "Passion for building scalable solutions", "Alignment with company goals"]
  },
  {
    id: 2,
    question: "Where do you see yourself professionally in 3 to 5 years, and why is our organization the right next step for your career growth?",
    category: "HR",
    difficulty: "Easy",
    targetSkill: "Career Vision & Organizational Culture Fit",
    idealKeyPoints: ["Clear career milestone targets", "Commitment to technical mastery & leadership", "Demonstrated research into company products"]
  },
  {
    id: 3,
    question: "Describe a situation where you had to debug a critical production issue under high pressure or tight deadline. What steps did you take?",
    category: "Behavioral",
    difficulty: "Medium",
    targetSkill: "Problem Solving under Pressure",
    idealKeyPoints: ["Situation & root cause analysis", "Systematic isolation of error", "Immediate patch & long-term regression fix", "Communication with team"]
  },
  {
    id: 4,
    question: "What is your process when receiving conflicting requirements or feedback from multiple senior stakeholders?",
    category: "Behavioral",
    difficulty: "Medium",
    targetSkill: "Stakeholder Management",
    idealKeyPoints: ["Data-driven decision framework", "Clarity through prototyping", "Prioritization via impact vs effort matrix", "Transparent sync meetings"]
  },
  {
    id: 5,
    question: "How do you handle API security, token expiration, and state hydration in modern React single-page applications?",
    category: "Technical",
    difficulty: "Medium",
    targetSkill: "Security & State Management",
    idealKeyPoints: ["JWT stored securely (HttpOnly cookie or in-memory)", "Axios interceptors for token refresh", "Server-side proxy routes to hide API keys", "Optimistic UI state updates"]
  },
  {
    id: 6,
    question: "How do you optimize React component rendering performance when displaying large data tables or charts?",
    category: "Technical",
    difficulty: "Medium",
    targetSkill: "Frontend Optimization",
    idealKeyPoints: ["React.memo & useMemo / useCallback hooks", "Virtualization (react-window / react-virtualized)", "Debounced input handlers", "Lazy loading component chunks"]
  },
  {
    id: 7,
    question: "Given an array of integers, how would you implement a function to find two numbers that sum up to a target value in O(n) time complexity? Explain your code logic and space/time tradeoffs.",
    category: "Coding",
    difficulty: "Medium",
    targetSkill: "Data Structures & Hash Maps",
    idealKeyPoints: ["Hash map lookup for target difference", "Single pass O(n) time complexity", "O(n) auxiliary space complexity", "Edge cases: duplicate values, negative numbers, empty arrays"]
  },
  {
    id: 8,
    question: "Write an efficient algorithm to invert a binary tree and explain how depth-first traversal works recursively versus iteratively using a queue.",
    category: "Coding",
    difficulty: "Medium",
    targetSkill: "Trees & Recursive Algorithms",
    idealKeyPoints: ["Base case checking null nodes", "Swapping left and right child pointers", "Recursive DFS vs Iterative BFS Queue approach", "Time complexity O(n) and call stack memory usage"]
  },
  {
    id: 9,
    question: "Design a high-throughput real-time notification system capable of handling 10 million daily active users. Detail your load balancing, message queue, web socket gateways, and database strategy.",
    category: "System Design",
    difficulty: "Hard",
    targetSkill: "Distributed Architecture & Scalability",
    idealKeyPoints: ["Stateless WebSocket gateway servers with Redis Pub/Sub", "Kafka / RabbitMQ message queues for async ingestion", "Database sharding & caching strategy", "Rate limiting and fallback offline push notifications"]
  },
  {
    id: 10,
    question: "How would you design a distributed URL Shortener service (like bit.ly)? Discuss hash key generation, database storage choice, caching layer, and handling heavy read vs write traffic ratios.",
    category: "System Design",
    difficulty: "Hard",
    targetSkill: "System Design & Storage Optimization",
    idealKeyPoints: ["Base62 encoding of auto-increment IDs vs MD5 hashing", "Cache eviction policies (LRU) for 80/20 read/write traffic", "NoSQL / Distributed Key-Value store (Cassandra / DynamoDB)", "Database index strategies and CDN redirect routing"]
  },
  {
    id: 11,
    question: "Explain the architecture of Retrieval Augmented Generation (RAG). How do vector databases, embeddings, and context window truncation prevent model hallucinations?",
    category: "Domain Specific",
    difficulty: "Hard",
    targetSkill: "RAG Architecture & GenAI",
    idealKeyPoints: ["Text chunking & tokenization", "Dense vector embeddings (e.g. Sentence Transformers)", "Nearest-neighbor similarity search (Cosine/Euclidean)", "Context injection into system prompt", "Strict fallback for low-similarity matches"]
  }
];

export const INITIAL_SYSTEM_LOGS: SystemLog[] = [
  { id: "log-101", timestamp: new Date(Date.now() - 300000).toISOString(), level: "INFO", module: "RAG Engine", message: "Successfully generated 384-dim embeddings for O*NET dataset. Index size: 14,250 docs.", user: "System" },
  { id: "log-102", timestamp: new Date(Date.now() - 600000).toISOString(), level: "INFO", module: "Resume Parser", message: "Parsed PDF document. Extracted 14 skills, 3 projects, 2 experience nodes.", user: "alex.johnson@example.com" },
  { id: "log-103", timestamp: new Date(Date.now() - 1200000).toISOString(), level: "INFO", module: "Interview Coach", message: "Evaluated Technical session #sess-882. Score: 88/100.", user: "alex.johnson@example.com" },
  { id: "log-104", timestamp: new Date(Date.now() - 1800000).toISOString(), level: "WARNING", module: "Auth Service", message: "Rate limit soft check triggered for IP 127.0.0.1 (5 requests / min).", user: "Anonymous" }
];
