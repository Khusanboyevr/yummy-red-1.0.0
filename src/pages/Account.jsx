import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Phone, MapPin, LogOut, Calendar, ExternalLink } from 'lucide-react';

const Account = () => {
  const { user, userLogout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="container py-5 mt-5 text-center">
        <div className="py-5">
          <User size={80} className="text-muted mb-4" />
          <h2 className="fw-bold mb-3">Tizimga kirmagansiz</h2>
          <p className="text-muted mb-4">Profilni ko'rish uchun iltimos ro'yxatdan o'ting.</p>
          <button 
            className="btn btn-danger px-5 py-2 rounded-pill"
            onClick={() => navigate('/login')}
          >
            Ro'yxatdan o'tish
          </button>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    userLogout();
    navigate('/');
  };

  return (
    <section id="account" className="account section" style={{ paddingTop: '120px', paddingBottom: '60px', minHeight: '80vh' }}>
      <div className="container" data-aos="fade-up">
        <div className="section-title">
          <h2>Shaxsiy Kabinet</h2>
          <p>Xush kelibsiz, {user.name}!</p>
        </div>

        <div className="row gy-4">
          {/* User Info Card */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4">
                <div className="text-center mb-4">
                  <div className="bg-danger text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                    <User size={40} />
                  </div>
                  <h4 className="fw-bold mb-1">{user.name}</h4>
                  <p className="text-muted small">{user.phone}</p>
                </div>
                
                <hr className="my-4" />
                
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-light p-2 rounded text-danger"><Phone size={18} /></div>
                    <div>
                      <div className="text-muted extra-small" style={{ fontSize: '0.75rem' }}>Telefon</div>
                      <div className="fw-bold">{user.phone}</div>
                    </div>
                  </div>
                  
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-light p-2 rounded text-danger"><Calendar size={18} /></div>
                    <div>
                      <div className="text-muted extra-small" style={{ fontSize: '0.75rem' }}>A'zo bo'lgan sana</div>
                      <div className="fw-bold">Hozirgina</div>
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <button 
                    onClick={handleLogout}
                    className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2 py-2 rounded-pill"
                    style={{ transition: 'all 0.3s' }}
                  >
                    <LogOut size={18} /> Chiqish
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Saved Locations Card */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4">
                <h4 className="fw-bold mb-4 d-flex align-items-center gap-2">
                  <MapPin size={24} className="text-danger" /> Saqlangan Manzillar
                </h4>
                
                {user.savedLocations && user.savedLocations.length > 0 ? (
                  <div className="d-flex flex-column gap-3">
                    {user.savedLocations.map((loc, idx) => (
                      <div key={idx} className="p-3 bg-light rounded-3 border-start border-danger border-4">
                        <div className="d-flex justify-content-between align-items-start gap-2">
                          <div>
                            <div className="text-muted mb-1" style={{ fontSize: '0.8rem' }}>
                              <Calendar size={14} className="me-1" /> {new Date(loc.date).toLocaleDateString()}
                            </div>
                            <div className="fw-bold">{loc.address}</div>
                          </div>
                          {loc.url && (
                            <a href={loc.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-danger text-white rounded-pill px-3">
                              <ExternalLink size={14} className="me-1" /> Map
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <div className="bg-light p-4 rounded-4 d-inline-block mb-3">
                      <MapPin size={40} className="text-muted" />
                    </div>
                    <p className="text-muted">Hali hech qanday manzil saqlanmagan.<br/>Buyurtma berganingizda manzilingiz avtomatik saqlanadi.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Account;
