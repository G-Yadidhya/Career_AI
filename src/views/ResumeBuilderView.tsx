import React, { useState, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import {
  FileText,
  Sparkles,
  Download,
  Printer,
  Edit3,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Layout,
  RefreshCw,
  Eye,
  Award,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Wand2,
  FileCheck,
  User,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Globe,
  Layers,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Columns,
  Monitor,
  Smartphone,
  Tablet,
  X,
  FileCode,
  FileDown,
  Check,
  Loader2
} from 'lucide-react';
import { api } from '../services/api';
import { ROLE_RESUME_TEMPLATES } from '../data/resumeTemplates';
import {
  CertificationItem,
  EducationItem,
  ExperienceItem,
  GeneratedResumeData,
  ProjectItem,
  TargetRoleType,
  TechnicalSkillCategory
} from '../types';

interface ResumeBuilderViewProps {
  onSaveToAnalysis?: (data: GeneratedResumeData) => void;
}

export const ResumeBuilderView: React.FC<ResumeBuilderViewProps> = ({ onSaveToAnalysis }) => {
  const [selectedRole, setSelectedRole] = useState<TargetRoleType>('Software Engineer');
  const [resumeData, setResumeData] = useState<GeneratedResumeData>(
    ROLE_RESUME_TEMPLATES['Software Engineer']
  );
  const [viewMode, setViewMode] = useState<'split' | 'editor' | 'preview'>('split');
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [layoutPreset, setLayoutPreset] = useState<'harvard' | 'modern' | 'compact'>('harvard');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadFormat, setDownloadFormat] = useState<string>('');
  const [showDownloadDropdown, setShowDownloadDropdown] = useState<boolean>(false);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);
  const [downloadSuccessMsg, setDownloadSuccessMsg] = useState<string>('');
  const [activeEditorSection, setActiveEditorSection] = useState<string>('contact');

  const downloadMenuRef = useRef<HTMLDivElement>(null);

  // Close download dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(event.target as Node)) {
        setShowDownloadDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle escape key to exit full screen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullScreen) {
        setIsFullScreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullScreen]);

  const rolesList: { type: TargetRoleType; label: string; desc: string }[] = [
    { type: 'Software Engineer', label: 'Software Engineer', desc: 'Full Stack, React, Node, Web' },
    { type: 'ML Engineer', label: 'ML Engineer', desc: 'PyTorch, RAG, LLMs, CUDA' },
    { type: 'Data Scientist', label: 'Data Scientist', desc: 'Python, SQL, A/B Testing, ML' },
    { type: 'Backend', label: 'Backend Engineer', desc: 'Go, Node, PostgreSQL, Kafka' },
    { type: 'Frontend', label: 'Frontend Engineer', desc: 'React 19, Next.js, Web Vitals' },
    { type: 'DevOps', label: 'DevOps / SRE', desc: 'K8s, Docker, Terraform, AWS' },
    { type: 'Product Manager', label: 'Product Manager', desc: 'PRDs, Roadmap, Growth PLG' },
  ];

  // Role template selection
  const handleSelectRole = (role: TargetRoleType) => {
    setSelectedRole(role);
    setResumeData(JSON.parse(JSON.stringify(ROLE_RESUME_TEMPLATES[role])));
  };

  // AI Resume Regeneration using server agent
  const handleGenerateWithAI = async () => {
    setIsGenerating(true);
    try {
      const generated = await api.buildResume(
        customPrompt || JSON.stringify(resumeData),
        selectedRole,
        `Generate an ATS-optimized, high-converting resume for ${selectedRole}`
      );
      if (generated && generated.contactInfo) {
        setResumeData(generated);
        if (onSaveToAnalysis) {
          onSaveToAnalysis(generated);
        }
      }
    } catch (err) {
      console.error('Failed to generate resume with AI:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Safe file name generator
  const getCleanFileName = (extension: string) => {
    const rawName = resumeData.contactInfo.fullName || 'ATS_Resume';
    const clean = rawName.trim().replace(/[^a-zA-Z0-9_-]/g, '_');
    return `${clean}_Resume.${extension}`;
  };

  // 1. Direct ATS Vector PDF Download using pure jsPDF vector engine (100% ATS-friendly & oklch error immune)
  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    setDownloadFormat('PDF');
    setShowDownloadDropdown(false);
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const fontName = layoutPreset === 'harvard' ? 'times' : 'helvetica';
      const pageWidth = pdf.internal.pageSize.getWidth(); // 210mm
      const pageHeight = pdf.internal.pageSize.getHeight(); // 297mm
      const margin = 14;
      const contentWidth = pageWidth - margin * 2; // 182mm
      const bottomLimit = pageHeight - margin;

      let currentY = margin;

      const checkPageBreak = (neededHeight: number) => {
        if (currentY + neededHeight > bottomLimit) {
          pdf.addPage();
          currentY = margin;
          return true;
        }
        return false;
      };

      // Header: Candidate Name
      pdf.setFont(fontName, 'bold');
      pdf.setFontSize(16);
      pdf.setTextColor(15, 15, 15);
      const name = (resumeData.contactInfo.fullName || 'Candidate Name').toUpperCase();
      pdf.text(name, pageWidth / 2, currentY, { align: 'center' });
      currentY += 5.5;

      // Contact Line 1
      pdf.setFont(fontName, 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(60, 60, 60);
      const contactParts = [
        resumeData.contactInfo.location,
        resumeData.contactInfo.phone,
        resumeData.contactInfo.email
      ].filter(Boolean);
      if (contactParts.length > 0) {
        pdf.text(contactParts.join('  •  '), pageWidth / 2, currentY, { align: 'center' });
        currentY += 4.5;
      }

      // Contact Line 2: Links
      const linkParts = [
        resumeData.contactInfo.linkedin ? `LinkedIn: ${resumeData.contactInfo.linkedin}` : '',
        resumeData.contactInfo.github ? `GitHub: ${resumeData.contactInfo.github}` : '',
        resumeData.contactInfo.portfolio ? `Portfolio: ${resumeData.contactInfo.portfolio}` : ''
      ].filter(Boolean);
      if (linkParts.length > 0) {
        pdf.setFontSize(8.5);
        pdf.text(linkParts.join('  •  '), pageWidth / 2, currentY, { align: 'center' });
        currentY += 4.5;
      }

      // Header bottom border
      currentY += 1;
      pdf.setDrawColor(40, 40, 40);
      pdf.setLineWidth(0.3);
      pdf.line(margin, currentY, pageWidth - margin, currentY);
      currentY += 5;

      // Helper function to render section header
      const renderSectionHeading = (title: string) => {
        checkPageBreak(10);
        pdf.setFont(fontName, 'bold');
        pdf.setFontSize(10.5);
        pdf.setTextColor(15, 15, 15);
        pdf.text(title.toUpperCase(), margin, currentY);
        currentY += 1.5;
        pdf.setDrawColor(60, 60, 60);
        pdf.setLineWidth(0.2);
        pdf.line(margin, currentY, pageWidth - margin, currentY);
        currentY += 4.5;
      };

      // 1. Professional Summary
      if (resumeData.executiveSummary) {
        renderSectionHeading('Professional Summary');
        pdf.setFont(fontName, 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(30, 30, 30);
        const splitSummary = pdf.splitTextToSize(resumeData.executiveSummary, contentWidth);
        checkPageBreak(splitSummary.length * 4.2);
        pdf.text(splitSummary, margin, currentY);
        currentY += splitSummary.length * 4.2 + 3;
      }

      // 2. Technical Skills
      if (resumeData.technicalSkills && resumeData.technicalSkills.length > 0) {
        renderSectionHeading('Technical Skills');
        pdf.setFontSize(9);
        for (const cat of resumeData.technicalSkills) {
          checkPageBreak(6);
          pdf.setFont(fontName, 'bold');
          pdf.setTextColor(15, 15, 15);
          const catLabel = `${cat.category}: `;
          const labelWidth = pdf.getTextWidth(catLabel);
          pdf.text(catLabel, margin, currentY);

          pdf.setFont(fontName, 'normal');
          pdf.setTextColor(45, 45, 45);
          const skillsText = cat.skills.join(', ');
          const splitSkills = pdf.splitTextToSize(skillsText, contentWidth - labelWidth);
          pdf.text(splitSkills[0] || '', margin + labelWidth, currentY);
          
          if (splitSkills.length > 1) {
            for (let i = 1; i < splitSkills.length; i++) {
              currentY += 3.8;
              checkPageBreak(4);
              pdf.text(splitSkills[i], margin + labelWidth, currentY);
            }
          }
          currentY += 4.2;
        }
        currentY += 2;
      }

      // 3. Professional Experience
      if (resumeData.professionalExperience && resumeData.professionalExperience.length > 0) {
        renderSectionHeading('Professional Experience');
        for (const exp of resumeData.professionalExperience) {
          checkPageBreak(12);
          
          // Job Title & Company (Left) + Dates (Right)
          pdf.setFont(fontName, 'bold');
          pdf.setFontSize(9.5);
          pdf.setTextColor(15, 15, 15);
          const titleCompany = `${exp.title} — ${exp.company}`;
          pdf.text(titleCompany, margin, currentY);

          pdf.setFont(fontName, 'normal');
          pdf.setFontSize(9);
          pdf.setTextColor(70, 70, 70);
          pdf.text(exp.dates || '', pageWidth - margin, currentY, { align: 'right' });
          currentY += 4;

          // Location
          if (exp.location) {
            pdf.setFont(fontName, 'italic');
            pdf.setFontSize(8.5);
            pdf.setTextColor(100, 100, 100);
            pdf.text(exp.location, margin, currentY);
            currentY += 3.8;
          }

          // Bullet Points
          pdf.setFont(fontName, 'normal');
          pdf.setFontSize(9);
          pdf.setTextColor(30, 30, 30);
          const bulletIndent = 4;
          for (const bullet of exp.bulletPoints) {
            const splitBullet = pdf.splitTextToSize(bullet, contentWidth - bulletIndent);
            checkPageBreak(splitBullet.length * 4 + 1);
            pdf.text('•', margin + 0.5, currentY);
            pdf.text(splitBullet, margin + bulletIndent, currentY);
            currentY += splitBullet.length * 3.8 + 1.2;
          }
          currentY += 2;
        }
      }

      // 4. Key Technical Projects
      if (resumeData.projects && resumeData.projects.length > 0) {
        renderSectionHeading('Key Technical Projects');
        for (const proj of resumeData.projects) {
          checkPageBreak(10);

          pdf.setFont(fontName, 'bold');
          pdf.setFontSize(9.5);
          pdf.setTextColor(15, 15, 15);
          pdf.text(proj.title, margin, currentY);

          const titleWidth = pdf.getTextWidth(proj.title);
          if (proj.techStack && proj.techStack.length > 0) {
            pdf.setFont(fontName, 'italic');
            pdf.setFontSize(8.5);
            pdf.setTextColor(80, 80, 80);
            pdf.text(` [${proj.techStack.join(', ')}]`, margin + titleWidth, currentY);
          }

          if (proj.link) {
            pdf.setFont(fontName, 'normal');
            pdf.setFontSize(8.5);
            pdf.setTextColor(60, 60, 180);
            pdf.text(proj.link, pageWidth - margin, currentY, { align: 'right' });
          }
          currentY += 4;

          // Project Bullets
          pdf.setFont(fontName, 'normal');
          pdf.setFontSize(9);
          pdf.setTextColor(30, 30, 30);
          const bulletIndent = 4;
          for (const bullet of proj.bulletPoints) {
            const splitBullet = pdf.splitTextToSize(bullet, contentWidth - bulletIndent);
            checkPageBreak(splitBullet.length * 4 + 1);
            pdf.text('•', margin + 0.5, currentY);
            pdf.text(splitBullet, margin + bulletIndent, currentY);
            currentY += splitBullet.length * 3.8 + 1.2;
          }
          currentY += 2;
        }
      }

      // 5. Education
      if (resumeData.education && resumeData.education.length > 0) {
        renderSectionHeading('Education');
        for (const edu of resumeData.education) {
          checkPageBreak(8);
          pdf.setFont(fontName, 'bold');
          pdf.setFontSize(9);
          pdf.setTextColor(15, 15, 15);
          pdf.text(edu.degree, margin, currentY);

          const degWidth = pdf.getTextWidth(edu.degree);
          pdf.setFont(fontName, 'normal');
          pdf.setTextColor(40, 40, 40);
          const eduDetails = `, ${edu.institution}${edu.gpa ? ` (GPA: ${edu.gpa})` : ''}`;
          pdf.text(eduDetails, margin + degWidth, currentY);

          pdf.setTextColor(80, 80, 80);
          pdf.text(edu.year || '', pageWidth - margin, currentY, { align: 'right' });
          currentY += 4.2;
        }
        currentY += 2;
      }

      // 6. Certifications
      if (resumeData.certifications && resumeData.certifications.length > 0) {
        renderSectionHeading('Certifications & Credentials');
        for (const cert of resumeData.certifications) {
          checkPageBreak(7);
          pdf.setFont(fontName, 'bold');
          pdf.setFontSize(9);
          pdf.setTextColor(15, 15, 15);
          pdf.text(cert.name, margin, currentY);

          const certWidth = pdf.getTextWidth(cert.name);
          pdf.setFont(fontName, 'normal');
          pdf.setTextColor(50, 50, 50);
          pdf.text(` — ${cert.issuer}`, margin + certWidth, currentY);

          pdf.setTextColor(80, 80, 80);
          pdf.text(cert.year || '', pageWidth - margin, currentY, { align: 'right' });
          currentY += 4.2;
        }
      }

      pdf.save(getCleanFileName('pdf'));
      setDownloadSuccessMsg('Vector PDF downloaded successfully!');
      setTimeout(() => setDownloadSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Error generating PDF download:', err);
      window.print();
    } finally {
      setIsDownloading(false);
      setDownloadFormat('');
    }
  };

  // 2. Download Microsoft Word / Google Docs Compatible .DOC
  const handleDownloadWord = () => {
    setShowDownloadDropdown(false);
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>${resumeData.contactInfo.fullName} Resume</title>
      <style>
        body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; line-height: 1.35; color: #000000; margin: 0.8in; }
        h1 { font-size: 18pt; text-align: center; text-transform: uppercase; margin-bottom: 2pt; font-weight: bold; }
        .contact { text-align: center; font-size: 10pt; margin-bottom: 12pt; color: #333333; }
        h2 { font-size: 11pt; text-transform: uppercase; border-bottom: 1.5pt solid #000000; padding-bottom: 2pt; margin-top: 12pt; margin-bottom: 5pt; font-weight: bold; }
        .job-header { font-weight: bold; font-size: 11pt; }
        .job-meta { font-style: italic; font-size: 9.5pt; color: #555555; margin-bottom: 3pt; }
        ul { margin-top: 3pt; margin-bottom: 6pt; padding-left: 18pt; }
        li { margin-bottom: 3pt; font-size: 10.5pt; }
      </style>
      </head>
      <body>
        <h1>${resumeData.contactInfo.fullName}</h1>
        <div class="contact">
          ${resumeData.contactInfo.location ? `${resumeData.contactInfo.location} | ` : ''}
          ${resumeData.contactInfo.phone ? `${resumeData.contactInfo.phone} | ` : ''}
          ${resumeData.contactInfo.email ? `${resumeData.contactInfo.email}` : ''}<br/>
          ${resumeData.contactInfo.linkedin ? `LinkedIn: ${resumeData.contactInfo.linkedin} | ` : ''}
          ${resumeData.contactInfo.github ? `GitHub: ${resumeData.contactInfo.github}` : ''}
          ${resumeData.contactInfo.portfolio ? ` | Portfolio: ${resumeData.contactInfo.portfolio}` : ''}
        </div>

        <h2>Professional Summary</h2>
        <p style="font-size: 10.5pt; margin-bottom: 8pt;">${resumeData.executiveSummary}</p>

        <h2>Technical Skills</h2>
        <ul>
          ${resumeData.technicalSkills.map(s => `<li><strong>${s.category}:</strong> ${s.skills.join(', ')}</li>`).join('')}
        </ul>

        <h2>Professional Experience</h2>
        ${resumeData.professionalExperience.map(exp => `
          <div class="job-header">${exp.title} &ndash; ${exp.company} (${exp.dates})</div>
          <div class="job-meta">${exp.location || ''}</div>
          <ul>
            ${exp.bulletPoints.map(b => `<li>${b}</li>`).join('')}
          </ul>
        `).join('')}

        <h2>Key Projects</h2>
        ${resumeData.projects.map(proj => `
          <div class="job-header">${proj.title} ${proj.techStack && proj.techStack.length > 0 ? `[${proj.techStack.join(', ')}]` : ''}</div>
          <ul>
            ${proj.bulletPoints.map(b => `<li>${b}</li>`).join('')}
          </ul>
        `).join('')}

        <h2>Education</h2>
        <ul>
          ${resumeData.education.map(edu => `<li><strong>${edu.degree}</strong>, ${edu.institution} (${edu.year}) ${edu.gpa ? `GPA: ${edu.gpa}` : ''}</li>`).join('')}
        </ul>

        ${resumeData.certifications && resumeData.certifications.length > 0 ? `
          <h2>Certifications & Credentials</h2>
          <ul>
            ${resumeData.certifications.map(c => `<li><strong>${c.name}</strong> &ndash; ${c.issuer} (${c.year})</li>`).join('')}
          </ul>
        ` : ''}
      </body>
      </html>
    `;
    const blob = new Blob(['\ufeff' + htmlContent], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = getCleanFileName('doc');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccessMsg('Word .DOC document downloaded!');
    setTimeout(() => setDownloadSuccessMsg(''), 3000);
  };

  // 3. Download Plain Text (.TXT) for ATS Raw Submissions
  const handleDownloadTxt = () => {
    setShowDownloadDropdown(false);
    const textContent = `${(resumeData.contactInfo.fullName || 'CANDIDATE').toUpperCase()}
${resumeData.contactInfo.location || ''} | ${resumeData.contactInfo.phone || ''} | ${resumeData.contactInfo.email || ''}
LinkedIn: ${resumeData.contactInfo.linkedin || ''} | GitHub: ${resumeData.contactInfo.github || ''}${resumeData.contactInfo.portfolio ? ` | Portfolio: ${resumeData.contactInfo.portfolio}` : ''}

================================================================================
PROFESSIONAL SUMMARY
================================================================================
${resumeData.executiveSummary}

================================================================================
TECHNICAL SKILLS
================================================================================
${resumeData.technicalSkills.map(s => `• ${s.category}: ${s.skills.join(', ')}`).join('\n')}

================================================================================
PROFESSIONAL EXPERIENCE
================================================================================
${resumeData.professionalExperience.map(exp => `${exp.title.toUpperCase()} — ${exp.company}
Dates: ${exp.dates} | Location: ${exp.location || 'N/A'}
${exp.bulletPoints.map(b => `  * ${b}`).join('\n')}`).join('\n\n')}

================================================================================
KEY TECHNICAL PROJECTS
================================================================================
${resumeData.projects.map(p => `${p.title} [${(p.techStack || []).join(', ')}]
${p.link ? `Link: ${p.link}\n` : ''}${p.bulletPoints.map(b => `  * ${b}`).join('\n')}`).join('\n\n')}

================================================================================
EDUCATION
================================================================================
${resumeData.education.map(e => `• ${e.degree} — ${e.institution} (${e.year})${e.gpa ? ` | GPA: ${e.gpa}` : ''}`).join('\n')}

================================================================================
CERTIFICATIONS
================================================================================
${resumeData.certifications.map(c => `• ${c.name} — ${c.issuer} (${c.year})`).join('\n')}
`;
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = getCleanFileName('txt');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccessMsg('Plain text .TXT resume downloaded!');
    setTimeout(() => setDownloadSuccessMsg(''), 3000);
  };

  // 4. Download Markdown (.MD)
  const handleDownloadMarkdown = () => {
    setShowDownloadDropdown(false);
    const markdownText = `# ${resumeData.contactInfo.fullName}
${resumeData.contactInfo.location} | ${resumeData.contactInfo.phone} | ${resumeData.contactInfo.email}
LinkedIn: ${resumeData.contactInfo.linkedin} | GitHub: ${resumeData.contactInfo.github}${resumeData.contactInfo.portfolio ? ` | Portfolio: ${resumeData.contactInfo.portfolio}` : ''}

## PROFESSIONAL SUMMARY
${resumeData.executiveSummary}

## TECHNICAL SKILLS
${resumeData.technicalSkills.map(s => `* **${s.category}**: ${s.skills.join(', ')}`).join('\n')}

## PROFESSIONAL EXPERIENCE
${resumeData.professionalExperience.map(exp => `### ${exp.title} - ${exp.company} (${exp.dates})
*${exp.location}*
${exp.bulletPoints.map(b => `* ${b}`).join('\n')}`).join('\n\n')}

## KEY TECHNICAL PROJECTS
${resumeData.projects.map(p => `### ${p.title} [${p.techStack.join(', ')}]
${p.bulletPoints.map(b => `* ${b}`).join('\n')}`).join('\n\n')}

## EDUCATION
${resumeData.education.map(e => `* **${e.degree}** - ${e.institution} (${e.year}) ${e.gpa ? `GPA: ${e.gpa}` : ''}`).join('\n')}

## CERTIFICATIONS
${resumeData.certifications.map(c => `* **${c.name}** - ${c.issuer} (${c.year})`).join('\n')}
`;
    const blob = new Blob([markdownText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = getCleanFileName('md');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccessMsg('Markdown .MD file downloaded!');
    setTimeout(() => setDownloadSuccessMsg(''), 3000);
  };

  // 5. Download Structured JSON (.JSON)
  const handleDownloadJSON = () => {
    setShowDownloadDropdown(false);
    const blob = new Blob([JSON.stringify(resumeData, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = getCleanFileName('json');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccessMsg('JSON data file downloaded!');
    setTimeout(() => setDownloadSuccessMsg(''), 3000);
  };

  // Native Print / Browser Vector PDF Trigger
  const handlePrintPDF = () => {
    setShowDownloadDropdown(false);
    window.print();
  };

  // Copy Markdown to Clipboard
  const handleCopyMarkdown = () => {
    const markdownText = `# ${resumeData.contactInfo.fullName}
${resumeData.contactInfo.email} | ${resumeData.contactInfo.phone} | ${resumeData.contactInfo.location}
LinkedIn: ${resumeData.contactInfo.linkedin} | GitHub: ${resumeData.contactInfo.github}

## EXECUTIVE SUMMARY
${resumeData.executiveSummary}

## TECHNICAL SKILLS
${resumeData.technicalSkills.map(s => `* **${s.category}**: ${s.skills.join(', ')}`).join('\n')}

## PROFESSIONAL EXPERIENCE
${resumeData.professionalExperience.map(exp => `### ${exp.title} - ${exp.company} (${exp.dates})
${exp.location}
${exp.bulletPoints.map(b => `* ${b}`).join('\n')}`).join('\n\n')}

## PROJECTS
${resumeData.projects.map(p => `### ${p.title} [${p.techStack.join(', ')}]
${p.bulletPoints.map(b => `* ${b}`).join('\n')}`).join('\n\n')}

## EDUCATION
${resumeData.education.map(e => `* **${e.degree}** - ${e.institution} (${e.year}) ${e.gpa ? `GPA: ${e.gpa}` : ''}`).join('\n')}
`;

    navigator.clipboard.writeText(markdownText);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2500);
  };

  // Contact Info state updater
  const handleContactChange = (field: keyof GeneratedResumeData['contactInfo'], value: string) => {
    setResumeData((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [field]: value
      }
    }));
  };

  // Skills handlers
  const handleSkillCategoryNameChange = (catIdx: number, newName: string) => {
    const updated = [...resumeData.technicalSkills];
    updated[catIdx].category = newName;
    setResumeData((prev) => ({ ...prev, technicalSkills: updated }));
  };

  const handleSkillsListChange = (catIdx: number, valueStr: string) => {
    const updated = [...resumeData.technicalSkills];
    updated[catIdx].skills = valueStr.split(',').map((s) => s.trim()).filter(Boolean);
    setResumeData((prev) => ({ ...prev, technicalSkills: updated }));
  };

  const handleAddSkillCategory = () => {
    setResumeData((prev) => ({
      ...prev,
      technicalSkills: [
        ...prev.technicalSkills,
        { category: 'New Skill Category', skills: ['Skill 1', 'Skill 2'] }
      ]
    }));
  };

  const handleRemoveSkillCategory = (catIdx: number) => {
    setResumeData((prev) => ({
      ...prev,
      technicalSkills: prev.technicalSkills.filter((_, idx) => idx !== catIdx)
    }));
  };

  // Experience Handlers
  const handleExperienceChange = (idx: number, field: keyof ExperienceItem, val: any) => {
    const updated = [...resumeData.professionalExperience];
    updated[idx] = { ...updated[idx], [field]: val };
    setResumeData((prev) => ({ ...prev, professionalExperience: updated }));
  };

  const handleExperienceBulletChange = (expIdx: number, bIdx: number, val: string) => {
    const updated = [...resumeData.professionalExperience];
    updated[expIdx].bulletPoints[bIdx] = val;
    setResumeData((prev) => ({ ...prev, professionalExperience: updated }));
  };

  const handleAddExperienceBullet = (expIdx: number) => {
    const updated = [...resumeData.professionalExperience];
    updated[expIdx].bulletPoints.push('Architected and optimized high-impact features resulting in 20%+ performance boost.');
    setResumeData((prev) => ({ ...prev, professionalExperience: updated }));
  };

  const handleRemoveExperienceBullet = (expIdx: number, bIdx: number) => {
    const updated = [...resumeData.professionalExperience];
    updated[expIdx].bulletPoints = updated[expIdx].bulletPoints.filter((_, i) => i !== bIdx);
    setResumeData((prev) => ({ ...prev, professionalExperience: updated }));
  };

  const handleAddExperience = () => {
    setResumeData((prev) => ({
      ...prev,
      professionalExperience: [
        {
          title: 'Software Developer',
          company: 'Innovation Labs',
          location: 'San Francisco, CA',
          dates: '2024 - Present',
          bulletPoints: ['Engineered scalable application features using modern engineering stack.']
        },
        ...prev.professionalExperience
      ]
    }));
  };

  const handleRemoveExperience = (idx: number) => {
    setResumeData((prev) => ({
      ...prev,
      professionalExperience: prev.professionalExperience.filter((_, i) => i !== idx)
    }));
  };

  // Projects Handlers
  const handleProjectChange = (idx: number, field: keyof ProjectItem, val: any) => {
    const updated = [...resumeData.projects];
    updated[idx] = { ...updated[idx], [field]: val };
    setResumeData((prev) => ({ ...prev, projects: updated }));
  };

  const handleProjectTechStackChange = (idx: number, valStr: string) => {
    const updated = [...resumeData.projects];
    updated[idx].techStack = valStr.split(',').map(s => s.trim()).filter(Boolean);
    setResumeData((prev) => ({ ...prev, projects: updated }));
  };

  const handleProjectBulletChange = (pIdx: number, bIdx: number, val: string) => {
    const updated = [...resumeData.projects];
    updated[pIdx].bulletPoints[bIdx] = val;
    setResumeData((prev) => ({ ...prev, projects: updated }));
  };

  const handleAddProject = () => {
    setResumeData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          title: 'Full-Stack Web App',
          techStack: ['React', 'TypeScript', 'Node.js'],
          bulletPoints: ['Built responsive single page interface with custom automated tests.']
        }
      ]
    }));
  };

  const handleRemoveProject = (idx: number) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== idx)
    }));
  };

  // ATS Real-time Health Audit
  const allBullets = [
    ...resumeData.professionalExperience.flatMap((e) => e.bulletPoints),
    ...resumeData.projects.flatMap((p) => p.bulletPoints),
  ];

  const actionVerbsList = [
    'architected', 'built', 'engineered', 'spearheaded', 'designed', 'optimized',
    'implemented', 'fine-tuned', 'led', 'created', 'developed', 'automated', 'scaled'
  ];

  const countActionVerbs = allBullets.filter((b) =>
    actionVerbsList.some((v) => b.toLowerCase().includes(v))
  ).length;

  const countMetrics = allBullets.filter((b) =>
    /\d+%|\$\d+|\d+x|\d+\+|\d+ms|\d+FPS/i.test(b)
  ).length;

  const atsScore = Math.min(
    100,
    Math.round(
      60 +
      (countActionVerbs / (allBullets.length || 1)) * 20 +
      (countMetrics / (allBullets.length || 1)) * 20
    )
  );

  // Reusable Resume Document Paper Component
  const renderResumeDocument = (isModal: boolean = false) => {
    const fontClass = layoutPreset === 'harvard' ? 'font-serif' : layoutPreset === 'modern' ? 'font-sans' : 'font-mono';
    const densityClass = layoutPreset === 'compact' ? 'space-y-2.5 text-[10px]' : 'space-y-4 text-xs';

    return (
      <div
        id={isModal ? "resume-document-canvas-modal" : "resume-document-canvas"}
        style={{
          transform: zoomLevel !== 100 ? `scale(${zoomLevel / 100})` : undefined,
          transformOrigin: 'top center',
          transition: 'transform 0.15s ease-out'
        }}
        className={`w-full max-w-[850px] mx-auto bg-white text-black ${fontClass} ${densityClass} p-6 sm:p-10 md:p-12 rounded-2xl shadow-2xl border border-zinc-300 leading-normal transition-all select-text`}
      >
        {/* Header */}
        <div className={`text-center border-b ${layoutPreset === 'modern' ? 'border-indigo-600 pb-4' : 'border-black pb-3'}`}>
          <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-black">
            {resumeData.contactInfo.fullName || 'Candidate Name'}
          </h1>
          <p className="text-[11px] sm:text-xs text-zinc-800 mt-1 flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5">
            {resumeData.contactInfo.location && <span>{resumeData.contactInfo.location}</span>}
            {resumeData.contactInfo.phone && <span>• {resumeData.contactInfo.phone}</span>}
            {resumeData.contactInfo.email && <span>• {resumeData.contactInfo.email}</span>}
          </p>
          {(resumeData.contactInfo.linkedin || resumeData.contactInfo.github || resumeData.contactInfo.portfolio) && (
            <p className="text-[10px] sm:text-[11px] text-zinc-700 mt-0.5 font-mono flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5">
              {resumeData.contactInfo.linkedin && <span>LinkedIn: {resumeData.contactInfo.linkedin}</span>}
              {resumeData.contactInfo.github && <span>• GitHub: {resumeData.contactInfo.github}</span>}
              {resumeData.contactInfo.portfolio && <span>• {resumeData.contactInfo.portfolio}</span>}
            </p>
          )}
        </div>

        {/* Executive Summary */}
        {resumeData.executiveSummary && (
          <div>
            <h2 className="text-[11px] sm:text-xs font-bold uppercase tracking-widest border-b border-black pb-0.5 mb-1.5 text-black font-sans">
              Professional Summary
            </h2>
            <p className="text-[11px] sm:text-xs text-zinc-900 leading-relaxed">
              {resumeData.executiveSummary}
            </p>
          </div>
        )}

        {/* Technical Skills */}
        {resumeData.technicalSkills && resumeData.technicalSkills.length > 0 && (
          <div>
            <h2 className="text-[11px] sm:text-xs font-bold uppercase tracking-widest border-b border-black pb-0.5 mb-1.5 text-black font-sans">
              Technical Skills
            </h2>
            <div className="space-y-1">
              {resumeData.technicalSkills.map((cat, idx) => (
                <div key={idx} className="text-[11px] sm:text-xs text-zinc-900">
                  <strong className="text-black font-semibold">{cat.category}:</strong>{' '}
                  <span>{cat.skills.join(', ')}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Professional Experience */}
        {resumeData.professionalExperience && resumeData.professionalExperience.length > 0 && (
          <div>
            <h2 className="text-[11px] sm:text-xs font-bold uppercase tracking-widest border-b border-black pb-0.5 mb-1.5 text-black font-sans">
              Professional Experience
            </h2>
            <div className="space-y-3.5">
              {resumeData.professionalExperience.map((exp, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex flex-wrap items-baseline justify-between font-bold text-[11px] sm:text-xs text-black">
                    <span>
                      {exp.title} <span className="font-normal italic"> – {exp.company}</span>
                    </span>
                    <span className="font-mono text-[10px] sm:text-[11px] text-zinc-800">{exp.dates}</span>
                  </div>
                  {exp.location && (
                    <div className="text-[10px] italic text-zinc-600">{exp.location}</div>
                  )}
                  <ul className="list-disc list-outside ml-4 text-[11px] sm:text-xs text-zinc-900 space-y-1 mt-1">
                    {exp.bulletPoints.map((bullet, bIdx) => (
                      <li key={bIdx} className="leading-snug">{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {resumeData.projects && resumeData.projects.length > 0 && (
          <div>
            <h2 className="text-[11px] sm:text-xs font-bold uppercase tracking-widest border-b border-black pb-0.5 mb-1.5 text-black font-sans">
              Key Technical Projects
            </h2>
            <div className="space-y-3">
              {resumeData.projects.map((proj, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex flex-wrap items-baseline justify-between font-bold text-[11px] sm:text-xs text-black">
                    <span>
                      {proj.title}{' '}
                      {proj.techStack && proj.techStack.length > 0 && (
                        <span className="font-normal italic text-zinc-700">[{proj.techStack.join(', ')}]</span>
                      )}
                    </span>
                    {proj.link && <span className="font-mono text-[10px] text-indigo-700">{proj.link}</span>}
                  </div>
                  <ul className="list-disc list-outside ml-4 text-[11px] sm:text-xs text-zinc-900 space-y-0.5 mt-0.5">
                    {proj.bulletPoints.map((bullet, bIdx) => (
                      <li key={bIdx} className="leading-snug">{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {resumeData.education && resumeData.education.length > 0 && (
          <div>
            <h2 className="text-[11px] sm:text-xs font-bold uppercase tracking-widest border-b border-black pb-0.5 mb-1.5 text-black font-sans">
              Education
            </h2>
            <div className="space-y-1">
              {resumeData.education.map((edu, idx) => (
                <div key={idx} className="flex flex-wrap items-baseline justify-between text-[11px] sm:text-xs text-zinc-900">
                  <span>
                    <strong className="text-black">{edu.degree}</strong>, {edu.institution}
                    {edu.gpa ? <span className="text-zinc-600 font-mono text-[10px] ml-1.5">(GPA: {edu.gpa})</span> : ''}
                  </span>
                  <span className="font-mono text-[10px] sm:text-[11px] text-zinc-800">{edu.year}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {resumeData.certifications && resumeData.certifications.length > 0 && (
          <div>
            <h2 className="text-[11px] sm:text-xs font-bold uppercase tracking-widest border-b border-black pb-0.5 mb-1.5 text-black font-sans">
              Certifications & Credentials
            </h2>
            <div className="space-y-1">
              {resumeData.certifications.map((cert, idx) => (
                <div key={idx} className="flex flex-wrap items-baseline justify-between text-[11px] sm:text-xs text-zinc-900">
                  <span>
                    <strong className="text-black">{cert.name}</strong> – {cert.issuer}
                  </span>
                  <span className="font-mono text-[10px] text-zinc-800">{cert.year}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Reusable Download Dropdown Menu Component
  const renderDownloadDropdown = (alignRight: boolean = true) => (
    <div
      ref={downloadMenuRef}
      className={`absolute ${alignRight ? 'right-0' : 'left-0'} top-full mt-2 w-64 bg-zinc-900/95 backdrop-blur-xl border border-white/20 rounded-2xl p-2.5 shadow-2xl z-50 animate-fade-in space-y-1 text-left`}
    >
      <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400 border-b border-white/10 mb-1 flex items-center justify-between">
        <span>Download Formats</span>
        <span className="text-indigo-400 font-mono">1-Click</span>
      </div>

      {/* Option 1: PDF */}
      <button
        onClick={handleDownloadPDF}
        disabled={isDownloading}
        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-white hover:bg-indigo-600/30 hover:border-indigo-500/40 border border-transparent transition-all text-left"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-[10px]">
            PDF
          </div>
          <div>
            <div className="font-bold text-white text-xs">PDF Document</div>
            <div className="text-[10px] text-zinc-400">High-res vector layout (.pdf)</div>
          </div>
        </div>
        {isDownloading && downloadFormat === 'PDF' ? (
          <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
        ) : (
          <Download className="w-3.5 h-3.5 text-zinc-400" />
        )}
      </button>

      {/* Option 2: Word .DOC */}
      <button
        onClick={handleDownloadWord}
        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-white hover:bg-blue-600/30 hover:border-blue-500/40 border border-transparent transition-all text-left"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[10px]">
            DOC
          </div>
          <div>
            <div className="font-bold text-white text-xs">Word Document</div>
            <div className="text-[10px] text-zinc-400">Editable Word & Docs (.doc)</div>
          </div>
        </div>
        <Download className="w-3.5 h-3.5 text-zinc-400" />
      </button>

      {/* Option 3: Plain Text .TXT */}
      <button
        onClick={handleDownloadTxt}
        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-white hover:bg-emerald-600/30 hover:border-emerald-500/40 border border-transparent transition-all text-left"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">
            TXT
          </div>
          <div>
            <div className="font-bold text-white text-xs">Plain Text (ATS)</div>
            <div className="text-[10px] text-zinc-400">Clean text format (.txt)</div>
          </div>
        </div>
        <Download className="w-3.5 h-3.5 text-zinc-400" />
      </button>

      {/* Option 4: Markdown .MD */}
      <button
        onClick={handleDownloadMarkdown}
        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-white hover:bg-purple-600/30 hover:border-purple-500/40 border border-transparent transition-all text-left"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-[10px]">
            MD
          </div>
          <div>
            <div className="font-bold text-white text-xs">Markdown File</div>
            <div className="text-[10px] text-zinc-400">Structured markdown (.md)</div>
          </div>
        </div>
        <Download className="w-3.5 h-3.5 text-zinc-400" />
      </button>

      {/* Option 5: JSON */}
      <button
        onClick={handleDownloadJSON}
        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-white hover:bg-amber-600/30 hover:border-amber-500/40 border border-transparent transition-all text-left"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px]">
            JSON
          </div>
          <div>
            <div className="font-bold text-white text-xs">Structured JSON</div>
            <div className="text-[10px] text-zinc-400">Full data backup (.json)</div>
          </div>
        </div>
        <Download className="w-3.5 h-3.5 text-zinc-400" />
      </button>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in text-white pb-12">
      
      {/* Toast / Notification Banner */}
      {downloadSuccessMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-white px-5 py-3 rounded-2xl shadow-2xl font-bold text-xs flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{downloadSuccessMsg}</span>
        </div>
      )}

      {/* Printable ATS Resume Container (hidden on screen, visible on print) */}
      <div className="hidden print:block print:w-full print:p-0 print:m-0 print:text-black print:bg-white text-black bg-white">
        <style font-media="print">{`
          @media print {
            body { background: white !important; color: black !important; }
            nav, sidebar, header, footer, button, .no-print { display: none !important; }
            .print-area { width: 100% !important; margin: 0 !important; padding: 0 !important; }
          }
        `}</style>
        <div className="print-area p-8 font-serif leading-relaxed text-black max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center border-b border-black pb-3 mb-4">
            <h1 className="text-2xl font-bold uppercase tracking-wider text-black">{resumeData.contactInfo.fullName}</h1>
            <p className="text-xs text-black mt-1">
              {resumeData.contactInfo.location} | {resumeData.contactInfo.phone} | {resumeData.contactInfo.email}
            </p>
            <p className="text-xs text-black mt-0.5">
              LinkedIn: {resumeData.contactInfo.linkedin} | GitHub: {resumeData.contactInfo.github}
              {resumeData.contactInfo.portfolio ? ` | Portfolio: ${resumeData.contactInfo.portfolio}` : ''}
            </p>
          </div>

          {/* Executive Summary */}
          <div className="mb-4">
            <h2 className="text-xs font-bold uppercase tracking-widest border-b border-black pb-0.5 mb-1.5 text-black">PROFESSIONAL SUMMARY</h2>
            <p className="text-xs text-black leading-normal">{resumeData.executiveSummary}</p>
          </div>

          {/* Technical Skills */}
          <div className="mb-4">
            <h2 className="text-xs font-bold uppercase tracking-widest border-b border-black pb-0.5 mb-1.5 text-black">TECHNICAL SKILLS</h2>
            <ul className="text-xs text-black space-y-0.5">
              {resumeData.technicalSkills.map((cat, idx) => (
                <li key={idx}>
                  <strong>{cat.category}:</strong> {cat.skills.join(', ')}
                </li>
              ))}
            </ul>
          </div>

          {/* Professional Experience */}
          <div className="mb-4">
            <h2 className="text-xs font-bold uppercase tracking-widest border-b border-black pb-0.5 mb-1.5 text-black">PROFESSIONAL EXPERIENCE</h2>
            <div className="space-y-3">
              {resumeData.professionalExperience.map((exp, idx) => (
                <div key={idx}>
                  <div className="flex justify-between font-bold text-xs text-black">
                    <span>{exp.title} – {exp.company}</span>
                    <span>{exp.dates}</span>
                  </div>
                  <div className="text-[11px] italic text-black mb-1">{exp.location}</div>
                  <ul className="list-disc list-inside text-xs text-black space-y-0.5">
                    {exp.bulletPoints.map((bullet, bIdx) => (
                      <li key={bIdx}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div className="mb-4">
            <h2 className="text-xs font-bold uppercase tracking-widest border-b border-black pb-0.5 mb-1.5 text-black">PROJECTS</h2>
            <div className="space-y-2">
              {resumeData.projects.map((proj, idx) => (
                <div key={idx}>
                  <div className="flex justify-between font-bold text-xs text-black">
                    <span>{proj.title} <span className="font-normal italic">[{proj.techStack.join(', ')}]</span></span>
                    {proj.link && <span className="font-mono text-[10px]">{proj.link}</span>}
                  </div>
                  <ul className="list-disc list-inside text-xs text-black space-y-0.5 mt-0.5">
                    {proj.bulletPoints.map((bullet, bIdx) => (
                      <li key={bIdx}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="mb-4">
            <h2 className="text-xs font-bold uppercase tracking-widest border-b border-black pb-0.5 mb-1.5 text-black">EDUCATION</h2>
            {resumeData.education.map((edu, idx) => (
              <div key={idx} className="flex justify-between text-xs text-black">
                <span><strong>{edu.degree}</strong>, {edu.institution} {edu.gpa ? `(GPA: ${edu.gpa})` : ''}</span>
                <span>{edu.year}</span>
              </div>
            ))}
          </div>

          {/* Certifications */}
          {resumeData.certifications && resumeData.certifications.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest border-b border-black pb-0.5 mb-1.5 text-black">CERTIFICATIONS</h2>
              {resumeData.certifications.map((cert, idx) => (
                <div key={idx} className="flex justify-between text-xs text-black">
                  <span><strong>{cert.name}</strong> – {cert.issuer}</span>
                  <span>{cert.year}</span>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* Screen Interactive Header */}
      <div className="no-print bg-white/5 border border-white/10 p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-widest mb-3 border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5" /> Module • AI Resume Builder & ATS Exporter
          </div>
          <h1 className="text-2xl sm:text-3xl font-light italic tracking-tight text-white">
            ATS-Optimized <strong className="font-bold not-italic">Resume Builder</strong>
          </h1>
          <p className="text-xs text-zinc-400 mt-2 max-w-2xl leading-relaxed">
            Generate role-tailored, Harvard-style single-column resumes for 7 engineering & product domains. Responsive for all screens with instant downloads (PDF, Word, Text, Markdown, JSON), full-screen viewer, and live ATS compliance scoring.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 relative">
          
          {/* Primary 1-Click Download PDF Button */}
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="px-4 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider shadow-xl flex items-center gap-2 transition-all"
            title="Download crisp ATS PDF file"
          >
            {isDownloading && downloadFormat === 'PDF' ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>{isDownloading && downloadFormat === 'PDF' ? 'Generating PDF...' : 'Download PDF'}</span>
          </button>

          {/* Download Options Dropdown Menu Button */}
          <div className="relative">
            <button
              onClick={() => setShowDownloadDropdown((prev) => !prev)}
              className="px-3.5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/10 flex items-center gap-1.5 transition-all"
              title="Select format (Word .doc, Plain Text .txt, Markdown, JSON)"
            >
              <FileDown className="w-4 h-4 text-indigo-400" />
              <span>Formats</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showDownloadDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showDownloadDropdown && renderDownloadDropdown(true)}
          </div>

          {/* Full Screen Viewer Button */}
          <button
            onClick={() => setIsFullScreen(true)}
            className="px-3.5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/10 flex items-center gap-2 transition-all"
            title="Open edge-to-edge Full Screen Resume Viewer"
          >
            <Maximize2 className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Full Screen</span>
          </button>

          {/* Print / System Dialog */}
          <button
            onClick={handlePrintPDF}
            className="px-3.5 py-2.5 rounded-full bg-white text-black hover:bg-zinc-200 font-bold text-xs uppercase tracking-widest shadow-xl flex items-center gap-2 transition-all"
            title="Native browser print dialog"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden md:inline">Print</span>
          </button>

          {/* Copy Markdown */}
          <button
            onClick={handleCopyMarkdown}
            className="px-3 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/10 flex items-center gap-1.5 transition-all"
            title="Copy formatted markdown to clipboard"
          >
            {copiedSuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span className="hidden lg:inline">{copiedSuccess ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Target Role Selector Badges */}
      <div className="no-print bg-white/5 border border-white/10 p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <span className="text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" /> Target Role Presets (7 Engineering & Product Domains)
          </span>
          <span className="text-[10px] font-mono px-3 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Current: {selectedRole}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {rolesList.map((r) => {
            const isSelected = selectedRole === r.type;
            return (
              <button
                key={r.type}
                onClick={() => handleSelectRole(r.type)}
                className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? 'bg-indigo-500/20 border-indigo-500/50 text-white shadow-lg shadow-indigo-500/10'
                    : 'bg-black/40 border-white/10 text-zinc-400 hover:border-white/20 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider block text-white">{r.label}</span>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-indigo-400" />}
                </div>
                <p className="text-[9px] text-zinc-400 leading-tight line-clamp-1">{r.desc}</p>
              </button>
            );
          })}
        </div>

        {/* AI Custom Regeneration Bar */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Optional: Paste target job description or specific technologies to tailor further with AI..."
            className="flex-1 w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <button
            onClick={handleGenerateWithAI}
            disabled={isGenerating}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all shrink-0"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Tailoring with AI...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>Optimize Role with AI</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Screen Layout Mode Navigation Bar (All Screen Responsive: Mobile, Tablet, Desktop) */}
      <div className="no-print bg-black/40 border border-white/10 p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3">
        
        {/* Mode Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-white/5 rounded-xl border border-white/10">
          <button
            onClick={() => setViewMode('editor')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'editor'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Editor</span>
          </button>

          <button
            onClick={() => setViewMode('preview')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'preview'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Resume Viewer</span>
          </button>

          <button
            onClick={() => setViewMode('split')}
            className={`hidden md:flex px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all items-center gap-1.5 ${
              viewMode === 'split'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Split View</span>
          </button>
        </div>

        {/* Layout, Download & Zoom Controls */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Direct Quick Download Action */}
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="px-3 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 text-xs font-bold flex items-center gap-1.5 transition-all"
            title="Download PDF"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>

          {/* Template Style Selector */}
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 text-[11px]">
            <span className="text-zinc-500 font-mono px-1.5 hidden sm:inline">Style:</span>
            {(['harvard', 'modern', 'compact'] as const).map((preset) => (
              <button
                key={preset}
                onClick={() => setLayoutPreset(preset)}
                className={`px-2.5 py-1 rounded-lg capitalize font-medium transition-colors ${
                  layoutPreset === preset ? 'bg-white/20 text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setZoomLevel((prev) => Math.max(60, prev - 10))}
              className="p-1.5 hover:bg-white/10 text-zinc-300 rounded-lg transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono text-zinc-400 px-1 min-w-[38px] text-center">
              {zoomLevel}%
            </span>
            <button
              onClick={() => setZoomLevel((prev) => Math.min(150, prev + 10))}
              className="p-1.5 hover:bg-white/10 text-zinc-300 rounded-lg transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(100)}
              className="p-1.5 hover:bg-white/10 text-zinc-300 rounded-lg transition-colors"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Full Screen Expand Button */}
          <button
            onClick={() => setIsFullScreen(true)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all flex items-center gap-1.5 text-xs font-bold"
            title="Expand Full Screen"
          >
            <Maximize2 className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Maximize</span>
          </button>
        </div>

      </div>

      {/* Main Workspace Layout (Supports Split, Editor Only, or Full Preview on All Screen Sizes) */}
      <div className={`no-print ${viewMode === 'split' ? 'grid grid-cols-1 lg:grid-cols-12 gap-8 items-start' : 'space-y-6'}`}>
        
        {/* Left Column: Full Modular Section Editor (Visible in 'split' or 'editor' mode) */}
        {(viewMode === 'split' || viewMode === 'editor') && (
          <div className={`${viewMode === 'split' ? 'lg:col-span-6 xl:col-span-6' : 'w-full'} bg-white/5 border border-white/10 p-6 rounded-3xl space-y-6`}>
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-400" /> Section Editor
              </h3>
              <span className="text-[10px] px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full font-mono border border-emerald-500/30">
                Live Auto-Sync
              </span>
            </div>

            {/* Section Selector Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10 scrollbar-none">
              {[
                { id: 'contact', label: 'Contact Info', icon: User },
                { id: 'summary', label: 'Summary', icon: FileText },
                { id: 'skills', label: 'Skills', icon: Layers },
                { id: 'experience', label: 'Experience', icon: Briefcase },
                { id: 'projects', label: 'Projects', icon: FolderGit2 },
                { id: 'education', label: 'Education', icon: GraduationCap },
              ].map((sec) => {
                const IconComp = sec.icon;
                const isActive = activeEditorSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => setActiveEditorSection(sec.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                      isActive
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                        : 'bg-black/30 text-zinc-400 hover:text-white border border-white/5'
                    }`}
                  >
                    <IconComp className="w-3.5 h-3.5" />
                    <span>{sec.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Editor 1: Contact Information */}
            {activeEditorSection === 'contact' && (
              <div className="space-y-4 animate-fade-in">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Candidate Contact Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={resumeData.contactInfo.fullName}
                      onChange={(e) => handleContactChange('fullName', e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={resumeData.contactInfo.email}
                      onChange={(e) => handleContactChange('email', e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={resumeData.contactInfo.phone}
                      onChange={(e) => handleContactChange('phone', e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Location (City, State)</label>
                    <input
                      type="text"
                      value={resumeData.contactInfo.location}
                      onChange={(e) => handleContactChange('location', e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">LinkedIn URL</label>
                    <input
                      type="text"
                      value={resumeData.contactInfo.linkedin}
                      onChange={(e) => handleContactChange('linkedin', e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">GitHub / Portfolio</label>
                    <input
                      type="text"
                      value={resumeData.contactInfo.github}
                      onChange={(e) => handleContactChange('github', e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Editor 2: Executive Summary */}
            {activeEditorSection === 'summary' && (
              <div className="space-y-4 animate-fade-in">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Executive Summary Statement</h4>
                <textarea
                  rows={5}
                  value={resumeData.executiveSummary}
                  onChange={(e) => setResumeData((prev) => ({ ...prev, executiveSummary: e.target.value }))}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-xs text-white leading-relaxed focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}

            {/* Editor 3: Technical Skills */}
            {activeEditorSection === 'skills' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Technical Skill Categories</h4>
                  <button
                    onClick={handleAddSkillCategory}
                    className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-xs text-white font-bold flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Category
                  </button>
                </div>

                <div className="space-y-4">
                  {resumeData.technicalSkills.map((cat, catIdx) => (
                    <div key={catIdx} className="p-4 bg-black/40 border border-white/10 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={cat.category}
                          onChange={(e) => handleSkillCategoryNameChange(catIdx, e.target.value)}
                          className="bg-transparent border-b border-white/20 text-xs font-bold text-white focus:outline-none focus:border-indigo-500 px-1 py-0.5"
                        />
                        <button
                          onClick={() => handleRemoveSkillCategory(catIdx)}
                          className="p-1 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div>
                        <label className="block text-[10px] text-zinc-500 uppercase mb-1">Comma-separated skills list</label>
                        <input
                          type="text"
                          value={cat.skills.join(', ')}
                          onChange={(e) => handleSkillsListChange(catIdx, e.target.value)}
                          className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Editor 4: Professional Experience */}
            {activeEditorSection === 'experience' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Professional Experience History</h4>
                  <button
                    onClick={handleAddExperience}
                    className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-xs text-white font-bold flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Position
                  </button>
                </div>

                <div className="space-y-6">
                  {resumeData.professionalExperience.map((exp, expIdx) => (
                    <div key={expIdx} className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4">
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <span className="text-xs font-bold text-white uppercase font-mono">Position #{expIdx + 1}</span>
                        <button
                          onClick={() => handleRemoveExperience(expIdx)}
                          className="p-1.5 hover:bg-red-500/20 text-red-400 rounded-lg text-xs flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] text-zinc-400 uppercase">Job Title</label>
                          <input
                            type="text"
                            value={exp.title}
                            onChange={(e) => handleExperienceChange(expIdx, 'title', e.target.value)}
                            className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-zinc-400 uppercase">Company Name</label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => handleExperienceChange(expIdx, 'company', e.target.value)}
                            className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-zinc-400 uppercase">Location</label>
                          <input
                            type="text"
                            value={exp.location}
                            onChange={(e) => handleExperienceChange(expIdx, 'location', e.target.value)}
                            className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-zinc-400 uppercase">Dates</label>
                          <input
                            type="text"
                            value={exp.dates}
                            onChange={(e) => handleExperienceChange(expIdx, 'dates', e.target.value)}
                            className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                          />
                        </div>
                      </div>

                      {/* Bullet Points */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="block text-[10px] font-bold text-zinc-400 uppercase">Accomplishment Bullets</label>
                          <button
                            onClick={() => handleAddExperienceBullet(expIdx)}
                            className="text-[10px] text-indigo-300 hover:underline flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" /> Add Bullet
                          </button>
                        </div>

                        {exp.bulletPoints.map((bullet, bIdx) => (
                          <div key={bIdx} className="flex items-start gap-2">
                            <textarea
                              rows={2}
                              value={bullet}
                              onChange={(e) => handleExperienceBulletChange(expIdx, bIdx, e.target.value)}
                              className="flex-1 bg-black/60 border border-white/10 rounded-xl p-2.5 text-xs text-zinc-200 leading-normal"
                            />
                            <button
                              onClick={() => handleRemoveExperienceBullet(expIdx, bIdx)}
                              className="p-1.5 hover:bg-red-500/20 text-red-400 rounded-lg shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Editor 5: Projects */}
            {activeEditorSection === 'projects' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Key Projects Portfolio</h4>
                  <button
                    onClick={handleAddProject}
                    className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-xs text-white font-bold flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Project
                  </button>
                </div>

                <div className="space-y-6">
                  {resumeData.projects.map((proj, pIdx) => (
                    <div key={pIdx} className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4">
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <span className="text-xs font-bold text-white uppercase font-mono">Project #{pIdx + 1}</span>
                        <button
                          onClick={() => handleRemoveProject(pIdx)}
                          className="p-1.5 hover:bg-red-500/20 text-red-400 rounded-lg text-xs flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] text-zinc-400 uppercase">Project Title</label>
                          <input
                            type="text"
                            value={proj.title}
                            onChange={(e) => handleProjectChange(pIdx, 'title', e.target.value)}
                            className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-zinc-400 uppercase">Project Link / Repo</label>
                          <input
                            type="text"
                            value={proj.link || ''}
                            onChange={(e) => handleProjectChange(pIdx, 'link', e.target.value)}
                            className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] text-zinc-400 uppercase mb-1">Tech Stack (comma separated)</label>
                        <input
                          type="text"
                          value={proj.techStack.join(', ')}
                          onChange={(e) => handleProjectTechStackChange(pIdx, e.target.value)}
                          className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-zinc-200"
                        />
                      </div>

                      {/* Bullets */}
                      <div className="space-y-2">
                        {proj.bulletPoints.map((b, bIdx) => (
                          <div key={bIdx} className="flex items-start gap-2">
                            <textarea
                              rows={2}
                              value={b}
                              onChange={(e) => handleProjectBulletChange(pIdx, bIdx, e.target.value)}
                              className="flex-1 bg-black/60 border border-white/10 rounded-xl p-2.5 text-xs text-zinc-200"
                            />
                            <button
                              onClick={() => {
                                const updated = [...resumeData.projects];
                                updated[pIdx].bulletPoints = updated[pIdx].bulletPoints.filter((_, i) => i !== bIdx);
                                setResumeData((prev) => ({ ...prev, projects: updated }));
                              }}
                              className="p-1.5 hover:bg-red-500/20 text-red-400 rounded-lg shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Editor 6: Education */}
            {activeEditorSection === 'education' && (
              <div className="space-y-4 animate-fade-in">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Education Background</h4>
                {resumeData.education.map((edu, eIdx) => (
                  <div key={eIdx} className="p-4 bg-black/40 border border-white/10 rounded-2xl space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-zinc-400 uppercase">Degree Title</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => {
                            const updated = [...resumeData.education];
                            updated[eIdx].degree = e.target.value;
                            setResumeData((prev) => ({ ...prev, education: updated }));
                          }}
                          className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-zinc-400 uppercase">Institution / University</label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => {
                            const updated = [...resumeData.education];
                            updated[eIdx].institution = e.target.value;
                            setResumeData((prev) => ({ ...prev, education: updated }));
                          }}
                          className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* Right Column: Live ATS Preview & Health Audit Panel (Visible in 'split' or 'preview' mode) */}
        {(viewMode === 'split' || viewMode === 'preview') && (
          <div className={`${viewMode === 'split' ? 'lg:col-span-6 xl:col-span-6' : 'w-full'} space-y-6`}>
            
            {/* ATS Health Metric Score Card */}
            <div className="bg-white/5 border border-white/10 p-5 rounded-3xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-400" /> ATS Parsing Compliance Audit
                </h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsFullScreen(true)}
                    className="text-xs text-indigo-300 hover:text-white flex items-center gap-1 font-mono transition-colors"
                  >
                    <Maximize2 className="w-3.5 h-3.5" /> Full Screen
                  </button>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/20 px-3 py-0.5 rounded-full border border-emerald-500/30">
                    {atsScore} / 100
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="flex items-center justify-between p-2.5 bg-black/40 rounded-xl border border-white/10">
                  <span className="text-zinc-300 text-[11px]">Single-Column Layout</span>
                  <span className="text-emerald-400 font-bold font-mono text-[11px]">100% Parsable</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-black/40 rounded-xl border border-white/10">
                  <span className="text-zinc-300 text-[11px]">Action Verbs</span>
                  <span className="text-indigo-300 font-bold font-mono text-[11px]">{countActionVerbs} Found</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-black/40 rounded-xl border border-white/10">
                  <span className="text-zinc-300 text-[11px]">Metrics</span>
                  <span className="text-purple-300 font-bold font-mono text-[11px]">{countMetrics} Metrics</span>
                </div>
              </div>
            </div>

            {/* Document Viewer Container with Responsive Overflow & Scaling */}
            <div className="p-4 sm:p-6 bg-black/30 border border-white/10 rounded-3xl overflow-x-auto shadow-2xl relative">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4 text-xs text-zinc-400">
                <span className="font-mono text-[11px] flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-indigo-400" />
                  Live Resume Preview ({layoutPreset.toUpperCase()})
                </span>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadPDF}
                    disabled={isDownloading}
                    className="px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 text-[11px] font-bold flex items-center gap-1 transition-colors border border-indigo-500/30"
                  >
                    <Download className="w-3 h-3" /> Download
                  </button>
                  <button
                    onClick={() => setIsFullScreen(true)}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold flex items-center gap-1 transition-colors"
                  >
                    <Maximize2 className="w-3 h-3" /> Full Screen
                  </button>
                </div>
              </div>

              {/* Render Document */}
              <div className="flex justify-center min-w-full overflow-y-auto max-h-[800px] scrollbar-thin">
                {renderResumeDocument(false)}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* FULL SCREEN MODAL / EXPANDED VIEWER (For All Screens: Mobile, Tablet, Laptop, Desktop) */}
      {isFullScreen && (
        <div className="no-print fixed inset-0 z-50 bg-zinc-950/95 backdrop-blur-xl flex flex-col text-white animate-fade-in overflow-hidden">
          
          {/* Full Screen Top Navigation & Actions Bar */}
          <div className="bg-zinc-900/90 border-b border-white/10 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4 shrink-0 shadow-2xl">
            
            {/* Title & Candidate Info */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <span>{resumeData.contactInfo.fullName || 'Resume Preview'}</span>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    ATS {atsScore}/100
                  </span>
                </h2>
                <p className="text-[10px] text-zinc-400 font-mono">
                  Full Screen Document Viewer • {selectedRole}
                </p>
              </div>
            </div>

            {/* Middle Controls: Preset & Zoom */}
            <div className="flex items-center flex-wrap gap-3">
              {/* Style Presets */}
              <div className="flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-white/10 text-xs">
                <span className="text-zinc-500 text-[10px] font-mono px-2 hidden md:inline">Preset:</span>
                {(['harvard', 'modern', 'compact'] as const).map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setLayoutPreset(preset)}
                    className={`px-3 py-1 rounded-lg capitalize text-xs font-medium transition-colors ${
                      layoutPreset === preset ? 'bg-indigo-600 text-white font-bold' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-white/10">
                <button
                  onClick={() => setZoomLevel((prev) => Math.max(60, prev - 10))}
                  className="p-1.5 hover:bg-white/10 text-zinc-300 rounded-lg transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono text-zinc-300 px-1.5 min-w-[42px] text-center font-bold">
                  {zoomLevel}%
                </span>
                <button
                  onClick={() => setZoomLevel((prev) => Math.min(160, prev + 10))}
                  className="p-1.5 hover:bg-white/10 text-zinc-300 rounded-lg transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoomLevel(100)}
                  className="p-1.5 hover:bg-white/10 text-zinc-300 rounded-lg transition-colors"
                  title="Reset 100%"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Actions: Download, Print, Copy, Close */}
            <div className="flex items-center gap-2 sm:gap-3 relative">
              
              {/* 1-Click Download PDF */}
              <button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg transition-all"
                title="Download ATS PDF"
              >
                {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                <span>Download PDF</span>
              </button>

              {/* Formats Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowDownloadDropdown((prev) => !prev)}
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/10 flex items-center gap-1 transition-all"
                >
                  <FileDown className="w-4 h-4 text-indigo-400" />
                  <span className="hidden sm:inline">Formats</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {showDownloadDropdown && renderDownloadDropdown(true)}
              </div>

              <button
                onClick={handlePrintPDF}
                className="px-3 py-2 rounded-xl bg-white text-black hover:bg-zinc-200 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg transition-all"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Print</span>
              </button>

              <button
                onClick={handleCopyMarkdown}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/10 flex items-center gap-1.5 transition-all"
              >
                {copiedSuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span className="hidden sm:inline">{copiedSuccess ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={() => setIsFullScreen(false)}
                className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 transition-colors flex items-center gap-1"
                title="Exit Full Screen (Esc)"
              >
                <Minimize2 className="w-4 h-4" />
                <span className="text-xs font-bold font-mono hidden md:inline">Exit</span>
              </button>
            </div>

          </div>

          {/* Full Screen Scrollable Canvas Area */}
          <div className="flex-1 overflow-y-auto overflow-x-auto p-4 sm:p-8 md:p-12 flex justify-center items-start bg-zinc-950/80">
            <div className="w-full max-w-4xl my-auto py-4 flex justify-center">
              {renderResumeDocument(true)}
            </div>
          </div>

          {/* Bottom Full Screen Status Bar */}
          <div className="bg-zinc-900/90 border-t border-white/10 px-6 py-2.5 flex items-center justify-between text-xs text-zinc-400 shrink-0 font-mono">
            <div className="flex items-center gap-4">
              <span>Standard ATS 1-Column Format</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">{countActionVerbs} Action Verbs</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">{countMetrics} Quantifiable Metrics</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-zinc-500">Press Esc or click Exit to return</span>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
