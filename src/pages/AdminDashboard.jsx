import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit, Trash2, Search, X, Loader2 } from 'lucide-react';

export default function AdminDashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'all',
    imageUrl: '',
    imageFile: null,
    variants: []
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const { admin, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !admin) {
      navigate('/admin-login');
    }
  }, [admin, authLoading, navigate]);

  // Rasm linki o'zgarganda previewni yangilash
  useEffect(() => {
    if (formData.imageUrl && !formData.imageFile) {
      setImagePreview(formData.imageUrl);
    }
  }, [formData.imageUrl, formData.imageFile]);

  useEffect(() => {
    fetchItems();
  }, []);

  if (authLoading || !admin) {
    return <div className="text-center py-5 mt-5">Yuklanmoqda...</div>;
  }

  const fetchItems = () => {
    const saved = localStorage.getItem('gopizza_menu');
    setItems(saved ? JSON.parse(saved) : []);
    setLoading(false);
  };

  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const compressImage = (base64Str, maxWidth = 800, maxHeight = 800) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7)); // 0.7 quality
      };
    });
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        price: item.price,
        category: item.category,
        imageUrl: item.image,
        imageFile: null,
        variants: item.variants || []
      });
      setImagePreview(item.image);
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        price: '',
        category: 'all',
        imageUrl: '',
        imageFile: null,
        variants: []
      });
      setImagePreview(null);
    }
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, imageFile: file, imageUrl: '' });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      let finalImage = formData.imageUrl;
      if (formData.imageFile) {
        const base64 = await readFileAsBase64(formData.imageFile);
        finalImage = await compressImage(base64);
      } else if (finalImage && finalImage.startsWith('data:image')) {
        // Agar link joyiga base64 tashlangan bo'lsa uni ham siqamiz
        finalImage = await compressImage(finalImage);
      }

      if (!finalImage) {
        alert('Iltimos rasm yuklang yoki linkini kiriting');
        setSaving(false);
        return;
      }

      const newItem = {
        _id: editingItem ? editingItem._id : Date.now().toString(),
        name: formData.name,
        price: Number(formData.price),
        category: 'all',
        image: finalImage,
        variants: formData.variants,
        createdAt: editingItem ? editingItem.createdAt : new Date().toISOString()
      };

      const savedMenu = localStorage.getItem('gopizza_menu');
      let menuList = savedMenu ? JSON.parse(savedMenu) : [];

      if (editingItem) {
        menuList = menuList.map(item => item._id === editingItem._id ? newItem : item);
      } else {
        menuList = [newItem, ...menuList];
      }

      try {
        localStorage.setItem('gopizza_menu', JSON.stringify(menuList));
        setItems(menuList);
        setIsModalOpen(false);
      } catch (e) {
        if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
          alert('Fayl hajmi juda katta! Iltimos kichikroq rasm yuklang yoki rasm linkidan foydalaning (LocalStorage xotirasi to\'ldi).');
        } else {
          alert('Saqlashda xatolik yuz berdi: ' + e.message);
        }
      }
    } catch (err) {
      console.error('Error saving item:', err);
      alert('Tizimda xatolik yuz berdi');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Chindan ham o\'chirmoqchimisiz?')) {
      const savedMenu = localStorage.getItem('gopizza_menu');
      let menuList = savedMenu ? JSON.parse(savedMenu) : [];
      menuList = menuList.filter(item => item._id !== id);
      localStorage.setItem('gopizza_menu', JSON.stringify(menuList));
      setItems(menuList);
    }
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="section mt-5 pt-5">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Menyu Boshqaruvi</h2>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-danger" onClick={logout}>Chiqish</button>
            <button className="btn btn-danger d-flex align-items-center gap-2" onClick={() => handleOpenModal()}>
              <Plus size={18} /> Yangi Qo'shish
            </button>
          </div>
        </div>

        <div className="mb-4 position-relative">
          <input 
            type="text" 
            className="form-control ps-5 py-2" 
            placeholder="Taomnomadan qidirish..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="position-absolute top-50 translate-middle-y ms-3 text-muted" size={18} />
        </div>

        <div className="alert alert-info py-2 small mb-4">
          <Plus size={14} className="me-1" /> Pizza yoki Kebab kabi taomlar uchun bir nechta o'lcham va narx qo'shishingiz mumkin.
        </div>

        {loading ? (
          <div className="text-center py-5">
            <Loader2 className="animate-spin" size={40} />
          </div>
        ) : (
          <div className="table-responsive bg-white shadow rounded p-3">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>Rasm</th>
                  <th>Nomi</th>
                  <th>Narxi</th>
                  <th>Amallar</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-muted">Hech narsa topilmadi. Yangi taom qo'shing.</td>
                  </tr>
                ) : (
                  filteredItems.map(item => (
                    <tr key={item._id}>
                      <td>
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} 
                        />
                      </td>
                      <td><h6 className="mb-0">{item.name}</h6></td>
                      <td>{item.price.toLocaleString()} so'm</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-outline-primary" onClick={() => handleOpenModal(item)}>
                            <Edit size={16} />
                          </button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(item._id)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingItem ? 'Tahrirlash' : 'Yangi Taom Qo\'shish'}</h5>
                <button type="button" className="btn-close" onClick={() => setIsModalOpen(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Nomi</label>
                      <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Narxi</label>
                      <input type="number" className="form-control" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                    </div>


                    <div className="col-md-6 mb-3">
                      <label className="form-label">Rasm Linki (ixtiyoriy)</label>
                      <input type="text" className="form-control" placeholder="https://..." value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value, imageFile: null})} />
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label">Yoki Rasm Yuklash</label>
                      <input type="file" className="form-control" accept="image/*" onChange={handleFileChange} />
                    </div>
                    {imagePreview && (
                      <div className="col-12 text-center">
                        <img src={imagePreview} alt="Preview" style={{ maxWidth: '200px', borderRadius: '10px' }} />
                      </div>
                    )}
                    
                    <div className="col-12 mt-4">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <label className="form-label fw-bold mb-0">Variantlar (O'lcham va Narx)</label>
                        <button 
                          type="button" 
                          className="btn btn-sm btn-outline-success"
                          onClick={() => {
                            const newVariants = [...formData.variants, { size: '', price: '' }];
                            setFormData({ ...formData, variants: newVariants });
                          }}
                        >
                          <Plus size={14} /> Variant Qo'shish
                        </button>
                      </div>
                      
                      {formData.variants.length === 0 ? (
                        <p className="text-muted small">Hech qanday variant qo'shilmagan. Asosiy narx ishlatiladi.</p>
                      ) : (
                        formData.variants.map((variant, idx) => (
                          <div key={idx} className="row g-2 mb-2 align-items-end">
                            <div className="col-5">
                              <label className="small text-muted">O'lcham (masalan: 30 sm)</label>
                              <input 
                                type="text" 
                                className="form-control form-control-sm" 
                                value={variant.size} 
                                onChange={(e) => {
                                  const newVariants = [...formData.variants];
                                  newVariants[idx].size = e.target.value;
                                  setFormData({ ...formData, variants: newVariants });
                                }} 
                                required 
                              />
                            </div>
                            <div className="col-5">
                              <label className="small text-muted">Narx (so'm)</label>
                              <input 
                                type="number" 
                                className="form-control form-control-sm" 
                                value={variant.price} 
                                onChange={(e) => {
                                  const newVariants = [...formData.variants];
                                  newVariants[idx].price = e.target.value;
                                  setFormData({ ...formData, variants: newVariants });
                                }} 
                                required 
                              />
                            </div>
                            <div className="col-2">
                              <button 
                                type="button" 
                                className="btn btn-sm btn-outline-danger w-100"
                                onClick={() => {
                                  const newVariants = formData.variants.filter((_, i) => i !== idx);
                                  setFormData({ ...formData, variants: newVariants });
                                }}
                              >
                                <X size={14} />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" disabled={saving} onClick={() => setIsModalOpen(false)}>Bekor qilish</button>
                  <button type="submit" className="btn btn-danger d-flex align-items-center gap-2" disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="animate-spin" size={18} /> Saqlanmoqda...
                      </>
                    ) : (
                      'Saqlash'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
