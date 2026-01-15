interface ExperienceBarProps {
  currentExp: number;
  nextLevelExp: number;
  level: number;
}

export function ExperienceBar({ currentExp, nextLevelExp, level }: ExperienceBarProps) {
  const expPercentage = (currentExp / nextLevelExp) * 100;
  const expNeeded = nextLevelExp - currentExp;

  return (
    <div className="bg-white p-4 rounded-lg border-2 border-yellow-300">
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm font-semibold text-gray-700">経験値</p>
        <p className="text-sm font-bold text-yellow-600">
          {currentExp} / {nextLevelExp}
        </p>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden border-2 border-yellow-400">
        <div
          className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-full transition-all duration-300 flex items-center justify-center"
          style={{ width: `${expPercentage}%` }}
        >
          {expPercentage > 20 && (
            <span className="text-xs font-bold text-white drop-shadow-md">
              {Math.round(expPercentage)}%
            </span>
          )}
        </div>
      </div>
      <p className="text-xs text-gray-600 mt-2">
        あと {expNeeded} 経験値でレベルアップ！
      </p>
    </div>
  );
}
