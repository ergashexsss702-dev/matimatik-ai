import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Layers,
  BookOpen,
  Hash,
  Play,
  RotateCcw,
  Copy,
  Printer,
  Download,
  CheckCircle2,
  HelpCircle,
  Volume2,
  Eye,
  EyeOff,
  Trophy,
  History,
  Check,
  Award,
} from 'lucide-react';
import { GradeLevel, Language, Question, SubjectType, UserSession } from '../types';
import { CURRICULUM, QUESTION_COUNT_OPTIONS } from '../data/curriculum';
import { TRANSLATIONS } from '../i18n/translations';
import { QuestionCard } from './QuestionCard';
import { AudioControls } from './AudioControls';
import { speechManager } from '../utils/audio';
import { generateAlgorithmicQuestions } from '../utils/mathEngine';

interface DashboardProps {
  language: Language;
  user: UserSession;
}

interface QuestionHistoryItem {
  id: string;
  grade: GradeLevel;
  subject: SubjectType;
  topic: string;
  count: number;
  mode: 'study' | 'test';
  questions: Question[];
  timestamp: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ language, user }) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.uz;

  // Selections
  const [grade, setGrade] = useState<GradeLevel>(5);
  const [subject, setSubject] = useState<SubjectType>('Matematika');
  const [topic, setTopic] = useState<string>('Oddiy kasrlar va ular ustida amallar');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [customCountInput, setCustomCountInput] = useState<string>('');
  const [isCustomCount, setIsCustomCount] = useState<boolean>(false);
  const [mode, setMode] = useState<'study' | 'test'>('study');

  // Generated Questions state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isGlobalShowAnswers, setIsGlobalShowAnswers] = useState<boolean>(false);

  // Test mode user answers & results
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [isTestFinished, setIsTestFinished] = useState<boolean>(false);
  const [testScore, setTestScore] = useState<{ correct: number; total: number; percentage: number } | null>(null);

  // Audio queue playing
  const [isQueuePlaying, setIsQueuePlaying] = useState<boolean>(false);
  const [queueProgress, setQueueProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });
  const [speechSpeed, setSpeechSpeed] = useState<number>(1.0);

  // History & toast
  const [history, setHistory] = useState<QuestionHistoryItem[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Update topics whenever grade or subject changes
  const availableTopics = React.useMemo(() => {
    const gradeData = CURRICULUM[grade];
    if (!gradeData) return ['Qo‘shish va ayirish'];
    if (subject === 'Algebra') {
      return gradeData.Algebra || ['Algebraik ifodalar', 'Chiziqli tenglamalar', 'Ko‘phadlar'];
    }
    return gradeData.Matematika || ['Natural sonlar', 'Qo‘shish va ayirish'];
  }, [grade, subject]);

  useEffect(() => {
    if (availableTopics.length > 0 && !availableTopics.includes(topic)) {
      setTopic(availableTopics[0]);
    }
  }, [availableTopics]);

  // If grade < 7 and subject was Algebra, default to Matematika gracefully
  useEffect(() => {
    if (grade < 7 && subject === 'Algebra') {
      setSubject('Matematika');
    }
  }, [grade]);

  // Generate Questions handler
  const handleGenerateQuestions = async () => {
    const finalCount = isCustomCount
      ? Math.min(Math.max(parseInt(customCountInput) || 5, 1), 50)
      : questionCount;

    setLoading(true);
    setIsTestFinished(false);
    setUserAnswers({});
    setTestScore(null);
    speechManager.stop();
    setIsQueuePlaying(false);

    try {
      const response = await fetch('/api/questions/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade,
          subject,
          topic,
          count: finalCount,
          mode,
          language,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success && Array.isArray(data.questions)) {
        setQuestions(data.questions);

        // Save to recent history
        const newHistoryItem: QuestionHistoryItem = {
          id: `hist_${Date.now()}`,
          grade,
          subject,
          topic,
          count: data.questions.length,
          mode,
          questions: data.questions,
          timestamp: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
        };
        setHistory((prev) => [newHistoryItem, ...prev.slice(0, 9)]);
      } else {
        throw new Error('API response invalid, using math engine');
      }
    } catch (err) {
      console.warn('Fallback to built-in high-accuracy math engine:', err);
      const fallbackQuestions = generateAlgorithmicQuestions(grade, subject, topic, finalCount, language);
      setQuestions(fallbackQuestions);
      const newHistoryItem: QuestionHistoryItem = {
        id: `hist_${Date.now()}`,
        grade,
        subject,
        topic,
        count: fallbackQuestions.length,
        mode,
        questions: fallbackQuestions,
        timestamp: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
      };
      setHistory((prev) => [newHistoryItem, ...prev.slice(0, 9)]);
    } finally {
      setLoading(false);
    }
  };

  // Select Option in Quiz
  const handleSelectOption = (qIndex: number, option: string) => {
    if (isTestFinished) return;
    setUserAnswers((prev) => ({
      ...prev,
      [qIndex]: option,
    }));
  };

  // Finish Quiz Evaluation
  const handleFinishTest = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswer) {
        correct++;
      }
    });
    const percentage = Math.round((correct / questions.length) * 100);
    setTestScore({ correct, total: questions.length, percentage });
    setIsTestFinished(true);
    setIsGlobalShowAnswers(true);
  };

  // Listen to All Queue
  const handleListenAll = () => {
    if (questions.length === 0) return;

    if (isQueuePlaying) {
      speechManager.stop();
      setIsQueuePlaying(false);
      return;
    }

    const itemsToRead: string[] = [];
    questions.forEach((q, idx) => {
      itemsToRead.push(`${idx + 1}-savol: ${q.question} ${q.formula ? '. Formula: ' + q.formula : ''}`);
      itemsToRead.push(`To‘g‘ri javob: ${q.correctAnswer}. ${q.explanation}`);
    });

    setIsQueuePlaying(true);
    setQueueProgress({ current: 1, total: questions.length });

    speechManager.playQueue(
      itemsToRead,
      language,
      (current, _total) => {
        const questionIdx = Math.ceil(current / 2);
        setQueueProgress({ current: questionIdx, total: questions.length });
      },
      () => {
        setIsQueuePlaying(false);
      }
    );
  };

  const handleStopAudio = () => {
    speechManager.stop();
    setIsQueuePlaying(false);
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeechSpeed(newSpeed);
    speechManager.setSpeed(newSpeed);
  };

  // Copy Questions
  const handleCopyQuestions = () => {
    if (questions.length === 0) return;

    let text = `“Savollarni javobi bilan”\n`;
    text += `${grade}-sinf | ${subject} | Mavzu: ${topic}\n\n`;

    questions.forEach((q, idx) => {
      text += `${idx + 1}-savol: ${q.question}\n`;
      if (q.formula) text += `Formula: ${q.formula}\n`;
      if (q.options && q.options.length > 0) {
        text += `Variantlar: ${q.options.join(' | ')}\n`;
      }
      text += `To‘g‘ri javob: ${q.correctAnswer}\n`;
      text += `Yechilishi:\n${q.steps.map((s) => ' - ' + s).join('\n')}\n`;
      text += `Izoh: ${q.explanation}\n\n`;
    });

    navigator.clipboard.writeText(text);
    showToast(t.copiedNotice);
  };

  // Print Results
  const handlePrint = () => {
    window.print();
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Load from history
  const handleLoadHistory = (item: QuestionHistoryItem) => {
    setGrade(item.grade);
    setSubject(item.subject);
    setTopic(item.topic);
    setMode(item.mode);
    setQuestions(item.questions);
    setIsTestFinished(false);
    setUserAnswers({});
    setTestScore(null);
    setShowHistoryModal(false);
  };

  return (
    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-2xl border border-emerald-500/40 bg-emerald-950/90 px-4 py-3 text-xs font-semibold text-emerald-200 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-3">
          <Check className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Welcome & Grade Selection Panel */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 p-6 sm:p-8 shadow-2xl shadow-black/30 backdrop-blur-2xl">
        {/* Glow ambient background accents */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
                <Sparkles className="h-4 w-4" />
                <span>Interaktiv ta’lim muhiti</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Matematika va Algebra Savollari
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                O‘quvchining sinf darajasiga mos aqlli savollar, hisoblangan to‘g‘ri javoblar va audio tushuntirishlar.
              </p>
            </div>

            {/* Mode Switcher: Study vs Test */}
            <div className="flex rounded-2xl border border-white/10 bg-black/40 p-1 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setMode('study')}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
                  mode === 'study'
                    ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>{t.modeStudy}</span>
              </button>
              <button
                type="button"
                onClick={() => setMode('test')}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
                  mode === 'test'
                    ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Trophy className="h-3.5 w-3.5" />
                <span>{t.modeTest}</span>
              </button>
            </div>
          </div>

          {/* Form Filter Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {/* 1. SINF TANLASH (1-11) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                1. {t.selectGrade}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as GradeLevel[]).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGrade(g)}
                    className={`h-9 px-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      grade === g
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-2 ring-indigo-400'
                        : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {g}-sinf
                  </button>
                ))}
              </div>
            </div>

            {/* 2. FAN TANLASH (Matematika & Algebra) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                2. {t.selectSubject}
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSubject('Matematika')}
                  className={`flex-1 rounded-2xl py-2.5 px-3 text-xs font-bold transition border cursor-pointer ${
                    subject === 'Matematika'
                      ? 'border-indigo-500 bg-indigo-500/20 text-indigo-200 ring-2 ring-indigo-500/40'
                      : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  Matematika
                </button>
                <button
                  type="button"
                  onClick={() => setSubject('Algebra')}
                  className={`flex-1 rounded-2xl py-2.5 px-3 text-xs font-bold transition border cursor-pointer ${
                    subject === 'Algebra'
                      ? 'border-indigo-500 bg-indigo-500/20 text-indigo-200 ring-2 ring-indigo-500/40'
                      : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  Algebra
                </button>
              </div>
              {grade < 7 && subject === 'Algebra' && (
                <p className="text-[10px] text-amber-400">
                  Algebra fani odatda 7-sinfdan boshlanadi.
                </p>
              )}
            </div>

            {/* 3. MAVZU TANLASH */}
            <div className="space-y-1.5 md:col-span-2 lg:col-span-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                3. {t.selectTopic}
              </label>
              <div className="relative">
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 py-2.5 px-3 text-xs font-medium text-white outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                >
                  {availableTopics.map((top, idx) => (
                    <option key={idx} value={top} className="bg-slate-900 text-white">
                      {top}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 4. SAVOLLAR SONI (5, 10, 15, 20, 30, 50 yoki o‘zi kiritadi) */}
            <div className="space-y-1.5 md:col-span-2 lg:col-span-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                4. {t.selectCount}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {QUESTION_COUNT_OPTIONS.map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => {
                      setIsCustomCount(false);
                      setQuestionCount(cnt);
                    }}
                    className={`h-9 px-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      !isCustomCount && questionCount === cnt
                        ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-400'
                        : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {cnt} ta
                  </button>
                ))}
              </div>

              {/* Custom Count Option */}
              <div className="pt-1 flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={customCountInput}
                  onChange={(e) => {
                    setCustomCountInput(e.target.value);
                    setIsCustomCount(true);
                  }}
                  placeholder={t.customCountLabel}
                  className={`w-24 rounded-xl border bg-slate-950/70 px-2.5 py-1.5 text-xs text-white outline-none ${
                    isCustomCount ? 'border-indigo-400 ring-1 ring-indigo-400' : 'border-white/10'
                  }`}
                />
                <span className="text-[11px] text-slate-400">
                  (Maksimal 50 ta)
                </span>
              </div>
            </div>
          </div>

          {/* Action Row: Generate Button & History */}
          <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-white/10">
            <div className="flex items-center gap-2">
              {history.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowHistoryModal(true)}
                  className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition cursor-pointer"
                >
                  <History className="h-4 w-4 text-indigo-400" />
                  <span>{t.backToPrevious} ({history.length})</span>
                </button>
              )}
            </div>

            {/* PRIMARY GLOWING BUTTON: Savollarni yaratish */}
            <button
              type="button"
              onClick={handleGenerateQuestions}
              disabled={loading}
              className="group relative flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 px-8 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-indigo-500/30 transition-all hover:shadow-indigo-500/50 hover:brightness-110 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              <div className="pointer-events-none absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 opacity-50 blur group-hover:opacity-100 transition duration-300" />
              <div className="relative flex items-center gap-2">
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>{t.generating}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>{t.generateBtn}</span>
                  </>
                )}
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* QUIZ SCORE BANNER (When Test finished) */}
      {isTestFinished && testScore && (
        <div className="relative overflow-hidden rounded-3xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/60 to-slate-900/80 p-6 shadow-2xl backdrop-blur-2xl animate-in zoom-in-95">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shadow-lg">
                <Award className="h-9 w-9" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  {t.testResults}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  {testScore.percentage >= 70 ? t.congrats : t.keepPracticing}
                </p>
              </div>
            </div>

            {/* Stats chips */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-center">
                <span className="block text-xs text-emerald-300 font-semibold">{t.correctCount}</span>
                <span className="font-mono text-xl font-extrabold text-emerald-200">{testScore.correct}</span>
              </div>
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-center">
                <span className="block text-xs text-red-300 font-semibold">{t.incorrectCount}</span>
                <span className="font-mono text-xl font-extrabold text-red-200">{testScore.total - testScore.correct}</span>
              </div>
              <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 px-5 py-2 text-center">
                <span className="block text-xs text-indigo-300 font-semibold">{t.percentage}</span>
                <span className="font-mono text-xl font-extrabold text-indigo-200">{testScore.percentage}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QUESTIONS LIST SECTION */}
      {questions.length > 0 && (
        <section className="space-y-5">
          {/* Controls Bar above questions */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Savollar ro‘yxati ({questions.length} ta)
              </span>
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold text-slate-300">
                {grade}-sinf | {subject}
              </span>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Show/Hide Answers bulk */}
              <button
                type="button"
                onClick={() => setIsGlobalShowAnswers(!isGlobalShowAnswers)}
                className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-2 text-xs font-semibold text-slate-200 transition cursor-pointer"
              >
                {isGlobalShowAnswers ? (
                  <>
                    <EyeOff className="h-3.5 w-3.5 text-indigo-400" />
                    <span>{t.hideAnswers}</span>
                  </>
                ) : (
                  <>
                    <Eye className="h-3.5 w-3.5 text-indigo-400" />
                    <span>{t.showAnswers}</span>
                  </>
                )}
              </button>

              {/* Listen to All Audio */}
              <button
                type="button"
                onClick={handleListenAll}
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition cursor-pointer ${
                  isQueuePlaying
                    ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300 animate-pulse'
                    : 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'
                }`}
              >
                <Volume2 className="h-3.5 w-3.5 text-indigo-400" />
                <span>{isQueuePlaying ? t.stopAudio : t.listenAll}</span>
              </button>

              {/* Copy Questions */}
              <button
                type="button"
                onClick={handleCopyQuestions}
                className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-2 text-xs font-semibold text-slate-200 transition cursor-pointer"
                title={t.copyQuestions}
              >
                <Copy className="h-3.5 w-3.5 text-indigo-400" />
                <span className="hidden sm:inline">{t.copyQuestions}</span>
              </button>

              {/* Print / PDF */}
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-2 text-xs font-semibold text-slate-200 transition cursor-pointer"
                title={t.printResults}
              >
                <Printer className="h-3.5 w-3.5 text-indigo-400" />
                <span className="hidden sm:inline">{t.printResults}</span>
              </button>
            </div>
          </div>

          {/* Render Question Cards */}
          <div className="space-y-4">
            {questions.map((q, idx) => (
              <QuestionCard
                key={q.id || idx}
                question={q}
                index={idx}
                language={language}
                mode={mode}
                isGlobalShowAnswers={isGlobalShowAnswers}
                selectedOption={userAnswers[idx]}
                onSelectOption={(opt) => handleSelectOption(idx, opt)}
                isTestFinished={isTestFinished}
              />
            ))}
          </div>

          {/* Test Mode Finish Action */}
          {mode === 'test' && !isTestFinished && (
            <div className="flex justify-center pt-4">
              <button
                type="button"
                onClick={handleFinishTest}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-emerald-500/25 hover:brightness-110 active:scale-[0.99] transition cursor-pointer"
              >
                <CheckCircle2 className="h-5 w-5" />
                <span>{t.finishTest}</span>
              </button>
            </div>
          )}
        </section>
      )}

      {/* Audio Queue Controls floating bar */}
      <AudioControls
        language={language}
        isQueuePlaying={isQueuePlaying}
        queueProgress={queueProgress}
        onStop={handleStopAudio}
        speed={speechSpeed}
        onSpeedChange={handleSpeedChange}
      />

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-slate-900/95 shadow-2xl p-6 text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <h4 className="font-bold text-base flex items-center gap-2">
                <History className="h-5 w-5 text-indigo-400" />
                <span>{t.backToPrevious}</span>
              </h4>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-2.5">
              {history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleLoadHistory(item)}
                  className="w-full flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-3.5 text-left hover:bg-white/10 transition cursor-pointer"
                >
                  <div>
                    <p className="text-xs font-bold text-white">
                      {item.grade}-sinf | {item.subject}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate max-w-[260px]">
                      {item.topic}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-[10px] text-indigo-300 font-bold">
                      {item.count} ta
                    </span>
                    <span className="block text-[10px] text-slate-500 mt-1">
                      {item.timestamp}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
