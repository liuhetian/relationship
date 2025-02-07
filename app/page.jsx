import RelationshipCalculator from './components/RelationshipCalculator';

export default function Home() {
  return (
    <main className="min-h-screen p-4">
      <h1 className="text-2xl font-bold text-center mb-4">亲戚关系计算器</h1>
      <RelationshipCalculator />
    </main>
  );
} 