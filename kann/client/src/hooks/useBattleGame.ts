import { useState } from 'react';
import {
  GameState,
  GameTheme,
  DifficultyLevel,
  STAGES,
  calculateExperience,
  JobTitle,
  MONSTER_ICONS,
  createInitialGameState,
} from '@/lib/gameData';

export const useBattleGame = () => {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());

  const generateMonster = (stageId: number, monsterIndex: number) => {
    const stage = STAGES.find((s) => s.id === stageId);
    if (!stage) return null;

    const hp = stage.baseMonsterHp + Math.floor(monsterIndex / 3);
    const attack = stage.baseMonsterAttack + Math.floor(monsterIndex / 5);
    const icon = MONSTER_ICONS[monsterIndex % MONSTER_ICONS.length];

    return {
      id: `monster-${stageId}-${monsterIndex}`,
      name: `モンスター ${monsterIndex + 1}`,
      maxHp: hp,
      currentHp: hp,
      attackPower: attack,
      icon,
    };
  };

  const calculateScore = (difficulty: string, remainingTime: number, timeLimit: number) => {
    let baseScore = 100;
    if (difficulty === DifficultyLevel.NORMAL) baseScore = 200;
    if (difficulty === DifficultyLevel.HARD) baseScore = 300;

    // 残り時間に基づくボーナス計算
    const timeBonus = Math.floor((remainingTime / timeLimit) * baseScore);
    return baseScore + timeBonus;
  };

  const calculateExperience = (difficulty: string) => {
    if (difficulty === DifficultyLevel.EASY) return 10;
    if (difficulty === DifficultyLevel.NORMAL) return 20;
    return 30;

    //const newExperience = prev.currentBattle.playerStats.experience + difficulty;
    //const newLevel = Math.floor(newExperience / 100) + 1;
  }

  const getJobTitle = (level: number) => {
    if (level <= 10) return { title: JobTitle.EXPLORER, name: '自然の探検家' };
    if (level <= 20) return { title: JobTitle.RANGER, name: 'エコ・レンジャー' };
    if (level <= 30) return { title: JobTitle.GUARDIAN, name: '地球の守護者' };
    if (level <= 40) return { title: JobTitle.CHAMPION, name: '環境チャンピオン' };
    return { title: JobTitle.HERO, name: 'プラネット・ヒーロー' };
  };

  const calculateAttackPower = (level: number) => {
    return 1 + Math.floor(level / 5);
  };

  const handleAnswerQuestion = (
    questionId: string,
    questionDifficulty: string,
    isCorrect: boolean,
    remainingTime: number,
    timeLimit: number
  ) => {
    setGameState((prev) => {
      const stage = STAGES.find((s) => s.id === prev.currentBattle.stageId);
      if (!stage) return prev;

      let newBattle = { ...prev.currentBattle };

      if (isCorrect) {
        // 正解時の処理
        const score = calculateScore(questionDifficulty, remainingTime, timeLimit);
        const exp = 50;

        const newExperience = prev.currentBattle.playerStats.experience + exp;
        const newLevel = Math.floor(newExperience / 100) + 1;
        const { title: newJobTitle } = getJobTitle(newLevel);
        const newAttackPower = calculateAttackPower(newLevel);

        // 連続正解カウント増加
        let newConsecutiveCorrect = prev.currentBattle.consecutiveCorrectAnswers + 1;
        // 難易度調整：3問連続正解で難易度アップ
        let newDifficulty = prev.currentBattle.currentDifficulty;
        if (newConsecutiveCorrect >= 3) {
          if (newDifficulty === DifficultyLevel.EASY) {
            newDifficulty = DifficultyLevel.NORMAL;
          } else if (newDifficulty === DifficultyLevel.NORMAL) {
            newDifficulty = DifficultyLevel.HARD;
          }
          // 難易度が上がったら連続正解カウントをリセット
          newConsecutiveCorrect = 0;
        }

        newBattle = {
          ...newBattle,
          playerStats: {
            level: newLevel,
            experience: newExperience,
            attackPower: newAttackPower,
            jobTitle: newJobTitle,
          },
          totalScore: prev.currentBattle.totalScore + score,
          correctAnswers: prev.currentBattle.correctAnswers + 1,
          currentMonster: {
            ...prev.currentBattle.currentMonster!,
            currentHp: 0,
          },
          usedQuestionIds: [...prev.currentBattle.usedQuestionIds, questionId],
          currentDifficulty: newDifficulty,
          consecutiveCorrectAnswers: newConsecutiveCorrect,
        };

        // モンスター撃破処理
        const nextMonsterIndex = prev.currentBattle.monsterIndex + 1;
        const isStageComplete = nextMonsterIndex >= stage.monsterCount;

        if (isStageComplete) {
          return {
            ...prev,
            currentBattle: newBattle,
            stageClear: true,
          };
        } else {
          const nextMonster = generateMonster(stage.id, nextMonsterIndex);
          newBattle = {
            ...newBattle,
            monsterIndex: nextMonsterIndex,
            currentMonster: nextMonster,
          };
          return {
            ...prev,
            currentBattle: newBattle,
          };
        }
      } else {
        // 不正解時の処理
        const damage = prev.currentBattle.currentMonster?.attackPower || 1;
        const newPlayerHp = Math.max(0, prev.currentBattle.playerHp - damage);

        // 難易度ダウン
        let newDifficulty = prev.currentBattle.currentDifficulty;
        if (newDifficulty === DifficultyLevel.HARD) {
          newDifficulty = DifficultyLevel.NORMAL;
        } else if (newDifficulty === DifficultyLevel.NORMAL) {
          newDifficulty = DifficultyLevel.EASY;
        }

        newBattle = {
          ...newBattle,
          playerHp: newPlayerHp,
          usedQuestionIds: [...prev.currentBattle.usedQuestionIds, questionId],
          currentDifficulty: newDifficulty,
          consecutiveCorrectAnswers: 0,
        };

        if (newPlayerHp === 0) {
          return {
            ...prev,
            currentBattle: newBattle,
            gameOver: true,
          };
        }

        return {
          ...prev,
          currentBattle: newBattle,
        };
      }
    });
  };

  const initializeBattle = (theme: GameTheme) => {
    const stage = STAGES.find((s) => s.theme === theme);
    if (!stage) return;

    const initialMonster = generateMonster(stage.id, 0);

    setGameState({
      selectedTheme: theme,
      currentStage: stage.id,
      currentBattle: {
        stageId: stage.id,
        monsterIndex: 0,
        currentMonster: initialMonster,
        playerHp: 3,
        maxPlayerHp: 3,
        playerStats: {
          level: 1,
          experience: 0,
          attackPower: 1,
          jobTitle: JobTitle.EXPLORER,
        },
        questionsAnswered: 0,
        correctAnswers: 0,
        totalScore: 0,
        usedQuestionIds: [],
        currentDifficulty: DifficultyLevel.EASY,
        consecutiveCorrectAnswers: 0,
      },
      gameOver: false,
      stageClear: false,
    });
  };

  const resetGame = () => {
    setGameState(createInitialGameState());
  };

  return {
    gameState,
    setGameState,
    handleAnswerQuestion,
    initializeBattle,
    resetGame,
  };
};
