/**
 * エコバトルクイズ - ゲームデータ構造とロジック
 * 
 * ステージ、モンスター、バトルシステム、プレイヤーレベルシステムの型定義
 */

// --- 型定義 ---

export enum GameTheme {
  ALEINSPECIES = 'alienspecies',
  ENERGY = 'energy',
  //CLIMATE = 'climate',
}

export enum DifficultyLevel {
  EASY = 'EASY',
  NORMAL = 'NORMAL',
  HARD = 'HARD',
}

export enum JobTitle {
  EXPLORER = 'explorer',
  RANGER = 'ranger',
  GUARDIAN = 'guardian',
  CHAMPION = 'champion',
  HERO = 'hero',
}

export interface Monster {
  id: string;
  name: string;
  maxHp: number;
  currentHp: number;
  attackPower: number;
  icon: string;
}

export interface Stage {
  id: number;
  name: string;
  theme: GameTheme;
  difficulty: DifficultyLevel;
  monsterCount: number;
  baseMonsterHp: number;
  baseMonsterAttack: number;
}

export interface PlayerStats {
  level: number;
  experience: number;
  attackPower: number;
  jobTitle: JobTitle;
}

export interface BattleState {
  stageId: number;
  monsterIndex: number;
  currentMonster: Monster | null;
  playerHp: number;
  maxPlayerHp: number;
  playerStats: PlayerStats;
  questionsAnswered: number;
  correctAnswers: number;
  totalScore: number;
  usedQuestionIds: string[];
  currentDifficulty: DifficultyLevel;
  consecutiveCorrectAnswers: number;
}

export interface GameState {
  selectedTheme: GameTheme | null;
  currentStage: number;
  currentBattle: BattleState;
  gameOver: boolean;
  stageClear: boolean;
}

export interface QuizQuestion {
  id: string;
  theme: GameTheme;
  difficulty: DifficultyLevel;
  question: string;
  options: string[];
  correctAnswer: number;
  feedback: {
    correct: string;
    incorrect: string;
  };
  timeLimit: number;
  baseScore: number;
}

// --- 定数 ---

export const STAGES: Stage[] = [
  {
    id: 1,
    name: 'ステージ1: 外来生物の森',
    theme: GameTheme.ALEINSPECIES,
    difficulty: DifficultyLevel.NORMAL,
    monsterCount: 10,
    baseMonsterHp: 1,
    baseMonsterAttack: 1,
  },
  {
    id: 2,
    name: 'ステージ2: エネルギーの街',
    theme: GameTheme.ENERGY,
    difficulty: DifficultyLevel.NORMAL,
    monsterCount: 10,
    baseMonsterHp: 1,
    baseMonsterAttack: 1,
  },
  
];

export const JOB_PROGRESSION = [
  { level: 0, title: JobTitle.EXPLORER, name: '自然の探検家' },
  { level: 10, title: JobTitle.RANGER, name: 'エコ・レンジャー' },
  { level: 20, title: JobTitle.GUARDIAN, name: '地球の守護者' },
  { level: 30, title: JobTitle.CHAMPION, name: '環境チャンピオン' },
  { level: 40, title: JobTitle.HERO, name: 'プラネット・ヒーロー' },
];

export const MONSTER_NAMES = {
  [GameTheme.ALEINSPECIES]: ['ゴミモンスター', 'リサイクル妖怪', 'ポイ捨て鬼'],
  [GameTheme.ENERGY]: ['生物滅亡獣', '自然破壊竜', '生態系怪物'],
  //[GameTheme.CLIMATE]: ['温暖化ドラゴン', 'CO2怪獣', '気候変動鬼'],
};

export const MONSTER_ICONS = ['👹', '👺', '🧌', '🐉', '👻'];

//export const EXPERIENCE_PER_LEVEL = 100;
//export const TIME_BONUS_MULTIPLIER = 10;

// --- ゲーム状態初期化 ---

export function createInitialGameState(): GameState {
  return {
    selectedTheme: null,
    currentStage: 1,
    currentBattle: {
      stageId: 1,
      monsterIndex: 0,
      currentMonster: null,
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
  };
}

// --- スコア計算 ---

export function calculateScore(
  difficulty: DifficultyLevel,
  timeRemaining: number,
  maxTime: number
): number {
  const baseScore = {
    [DifficultyLevel.EASY]: 100,
    [DifficultyLevel.NORMAL]: 200,
    [DifficultyLevel.HARD]: 300,
  }[difficulty];

  const timeBonus = Math.floor((timeRemaining / maxTime) * baseScore);
  return baseScore + timeBonus;
}

// --- 経験値計算 ---
export function calculateExperience(difficulty: DifficultyLevel): number {
  return difficulty === DifficultyLevel.EASY ? 10 : difficulty === DifficultyLevel.NORMAL ? 20 : 30;
}
// --- ジョブ取得 ---

export function getJobTitle(level: number): { title: JobTitle; name: string } {
  let currentJob = JOB_PROGRESSION[0];
  for (const job of JOB_PROGRESSION) {
    if (level >= job.level) {
      currentJob = job;
    }
  }
  return { title: currentJob.title, name: currentJob.name };
}

// --- 攻撃力計算 ---

export function calculateAttackPower(level: number): number {
  return 1 + Math.floor((level - 1) / 5);
}

// --- モンスター生成 ---

export function generateMonster(
  stage: Stage,
  monsterIndex: number
): Monster {
  const names = MONSTER_NAMES[stage.theme];
  const name = names[monsterIndex % names.length];
  const icon = MONSTER_ICONS[monsterIndex % MONSTER_ICONS.length];

  const hpMultiplier = 1 ;
  const attackMultiplier = 1 ;

  return {
    id: `monster-${stage.id}-${monsterIndex}`,
    name,
    maxHp: 1,//Math.ceil(stage.baseMonsterHp * hpMultiplier),
    currentHp: 1,//Math.ceil(stage.baseMonsterHp * hpMultiplier),
    attackPower: 1,//Math.ceil(stage.baseMonsterAttack * attackMultiplier),
    icon,
  };
}
