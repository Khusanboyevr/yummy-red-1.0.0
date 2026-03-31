import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit, Trash2, Search, X, Loader2, Download, RefreshCw, Layers, List } from 'lucide-react';
import { staticMenuData } from '../data/menuData';
import { staticComboData } from '../data/comboData';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('menu'); // 'menu' yoki 'combos'
  const [items, setItems] = useState([]);
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  // Menu form data
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'all',
    imageUrl: '',
    imageFile: null,
    variants: []
  });

  // Combo form data
  const [comboFormData, setComboFormData] = useState({
    name: '',
    price: '',
    badge: '',
    items: '',
    backgroundColor: '#28a745',
    imageUrl: '',
    imageFile: null
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
    if (activeTab === 'menu') {
      if (formData.imageUrl && !formData.imageFile) {
        setImagePreview(formData.imageUrl);
      }
    } else {
      if (comboFormData.imageUrl && !comboFormData.imageFile) {
        setImagePreview(comboFormData.imageUrl);
      }
    }
  }, [formData.imageUrl, formData.imageFile, comboFormData.imageUrl, comboFormData.imageFile, activeTab]);

  useEffect(() => {
    fetchData();
  }, []);

  if (authLoading || !admin) {
    return <div className="text-center py-5 mt-5">Yuklanmoqda...</div>;
  }

  const fetchData = () => {
    setLoading(true);
    const savedMenu = localStorage.getItem('gopizza_menu');
    setItems(savedMenu ? JSON.parse(savedMenu) : []);
    
    const savedCombos = localStorage.getItem('gopizza_combos');
    setCombos(savedCombos ? JSON.parse(savedCombos) : []);
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
    if (activeTab === 'menu') {
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
    } else {
      if (item) {
        setEditingItem(item);
        setComboFormData({
          name: item.name,
          price: item.price,
          badge: item.badge,
          items: item.items,
          backgroundColor: item.backgroundColor || '#28a745',
          imageUrl: item.image,
          imageFile: null
        });
        setImagePreview(item.image);
      } else {
        setEditingItem(null);
        setComboFormData({
          name: '',
          price: '',
          badge: '',
          items: '',
          backgroundColor: '#28a745',
          imageUrl: '',
          imageFile: null
        });
        setImagePreview(null);
      }
    }
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (activeTab === 'menu') {
        setFormData({ ...formData, imageFile: file, imageUrl: '' });
      } else {
        setComboFormData({ ...comboFormData, imageFile: file, imageUrl: '' });
      }
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (activeTab === 'menu') {
        let finalImage = formData.imageUrl;
        if (formData.imageFile) {
          const base64 = await readFileAsBase64(formData.imageFile);
          finalImage = await compressImage(base64);
        } else if (finalImage && finalImage.startsWith('data:image')) {
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

        localStorage.setItem('gopizza_menu', JSON.stringify(menuList));
        setItems(menuList);
      } else {
        // Combo saqlash
        let finalImage = comboFormData.imageUrl;
        if (comboFormData.imageFile) {
          const base64 = await readFileAsBase64(comboFormData.imageFile);
          finalImage = await compressImage(base64);
        }

        if (!finalImage) {
          alert('Iltimos rasm yuklang yoki linkini kiriting');
          setSaving(false);
          return;
        }

        const newCombo = {
          _id: editingItem ? editingItem._id : Date.now().toString(),
          name: comboFormData.name,
          price: Number(comboFormData.price),
          badge: comboFormData.badge,
          items: comboFormData.items,
          backgroundColor: comboFormData.backgroundColor,
          image: finalImage,
          createdAt: editingItem ? editingItem.createdAt : new Date().toISOString()
        };

        const savedCombos = localStorage.getItem('gopizza_combos');
        let comboList = savedCombos ? JSON.parse(savedCombos) : [];

        if (editingItem) {
          comboList = comboList.map(c => c._id === editingItem._id ? newCombo : c);
        } else {
          comboList = [newCombo, ...comboList];
        }

        localStorage.setItem('gopizza_combos', JSON.stringify(comboList));
        setCombos(comboList);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving:', err);
      alert('Tizimda xatolik yuz berdi');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Chindan ham o\'chirmoqchimisiz?')) {
      if (activeTab === 'menu') {
        const savedMenu = localStorage.getItem('gopizza_menu');
        let menuList = savedMenu ? JSON.parse(savedMenu) : [];
        menuList = menuList.filter(item => item._id !== id);
        localStorage.setItem('gopizza_menu', JSON.stringify(menuList));
        setItems(menuList);
      } else {
        const savedCombos = localStorage.getItem('gopizza_combos');
        let comboList = savedCombos ? JSON.parse(savedCombos) : [];
        comboList = comboList.filter(c => c._id !== id);
        localStorage.setItem('gopizza_combos', JSON.stringify(comboList));
        setCombos(comboList);
      }
    }
  };

  const handleExportToFile = () => {
    if (activeTab === 'menu') {
      const savedMenu = localStorage.getItem('gopizza_menu');
      const menuList = savedMenu ? JSON.parse(savedMenu) : staticMenuData;
      const fileContent = `export const staticMenuData = ${JSON.stringify(menuList, null, 2)};`;
      downloadFile(fileContent, 'menuData.js');
    } else {
      const savedCombos = localStorage.getItem('gopizza_combos');
      const comboList = savedCombos ? JSON.parse(savedCombos) : staticComboData;
      const fileContent = `export const staticComboData = ${JSON.stringify(comboList, null, 2)};`;
      downloadFile(fileContent, 'comboData.js');
    }
  };

  const downloadFile = (content, filename) => {
    const blob = new Blob([content], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert(`✅ ${filename} yuklab olindi!\n\nBu faylni src/data/ papkasiga qo'ying.`);
  };

  const handleReloadStatic = () => {
    if (window.confirm('Statik ma\'lumotlarni qayta yuklashni xohlaysizmi? Hozirgi o\'zgarishlar o\'chib ketadi!')) {
      if (activeTab === 'menu') {
        localStorage.setItem('gopizza_menu', JSON.stringify(staticMenuData));
        setItems(staticMenuData);
      } else {
        localStorage.setItem('gopizza_combos', JSON.stringify(staticComboData));
        setCombos(staticComboData);
      }
      alert('✅ Statik ma\'lumotlar muvaffaqiyatli qayta yuklandi!');
    }
  };

  const currentList = activeTab === 'menu' ? items : combos;
  const filteredItems = currentList.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="section mt-5 pt-5">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <h2>Admin Panel</h2>
          <div className="d-flex gap-2 flex-wrap">
            <button className="btn btn-outline-success d-flex align-items-center gap-2" onClick={handleExportToFile}>
              <Download size={16} /> Faylga Saqlash
            </button>
            <button className="btn btn-outline-warning d-flex align-items-center gap-2" onClick={handleReloadStatic}>
              <RefreshCw size={16} /> Statikni Yuklash
            </button>
            <button className="btn btn-outline-danger" onClick={logout}>Chiqish</button>
            <button className="btn btn-danger d-flex align-items-center gap-2" onClick={() => handleOpenModal()}>
              <Plus size={18} /> Yangi Qo'shish
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="d-flex gap-3 mb-4 border-bottom pb-2">
          <button 
            className={`btn d-flex align-items-center gap-2 ${activeTab === 'menu' ? 'btn-danger' : 'btn-light'}`}
            onClick={() => { setActiveTab('menu'); setSearch(''); }}
          >
            <List size={18} /> Menyu
          </button>
          <button 
            className={`btn d-flex align-items-center gap-2 ${activeTab === 'combos' ? 'btn-danger' : 'btn-light'}`}
            onClick={() => { setActiveTab('combos'); setSearch(''); }}
          >
            <Layers size={18} /> Combolar
          </button>
        </div>

        <div className="mb-4 position-relative">
          <input 
            type="text" 
            className="form-control ps-5 py-2" 
            placeholder={`${activeTab === 'menu' ? 'Taomnomadan' : 'Combolardan'} qidirish...`} 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="position-absolute top-50 translate-middle-y ms-3 text-muted" size={18} />
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
                  {activeTab === 'combos' && <th>Badge</th>}
                  <th>Amallar</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">Hech narsa topilmadi.</td>
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
                      <td>
                        <h6 className="mb-0">{item.name}</h6>
                        {activeTab === 'combos' && <small className="text-muted">{item.items.substring(0, 30)}...</small>}
                      </td>
                      <td>{item.price.toLocaleString()} so'm</td>
                      {activeTab === 'combos' && <td><span className="badge bg-danger">{item.badge}</span></td>}
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
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingItem ? 'Tahrirlash' : `Yangi ${activeTab === 'menu' ? 'Taom' : 'Combo'} Qo'shish`}</h5>
                <button type="button" className="btn-close" onClick={() => setIsModalOpen(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Nomi</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={activeTab === 'menu' ? formData.name : comboFormData.name} 
                        onChange={e => activeTab === 'menu' ? setFormData({...formData, name: e.target.value}) : setComboFormData({...comboFormData, name: e.target.value})} 
                        required 
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Narxi</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        value={activeTab === 'menu' ? formData.price : comboFormData.price} 
                        onChange={e => activeTab === 'menu' ? setFormData({...formData, price: e.target.value}) : setComboFormData({...comboFormData, price: e.target.value})} 
                        required 
                      />
                    </div>

                    {activeTab === 'combos' && (
                       <>
                         <div className="col-md-6 mb-3">
                            <label className="form-label">Badge (masalan: 2+1 AKSIYA)</label>
                            <input type="text" className="form-control" value={comboFormData.badge} onChange={e => setComboFormData({...comboFormData, badge: e.target.value})} />
                         </div>
                         <div className="col-md-6 mb-3">
                            <label className="form-label">Fon Rangi</label>
                            <input type="color" className="form-control form-control-color w-100" value={comboFormData.backgroundColor} onChange={e => setComboFormData({...comboFormData, backgroundColor: e.target.value})} />
                         </div>
                         <div className="col-12 mb-3">
                            <label className="form-label">Tarkibi (Vergul bilan ajrating)</label>
                            <textarea className="form-control" value={comboFormData.items} onChange={e => setComboFormData({...comboFormData, items: e.target.value})} rows="2" required></textarea>
                         </div>
                       </>
                    )}

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Rasm Linki (ixtiyoriy)</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="https://..." 
                        value={activeTab === 'menu' ? formData.imageUrl : comboFormData.imageUrl} 
                        onChange={e => activeTab === 'menu' ? setFormData({...formData, imageUrl: e.target.value, imageFile: null}) : setComboFormData({...comboFormData, imageUrl: e.target.value, imageFile: null})} 
                      />
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label">Yoki Rasm Yuklash</label>
                      <input type="file" className="form-control" accept="image/*" onChange={handleFileChange} />
                    </div>
                    {imagePreview && (
                      <div className="col-12 text-center mb-3">
                        <img src={imagePreview} alt="Preview" style={{ maxWidth: '200px', borderRadius: '10px' }} />
                      </div>
                    )}
                    
                    {activeTab === 'menu' && (
                      <div className="col-12 mt-2">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <label className="form-label fw-bold mb-0">Variantlar</label>
                          <button type="button" className="btn btn-sm btn-outline-success" onClick={() => setFormData({ ...formData, variants: [...formData.variants, { size: '', price: '' }] })}>
                            <Plus size={14} /> Variant Qo'shish
                          </button>
                        </div>
                        {formData.variants.map((v, i) => (
                          <div key={i} className="row g-2 mb-2">
                            <div className="col-5"><input type="text" className="form-control form-control-sm" placeholder="O'lcham" value={v.size} onChange={e => { const v2 = [...formData.variants]; v2[i].size = e.target.value; setFormData({...formData, variants: v2}); }} /></div>
                            <div className="col-5"><input type="number" className="form-control form-control-sm" placeholder="Narx" value={v.price} onChange={e => { const v2 = [...formData.variants]; v2[i].price = e.target.value; setFormData({...formData, variants: v2}); }} /></div>
                            <div className="col-2"><button type="button" className="btn btn-sm btn-outline-danger w-100" onClick={() => setFormData({...formData, variants: formData.variants.filter((_, idx) => idx !== i)}) }><X size={14} /></button></div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" disabled={saving} onClick={() => setIsModalOpen(false)}>Bekor qilish</button>
                  <button type="submit" className="btn btn-danger" disabled={saving}>
                    {saving ? <Loader2 className="animate-spin" size={18} /> : 'Saqlash'}
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
