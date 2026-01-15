/**
 * ハート型のHP表示コンポーネント
 */

interface HeartDisplayProps {
  currentHp: number;
  maxHp: number;
}

export function HeartDisplay({ currentHp, maxHp }: HeartDisplayProps) {
  return (
    <div className="flex gap-2">
      {Array.from({ length: maxHp }).map((_, index) => (
        <div
          key={index}
          className={`text-4xl transition-all ${
            index < currentHp ? 'scale-100 opacity-100' : 'scale-75 opacity-50 grayscale'
          }`}
        >
          ❤️
        </div>
      ))}
    </div>
  );
}
