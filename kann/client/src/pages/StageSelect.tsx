import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { GameTheme } from '@/lib/gameData';

export default function StageSelect() {
  const [, navigate] = useLocation();

  const stages = [
    {
      theme: GameTheme.ALEINSPECIES,
      title: '外来生物の森',
      description: '外来生物について学ぼう！',
      icon: '🌿',
      color: 'from-green-400 to-green-600',
    },
    {
      theme: GameTheme.ENERGY,
      title: 'エネルギーの街',
      description: '再生可能エネルギーについて学ぼう！',
      icon: '⚡',
      color: 'from-emerald-400 to-emerald-600',
    },
    
  ];

  const handleSelectStage = (theme: GameTheme) => {
    localStorage.setItem('selected_theme', theme);
    navigate('/battle');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-green-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">⚔️ ステージを選択</h1>
          <p className="text-xl text-gray-700">学びたい環境テーマを選んでバトルを始めよう！</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stages.map(stage => (
            <Card
              key={stage.theme}
              className="p-8 bg-white border-4 hover:shadow-2xl transition-all transform hover:scale-105 cursor-pointer"
            >
              <div className="text-center">
                <div className="text-7xl mb-4">{stage.icon}</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">{stage.title}</h2>
                <p className="text-gray-600 mb-6">{stage.description}</p>
                <Button
                  onClick={() => handleSelectStage(stage.theme)}
                  className={`w-full bg-gradient-to-r ${stage.color} hover:opacity-90 text-white font-bold py-3 rounded-lg`}
                >
                  このテーマを選ぶ →
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="border-2 border-gray-400 text-gray-700 font-bold py-2 px-6"
          >
            ← ホームに戻る
          </Button>
        </div>
      </div>
    </div>
  );
}
