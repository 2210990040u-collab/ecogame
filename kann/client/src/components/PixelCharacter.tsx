import { JobTitle } from '@/lib/gameData';

interface PixelCharacterProps {
  type: 'player' | 'monster';
  icon?: string;
  name?: string;
  hp?: number;
  maxHp?: number;
  isAttacking?: boolean;
  jobTitle?: JobTitle;
}

const JOB_IMAGES: Record<JobTitle, string> = {
  explorer: '/images/player-explorer.png',
  ranger: '/images/player-ranger.png',
  guardian: '/images/player-guardian.png',
  champion: '/images/player-champion.png',
  hero: '/images/player-hero.png',
};

export function PixelCharacter({
  type,
  icon,
  name,
  hp,
  maxHp,
  isAttacking,
  jobTitle,
}: PixelCharacterProps) {
  if (type === 'player' && jobTitle) {
    const imagePath = JOB_IMAGES[jobTitle];
    return (
      <div className={`flex flex-col items-center ${isAttacking ? 'animate-pulse scale-110' : ''}`}>
        <img
          src={imagePath}
          alt="Player Character"
          className="w-32 h-32 object-contain drop-shadow-lg"
        />
        <p className="text-sm font-bold text-gray-700 mt-2">プレイヤー</p>
      </div>
    );
  }

  if (type === 'monster') {
    const hpPercentage = maxHp && hp ? (hp / maxHp) * 100 : 0;
    return (
      <div className={`flex flex-col items-center ${isAttacking ? 'animate-pulse scale-110' : ''}`}>
        <div className="text-6xl mb-2">{icon}</div>
        <p className="text-sm font-bold text-gray-700">{name}</p>
        {hp !== undefined && maxHp !== undefined && (
          <div className="mt-2 w-24">
            <div className="bg-gray-200 rounded-full h-4 overflow-hidden border-2 border-red-400">
              <div
                className="bg-red-500 h-full transition-all"
                style={{ width: `${hpPercentage}%` }}
              />
            </div>

          </div>
        )}
      </div>
    );
  }

  return null;
}
