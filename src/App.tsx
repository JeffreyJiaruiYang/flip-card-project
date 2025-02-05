import { useState, useEffect } from 'react';
import Card from './components/Card';
import './App.css';
import { cardService } from './services/cardService';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [cardHistory, setCardHistory] = useState<Array<{
    id: number;
    name: string;
    timestamp: Date;
  }>>([]);
  const [activeTab, setActiveTab] = useState('home');
  const [userId] = useState('user1'); // 临时用户ID，之后可以改用认证系统

  // Add Azure Storage configuration
  const sasToken = import.meta.env.VITE_AZURE_SAS_TOKEN;
  const storageAccountName = import.meta.env.VITE_STORAGE_ACCOUNT_NAME;
  const containerName = 'cards'; // Your container name

  const cards = [
    { 
      id: 1, 
      front: `https://${storageAccountName}.blob.core.windows.net/${containerName}/front1.jpg${sasToken}`,
      back: `https://${storageAccountName}.blob.core.windows.net/${containerName}/back1.jpg${sasToken}`,
      name: 'Card A' 
    },
    { 
      id: 2, 
      front: `https://${storageAccountName}.blob.core.windows.net/${containerName}/front2.jpg${sasToken}`,
      back: `https://${storageAccountName}.blob.core.windows.net/${containerName}/back1.jpg${sasToken}`,
      name: 'Card B' 
    },
    { 
      id: 3, 
      front: `https://${storageAccountName}.blob.core.windows.net/${containerName}/front3.jpg${sasToken}`,
      back: `https://${storageAccountName}.blob.core.windows.net/${containerName}/back1.jpg${sasToken}`,
      name: 'Card C' 
    },
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

  // 修改卡片点击处理
  const handleCardClick = async (cardId: number) => {
    const newState = {
      userId,
      cardId,
      isFlipped: true,
      lastUpdated: new Date()
    };
    
    await cardService.saveCardState(newState);
    setCardHistory(prev => [...prev, {
      id: cardId,
      name: cards.find(c => c.id === cardId)?.name || '',
      timestamp: new Date()
    }]);
  };

  // 加载卡片状态
  useEffect(() => {
    const loadCardStates = async () => {
      const states = await cardService.getCardStates(userId);
      // 更新UI状态
      const history = states.map(state => ({
        id: state.cardId,
        name: cards.find(c => c.id === state.cardId)?.name || '',
        timestamp: state.lastUpdated
      }));
      setCardHistory(history);
    };

    loadCardStates();
  }, [userId]);

  // Add this component for dummy content
  const TabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div>
            <div className="draw-instruction">
              <p>点击下方卡牌即可抽卡, 今日还可抽3次!</p>
            </div>
            <div className="card-row" style={{ 
              display: 'flex', 
              justifyContent: 'space-around',
              width: '100%',
              padding: '20px'
            }}>
              {sortedCards.map((card) => (
                <Card 
                  key={card.id} 
                  frontImage={card.front} 
                  backImage={card.back}
                  onClick={() => handleCardClick(card.id)}
                />
              ))}
            </div>
          </div>
        );
      case 'collection':
        return (
          <div className="tab-content">
            <h2>My Collection</h2>
            <div className="history-list">
              {cardHistory.map((record, index) => (
                <div key={index} className="history-item" style={{
                  padding: '10px',
                  margin: '5px 0',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '5px'
                }}>
                  <p>Card: {record.name}</p>
                  <p>Drawn at: {record.timestamp.toLocaleString()}</p>
                </div>
              ))}
              {cardHistory.length === 0 && (
                <p>No cards collected yet. Try drawing some cards!</p>
              )}
            </div>
          </div>
        );
      case 'my-cards':
        return <div className="tab-content"><h2>My Cards</h2><p>Your owned cards will appear here.</p></div>;
      case 'shop':
        return <div className="tab-content"><h2>Shop</h2><p>Available cards for purchase will appear here.</p></div>;
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      <nav className="menu-bar">
        <div className="logo">
          <h2>Fishbone Cards</h2>
        </div>
        <div className="menu-items">
          <a 
            href="/" 
            className={`menu-item ${activeTab === 'home' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('home');
            }}
          >
            Home
          </a>
          <a 
            href="/collection" 
            className={`menu-item ${activeTab === 'collection' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('collection');
            }}
          >
            My Collection
          </a>
          <a 
            href="/my-cards" 
            className={`menu-item ${activeTab === 'my-cards' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('my-cards');
            }}
          >
            My Cards
          </a>
          <a 
            href="/shop" 
            className={`menu-item ${activeTab === 'shop' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('shop');
            }}
          >
            Shop
          </a>
        </div>
        <div className="user-section">
          <button className="user-button">
            <i className="fas fa-user"></i>
          </button>
        </div>
      </nav>

      <main className="content">
        <header className="content-header">
          <h1 style={{ color: '#2c3e50' }}>Welcome to Fishbone Cards</h1>
          <div className="controls">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search cards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-bar"
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  border: '1px solid #ddd',
                  width: '100%'
                }}
              />
            </div>
            <button 
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="sort-button"
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                border: '1px solid #ddd',
                background: '#fff',
                cursor: 'pointer'
              }}
            >
              {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </button>
          </div>
        </header>

        <TabContent />
      </main>
    </div>
  );
}

export default App;
