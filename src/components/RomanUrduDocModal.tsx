import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  X, 
  BookOpen, 
  CheckCircle2, 
  Layers, 
  Radio, 
  HardDrive, 
  ShieldCheck, 
  Terminal, 
  Search,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { ROMAN_URDU_DOCS } from '../data/romanUrduDocumentation';

interface RomanUrduDocModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RomanUrduDocModal: React.FC<RomanUrduDocModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeSectionId, setActiveSectionId] = useState<string>(ROMAN_URDU_DOCS.sections[0].id);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [searchDocQuery, setSearchDocQuery] = useState('');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  if (!isOpen) return null;

  const currentSection = ROMAN_URDU_DOCS.sections.find(s => s.id === activeSectionId) || ROMAN_URDU_DOCS.sections[0];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  /**
   * Generates and downloads the complete Roman Urdu Technical Documentation as a formatted PDF file using jsPDF
   */
  const handleDownloadPDF = () => {
    setIsGeneratingPdf(true);

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pageWidth - margin * 2;
      let y = margin;

      // Helper for page break
      const checkPageBreak = (neededHeight: number) => {
        if (y + neededHeight > pageHeight - 18) {
          doc.addPage();
          y = margin;
          // Draw mini running header
          doc.setFontSize(8);
          doc.setTextColor(120, 120, 120);
          doc.setFont('helvetica', 'normal');
          doc.text("OpenTube Network — Technical Documentation (Roman Urdu)", margin, y);
          doc.setDrawColor(200, 200, 200);
          doc.line(margin, y + 2, pageWidth - margin, y + 2);
          y += 8;
        }
      };

      // Header Banner
      doc.setFillColor(15, 23, 42); // Dark slate
      doc.rect(0, 0, pageWidth, 42, 'F');

      // Brand Logo Text
      doc.setFontSize(20);
      doc.setTextColor(16, 185, 129); // Emerald
      doc.setFont('helvetica', 'bold');
      doc.text("OpenTube Network", margin, 18);

      doc.setFontSize(10);
      doc.setTextColor(148, 163, 184); // Muted slate
      doc.setFont('helvetica', 'normal');
      doc.text("Decentralized Community-Governed Video Platform", margin, 24);

      doc.setFontSize(8);
      doc.setTextColor(52, 211, 153);
      doc.text("PROTOCOL SPECIFICATION • ROMAN URDU EDITION • " + ROMAN_URDU_DOCS.version, margin, 32);

      y = 50;

      // Document Title
      doc.setFontSize(14);
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      const titleLines = doc.splitTextToSize(ROMAN_URDU_DOCS.title, contentWidth);
      doc.text(titleLines, margin, y);
      y += titleLines.length * 7;

      // Subtitle
      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105);
      doc.setFont('helvetica', 'italic');
      const subLines = doc.splitTextToSize(ROMAN_URDU_DOCS.subtitle, contentWidth);
      doc.text(subLines, margin, y);
      y += subLines.length * 5 + 4;

      // Metadata Box
      doc.setFillColor(241, 245, 249);
      doc.rect(margin, y, contentWidth, 16, 'F');
      doc.setDrawColor(203, 213, 225);
      doc.rect(margin, y, contentWidth, 16, 'S');

      doc.setFontSize(8);
      doc.setTextColor(30, 41, 59);
      doc.setFont('helvetica', 'normal');
      doc.text(`Author: ${ROMAN_URDU_DOCS.author}`, margin + 4, y + 6);
      doc.text(`Version: ${ROMAN_URDU_DOCS.version}   |   Date: ${ROMAN_URDU_DOCS.releaseDate}`, margin + 4, y + 11);
      y += 22;

      // Executive Summary
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      doc.setFont('helvetica', 'normal');
      const summaryLines = doc.splitTextToSize(ROMAN_URDU_DOCS.summary, contentWidth);
      doc.text(summaryLines, margin, y);
      y += summaryLines.length * 4.5 + 6;

      // Divider
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, y, pageWidth - margin, y);
      y += 6;

      // Loop through all sections
      ROMAN_URDU_DOCS.sections.forEach((sec, idx) => {
        checkPageBreak(25);

        // Section Title
        doc.setFontSize(12);
        doc.setTextColor(5, 150, 105); // Emerald-600
        doc.setFont('helvetica', 'bold');
        doc.text(sec.title, margin, y);
        y += 6;

        // Section Subtitle
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        doc.setFont('helvetica', 'italic');
        doc.text(sec.subtitle, margin, y);
        y += 6;

        // Content Paragraphs
        sec.content.forEach(p => {
          doc.setFontSize(8.5);
          doc.setTextColor(30, 41, 59);
          doc.setFont('helvetica', 'normal');
          const pLines = doc.splitTextToSize(p, contentWidth);
          checkPageBreak(pLines.length * 4.2 + 4);
          doc.text(pLines, margin, y);
          y += pLines.length * 4.2 + 3;
        });

        // Key Points Box if present
        if (sec.keyPoints && sec.keyPoints.length > 0) {
          checkPageBreak(sec.keyPoints.length * 5 + 8);
          doc.setFillColor(240, 253, 244); // light green bg
          const boxHeight = sec.keyPoints.length * 5 + 6;
          doc.rect(margin, y, contentWidth, boxHeight, 'F');
          doc.setDrawColor(187, 247, 208);
          doc.rect(margin, y, contentWidth, boxHeight, 'S');

          let boxY = y + 5;
          sec.keyPoints.forEach(kp => {
            doc.setFontSize(8);
            doc.setTextColor(22, 101, 52); // green 800
            doc.setFont('helvetica', 'bold');
            doc.text("• " + kp, margin + 4, boxY);
            boxY += 5;
          });
          y += boxHeight + 4;
        }

        // Code Snippet Box if present
        if (sec.codeSnippet) {
          const codeLines = doc.splitTextToSize(sec.codeSnippet, contentWidth - 8);
          const snippetHeight = codeLines.length * 4 + 6;
          checkPageBreak(snippetHeight + 4);

          doc.setFillColor(15, 23, 42); // dark slate bg
          doc.rect(margin, y, contentWidth, snippetHeight, 'F');
          doc.setFontSize(7.5);
          doc.setTextColor(110, 231, 183); // light emerald
          doc.setFont('courier', 'normal');
          doc.text(codeLines, margin + 4, y + 5);
          y += snippetHeight + 6;
        }

        // Section separator
        doc.setDrawColor(241, 245, 249);
        doc.line(margin, y, pageWidth - margin, y);
        y += 5;
      });

      // Add Page Numbers to all pages
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.setFont('helvetica', 'normal');
        doc.text(
          `Page ${i} of ${totalPages}  •  OpenTube Network Technical Blueprint (Roman Urdu)`,
          pageWidth / 2,
          pageHeight - 8,
          { align: 'center' }
        );
      }

      // Download file
      doc.save('OpenTube_Network_Technical_Documentation_Roman_Urdu.pdf');
    } catch (err) {
      console.error('PDF Generation Error:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="w-full max-w-5xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:border-none print:shadow-none print:bg-white print:text-black">
        
        {/* Top Action Bar */}
        <div className="px-6 py-4 bg-zinc-950 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  OpenTube Technical Manual
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 uppercase">
                  Roman Urdu PDF & Guide
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono">
                Pora system kaise kaam karta hai aur is may kya kya use huwa hai
              </p>
            </div>
          </div>

          {/* Action Buttons: PDF Download & Print */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPdf}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition active:scale-95"
              title="Download full document as PDF file"
            >
              <Download className="w-4 h-4" />
              <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download PDF File'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition"
              title="Print document or Save via browser PDF"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button 
              onClick={onClose} 
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              aria-label="Close Documentation Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content Layout: Sidebar + Reader */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden print:overflow-visible">
          
          {/* Sidebar / Sections Menu */}
          <div className="w-full md:w-72 bg-zinc-950/80 border-r border-zinc-800/80 p-4 space-y-3 overflow-y-auto print:hidden">
            <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider font-bold">
              Sections Index
            </div>

            <div className="space-y-1">
              {ROMAN_URDU_DOCS.sections.map(section => {
                const isActive = activeSectionId === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSectionId(section.id)}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition-all ${
                      isActive
                        ? 'bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 font-semibold'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent'
                    }`}
                  >
                    <div className="truncate">{section.title}</div>
                  </button>
                );
              })}
            </div>

            {/* Quick PDF Card */}
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-emerald-950/40 to-teal-950/20 border border-emerald-800/40 space-y-2 mt-4">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                <Sparkles className="w-4 h-4" />
                <span>PDF Download Ready</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-snug">
                Is poore document ka mukammal multi-page PDF generate karne ke liye ooper "Download PDF File" button dabayein.
              </p>
            </div>
          </div>

          {/* Section Reader Panel */}
          <div className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-6 print:p-0">
            
            {/* Header of Active Section */}
            <div className="pb-4 border-b border-zinc-800 print:border-black">
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                Technical Specification
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-white mt-1 print:text-black">
                {currentSection.title}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 font-medium mt-1 print:text-zinc-700">
                {currentSection.subtitle}
              </p>
            </div>

            {/* Paragraphs */}
            <div className="space-y-3.5 text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans print:text-black">
              {currentSection.content.map((para, i) => (
                <p key={i} className="whitespace-pre-line">
                  {para}
                </p>
              ))}
            </div>

            {/* Key Takeaways Box */}
            {currentSection.keyPoints && currentSection.keyPoints.length > 0 && (
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/40 space-y-2 print:bg-gray-50 print:border-gray-300">
                <div className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Khaas Nuqaat (Key Takeaways)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-emerald-200/90 print:text-black">
                  {currentSection.keyPoints.map((pt, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400">•</span>
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Code Snippet Box */}
            {currentSection.codeSnippet && (
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-200 space-y-2 print:bg-gray-100 print:text-black">
                <div className="flex items-center justify-between text-zinc-500 text-[11px] pb-1 border-b border-zinc-900 print:border-gray-300">
                  <span>COMMAND / PIPELINE</span>
                  <button
                    onClick={() => handleCopyCode(currentSection.codeSnippet!)}
                    className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 print:hidden"
                  >
                    {copiedSnippet ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSnippet ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="text-emerald-400 overflow-x-auto print:text-black">{currentSection.codeSnippet}</pre>
              </div>
            )}

            {/* Navigation buttons at bottom */}
            <div className="pt-6 border-t border-zinc-800 flex items-center justify-between text-xs print:hidden">
              <span className="text-zinc-500 font-mono">
                OpenTube Protocol v2.4.1 • Sovereign Media
              </span>

              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold font-mono"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save this manual as PDF file</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
