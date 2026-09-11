import React, { useState } from 'react';
import {
  FileText,
  Image as ImageIcon,
  Headphones,
  Video,
  Globe,
  UploadCloud,
  FileCode,
  Users,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { SourceType, Source, Flashcard, Quiz } from '../types';
import { processSource } from '../services/api';

interface SourceCreationProps {
  onSourceCreated: (source: Source, flashcards: Flashcard[], quiz: Quiz) => void;
  onCancel: () => void;
}

export const SourceCreation: React.FC<SourceCreationProps> = ({
  onSourceCreated,
  onCancel,
}) => {
  const [selectedType, setSelectedType] = useState<SourceType>('pdf');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [rawText, setRawText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [isMeetingMode, setIsMeetingMode] = useState(false);

  // Stepper state for processing
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const steps = [
    'Step 1/5 — Extracting content',
    'Step 2/5 — Cleaning content & removing boilerplate',
    'Step 3/5 — Creating knowledge chunks & metadata',
    'Step 4/5 — Building semantic vector index',
    'Step 5/5 — Generating 12-section summary & study tools',
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '));
      }

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Strip data:mime/type;base64, prefix
        const base64 = result.split(',')[1];
        setFileBase64(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '));
      }
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        setFileBase64(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('Please provide a title for this knowledge source.');
      return;
    }

    setErrorMessage(null);
    setIsProcessing(true);
    setCurrentStep(0);

    // Progress stepper animation loop
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1200);

    try {
      const result = await processSource({
        title: title.trim(),
        type: selectedType,
        content: rawText.trim() || undefined,
        fileBase64: fileBase64 || undefined,
        mimeType: selectedFile?.type,
        url: url.trim() || undefined,
        filename: selectedFile?.name,
        isMeetingMode,
      });

      clearInterval(stepInterval);
      setCurrentStep(steps.length);
      setTimeout(() => {
        onSourceCreated(result.source, result.flashcards, result.quiz);
      }, 500);
    } catch (err: any) {
      clearInterval(stepInterval);
      setIsProcessing(false);
      setErrorMessage(err.message || 'Failed to process knowledge source. Please check inputs.');
    }
  };

  const loadSampleNotes = (sampleTitle: string, sampleContent: string, type: SourceType) => {
    setSelectedType(type);
    setTitle(sampleTitle);
    setRawText(sampleContent);
    setUrl('');
    setSelectedFile(null);
    setFileBase64(null);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-12">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-slate-900">
            Create Knowledge Source
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            KITTAB extracts, structures, and indexes your real-world learning materials for RAG.
          </p>
        </div>
        <button
          onClick={onCancel}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
        >
          Cancel
        </button>
      </div>

      {/* Type Selector Tabs */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-7">
        {[
          { id: 'pdf' as SourceType, label: 'PDF Document', icon: FileText },
          { id: 'notes' as SourceType, label: 'Notes / OCR', icon: ImageIcon },
          { id: 'audio' as SourceType, label: 'Audio / Call', icon: Headphones },
          { id: 'video' as SourceType, label: 'Video File', icon: Video },
          { id: 'youtube' as SourceType, label: 'YouTube URL', icon: Video },
          { id: 'web' as SourceType, label: 'Website URL', icon: Globe },
          { id: 'text' as SourceType, label: 'Study Text', icon: FileCode },
        ].map((t) => {
          const Icon = t.icon;
          const isSelected = selectedType === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedType(t.id)}
              className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all ${
                isSelected
                  ? 'border-amber-600 bg-amber-50/80 text-amber-950 font-semibold shadow-xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Icon
                className={`h-5 w-5 ${
                  isSelected ? 'text-amber-700' : 'text-slate-400'
                }`}
              />
              <span className="text-[11px] leading-tight">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        {/* Source Title Input */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            Knowledge Source Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Operating Systems — Process Synchronization & Deadlocks"
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          />
        </div>

        {/* Meeting / Call Mode Toggle */}
        {(selectedType === 'audio' || selectedType === 'video' || selectedType === 'text') && (
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
            <div className="flex items-center gap-2.5">
              <Users className="h-5 w-5 text-amber-700" />
              <div>
                <div className="text-xs font-bold text-slate-900">Meeting / Online Lecture Mode</div>
                <div className="text-[11px] text-slate-500">
                  Automatically extracts speakers, key decisions, action items, and follow-up tasks.
                </div>
              </div>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={isMeetingMode}
                onChange={(e) => setIsMeetingMode(e.target.checked)}
                className="peer sr-only"
              />
              <div className="peer h-5 w-9 rounded-full bg-slate-300 peer-checked:bg-amber-700 peer-focus:outline-none peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all"></div>
            </label>
          </div>
        )}

        {/* Input Specific Form Elements */}
        {/* 1. File Upload (PDF, Notes/Images, Audio, Video) */}
        {(selectedType === 'pdf' || selectedType === 'notes' || selectedType === 'audio' || selectedType === 'video') && (
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-800">
              Upload {selectedType === 'pdf' ? 'PDF File' : selectedType === 'notes' ? 'Handwritten Image / Document' : selectedType === 'audio' ? 'Audio File (MP3, WAV, M4A)' : 'Video File'}
            </label>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-8 text-center transition-colors hover:border-amber-500 hover:bg-amber-50/30"
            >
              <UploadCloud className="h-10 w-10 text-slate-400 mb-2" />
              <p className="text-xs font-semibold text-slate-700">
                Drag and drop your file here, or{' '}
                <label className="cursor-pointer text-amber-700 hover:underline">
                  browse files
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept={
                      selectedType === 'pdf'
                        ? '.pdf'
                        : selectedType === 'notes'
                        ? 'image/png,image/jpeg,image/webp,image/jpg'
                        : selectedType === 'audio'
                        ? 'audio/mp3,audio/wav,audio/m4a,audio/mp4,audio/ogg'
                        : 'video/mp4,video/webm,video/quicktime,video/x-matroska'
                    }
                    className="hidden"
                  />
                </label>
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                {selectedType === 'pdf'
                  ? 'Supports multi-page textbooks, lecture slides, and notes'
                  : selectedType === 'notes'
                  ? 'EasyOCR extracts printed and handwritten notes (PNG, JPG, WEBP)'
                  : selectedType === 'audio'
                  ? 'Whisper transcription for lectures, meeting audio, and voice notes'
                  : 'Video audio extraction and key scenes'}
              </p>

              {selectedFile && (
                <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-amber-900 border border-amber-200 shadow-2xs">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>{selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
                </div>
              )}
            </div>

            {selectedType === 'notes' && (
              <div className="rounded-lg bg-amber-50/80 border border-amber-200 p-3 text-xs text-amber-900 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong>OCR Accuracy Note:</strong> Handwritten notes are processed using advanced optical character recognition. Accuracy may vary depending on handwriting clarity, cursive styling, and image contrast.
                </span>
              </div>
            )}
          </div>
        )}

        {/* 2. URL Input (YouTube or Website) */}
        {(selectedType === 'youtube' || selectedType === 'web') && (
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              {selectedType === 'youtube' ? 'YouTube Video URL' : 'Website or Documentation URL'} *
            </label>
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={
                selectedType === 'youtube'
                  ? 'https://www.youtube.com/watch?v=...'
                  : 'https://en.wikipedia.org/wiki/... or article URL'
              }
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              {selectedType === 'youtube'
                ? 'KITTAB retrieves the video transcripts, chapters, and generates timestamped notes.'
                : 'Scrapes main articles, cleans navigation boilerplate, and preserves headings and lists.'}
            </p>
          </div>
        )}

        {/* 3. Direct Text / Study Notes Area */}
        {selectedType === 'text' && (
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Study Notes / Article Content *
            </label>
            <textarea
              required
              rows={8}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste raw lecture notes, book summaries, code walk-throughs, or meeting minutes here..."
              className="w-full rounded-xl border border-slate-300 p-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
          </div>
        )}

        {/* Quick Sample Presets */}
        <div className="border-t border-slate-100 pt-4">
          <div className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
            <span>Or load a curated study sample:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                loadSampleNotes(
                  'Computer Networks — OSI & TCP/IP Architecture',
                  `Computer Networks: OSI and TCP/IP Reference Models.

The OSI 7-layer model: Physical, Data Link, Network, Transport, Session, Presentation, Application.
1. Physical Layer: Transmits raw bits over cables or radio frequencies.
2. Data Link Layer: Framing, MAC addressing (e.g. Ethernet 802.3), and error detection using CRC checksums.
3. Network Layer: Logical IP addressing and packet routing across networks (IPv4, IPv6, BGP, OSPF).
4. Transport Layer: End-to-end communication, port addressing, reliability, and flow control. TCP provides reliable byte streams via 3-way handshakes (SYN, SYN-ACK, ACK) and sliding window flow control. UDP provides lightweight, connectionless datagram delivery with minimal latency.
5. Application Layer: High-level protocols such as HTTP/HTTPS, DNS, and SSH.

Key Differences Between TCP and UDP:
TCP guarantees delivery through acknowledgments and retransmissions. UDP does not guarantee packet arrival, making it optimal for real-time video streaming, gaming, and VoIP.`,
                  'text'
                )
              }
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700 hover:border-amber-400 hover:bg-amber-50"
            >
              Networks (TCP/IP & OSI)
            </button>

            <button
              type="button"
              onClick={() =>
                loadSampleNotes(
                  'Software Architecture — Distributed Consensus & Paxos',
                  `Distributed Systems: Consensus, Raft, and Paxos.

Consensus is the fundamental problem of getting a set of independent server nodes to agree on a state value despite partial network partitions and server crashes.
The FLP Impossibility Theorem establishes that in an asynchronous network, no deterministic consensus algorithm can guarantee liveness in the presence of even a single unannounced fail-stop process.

Raft Consensus Algorithm:
Raft decomposes consensus into three independent subproblems:
1. Leader Election: A randomized election timer triggers candidate voting. If a candidate secures a quorum (majority: N/2 + 1), it becomes leader.
2. Log Replication: The leader receives client commands, writes them to its log, and forces follower logs to duplicate its sequence.
3. Safety: If any server has applied a particular log entry to its state machine, no other server may apply a different command for the same log index.`,
                  'text'
                )
              }
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700 hover:border-amber-400 hover:bg-amber-50"
            >
              Distributed Consensus (Raft/Paxos)
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-300 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isProcessing}
            className="flex items-center gap-2 rounded-xl bg-amber-700 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-amber-800 disabled:opacity-50 transition-all"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Processing Source...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Process & Create Source</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Progressive Stepper Modal matching Section 32 */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl space-y-5">
            <div className="text-center space-y-1">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Processing Knowledge Source...
              </h3>
              <p className="text-xs text-slate-500">
                Converting raw input into structured knowledge, vectors, and study tools.
              </p>
            </div>

            <div className="space-y-2.5">
              {steps.map((stepText, idx) => {
                const isDone = currentStep > idx;
                const isCurrent = currentStep === idx;
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs transition-colors ${
                      isDone
                        ? 'bg-emerald-50/70 text-emerald-900 font-medium'
                        : isCurrent
                        ? 'bg-amber-50 text-amber-900 font-semibold'
                        : 'text-slate-400'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    ) : isCurrent ? (
                      <Loader2 className="h-4 w-4 text-amber-700 animate-spin shrink-0" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-slate-300 shrink-0" />
                    )}
                    <span>{stepText}</span>
                  </div>
                );
              })}
            </div>

            {currentStep >= steps.length && (
              <div className="flex items-center justify-center gap-1 text-xs font-semibold text-emerald-600 animate-pulse">
                <CheckCircle2 className="h-4 w-4" />
                <span>Completed ✓ Opening knowledge source...</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
