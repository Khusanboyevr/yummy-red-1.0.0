import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Phone } from 'lucide-react';

const UserAuth = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+998');
  const { userRegister } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && phone.length >= 13) {
      userRegister(name, phone);
      navigate('/account');
    } else {
      alert("Iltimos, ismingizni va to'liq telefon raqamingizni kiriting.");
    }
  };

  const handlePhoneChange = (e) => {
    let val = e.target.value;
    if (!val.startsWith("+998")) {
      val = "+998" + val.replace(/\D/g, "");
    }
    setPhone(val);
  };

  return (
    <section id="user-auth" className="user-auth section d-flex align-items-center" style={{ minHeight: '80vh', paddingTop: '120px', paddingBottom: '60px' }}>
      <div className="container" data-aos="fade-up">
        <div className="section-title">
          <h2>Ro'yxatdan O'tish</h2>
          <p>GoPizza oilasiga xush kelibsiz!</p>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-5">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="card-body p-4 p-md-5 bg-white">
                <form onSubmit={handleSubmit} className="php-email-form">
                  <div className="form-group mb-4">
                    <label className="form-label d-flex align-items-center gap-2 mb-2 fw-bold">
                      <User size={18} className="text-danger" /> To'liq ismingiz
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-3 py-2"
                      placeholder="Ismingizni kiriting"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="form-group mb-4">
                    <label className="form-label d-flex align-items-center gap-2 mb-2 fw-bold">
                      <Phone size={18} className="text-danger" /> Telefon raqamingiz
                    </label>
                    <input
                      type="tel"
                      className="form-control rounded-3 py-2"
                      placeholder="+998"
                      value={phone}
                      onChange={handlePhoneChange}
                      required
                    />
                  </div>

                  <div className="text-center mt-4">
                    <button type="submit" className="btn btn-danger w-100 py-3 rounded-pill fw-bold shadow-sm" style={{ transition: 'all 0.3s' }}>
                      Ro'yxatdan O'tish
                    </button>
                  </div>
                  
                  <p className="text-center mt-4 text-muted small">
                    Ro'yxatdan o'tish orqali siz buyurtmalaringizni osonroq kuzatishingiz va manzillaringizni saqlashingiz mumkin.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserAuth;
