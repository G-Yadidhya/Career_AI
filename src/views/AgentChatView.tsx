import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Trash2,
  User,
  Bot,
  Cpu,
  Sparkles,
  Terminal,
  CheckCircle,
  FileText,
  Briefcase,
  MessageSquare,
  HelpCircle,
  CornerDownLeft,
  X,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  calls?: Array<{
    name: string;
    args: any;
    result?: any;
  }>;
  timestamp: string;
}

export const AgentChatView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [showConfig, setShowConfig] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Load chat history and config on mount
  useEffect(() => {
    const savedChat = localStorage.getItem('agent_chat_history');
    if (savedChat) {
      try {
        setMessages(JSON.parse(savedChat));
      } catch (e) {
        console.error('Failed to parse chat history', e);
      }
    } else {
      // Add a helpful intro greeting
      setMessages([
        {
          role: 'model',
          content: "Welcome to the AI Agent Orchestration Center. I am your multi-agent routing model. I can dynamically coordinate and invoke specialized sub-agents (Resume Analyst, ATS Optimizer, Job Matcher, Career Roadmapper, and Interview Coach) and query our semantic Knowledge Base to answer your career queries.\n\nType a prompt below or click one of the suggested requests to see real-time tool calling in action!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    }

    const savedResume = localStorage.getItem('agent_chat_resume');
    if (savedResume) setResumeText(savedResume);

    const savedJD = localStorage.getItem('agent_chat_jd');
    if (savedJD) setJobDescription(savedJD);
  }, []);

  // Save chat and config on updates
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('agent_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('agent_chat_resume', resumeText);
  }, [resumeText]);

  useEffect(() => {
    localStorage.setItem('agent_chat_jd', jobDescription);
  }, [jobDescription]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const handleSend = async (customText?: string) => {
    const textToSend = (customText || input).trim();
    if (!textToSend || isSending) return;

    if (!customText) {
      setInput('');
    }
    setError(null);

    const userMsg: ChatMessage = {
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsSending(true);

    try {
      // Format history matching ChatMessage schema of the SDK: role must be 'user' | 'model'
      const historyPayload = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await api.agentChat(textToSend, historyPayload, resumeText, jobDescription);

      const botMsg: ChatMessage = {
        role: 'model',
        content: response.reply || 'I processed your request but had no written response.',
        calls: response.calls || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      setError(err?.message || 'Failed to communicate with the Agent Orchestrator. The model quota may be exceeded.');
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  const handleClearChat = () => {
    setShowClearModal(true);
  };

  const confirmClearChat = () => {
    const intro: ChatMessage = {
      role: 'model',
      content: "Welcome to the AI Agent Orchestration Center. I am your multi-agent routing model. I can dynamically coordinate and invoke specialized sub-agents (Resume Analyst, ATS Optimizer, Job Matcher, Career Roadmapper, and Interview Coach) and query our semantic Knowledge Base to answer your career queries.\n\nType a prompt below or click one of the suggested requests to see real-time tool calling in action!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([intro]);
    localStorage.setItem('agent_chat_history', JSON.stringify([intro]));
    setShowClearModal(false);
    showToast('Conversation history cleared');
  };

  const handleDeleteMessage = (indexToDelete: number) => {
    setMessages((prev) => {
      const updated = prev.filter((_, idx) => idx !== indexToDelete);
      const toStore = updated.length > 0 ? updated : [
        {
          role: 'model',
          content: "Welcome to the AI Agent Orchestration Center. I am your multi-agent routing model. Ready to coordinate specialized sub-agents for you.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        } as ChatMessage
      ];
      localStorage.setItem('agent_chat_history', JSON.stringify(toStore));
      return toStore;
    });
    showToast('Message removed');
  };

  const suggestions = [
    {
      title: 'Analyze Resume Structure',
      text: 'Analyze my current resume text and identify high-impact strengths and ATS compliance issues.',
    },
    {
      title: 'Job Match Comparison',
      text: 'Perform a detailed skill gap analysis between my resume and target job requirements.',
    },
    {
      title: 'STAR Interview Help',
      text: 'Help me draft a compelling STAR interview response for building a complex analytics database.',
    },
    {
      title: 'Knowledge Base Search',
      text: 'Search the semantic knowledge base for guidelines on passing a full-stack technical interview.',
    }
  ];

  return (
    <div id="agent-orchestrator-root" className="h-full flex flex-col space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 pb-5">
        <div className="space-y-1">
          <span className="px-3.5 py-1 text-[10px] font-bold uppercase tracking-widest bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full inline-flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 animate-pulse" /> Advanced Multi-Agent Routing
          </span>
          <h1 className="text-3xl font-light italic tracking-tight text-white flex items-center gap-2">
            AI Tool Orchestrator
          </h1>
          <p className="text-sm text-zinc-400">
            Chat with the coordinator model. Watch it call sub-agents and access the Knowledge Base in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowConfig(!showConfig)}
            className={`px-4 py-2 border rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              showConfig 
                ? 'bg-indigo-600 text-white border-indigo-500' 
                : 'bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10'
            }`}
          >
            Configure Context Inputs
          </button>
          <button
            onClick={handleClearChat}
            className="p-2 border border-white/10 hover:border-red-500/30 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 rounded-full transition-all"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Config Panel */}
      {showConfig && (
        <div className="bg-white/5 border border-white/10 rounded-3xl p-5 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" /> Active Orchestration Context
            </h3>
            <button onClick={() => setShowConfig(false)} className="text-zinc-500 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-zinc-400">
            Providing your resume or target job description allows the router to automatically supply them to sub-agents when they invoke tool calls.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-400" /> Current Resume Text
              </label>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste raw resume text here..."
                className="w-full h-32 bg-black/40 border border-white/10 rounded-2xl p-3 text-xs text-zinc-300 focus:outline-none focus:border-indigo-500/50 resize-none font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-emerald-400" /> Target Job Description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste job description requirements here..."
                className="w-full h-32 bg-black/40 border border-white/10 rounded-2xl p-3 text-xs text-zinc-300 focus:outline-none focus:border-indigo-500/50 resize-none font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* Chat Messages Log */}
      <div className="flex-1 bg-black/30 border border-white/10 rounded-3xl flex flex-col overflow-hidden min-h-[450px]">
        {/* Messages list */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-4 max-w-4xl ${
                msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
              }`}
            >
              {/* Avatar icon */}
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 border ${
                  msg.role === 'user'
                    ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-400'
                    : 'bg-white/5 border-white/10 text-zinc-400'
                }`}
              >
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message text bubble */}
              <div className="space-y-2 max-w-full group relative">
                <div
                  className={`rounded-3xl px-4 py-3 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg'
                      : 'bg-white/5 border border-white/5 text-zinc-200 rounded-tl-none'
                  }`}
                >
                  {msg.content}
                </div>

                {/* Individual message delete action */}
                <button
                  onClick={() => handleDeleteMessage(index)}
                  className={`absolute top-2 ${
                    msg.role === 'user' ? '-left-8' : '-right-8'
                  } opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 border border-red-500/20 transition-all`}
                  title="Delete this message"
                  aria-label="Delete message"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                {/* Real-time Tool Calls executed in this step */}
                {msg.calls && msg.calls.length > 0 && (
                  <div className="bg-black/40 border border-white/10 rounded-2xl p-3.5 space-y-2">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                      <Terminal className="w-3.5 h-3.5" /> Activated Tool Integrations ({msg.calls.length})
                    </div>
                    <div className="space-y-2">
                      {msg.calls.map((call, cIdx) => (
                        <div key={cIdx} className="border-l border-indigo-500/30 pl-3 py-1 space-y-1">
                          <div className="flex items-center gap-1.5">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="font-mono text-[11px] font-bold text-white">
                              {call.name}()
                            </span>
                          </div>
                          {call.args && Object.keys(call.args).length > 0 && (
                            <pre className="text-[10px] text-zinc-500 font-mono bg-black/60 p-2 rounded-lg overflow-x-auto max-w-full">
                              {JSON.stringify(call.args, null, 2)}
                            </pre>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <span className="text-[10px] text-zinc-600 block px-1">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {/* Thinking / Loading indicator */}
          {isSending && (
            <div className="flex gap-4">
              <div className="w-9 h-9 rounded-2xl bg-white/5 border border-white/10 text-indigo-400 flex items-center justify-center shrink-0">
                <Cpu className="w-4 h-4 animate-spin" />
              </div>
              <div className="space-y-1">
                <div className="bg-white/5 border border-white/5 rounded-3xl rounded-tl-none px-4 py-3 text-xs text-zinc-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                  <span>Agent orchestrator is executing reasoning loop...</span>
                </div>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <p className="font-bold text-white">System Communication Failure</p>
                <p className="text-zinc-400">{error}</p>
                <button 
                  onClick={() => handleSend()}
                  className="px-3 py-1 bg-red-500/20 text-red-300 font-medium hover:bg-red-500/30 transition-all rounded-md mt-1"
                >
                  Retry Request
                </button>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested prompts (only show when no message or small chat) */}
        {messages.length <= 1 && (
          <div className="p-4 sm:p-6 border-t border-white/10 bg-black/10">
            <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5" /> Suggested Agent Instructions
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {suggestions.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(sug.text)}
                  className="p-3 text-left bg-white/5 border border-white/10 hover:bg-white/10 hover:border-indigo-500/30 rounded-2xl transition-all group"
                >
                  <p className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">
                    {sug.title}
                  </p>
                  <p className="text-[10px] text-zinc-500 line-clamp-1">
                    {sug.text}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Form */}
        <div className="p-4 border-t border-white/10 bg-black/40">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="relative flex items-center bg-[#0d0d0d] border border-white/10 focus-within:border-indigo-500/50 rounded-2xl px-4 py-2.5 transition-all"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the coordinator model anything (e.g., 'Compare my resume skills against standard Senior DevOps specifications')..."
              disabled={isSending}
              className="flex-1 bg-transparent border-none text-xs sm:text-sm text-zinc-200 focus:outline-none focus:ring-0 placeholder-zinc-600 pr-10"
            />
            
            <div className="absolute right-3 flex items-center gap-2">
              {input.trim() && (
                <span className="text-[9px] text-zinc-600 bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded font-mono hidden sm:inline-flex items-center gap-1">
                  Enter <CornerDownLeft className="w-2.5 h-2.5" />
                </span>
              )}
              <button
                type="submit"
                disabled={!input.trim() || isSending}
                className={`p-2 rounded-xl transition-all ${
                  input.trim() && !isSending
                    ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                    : 'text-zinc-600 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* In-app Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-zinc-900 border border-white/10 text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-medium animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Confirmation Modal for Clearing Entire Chat */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-white/15 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-2xl">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Clear Conversation History?</h3>
            </div>
            
            <p className="text-xs text-zinc-400 leading-relaxed">
              This will remove all user prompts, reasoning cycles, and tool execution logs from this chat session and reset to the initial coordinator prompt.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowClearModal(false)}
                className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmClearChat}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded-xl transition-all shadow-lg shadow-red-600/30 flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
