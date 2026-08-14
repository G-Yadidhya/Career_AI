import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Sparkles,
  Volume2,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Send,
  Award,
  BookOpen,
  ArrowRight,
  TrendingUp,
  VolumeX,
  RefreshCw,
  Layers,
  Wand2,
  Code2,
  Cpu,
  BrainCircuit,
  MessageSquare,
  HelpCircle,
  Target,
  FileCheck,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import { api } from '../services/api';
import { MOCK_INTERVIEW_BANK } from '../data/knowledgeBase';
import { AnswerEvaluation, InterviewSession, InterviewType, QuestionItem, ResumeAnalysis } from '../types';

interface InterviewCoachViewProps {
  currentResume: ResumeAnalysis | null;
  onAddSession: (session: InterviewSession) => void;
}

export const InterviewCoachView: React.FC<InterviewCoachViewProps> = ({
  currentResume,
  onAddSession,
}) => {
  const [selectedType, setSelectedType] = useState<InterviewType>('Behavioral');
  const [targetRole, setTargetRole] = useState(
    currentResume?.parsedResume?.candidateName ? 'AI & Full Stack Engineer' : 'Software Engineer'
  );
  const [activeSession, setActiveSession] = useState<InterviewSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswerText, setUserAnswerText] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Stop active audio whenever audioBase64 changes
  useEffect(() => {
    stopTTSAudio();
  }, [audioBase64]);

  // Cleanup audio context and source on unmount
  useEffect(() => {
    return () => {
      if (audioSourceRef.current) {
        try {
          audioSourceRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
      if (audioContextRef.current) {
        try {
          audioContextRef.current.close();
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  const stopTTSAudio = () => {
    try {
      if (audioSourceRef.current) {
        audioSourceRef.current.stop();
        audioSourceRef.current = null;
      }
    } catch (e) {
      console.error('Error stopping audio source:', e);
    }
    setIsPlayingAudio(false);
  };

  const categories: { type: InterviewType; label: string; icon: any; description: string }[] = [
    { type: 'Behavioral', label: 'Behavioral', icon: MessageSquare, description: 'STAR method, leadership, stakeholder conflict, & pressure handling' },
    { type: 'Technical', label: 'Technical', icon: Cpu, description: 'Core web stack, security, frameworks, DBs, & performance optimization' },
    { type: 'Coding', label: 'Coding', icon: Code2, description: 'Algorithms, data structures, complexity trade-offs, & clean code' },
    { type: 'HR', label: 'HR / Culture', icon: Sparkles, description: 'Background walk-through, career vision, & organizational fit' },
    { type: 'System Design', label: 'System Design', icon: BrainCircuit, description: 'Distributed systems, high availability, caching, & scalability' },
  ];

  // Start new interview session
  const handleStartSession = () => {
    const filteredQuestions = MOCK_INTERVIEW_BANK.filter(
      (q) => q.category === selectedType
    );

    const questionsToUse = filteredQuestions.length > 0 ? filteredQuestions : MOCK_INTERVIEW_BANK;

    const newSession: InterviewSession = {
      id: `sess-${Date.now()}`,
      type: selectedType,
      targetRole,
      jobDescriptionContext: 'Target position requires deep domain mastery, STAR problem solving, and system design clarity.',
      questions: questionsToUse,
      evaluations: {},
      overallScore: 0,
      overallFeedback: '',
      status: 'In Progress',
      startedAt: new Date().toISOString(),
    };

    setActiveSession(newSession);
    setCurrentQuestionIndex(0);
    setUserAnswerText('');
    setAudioBase64(null);
  };

  const handleEvaluateAnswer = async () => {
    if (!activeSession || !userAnswerText.trim()) return;
    const currentQ = activeSession.questions[currentQuestionIndex];
    setIsEvaluating(true);

    try {
      const evalResult: AnswerEvaluation = await api.evaluateInterviewAnswer({
        questionId: currentQ.id,
        questionText: currentQ.question,
        userAnswer: userAnswerText,
        category: selectedType,
        targetRole,
      });

      // Synthesize TTS audio for model response
      if (evalResult.suggestedBetterAnswer) {
        try {
          const ttsResult = await api.synthesizeSpeech(
            evalResult.suggestedBetterAnswer.slice(0, 1200),
            'Zephyr'
          );
          if (ttsResult.audioBase64) {
            evalResult.audioFeedbackUrl = ttsResult.audioBase64;
            setAudioBase64(ttsResult.audioBase64);
          }
        } catch (ttsErr) {
          console.warn('TTS Synthesis skipped:', ttsErr);
        }
      }

      // Update Session
      const updatedEvaluations = {
        ...activeSession.evaluations,
        [currentQ.id]: evalResult,
      };

      const evalValues: AnswerEvaluation[] = Object.values(updatedEvaluations);
      const avgScore = Math.round(
        evalValues.reduce((acc: number, curr: AnswerEvaluation) => acc + curr.score, 0) / evalValues.length
      );

      const isLast = currentQuestionIndex >= activeSession.questions.length - 1;

      const updatedSession: InterviewSession = {
        ...activeSession,
        evaluations: updatedEvaluations,
        overallScore: avgScore,
        status: isLast ? 'Completed' : 'In Progress',
        completedAt: isLast ? new Date().toISOString() : undefined,
      };

      setActiveSession(updatedSession);
      onAddSession(updatedSession);
    } catch (err) {
      console.error('Failed to evaluate answer:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const playTTSAudio = () => {
    if (!audioBase64) return;
    
    // Stop any existing playback first to prevent overlapping sound
    stopTTSAudio();

    try {
      setIsPlayingAudio(true);
      
      // Initialize or reuse AudioContext
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      
      const audioCtx = audioContextRef.current;
      
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const binary = atob(audioBase64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      
      const float32Array = new Float32Array(bytes.length / 2);
      const dataView = new DataView(bytes.buffer);
      for (let i = 0; i < float32Array.length; i++) {
        float32Array[i] = dataView.getInt16(i * 2, true) / 32768;
      }

      const buffer = audioCtx.createBuffer(1, float32Array.length, 24000);
      buffer.getChannelData(0).set(float32Array);
      
      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtx.destination);
      
      source.onended = () => {
        if (audioSourceRef.current === source) {
          setIsPlayingAudio(false);
          audioSourceRef.current = null;
        }
      };
      
      audioSourceRef.current = source;
      source.start();
    } catch (e) {
      console.error('Audio playback error:', e);
      setIsPlayingAudio(false);
      audioSourceRef.current = null;
    }
  };

  const handleNextQuestion = () => {
    if (!activeSession) return;
    if (currentQuestionIndex < activeSession.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setUserAnswerText('');
      setAudioBase64(null);
    }
  };

  const currentQ = activeSession?.questions[currentQuestionIndex];
  const currentEval = activeSession && currentQ ? activeSession.evaluations[currentQ.id] : null;

  return (
    <div className="space-y-8 animate-fade-in text-white">
      
      {/* Module Title Banner */}
      <div className="bg-white/5 border border-white/10 p-8 rounded-3xl shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-widest mb-3 border border-indigo-500/30">
          <Mic className="w-3.5 h-3.5" /> Module 5 • Explainable AI Interview Coach
        </div>
        <h1 className="text-3xl font-light italic tracking-tight text-white">
          Interactive Mock Interview & <strong className="font-bold not-italic">STAR Coach</strong>
        </h1>
        <p className="text-xs text-zinc-400 mt-2 max-w-2xl leading-relaxed">
          Simulate real Behavioral, Technical, Coding, HR, and System Design interviews. Evaluates STAR alignment, Confidence, Grammar, Communication, and Technical depth with fully explainable score justifications.
        </p>
      </div>

      {/* Session Setup View */}
      {!activeSession ? (
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" /> Select Interview Category & Target Role
            </h3>
            <span className="text-[10px] px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full font-mono border border-indigo-500/30">
              5 Supported Domains
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {categories.map((cat) => {
              const IconComp = cat.icon;
              const isSelected = selectedType === cat.type;
              return (
                <button
                  key={cat.type}
                  onClick={() => setSelectedType(cat.type)}
                  className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? 'bg-indigo-500/20 border-indigo-500/50 text-white shadow-lg shadow-indigo-500/10'
                      : 'bg-black/40 border-white/10 text-zinc-400 hover:border-white/20 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <IconComp className={`w-5 h-5 ${isSelected ? 'text-indigo-400' : 'text-zinc-500'}`} />
                    {isSelected && <span className="w-2 h-2 rounded-full bg-indigo-400" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider block text-white">{cat.label}</span>
                    <p className="text-[10px] text-zinc-400 mt-1 leading-snug line-clamp-2">{cat.description}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Target Position / Role</label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Senior AI & Full Stack Engineer"
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <button
            onClick={handleStartSession}
            className="w-full py-4 px-6 rounded-full bg-white text-black hover:bg-zinc-200 font-bold text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Launch Mock Interview Session ({selectedType})</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Active Session Header */}
          <div className="bg-white/5 border border-white/10 p-5 rounded-3xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-indigo-300 bg-indigo-500/20 px-3.5 py-1 rounded-full border border-indigo-500/30 font-mono">
                Question {currentQuestionIndex + 1} of {activeSession.questions.length}
              </span>
              <span className="text-xs text-white font-bold tracking-wide">{activeSession.type} Mock Interview Session</span>
            </div>

            <button
              onClick={() => setActiveSession(null)}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Change Category
            </button>
          </div>

          {/* Active Question Box */}
          <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-6">
            
            <div className="p-6 bg-black/40 rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                <span className="text-indigo-400 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" /> {currentQ?.category} Question
                </span>
                <span className="font-mono">Difficulty: <strong className="text-white">{currentQ?.difficulty}</strong></span>
              </div>
              
              <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
                "{currentQ?.question}"
              </h2>

              {currentQ?.targetSkill && (
                <div className="pt-1 flex items-center gap-2 text-xs text-zinc-400 font-mono">
                  <span>Target Competency:</span>
                  <span className="text-indigo-300 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                    {currentQ.targetSkill}
                  </span>
                </div>
              )}
            </div>

            {/* Answer Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Your Answer (Use STAR Format: Situation, Task, Action, Result)
                </label>
                <span className="text-[10px] text-zinc-500 font-mono">{userAnswerText.length} chars</span>
              </div>

              <textarea
                rows={7}
                value={userAnswerText}
                onChange={(e) => setUserAnswerText(e.target.value)}
                placeholder="Type or paste your interview response here. Describe the Situation, Task, Action you personally took, and quantitative Result achieved..."
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 leading-relaxed font-sans"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleEvaluateAnswer}
                disabled={isEvaluating || !userAnswerText.trim()}
                className="py-3.5 px-6 rounded-full bg-white text-black hover:bg-zinc-200 disabled:opacity-50 font-bold text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 transition-all"
              >
                {isEvaluating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-black" />
                    <span>Evaluating STAR & 5 Dimensions...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Evaluate Response with AI</span>
                  </>
                )}
              </button>

              {currentQuestionIndex < activeSession.questions.length - 1 && (
                <button
                  onClick={handleNextQuestion}
                  className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider border border-white/10 flex items-center gap-2 transition-all"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>

          {/* Answer Evaluation Feedback Panels */}
          {currentEval && (
            <div className="space-y-8">
              
              {/* Section 1: 5 Score Dimension Cards with Explainability */}
              <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2">
                      <Award className="w-4 h-4 text-indigo-400" /> Multi-Dimensional Answer Scores
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Every dimension includes AI score justification, confidence rating, and target recommendation.
                    </p>
                  </div>
                  <span className="text-[10px] px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full font-mono border border-indigo-500/30">
                    FAANG Benchmarked
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  
                  {/* Overall Score */}
                  <div className="bg-black/40 border border-white/10 p-4 rounded-2xl flex flex-col justify-between space-y-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Overall Score</span>
                      <div className="text-3xl font-black text-indigo-400 mt-1">{currentEval.overallScoreDetail?.score || currentEval.score} <span className="text-xs text-zinc-500 font-normal">/ 100</span></div>
                      <p className="text-[11px] text-zinc-300 mt-2 leading-relaxed">
                        {currentEval.overallScoreDetail?.reason || 'Overall composite response evaluation.'}
                      </p>
                      {currentEval.overallScoreDetail?.evidence && (
                        <p className="text-[10px] text-zinc-400 mt-1.5 leading-relaxed italic border-l border-indigo-500/30 pl-2">
                          <strong className="text-zinc-300 font-medium not-italic">Evidence:</strong> "{currentEval.overallScoreDetail.evidence}"
                        </p>
                      )}
                    </div>
                    <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-[10px] text-indigo-200">
                      <strong className="text-indigo-300 font-bold block uppercase mb-0.5">Tip:</strong>
                      {currentEval.overallScoreDetail?.recommendation || 'Incorporate explicit metrics.'}
                    </div>
                  </div>

                  {/* Confidence */}
                  <div className="bg-black/40 border border-white/10 p-4 rounded-2xl flex flex-col justify-between space-y-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Confidence</span>
                      <div className="text-3xl font-black text-purple-400 mt-1">{currentEval.confidenceDetail?.score || currentEval.confidenceScore} <span className="text-xs text-zinc-500 font-normal">/ 100</span></div>
                      <p className="text-[11px] text-zinc-300 mt-2 leading-relaxed">
                        {currentEval.confidenceDetail?.reason || 'Tone and delivery assertiveness.'}
                      </p>
                      {currentEval.confidenceDetail?.evidence && (
                        <p className="text-[10px] text-zinc-400 mt-1.5 leading-relaxed italic border-l border-purple-500/30 pl-2">
                          <strong className="text-zinc-300 font-medium not-italic">Evidence:</strong> "{currentEval.confidenceDetail.evidence}"
                        </p>
                      )}
                    </div>
                    <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 rounded-xl text-[10px] text-purple-200">
                      <strong className="text-purple-300 font-bold block uppercase mb-0.5">Tip:</strong>
                      {currentEval.confidenceDetail?.recommendation || 'Eliminate filler phrasing.'}
                    </div>
                  </div>

                  {/* Grammar */}
                  <div className="bg-black/40 border border-white/10 p-4 rounded-2xl flex flex-col justify-between space-y-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Grammar</span>
                      <div className="text-3xl font-black text-amber-400 mt-1">{currentEval.grammarDetail?.score || currentEval.grammarScore} <span className="text-xs text-zinc-500 font-normal">/ 100</span></div>
                      <p className="text-[11px] text-zinc-300 mt-2 leading-relaxed">
                        {currentEval.grammarDetail?.reason || 'Grammatical structure and clarity.'}
                      </p>
                      {currentEval.grammarDetail?.evidence && (
                        <p className="text-[10px] text-zinc-400 mt-1.5 leading-relaxed italic border-l border-amber-500/30 pl-2">
                          <strong className="text-zinc-300 font-medium not-italic">Evidence:</strong> "{currentEval.grammarDetail.evidence}"
                        </p>
                      )}
                    </div>
                    <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[10px] text-amber-200">
                      <strong className="text-amber-300 font-bold block uppercase mb-0.5">Tip:</strong>
                      {currentEval.grammarDetail?.recommendation || 'Maintain tense consistency.'}
                    </div>
                  </div>

                  {/* Communication */}
                  <div className="bg-black/40 border border-white/10 p-4 rounded-2xl flex flex-col justify-between space-y-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Communication</span>
                      <div className="text-3xl font-black text-emerald-400 mt-1">{currentEval.communicationDetail?.score || currentEval.communicationScore} <span className="text-xs text-zinc-500 font-normal">/ 100</span></div>
                      <p className="text-[11px] text-zinc-300 mt-2 leading-relaxed">
                        {currentEval.communicationDetail?.reason || 'Logical flow and articulation.'}
                      </p>
                      {currentEval.communicationDetail?.evidence && (
                        <p className="text-[10px] text-zinc-400 mt-1.5 leading-relaxed italic border-l border-emerald-500/30 pl-2">
                          <strong className="text-zinc-300 font-medium not-italic">Evidence:</strong> "{currentEval.communicationDetail.evidence}"
                        </p>
                      )}
                    </div>
                    <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[10px] text-emerald-200">
                      <strong className="text-emerald-300 font-bold block uppercase mb-0.5">Tip:</strong>
                      {currentEval.communicationDetail?.recommendation || 'Use explicit transitions.'}
                    </div>
                  </div>

                  {/* Technical Depth */}
                  <div className="bg-black/40 border border-white/10 p-4 rounded-2xl flex flex-col justify-between space-y-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Technical Depth</span>
                      <div className="text-3xl font-black text-cyan-400 mt-1">{currentEval.technicalDepthDetail?.score || currentEval.technicalScore} <span className="text-xs text-zinc-500 font-normal">/ 100</span></div>
                      <p className="text-[11px] text-zinc-300 mt-2 leading-relaxed">
                        {currentEval.technicalDepthDetail?.reason || 'Domain concept mastery.'}
                      </p>
                      {currentEval.technicalDepthDetail?.evidence && (
                        <p className="text-[10px] text-zinc-400 mt-1.5 leading-relaxed italic border-l border-cyan-500/30 pl-2">
                          <strong className="text-zinc-300 font-medium not-italic">Evidence:</strong> "{currentEval.technicalDepthDetail.evidence}"
                        </p>
                      )}
                    </div>
                    <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-[10px] text-cyan-200">
                      <strong className="text-cyan-300 font-bold block uppercase mb-0.5">Tip:</strong>
                      {currentEval.technicalDepthDetail?.recommendation || 'Elaborate on edge cases.'}
                    </div>
                  </div>

                </div>
              </div>

              {/* Section 2: STAR Framework Breakdown Cards */}
              {currentEval.star && (
                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2">
                      <Layers className="w-4 h-4 text-indigo-400" /> STAR Framework Breakdown (Situation, Task, Action, Result)
                    </h3>
                    <span className="text-[10px] px-3 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                      Overall STAR: {currentEval.star.overall?.score || 84}/100
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    {/* Situation */}
                    <div className="p-4 bg-black/40 rounded-2xl border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Situation</span>
                        <span className="text-xs font-mono font-bold text-white">{currentEval.star.situation.scoreDetail.score}%</span>
                      </div>
                      <p className="text-xs text-zinc-300 leading-relaxed">{currentEval.star.situation.breakdown}</p>
                      <div className="text-[10px] text-zinc-400 pt-2 border-t border-white/10 space-y-1">
                        <div><strong className="text-indigo-300 block mb-0.5">Reason:</strong> {currentEval.star.situation.scoreDetail.reason}</div>
                        {currentEval.star.situation.scoreDetail.evidence && (
                          <div className="text-zinc-500 italic"><strong className="text-zinc-400 font-medium not-italic block mb-0.5">Evidence:</strong> "{currentEval.star.situation.scoreDetail.evidence}"</div>
                        )}
                      </div>
                    </div>

                    {/* Task */}
                    <div className="p-4 bg-black/40 rounded-2xl border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Task</span>
                        <span className="text-xs font-mono font-bold text-white">{currentEval.star.task.scoreDetail.score}%</span>
                      </div>
                      <p className="text-xs text-zinc-300 leading-relaxed">{currentEval.star.task.breakdown}</p>
                      <div className="text-[10px] text-zinc-400 pt-2 border-t border-white/10 space-y-1">
                        <div><strong className="text-indigo-300 block mb-0.5">Reason:</strong> {currentEval.star.task.scoreDetail.reason}</div>
                        {currentEval.star.task.scoreDetail.evidence && (
                          <div className="text-zinc-500 italic"><strong className="text-zinc-400 font-medium not-italic block mb-0.5">Evidence:</strong> "{currentEval.star.task.scoreDetail.evidence}"</div>
                        )}
                      </div>
                    </div>

                    {/* Action */}
                    <div className="p-4 bg-black/40 rounded-2xl border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Action</span>
                        <span className="text-xs font-mono font-bold text-white">{currentEval.star.action.scoreDetail.score}%</span>
                      </div>
                      <p className="text-xs text-zinc-300 leading-relaxed">{currentEval.star.action.breakdown}</p>
                      <div className="text-[10px] text-zinc-400 pt-2 border-t border-white/10 space-y-1">
                        <div><strong className="text-indigo-300 block mb-0.5">Reason:</strong> {currentEval.star.action.scoreDetail.reason}</div>
                        {currentEval.star.action.scoreDetail.evidence && (
                          <div className="text-zinc-500 italic"><strong className="text-zinc-400 font-medium not-italic block mb-0.5">Evidence:</strong> "{currentEval.star.action.scoreDetail.evidence}"</div>
                        )}
                      </div>
                    </div>

                    {/* Result */}
                    <div className="p-4 bg-black/40 rounded-2xl border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Result</span>
                        <span className="text-xs font-mono font-bold text-white">{currentEval.star.result.scoreDetail.score}%</span>
                      </div>
                      <p className="text-xs text-zinc-300 leading-relaxed">{currentEval.star.result.breakdown}</p>
                      <div className="text-[10px] text-zinc-400 pt-2 border-t border-white/10 space-y-1">
                        <div><strong className="text-indigo-300 block mb-0.5">Reason:</strong> {currentEval.star.result.scoreDetail.reason}</div>
                        {currentEval.star.result.scoreDetail.evidence && (
                          <div className="text-zinc-500 italic"><strong className="text-zinc-400 font-medium not-italic block mb-0.5">Evidence:</strong> "{currentEval.star.result.scoreDetail.evidence}"</div>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* Section 3: Strengths vs Weaknesses & Follow-Up Questions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Strengths */}
                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-3">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Key Strengths Highlighted
                  </h4>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    {currentEval.strengths.map((str, i) => (
                      <li key={i} className="p-3 bg-black/40 rounded-2xl border border-white/10 flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses */}
                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-3">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" /> Identified Weaknesses & Gaps
                  </h4>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    {(currentEval.weaknesses || currentEval.areasToImprove).map((wk, i) => (
                      <li key={i} className="p-3 bg-black/40 rounded-2xl border border-white/10 flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                        <span>{wk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Section 4: AI Follow-Up Questions & Step-by-Step Improvement Plan */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* AI-Generated Follow-Up Questions */}
                {currentEval.followUpQuestions && currentEval.followUpQuestions.length > 0 && (
                  <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-4">
                    <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-indigo-400" /> AI Interviewer Follow-Up Questions
                    </h3>
                    <div className="space-y-3">
                      {currentEval.followUpQuestions.map((q, idx) => (
                        <div key={idx} className="p-4 bg-black/40 rounded-2xl border border-white/10 space-y-1">
                          <span className="text-[10px] font-bold text-indigo-300 uppercase font-mono">Follow-up #{idx + 1}</span>
                          <p className="text-xs text-white font-medium leading-relaxed">"{q}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step-by-Step Improvement Plan */}
                {currentEval.improvementPlan && currentEval.improvementPlan.length > 0 && (
                  <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-4">
                    <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-emerald-400" /> Actionable Improvement Plan
                    </h3>
                    <div className="space-y-3">
                      {currentEval.improvementPlan.map((step) => (
                        <div key={step.stepNumber} className="p-4 bg-black/40 rounded-2xl border border-white/10 space-y-1">
                          <div className="flex items-center justify-between text-xs font-bold text-white">
                            <span>Step {step.stepNumber}: {step.title}</span>
                          </div>
                          <p className="text-xs text-zinc-300 mt-1 leading-relaxed">{step.action}</p>
                          <div className="text-[10px] text-emerald-300 pt-1 font-mono">
                            Expected Outcome: {step.expectedOutcome}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Section 5: Model Exemplary Answer & TTS Player */}
              <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-widest flex items-center gap-2">
                    <Wand2 className="w-4 h-4 text-indigo-400" /> Model Exemplary STAR Answer
                  </h4>

                  {audioBase64 && (
                    <button
                      onClick={isPlayingAudio ? stopTTSAudio : playTTSAudio}
                      className={`px-4 py-1.5 rounded-full border text-xs font-bold font-mono flex items-center gap-2 transition-colors ${
                        isPlayingAudio 
                          ? 'bg-red-500/20 text-red-300 border-red-500/30 hover:bg-red-500/30' 
                          : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/30'
                      }`}
                    >
                      {isPlayingAudio ? (
                        <>
                          <VolumeX className="w-4 h-4 text-red-400" />
                          <span>Stop Audio Feedback</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-4 h-4 text-indigo-400" />
                          <span>Listen TTS Audio Feedback</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                <div className="p-5 bg-black/40 rounded-2xl border border-white/10 text-xs text-zinc-200 leading-relaxed font-serif italic">
                  "{currentEval.suggestedBetterAnswer}"
                </div>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
};
