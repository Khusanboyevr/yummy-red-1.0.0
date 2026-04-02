import React from 'react';
import { X, ShoppingCart, Plus, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function RecommendationModal({ show, onClose, sourceItem, recommendedItems }) {
  const { addToCart, cartItems } = useCart();

  if (!show || !sourceItem || !recommendedItems || recommendedItems.length === 0) return null;

  const handleAddToCart = (item) => {
    const size = item.variants?.[0]?.size || 'Standard';
    const price = item.variants?.[0]?.price || item.price;
    addToCart({ ...item, size, price });
  };

  const isInCart = (itemId) => {
    return cartItems.some(item => item._id === itemId);
  };

  return (
    <div 
      className="recommendation-modal-overlay d-flex align-items-center justify-content-center"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        padding: '20px',
        animation: 'fadeIn 0.3s ease'
      }}
      onClick={onClose}
    >
      <div 
        className="recommendation-modal-content bg-white"
        style={{
          width: '100%',
          maxWidth: '550px',
          borderRadius: '30px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
          animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          position: 'relative'
        }}
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="btn-close-custom"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(0,0,0,0.05)',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <X size={20} />
        </button>

        <div className="p-4 p-md-5">
          <div className="text-center mb-4">
            <div 
              className="badge bg-danger mb-2 px-3 py-2" 
              style={{ borderRadius: '10px', fontSize: '0.8rem', letterSpacing: '1px' }}
            >
              ZO'R TANLOV!
            </div>
            <h3 className="fw-bold mb-1">Buni ham sinab ko'rasizmi?</h3>
            <p className="text-muted"><strong>{sourceItem.name}</strong> bilan birgalikda tavfsiya etamiz:</p>
          </div>

          <div className="recommended-list">
            {recommendedItems.map((item, index) => (
              <div 
                key={item._id} 
                className="d-flex align-items-center p-3 mb-3 border rounded-4 hover-shadow"
                style={{
                  transition: 'all 0.3s ease',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '20px',
                }}
              >
                <img 
                  src={item.image} 
                  alt={item.name} 
                  style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '15px' }}
                />
                <div className="ms-3 flex-grow-1">
                  <h6 className="mb-0 fw-bold">{item.name}</h6>
                  <p className="mb-0 text-danger fw-bold">{item.price.toLocaleString()} so'm</p>
                </div>
                <div>
                  {isInCart(item._id) ? (
                    <button 
                      className="btn btn-success rounded-circle"
                      style={{ width: '45px', height: '45px', padding: 0 }}
                      disabled
                    >
                      <Check size={20} />
                    </button>
                  ) : (
                    <button 
                      className="btn btn-danger rounded-circle shadow-sm"
                      style={{ width: '45px', height: '45px', padding: 0 }}
                      onClick={() => handleAddToCart(item)}
                    >
                      <Plus size={20} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-2">
            <button 
              className="btn btn-dark w-100 py-3 rounded-4 fw-bold"
              style={{ fontSize: '1.1rem' }}
              onClick={onClose}
            >
              Rahmat, hammasi joyida
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hover-shadow:hover {
          background-color: #fff !important;
          box-shadow: 0 10px 20px rgba(0,0,0,0.05);
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
