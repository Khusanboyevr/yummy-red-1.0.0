import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(username, password);
    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.message);
    }
  };

  return (
    <section id="login" className="login section d-flex align-items-center" style={{ minHeight: '100vh', paddingTop: '100px' }}>
      <div className="container" data-aos="fade-up">
        <div className="section-title">
          <h2>Admin Kirish</h2>
          <p>Boshqaruv paneliga kirish</p>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-5">
            <form onSubmit={handleSubmit} className="php-email-form p-4 shadow rounded bg-white">
              <div className="form-group mb-3">
                <label className="mb-2">Login</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="form-group mb-3">
                <label className="mb-2">Parol</label>
                <div className="position-relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ paddingRight: '40px' }}
                  />
                  <button
                    type="button"
                    className="position-absolute end-0 top-50 translate-middle-y border-0 bg-transparent px-3"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ color: '#6c757d' }}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              {error && <div className="alert alert-danger mb-3">{error}</div>}
              <div className="text-center">
                <button type="submit" className="btn btn-primary px-5 py-2" style={{ backgroundColor: '#ce1212', border: 'none' }}>
                  Kirish
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminLogin;
