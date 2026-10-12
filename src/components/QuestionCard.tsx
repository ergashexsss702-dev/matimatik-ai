import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { Language, Question } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { speechManager } from '../utils/audio';

interface QuestionCardProps {
  question: Question;
  index: number;
  language: Language;
  mode: 'study' | 'test';
  isGlobalShowAnswers: boolean;
  selectedOption?: string;
  onSelectOption?: (option: string) => void;
  isTestFinished?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  index,
  language,
  mode,
  isGlobalShowAnswers,
  selectedOption,
  onSelectOption,
  isTestFinished,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.uz;

  const [isAnswerExpanded, setIsAnswerExpanded] = useState<boolean>(false);
  const [isPlayingQuestion, setIsPlayingQuestion] = useState(false);
  const [isPlayingAnswer, setIsPlayingAnswer] = useState(false);

  // In study mode or if global show is toggled, answer can be visible
  const showAnswerDetails = isGlobalShowAnswers || isAnswerExpanded || (mode === 'test' && isTestFinished);

  const handleListenQuestion = () => {
    if (isPlayingQuestion) {
      speechManager.stop();
      setIsPlayingQuestion(false);
      return;
    }
    speechManager.stop();
    setIsPlayingAnswer(false);
    setIsPlayingQuestion(true);

    const textToSpeak = `${index + 1}-savol: ${question.question} ${question.formula ? '. Formula: ' + question.formula : ''}`;
    speechManager.speak(textToSpeak, language, (status) => {
      if (status === 'end' || status === 'error') {
        setIsPlayingQuestion(false);
      }
    });
  };

  const handleListenAnswer = () => {
    if (isPlayingAnswer) {
      speechManager.stop();
      setIsPlayingAnswer(false);
      return;
    }
    speechManager.stop();
    setIsPlayingQuestion(false);
    setIsPlayingAnswer(true);

    const stepsText = question.steps.join('. ');
    const textToSpeak = `To‘g‘ri javob: ${question.correctAnswer}. ${question.explanation}. Yechish bosqichlari: ${stepsText}`;

    speechManager.speak(textToSpeak, language, (status) => {
      if (status === 'end' || status === 'error') {
        setIsPlayingAnswer(false);
      }
    });
  };

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 p-5 sm:p-7 shadow-xl shadow-black/20 backdrop-blur-xl transition-all duration-300 hover:border-indigo-500/30 hover:shadow-indigo-950/20">
      {/* Top Bar: Question Number & Speech Action */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 text-xs font-extrabold text-white shadow-md shadow-indigo-500/30">
            #{index + 1}
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
            {index + 1}-savol
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Listen Question Button */}
          <button
            type="button"
            onClick={handleListenQuestion}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
              isPlayingQuestion
                ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300 animate-pulse'
                : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
            title={t.listenQuestion}
          >
            {isPlayingQuestion ? (
              <VolumeX className="h-3.5 w-3.5 text-indigo-400" />
            ) : (
              <Volume2 className="h-3.5 w-3.5 text-indigo-400" />
            )}
            <span className="hidden sm:inline">{t.listenQuestion}</span>
          </button>
        </div>
      </div>

      {/* Question Text */}
      <div className="mb-4 space-y-2">
        <p className="text-base sm:text-lg font-semibold text-white leading-relaxed">
          {question.question}
        </p>

        {/* Formula Display if provided */}
        {question.formula && (
          <div className="inline-block rounded-xl bg-indigo-950/40 border border-indigo-500/30 px-3.5 py-1.5 font-mono text-sm sm:text-base font-bold text-indigo-200 shadow-inner">
            {question.formula}
          </div>
        )}
      </div>

      {/* Multiple-Choice Options (Always rendered in Test Mode, or if options exist) */}
      {question.options && question.options.length > 0 && (
        <div className="mb-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {question.options.map((option, optIdx) => {
            const letter = String.fromCharCode(65 + optIdx); // A, B, C, D
            const isSelected = selectedOption === option;
            const isCorrect = option === question.correctAnswer;
            const showCorrectness = isTestFinished && mode === 'test';

            let btnStyle = 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10';

            if (isSelected) {
              btnStyle = 'border-indigo-500 bg-indigo-500/20 text-indigo-200 ring-2 ring-indigo-500/40';
            }

            if (showCorrectness) {
              if (isCorrect) {
                btnStyle = 'border-emerald-500 bg-emerald-500/20 text-emerald-200 ring-2 ring-emerald-500/50';
              } else if (isSelected && !isCorrect) {
                btnStyle = 'border-red-500 bg-red-500/20 text-red-200 ring-2 ring-red-500/50';
              }
            }

            return (
              <button
                key={optIdx}
                type="button"
                disabled={isTestFinished}
                onClick={() => onSelectOption?.(option)}
                className={`flex items-center gap-3 rounded-2xl border p-3 text-left text-sm font-medium transition cursor-pointer ${btnStyle}`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl font-bold text-xs ${
                    isSelected
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white/10 text-slate-400'
                  }`}
                >
                  {letter}
                </span>
                <span className="flex-1 font-mono">{option}</span>
                {showCorrectness && isCorrect && (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Toggle Answer Section */}
      <div className="border-t border-white/10 pt-4">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setIsAnswerExpanded(!isAnswerExpanded)}
            className="flex items-center gap-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-2 text-xs font-semibold text-slate-200 transition cursor-pointer"
          >
            <BookOpen className="h-3.5 w-3.5 text-indigo-400" />
            <span>
              {showAnswerDetails ? t.hideAnswers : t.showAnswers}
            </span>
            {showAnswerDetails ? (
              <ChevronUp className="h-3.5 w-3.5 text-slate-400" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            )}
          </button>

          {showAnswerDetails && (
            <button
              type="button"
              onClick={handleListenAnswer}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition cursor-pointer ${
                isPlayingAnswer
                  ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 animate-pulse'
                  : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
              title={t.listenAnswer}
            >
              {isPlayingAnswer ? (
                <VolumeX className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <Volume2 className="h-3.5 w-3.5 text-emerald-400" />
              )}
              <span className="hidden sm:inline">{t.listenAnswer}</span>
            </button>
          )}
        </div>

        {/* Expanded Answer Content */}
        {showAnswerDetails && (
          <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-4 sm:p-5 text-sm space-y-3.5 animate-in fade-in slide-in-from-top-2">
            {/* Correct Answer */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-emerald-400">
                {t.correctAnswerText}
              </span>
              <span className="rounded-xl bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 font-mono font-bold text-emerald-200 text-base">
                {question.correctAnswer}
              </span>
            </div>

            {/* Step-by-Step Solution */}
            {question.steps && question.steps.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {t.stepByStepSolution}
                </p>
                <div className="space-y-1.5 pl-1">
                  {question.steps.map((step, sIdx) => (
                    <div
                      key={sIdx}
                      className="flex items-start gap-2 text-xs sm:text-sm text-slate-300"
                    >
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-emerald-400 mt-1" />
                      <span className="font-mono">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Simple Explanation */}
            {question.explanation && (
              <div className="rounded-xl bg-white/5 p-3 text-xs sm:text-sm text-slate-300 border border-white/5">
                <span className="font-semibold text-indigo-300 mr-1.5">
                  {t.simpleExplanation}
                </span>
                <span>{question.explanation}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
