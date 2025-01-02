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
      <nav className="menu-bar">
        <div className="logo">
          <h2>Fishbone Cards</h2>
        </div>
        <div className="menu-items">
          <a href="#home" className="menu-item active">Home</a>
          <a href="#collection" className="menu-item">My Collection</a>
          <a href="#shop" className="menu-item">Shop</a>
        </div>
        <div className="user-section">
          <button className="user-button">
            <i className="fas fa-user"></i>
          </button>
        </div>
      </nav>

      <main className="content">
        <header className="content-header">
          <h1>Welcome to Fishbone Cards</h1>
          <div className="controls">
            <div className="search-container">
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                placeholder="Search cards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-bar"
              />
            </div>
            <button 
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="sort-button"
            >
              <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
              {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </button>
          </div>
        </header>

        <div className="draw-instruction">
          <p>点击下方卡牌即可抽卡，今日还可抽3次！</p>
        </div>

        <div className="card-row">
          {sortedCards.map((card) => (
            <Card key={card.id} frontImage={card.front} backImage={card.back} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
