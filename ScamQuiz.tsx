import React, { useState } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Award,
  BookOpen,
} from 'lucide-react';
import { quizQuestions } from '@/data/scamData';

const ScamQuiz: React.FC = () => {
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = quizQuestions[currentQ];

  const handleAnswer = (index: number) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
    setShowExplanation(true);
    if (index === question.correctIndex) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQ < quizQuestions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setFinished(true);
    }
  };

  const handleRestart = () => {
    setStarted(false);
    setCurrentQ(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setFinished(false);
  };

  const getScoreMessage = () => {
    const pct = (score / quizQuestions.length) * 100;
    if (pct === 100) return { title: 'Perfect Score!', msg: 'You are a scam-spotting expert! Share what you know with friends and family.', color: 'text-green-700' };
    if (pct >= 80) return { title: 'Great Job!', msg: 'You have strong scam awareness. Keep learning and stay vigilant.', color: 'text-green-600' };
    if (pct >= 60) return { title: 'Good Effort!', msg: 'You are on the right track. Review the scam types above to strengthen your knowledge.', color: 'text-blue-600' };
    return { title: 'Keep Learning!', msg: 'Knowledge is power. Review our scam types section and try again — you will do better!', color: 'text-orange-600' };
  };

  // Start screen
  if (!started) {
    return (
      <section id="scam-quiz" className="bg-white py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-3xl p-10 lg:p-14 text-white">
            <div className="bg-white/10 p-4 rounded-2xl inline-block mb-6">
              <HelpCircle className="w-12 h-12" />
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">
              Can You Spot the Scam?
            </h2>
            <p className="text-xl text-blue-100 leading-relaxed mb-8 max-w-xl mx-auto">
              Test your knowledge with {quizQuestions.length} real-world
              scenarios. Each question teaches you something new about staying
              safe.
            </p>
            <button
              onClick={() => setStarted(true)}
              className="px-10 py-5 bg-green-500 hover:bg-green-600 text-white text-2xl font-bold rounded-2xl transition-all shadow-lg shadow-green-500/30 hover:shadow-green-500/50"
            >
              Start the Quiz
            </button>
            <p className="mt-6 text-blue-200 text-lg">
              No sign-up needed. Takes about 5 minutes.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Finished screen
  if (finished) {
    const result = getScoreMessage();
    return (
      <section id="scam-quiz" className="bg-white py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-50 to-green-50 border-2 border-blue-200 rounded-3xl p-10 lg:p-14 text-center">
            <div className="bg-blue-100 p-4 rounded-2xl inline-block mb-6">
              <Award className="w-12 h-12 text-blue-900" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Quiz Complete!
            </h2>
            <div className="text-6xl font-bold text-blue-900 my-6">
              {score} / {quizQuestions.length}
            </div>
            <h3 className={`text-2xl font-bold ${result.color} mb-3`}>
              {result.title}
            </h3>
            <p className="text-xl text-gray-600 leading-relaxed mb-8 max-w-lg mx-auto">
              {result.msg}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleRestart}
                className="px-8 py-4 bg-blue-900 hover:bg-blue-800 text-white text-xl font-bold rounded-xl transition-colors flex items-center justify-center gap-3"
              >
                <RotateCcw className="w-6 h-6" />
                Try Again
              </button>
              <button
                onClick={() => {
                  handleRestart();
                  setStarted(false);
                }}
                className="px-8 py-4 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xl font-bold rounded-xl transition-colors flex items-center justify-center gap-3"
              >
                <BookOpen className="w-6 h-6" />
                Review Scam Types
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Question screen
  return (
    <section id="scam-quiz" className="bg-white py-16 lg:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-semibold text-gray-600">
              Question {currentQ + 1} of {quizQuestions.length}
            </span>
            <span className="text-lg font-semibold text-blue-900">
              Score: {score}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-500"
              style={{
                width: `${((currentQ + 1) / quizQuestions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 lg:p-8 mb-6">
          <div className="flex items-start gap-4">
            <HelpCircle className="w-8 h-8 text-blue-700 flex-shrink-0 mt-1" />
            <p className="text-xl lg:text-2xl text-gray-900 leading-relaxed font-medium">
              {question.scenario}
            </p>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {question.options.map((option, idx) => {
            let optionStyle = 'bg-white border-2 border-gray-200 hover:border-blue-400 text-gray-800';
            let icon = null;

            if (showExplanation) {
              if (idx === question.correctIndex) {
                optionStyle = 'bg-green-50 border-2 border-green-400 text-green-900';
                icon = <CheckCircle2 className="w-7 h-7 text-green-600 flex-shrink-0" />;
              } else if (idx === selectedAnswer && idx !== question.correctIndex) {
                optionStyle = 'bg-red-50 border-2 border-red-400 text-red-900';
                icon = <XCircle className="w-7 h-7 text-red-600 flex-shrink-0" />;
              } else {
                optionStyle = 'bg-gray-50 border-2 border-gray-200 text-gray-500';
              }
            } else if (selectedAnswer === idx) {
              optionStyle = 'bg-blue-50 border-2 border-blue-400 text-blue-900';
            }

            return (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={showExplanation}
                className={`w-full text-left p-5 rounded-xl transition-all duration-200 flex items-start gap-4 ${optionStyle} ${
                  !showExplanation ? 'cursor-pointer' : 'cursor-default'
                } focus:outline-none focus:ring-4 focus:ring-blue-300`}
              >
                <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-lg">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-lg leading-relaxed flex-1">{option}</span>
                {icon}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className="bg-blue-900 text-white rounded-2xl p-6 lg:p-8 mb-6">
            <div className="flex items-start gap-4">
              <BookOpen className="w-7 h-7 flex-shrink-0 mt-1 text-blue-200" />
              <div>
                <h4 className="text-xl font-bold mb-2">
                  {selectedAnswer === question.correctIndex
                    ? 'Correct! Well done.'
                    : 'Not quite — here is why:'}
                </h4>
                <p className="text-lg text-blue-100 leading-relaxed">
                  {question.explanation}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Next Button */}
        {showExplanation && (
          <button
            onClick={handleNext}
            className="w-full py-5 bg-green-500 hover:bg-green-600 text-white text-xl font-bold rounded-xl transition-colors flex items-center justify-center gap-3"
          >
            {currentQ < quizQuestions.length - 1 ? (
              <>
                Next Question
                <ArrowRight className="w-6 h-6" />
              </>
            ) : (
              'See My Results'
            )}
          </button>
        )}
      </div>
    </section>
  );
};

export default ScamQuiz;
