import { useState, useEffect } from 'react';
import { ShoppingCart, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { staticComboData } from '../data/comboData';

export default function Combos() {
  const [combos, setCombos] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const saved = localStorage.getItem('gopizza_combos');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCombos(parsed.length > 0 ? parsed : staticComboData);
      } catch {
        setCombos(staticComboData);
      }
    } else {
      setCombos(staticComboData);
      localStorage.setItem('gopizza_combos', JSON.stringify(staticComboData));
    }
  }, []);

  if (combos.length === 0) return null;

  return (
    <section id="combos" className="combos section py-5">
      <div className="container section-title" data-aos="fade-up">
        <h2>Maxsus Takliflar</h2>
        <p><span>Bizning</span> <span className="description-title">Ajoyib Combolarimiz</span></p>
      </div>

      <div className="container">
        <div className="row gy-4">
          {combos.map((combo) => (
            <div className="col-lg-6" key={combo._id} data-aos="fade-up">
              <div 
                className="combo-card p-4 h-100 position-relative overflow-hidden shadow-lg"
                style={{ 
                  backgroundColor: combo.backgroundColor || '#28a745', 
                  borderRadius: '20px',
                  color: '#fff',
                  border: 'none',
                  transition: 'transform 0.3s ease'
                }}
              >
                <div className="row align-items-center h-100">
                  <div className="col-md-7 position-relative z-1">
                    <div className="d-flex align-items-center gap-2 mb-2">
                       <img src="/assets/img/hero-img.png" alt="Logo" style={{ height: '30px', filter: 'brightness(0) invert(1)' }} />
                       <span className="fw-bold" style={{ letterSpacing: '2px' }}>GO PIZZA</span>
                    </div>
                    
                    <h3 className="display-6 fw-bold mb-3" style={{ textTransform: 'uppercase' }}>{combo.name}</h3>
                    
                    <div className="badge-wrapper mb-4">
                      <span className="bg-white text-danger px-3 py-1 fw-bold rounded-pill shadow-sm" style={{ fontSize: '1.2rem' }}>
                        {combo.badge}
                      </span>
                    </div>

                    <div className="price-tag mb-4 shadow-sm" style={{ 
                      background: 'rgba(255,255,255,0.2)', 
                      backdropFilter: 'blur(10px)',
                      padding: '10px 20px',
                      borderRadius: '50px',
                      display: 'inline-block',
                      fontSize: '1.5rem',
                      fontWeight: '700'
                    }}>
                      {combo.price.toLocaleString()} so'm
                    </div>

                    <div className="items-list mb-4">
                      <p className="small opacity-75 mb-2 fw-bold text-uppercase">Tarkibi:</p>
                      <h5 className="lh-base" style={{ fontWeight: '500' }}>
                        {combo.items}
                      </h5>
                    </div>

                    <button 
                      className="btn btn-light text-success fw-bold px-4 py-2 rounded-pill d-flex align-items-center gap-2 shadow"
                      onClick={() => addToCart({
                         ...combo,
                         id: combo._id,
                         image: combo.image,
                         size: 'Combo'
                      })}
                    >
                      <ShoppingCart size={20} /> Savatga Qo'shish
                    </button>
                  </div>
                  
                  <div className="col-md-5 mt-4 mt-md-0 position-relative">
                    <img 
                      src={combo.image} 
                      alt={combo.name} 
                      className="img-fluid rounded-circle shadow-lg"
                      style={{ 
                        width: '100%', 
                        aspectRatio: '1/1', 
                        objectFit: 'cover',
                        border: '5px solid rgba(255,255,255,0.3)'
                      }} 
                    />
                  </div>
                </div>
                
                {/* Decorative Elements */}
                <div style={{
                  position: 'absolute',
                  top: '-50px',
                  right: '-50px',
                  width: '200px',
                  height: '200px',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '50%'
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .combo-card:hover {
          transform: translateY(-10px);
        }
        @media (max-width: 768px) {
          .combo-card {
            text-align: center;
          }
          .combo-card .d-flex {
            justify-content: center;
          }
        }
      `}} />
    </section>
  );
}
