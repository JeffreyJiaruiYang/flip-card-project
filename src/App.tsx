import { useState } from 'react';
import Card from './components/Card';
import './App.css';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const cards = [
    { id: 1, front: '/images/front1.jpg', back: '/images/back1.jpg', name: 'Card A' },
    { id: 2, front: '/images/front2.jpg', back: '/images/back1.jpg', name: 'Card B' },
    { id: 3, front: '/images/front3.jpg', back: '/images/back1.jpg', name: 'Card C' },
  ];

  // 搜索过滤
  const filteredCards = cards.filter((card) =>
    card.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 排序
  const sortedCards = filteredCards.sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>欢迎来到fishbone抽卡</h1>
        <div className="controls">
          <input
            type="text"
            placeholder="Search cards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-bar"
          />
          <button 
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="sort-button"
          >
            Sort: {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          </button>
        </div>
      </header>
      <main className="card-list-container">
        <div className="card-list">
          {sortedCards.map((card) => (
            <Card key={card.id} frontImage={card.front} backImage={card.back} />
          ))}
        </div>
      </main>
    </div>
  );
  
}

export default App;
