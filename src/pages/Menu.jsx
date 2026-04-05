import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { staticMenuData } from '../data/menuData';
import { getRestaurantStatus } from '../utils/businessHours';
import ClosedOverlay from '../components/ClosedOverlay';
import RecommendationModal from '../components/RecommendationModal';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Hamma taomlar');
  const { addToCart } = useCart();
  const { isOpen } = getRestaurantStatus();
  const [recommendation, setRecommendation] = useState({ 
    show: false, 
    sourceItem: null, 
    recommendedItems: [] 
  });

  const categories = [
    'Hamma taomlar',
    'Pizzalar',
    'Fast food',
    'Salqin ichimlik va sharbatlar',
    'Qaynoq ichimliklar',
    'Qoʻshimchalar',
    'Turk taomlari'
  ];

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const [menuSnap, recSnap] = await Promise.all([
          getDocs(collection(db, 'menu')),
          getDocs(collection(db, 'recommendations'))
        ]);
        
        const fetchedMenu = menuSnap.docs.map(d => d.data());
        const rawItems = fetchedMenu.length > 0 ? fetchedMenu : staticMenuData;
        
        const fetchedRecs = recSnap.docs.map(d => d.data());
        localStorage.setItem('gopizza_recommendations', JSON.stringify(fetchedRecs));

        const items = rawItems.map(item => {
          if (item.variants && item.variants.length > 0) {
            return {
              ...item,
              selectedSize: item.variants[0].size,
              selectedPrice: item.variants[0].price
            };
          }
          return item;
        });
        setMenuItems(items);
      } catch (err) {
        console.error(err);
        const items = staticMenuData.map(item => {
          if (item.variants && item.variants.length > 0) {
            return {
              ...item,
              selectedSize: item.variants[0].size,
              selectedPrice: item.variants[0].price
            };
          }
          return item;
        });
        setMenuItems(items);
      }
      setLoading(false);
    };
    fetchMenu();
  }, []);

  return (
    <section id="menu" className="menu section">
      <div className="container section-title" data-aos="fade-up">
        <h2>Bizning Menyu</h2>
        <p><span>Bizning</span> <span className="description-title">Mazali Taomlar</span></p>
        {!isOpen && <ClosedOverlay />}
      </div>

      <div className="container mb-5" data-aos="fade-up">
        <div className="d-flex flex-wrap justify-content-center gap-2 category-nav">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`btn px-4 py-2 rounded-pill transition-all ${
                activeCategory === cat 
                  ? 'btn-danger shadow' 
                  : 'btn-outline-secondary border-0 text-dark fw-medium'
              }`}
              onClick={() => setActiveCategory(cat)}
              style={{
                transition: 'all 0.3s ease',
                backgroundColor: activeCategory === cat ? '' : 'rgba(0,0,0,0.05)',
                fontSize: '0.9rem'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="container" data-aos="fade-up" data-aos-delay="200">
        <div className="row gy-5">
          {loading ? (
            <div className="col-12 text-center py-5">
              <Loader2 className="animate-spin" size={48} color="var(--accent-color)" />
              <p className="mt-3 text-muted">Ajoyib taomlar tayyorlanmoqda...</p>
            </div>
          ) : (
            menuItems
              .filter(item => activeCategory === 'Hamma taomlar' || item.category === activeCategory)
              .map((item) => (
              <div className="col-lg-4 col-md-6 menu-item" key={item._id || item.id}>
                <div 
                  className="card border-0 h-100 shadow-sm p-3 position-relative overflow-hidden"
                  style={{
                    borderRadius: '20px',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-10px)';
                    e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 0.125rem 0.25rem rgba(0,0,0,0.075)';
                  }}
                >
                  <div className="text-center position-relative mb-3">
                    <img 
                      src={item.image} 
                      className="img-fluid" 
                      alt={item.name} 
                      style={{ 
                        width: '200px', 
                        height: '200px', 
                        objectFit: 'cover',
                        borderRadius: '50%',
                        transition: 'transform 0.5s ease'
                      }} 
                    />
                  </div>
                  <div className="card-body p-0 text-center d-flex flex-column">
                    <h4 className="fw-bold mb-1" style={{ color: '#333' }}>{item.name}</h4>
                    <p className="text-muted small mb-3 flex-grow-1 px-2">
                      {item.description || "Mazali va to'yimli, maxsus retsept asosida tayyorlangan."}
                    </p>
                    
                    <div className="d-flex justify-content-between align-items-center mt-auto pt-3 border-top w-100">
                      <span className="price fw-bold text-danger fs-5">
                        {(item.selectedPrice || item.price).toLocaleString()} so'm
                      </span>
                      
                      <button 
                        className="btn btn-danger d-flex align-items-center justify-content-center" 
                        disabled={!isOpen}
                        onClick={() => {
                          if (!isOpen) return;
                          const size = item.selectedSize || (item.variants?.[0]?.size) || 'Standard';
                          const price = item.selectedPrice || (item.variants?.[0]?.price) || item.price;
                          addToCart({ ...item, size, price });

                          // Tavfsiyalarni tekshirish
                          try {
                            const savedRecs = localStorage.getItem('gopizza_recommendations');
                            if (savedRecs) {
                              const recs = JSON.parse(savedRecs);
                              const itemRec = recs.find(r => r.sourceCategory === item.category);
                              if (itemRec && itemRec.recommendedItemIds.length > 0) {
                                const recItems = itemRec.recommendedItemIds
                                  .map(id => menuItems.find(i => i._id === id))
                                  .filter(Boolean);
                                
                                if (recItems.length > 0) {
                                  setTimeout(() => {
                                    setRecommendation({
                                      show: true,
                                      sourceItem: item,
                                      recommendedItems: recItems
                                    });
                                  }, 300);
                                }
                              }
                            }
                          } catch (err) {
                            console.error("Recommendation error:", err);
                          }
                        }}
                        style={{ 
                          width: '40px',
                          height: '40px',
                          borderRadius: '12px', 
                          padding: '0',
                          opacity: isOpen ? 1 : 0.6,
                          cursor: isOpen ? 'pointer' : 'not-allowed'
                        }}
                      >
                        <ShoppingCart size={18} />
                      </button>
                    </div>

                    {item.variants && item.variants.length > 0 && (
                      <div className="size-selector mt-3 d-flex flex-wrap justify-content-center gap-2">
                        {item.variants.map((v, i) => (
                           <button 
                            key={i}
                            className={`btn ${item.selectedSize === v.size ? 'btn-danger shadow' : 'btn-outline-danger'}`}
                            onClick={() => {
                              const newItems = [...menuItems];
                              const itemIdx = newItems.findIndex(mi => (mi._id || mi.id) === (item._id || item.id));
                              newItems[itemIdx].selectedSize = v.size;
                              newItems[itemIdx].selectedPrice = v.price;
                              setMenuItems(newItems);
                            }}
                            style={{ 
                              fontSize: '0.9rem', 
                              borderRadius: '14px', 
                              padding: '8px 20px',
                              fontWeight: '700',
                              transition: 'all 0.3s ease',
                              minWidth: '90px'
                            }}
                          >
                            {v.size}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {!isOpen && <ClosedOverlay />}
      
      <RecommendationModal 
        show={recommendation.show}
        onClose={() => setRecommendation({ ...recommendation, show: false })}
        sourceItem={recommendation.sourceItem}
        recommendedItems={recommendation.recommendedItems}
      />
    </section>
  );
}