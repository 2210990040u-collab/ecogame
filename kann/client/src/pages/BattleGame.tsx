import { useState, useEffect } from 'react';
import { useBattleGame } from '@/hooks/useBattleGame';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { PixelCharacter } from '@/components/PixelCharacter';
import { HeartDisplay } from '@/components/HeartDisplay';
import { ExperienceBar } from '@/components/ExperienceBar';
import { STAGES, GameTheme } from '@/lib/gameData';
import { useLocation } from 'wouter';

interface QuizQuestion {
  id: string;
  theme: string;
  difficulty: string;
  question: string;
  image?: string;
  imageSource?: string;
  options: string[];
  correctAnswer: number;
  feedback: {
    correct: string;
    incorrect: string;
  };
  timeLimit: number;
  baseScore: number;
}

interface QuizData {
  questions: QuizQuestion[];
}

export default function BattleGame() {
  const [, navigate] = useLocation();
  const { gameState, handleAnswerQuestion, initializeBattle } = useBattleGame();
  const [quizzes, setQuizzes] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [loading, setLoading] = useState(true);

  // ゲーム初期化
  useEffect(() => {
    const selectedTheme = localStorage.getItem('selected_theme') as GameTheme | null;
    if (!selectedTheme) {
      navigate('/stage-select');
      return;
    }

    // バトルを初期化
    initializeBattle(selectedTheme);
    setLoading(false);
  }, []);

  // クイズデータを読み込み
  useEffect(() => {
    fetch('/quizzes.json')
      .then(res => res.json())
      .then((data: QuizData) => {
        setQuizzes(data.questions);
      })
      .catch(err => {
        console.error('Failed to load quizzes:', err);
        toast.error('クイズの読み込みに失敗しました');
      });
  }, []);

  // 最初の問題を読み込み
  useEffect(() => {
    if (quizzes.length > 0 && gameState.currentBattle.currentMonster && !currentQuestion) {
      loadNextQuestion(quizzes);
    }
  }, [quizzes, gameState.currentBattle.currentMonster]);

  const loadNextQuestion = (questions: QuizQuestion[]) => {
    if (!gameState.currentBattle.currentMonster) return;

    // テーマと難易度でフィルタリング
    const themeQuestions = questions.filter(
      q => q.theme === gameState.selectedTheme && 
           q.difficulty === gameState.currentBattle.currentDifficulty &&
           !gameState.currentBattle.usedQuestionIds.includes(q.id)
    );
    
    if (themeQuestions.length === 0) {
      // 使用済み問題を除いて再度フィルタリング
      const fallbackQuestions = questions.filter(
        q => q.theme === gameState.selectedTheme && 
             q.difficulty === gameState.currentBattle.currentDifficulty
      );
      
      if (fallbackQuestions.length === 0) {
        toast.error('クイズが見つかりません');
        return;
      }
      
      // 使用済み問題をリセット
      const randomQuestion = fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)];
      setCurrentQuestion(randomQuestion);
      setTimeRemaining(randomQuestion.timeLimit);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setIsAnswered(false);
      return;
    }

    const randomQuestion = themeQuestions[Math.floor(Math.random() * themeQuestions.length)];
    setCurrentQuestion(randomQuestion);
    setTimeRemaining(randomQuestion.timeLimit);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsAnswered(false);
  };

  useEffect(() => {
    if (!currentQuestion || isAnswered) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion, isAnswered]);

  const handleTimeUp = () => {
    setIsAnswered(true);
    setShowFeedback(true);
    if (currentQuestion) {
      handleAnswerQuestion(currentQuestion.id, currentQuestion.difficulty, false, 0, currentQuestion.timeLimit);
    }
    toast.error('時間切れ！不正解です。');
  };

  const handleSelectAnswer = (index: number) => {
    if (isAnswered) return;

    setSelectedAnswer(index);
    setIsAnswered(true);
    setShowFeedback(true);

    const isCorrect = index === currentQuestion?.correctAnswer;
    if (currentQuestion) {
      handleAnswerQuestion(currentQuestion.id, currentQuestion.difficulty, isCorrect, timeRemaining, currentQuestion.timeLimit);
    }

    if (isCorrect) {
      toast.success('正解！');
    } else {
      toast.error('不正解。');
    }
  };

  const handleContinue = () => {
    if (!currentQuestion) return;

    if (gameState.stageClear) {
      navigate('/');
    } else if (gameState.gameOver) {
      navigate('/');
    } else {
      loadNextQuestion(quizzes);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-green-100 flex items-center justify-center">
        <div className="text-2xl font-bold text-purple-600">ゲームを初期化中...</div>
      </div>
    );
  }

  if (gameState.gameOver && !gameState.stageClear) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-green-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">ゲームオーバー</h1>
          <p className="text-lg text-gray-700 mb-6">獲得スコア: {gameState.currentBattle.totalScore}</p>
          <Button onClick={() => navigate('/')} className="w-full">ホームに戻る</Button>
        </Card>
      </div>
    );
  }

  if (gameState.stageClear) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-green-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <h1 className="text-4xl font-bold text-green-600 mb-4">ステージクリア！</h1>
          <p className="text-lg text-gray-700 mb-2">獲得スコア: {gameState.currentBattle.totalScore}</p>
          <p className="text-lg text-gray-700 mb-6">レベル: {gameState.currentBattle.playerStats.level}</p>
          <Button onClick={() => navigate('/')} className="w-full">ホームに戻る</Button>
        </Card>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-green-100 flex items-center justify-center">
        <div className="text-2xl font-bold text-purple-600">問題を読み込み中...</div>
      </div>
    );
  }

  const stage = STAGES.find(s => s.id === gameState.currentBattle.stageId);
  const isFeedbackCorrect = selectedAnswer === currentQuestion.correctAnswer;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-green-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* ステージ情報 */}
        <div className="mb-4 text-center">
          <h1 className="text-2xl font-bold text-purple-700">{stage?.name}</h1>
          <p className="text-gray-600">モンスター {gameState.currentBattle.monsterIndex + 1} / {stage?.monsterCount}</p>
        </div>

        {/* プレイヤー情報 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="p-4">
            <div className="text-sm text-gray-600 mb-2">HP</div>
            <HeartDisplay currentHp={gameState.currentBattle.playerHp} maxHp={gameState.currentBattle.maxPlayerHp} />
            <div className="text-sm text-gray-600 mt-2">レベル: {gameState.currentBattle.playerStats.level}</div>
            <div className="text-sm text-gray-600">職業: {gameState.currentBattle.playerStats.jobTitle}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-600 mb-2">経験値</div>
            <ExperienceBar 
              currentExp={gameState.currentBattle.playerStats.experience % 100}
              nextLevelExp={100}
              level={gameState.currentBattle.playerStats.level}
            />
            <div className="text-sm text-gray-600 mt-2">スコア: {gameState.currentBattle.totalScore}</div>
            <div className="text-sm text-gray-600">難易度: {gameState.currentBattle.currentDifficulty}</div>
          </Card>
        </div>

        {/* バトルエリア */}
        <div className="grid grid-cols-2 gap-8 mb-6 items-center">
          <PixelCharacter 
            type="player"
            jobTitle={gameState.currentBattle.playerStats.jobTitle}
          />
          <PixelCharacter 
            type="monster"
            icon={gameState.currentBattle.currentMonster?.icon || '👹'}
            hp={gameState.currentBattle.currentMonster?.currentHp || 0}
            maxHp={gameState.currentBattle.currentMonster?.maxHp || 1}
          />
        </div>

        {/* クイズ */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">{currentQuestion.question}</h2>

        {currentQuestion.image && (
          <div className="mb-4 text-center">
            <img
              src={currentQuestion.image}
              alt="クイズ画像"
              className="mx-auto max-h-64 rounded-lg border shadow"
            />
          {currentQuestion.imageSource && (
            <p className="text-xs text-gray-500 mt-1">
              画像提供：{currentQuestion.imageSource}
            </p>
          )}
          </div>
        )}



          
          <div className="mb-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{timeRemaining}秒</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${(timeRemaining / currentQuestion.timeLimit) * 100}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelectAnswer(index)}
                disabled={isAnswered}
                className={`p-4 text-left rounded-lg font-semibold transition-all ${
                  selectedAnswer === index
                    ? isFeedbackCorrect
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                    : 'bg-white text-gray-800 hover:bg-gray-100'
                } ${isAnswered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {option}
              </button>
            ))}
          </div>
        </Card>

        {/* フィードバック */}
        {showFeedback && (
          <Card className={`p-6 mb-6 ${isFeedbackCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
            <h3 className={`text-lg font-bold mb-2 ${isFeedbackCorrect ? 'text-green-600' : 'text-red-600'}`}>
              {isFeedbackCorrect ? '正解！' : '不正解'}
            </h3>
            <p className="text-gray-700 mb-4">
              {isFeedbackCorrect 
                ? currentQuestion.feedback.correct 
                : currentQuestion.feedback.incorrect}
            </p>
            <Button onClick={handleContinue} className="w-full">
              {gameState.stageClear ? 'ステージクリア！' : gameState.gameOver ? 'ゲームオーバー' : '次の問題へ'}
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
