import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { staticMenuData } from '../data/menuData';
import { getRestaurantStatus } from '../utils/businessHours';
import ClosedOverlay from '../components/ClosedOverlay';

export default function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { isOpen } = getRestaurantStatus();

  useEffect(() => {
    const fetchMenu = () => {
      // Avval localStorage-dan o'qiymiz, bo'sh bo'lsa — static fayldan
      const saved = localStorage.getItem('gopizza_menu');
      let rawItems = [];

      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          rawItems = parsed && parsed.length > 0 ? parsed : staticMenuData;
        } catch {
          rawItems = staticMenuData;
        }
      } else {
        // Hosting yoki yangi brauzerda: localStorage bo'sh — static fayldan yuklaymiz
        rawItems = staticMenuData;
        // Static ma'lumotni localStorage-ga ham yozib qo'yamiz (keyingi o'qishlar tezroq bo'lsin)
        try {
          localStorage.setItem('gopizza_menu', JSON.stringify(staticMenuData));
        } catch {}
      }

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
      setLoading(false);
    };
    fetchMenu();
  }, []);

  return (
    <section id="menu" className="menu section">
      <div className="container section-title" data-aos="fade-up">
        <h2>Bizning Menyu</h2>
        <p><span>Bizning</span> <span className="description-title">Mazali Menyumiz</span></p>
        {!isOpen && <ClosedOverlay />}
      </div>

      <div className="container" data-aos="fade-up" data-aos-delay="200">
        <div className="row gy-5">
          {loading ? (
            <div className="col-12 text-center py-5">
              <Loader2 className="animate-spin" size={48} color="var(--accent-color)" />
              <p className="mt-3">Menyu luksini tayyorlayapmiz...</p>
            </div>
          ) : (
            menuItems.map((item) => (
              <div className="col-lg-4 menu-item" key={item._id || item.id}>
                <div className="d-flex flex-column align-items-center">
                  <a href={item.image} className="glightbox mb-4">
                    <img src={item.image} className="menu-img img-fluid" alt={item.name} />
                  </a>
                  <h4>{item.name}</h4>
                  <p className="description">
                    Mazali va to'yimli, maxsus retsept asosida tayyorlangan.
                  </p>
                  <p className="price">
                    {(item.selectedPrice || item.price).toLocaleString()} so'm
                  </p>
                  
                  {item.variants && item.variants.length > 0 && (
                    <div className="size-selector mb-3 d-flex flex-wrap justify-content-center gap-2">
                      {item.variants.map((v, i) => (
                        <button 
                          key={i}
                          className={`btn btn-sm ${item.selectedSize === v.size ? 'btn-danger' : 'btn-outline-danger'}`}
                          onClick={() => {
                            const newItems = [...menuItems];
                            const itemIdx = newItems.findIndex(mi => mi._id === item._id);
                            newItems[itemIdx].selectedSize = v.size;
                            newItems[itemIdx].selectedPrice = v.price;
                            setMenuItems(newItems);
                          }}
                          style={{ fontSize: '11px', borderRadius: '15px', padding: '2px 10px' }}
                        >
                          {v.size}
                        </button>
                      ))}
                    </div>
                  )}

                  <button 
                    className="btn btn-danger d-flex align-items-center gap-2" 
                    disabled={!isOpen}
                    onClick={() => {
                      if (!isOpen) return;
                      const size = item.selectedSize || (item.variants?.[0]?.size) || 'Standard';
                      const price = item.selectedPrice || (item.variants?.[0]?.price) || item.price;
                      addToCart({ ...item, size, price });
                    }}
                    style={{ 
                      borderRadius: '25px', 
                      padding: '8px 25px', 
                      fontSize: '14px', 
                      fontWeight: '600',
                      opacity: isOpen ? 1 : 0.6,
                      cursor: isOpen ? 'pointer' : 'not-allowed'
                    }}
                  >
                    <ShoppingCart size={16} /> {isOpen ? "Savatga Qo'shish" : "Hozircha yopiq"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}