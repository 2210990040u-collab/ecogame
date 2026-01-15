import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";

export default function Home() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-green-100">
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">⚔️ エコバトルクイズ</h1>
          <p className="text-xl opacity-90">モンスターを倒して、環境について学ぼう！クイズに正解してダメージを与えよう！</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 bg-white border-2 border-purple-200 hover:shadow-lg transition-shadow">
              <div className="text-5xl mb-4">⚔️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">バトルシステム</h3>
              <p className="text-gray-600">クイズに正解してモンスターにダメージを与えよう！各ステージ10体のモンスターをクリアして次へ進む！</p>
            </Card>

            <Card className="p-6 bg-white border-2 border-blue-200 hover:shadow-lg transition-shadow">
              <div className="text-5xl mb-4">📚</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">環境学習</h3>
              <p className="text-gray-600">ごみとリサイクル、生物多様性、地球温暖化など、重要な環境テーマを学べます。</p>
            </Card>

            <Card className="p-6 bg-white border-2 border-red-200 hover:shadow-lg transition-shadow">
              <div className="text-5xl mb-4">❤️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">ハート制</h3>
              <p className="text-gray-600">プレイヤーのHP はハート3つ。不正解するとダメージを受ける。HPが0になるとゲームオーバー！</p>
            </Card>
          </div>
        </section>

        <section className="mb-12 bg-white rounded-lg p-8 border-2 border-purple-200">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">ゲームの特徴</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold text-purple-600 mb-2">ステージシステム</h3>
              <p className="text-gray-700">各ステージに10体のモンスターが出現。全て倒すと次のステージへ進行します。</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-blue-600 mb-2">テーマ別ステージ</h3>
              <p className="text-gray-700">ステージごとに異なる環境テーマ。ステージが進むにつれて難易度が上昇します。</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-red-600 mb-2">ハート制HP</h3>
              <p className="text-gray-700">プレイヤーのHP はハート3つ。不正解するとダメージを受けます。</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-orange-600 mb-2">即時フィードバック</h3>
              <p className="text-gray-700">正解・不正解時にエコニャンが励まし、豆知識を教えてくれます。</p>
            </div>
          </div>
        </section>

        <section className="text-center">
          <Button
            onClick={() => navigate('/stage-select')}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-6 px-10 text-xl rounded-2xl shadow-lg transition-all hover:scale-105"
          >
            バトルを始める ⚔️
          </Button>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-400">エコバトルクイズ © 2025 - モンスターを倒して環境を学ぼう！</p>
        </div>
      </footer>
    </div>
  );
}
