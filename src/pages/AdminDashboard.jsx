import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit, Trash2, Search, X, Loader2, Download, RefreshCw, Layers, List, ThumbsUp, Link2 } from 'lucide-react';
import { staticMenuData } from '../data/menuData';
import { staticComboData } from '../data/comboData';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('menu'); // 'menu', 'combos', yoki 'recommendations'
  const [items, setItems] = useState([]);
  const [combos, setCombos] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Pizzalar', // Default kategoriya
    imageUrl: '',
    imageFile: null,
    variants: [],
    description: ''
  });

  const [activeAdminCategory, setActiveAdminCategory] = useState('Hamma taomlar');

  const categories = [
    'Hamma taomlar',
    'Pizzalar',
    'Fast food',
    'Salqin ichimlik va sharbatlar',
    'Qaynoq ichimliklar',
    'Qoʻshimchalar',
    'Turk taomlari'
  ];

  // Recommendation form data
  const [recFormData, setRecFormData] = useState({
    sourceCategory: 'Pizzalar',
    recommendedItemIds: []
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
    const menuItems = savedMenu ? JSON.parse(savedMenu) : [];
    setItems(menuItems);
    
    const savedCombos = localStorage.getItem('gopizza_combos');
    setCombos(savedCombos ? JSON.parse(savedCombos) : []);

    const savedRecs = localStorage.getItem('gopizza_recommendations');
    setRecommendations(savedRecs ? JSON.parse(savedRecs) : []);

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
          variants: item.variants || [],
          description: item.description || ''
        });
        setImagePreview(item.image);
      } else {
        setEditingItem(null);
        setFormData({
          name: '',
          price: '',
          category: 'Hamma taomlar',
          imageUrl: '',
          imageFile: null,
          variants: [],
          description: ''
        });
        setImagePreview(null);
      }
    } else if (activeTab === 'recommendations') {
      if (item) {
        setEditingItem(item);
        setRecFormData({
          sourceCategory: item.sourceCategory,
          recommendedItemIds: item.recommendedItemIds || []
        });
      } else {
        setEditingItem(null);
        setRecFormData({
          sourceCategory: 'Hamma taomlar',
          recommendedItemIds: []
        });
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
          category: formData.category,
          image: finalImage,
          variants: formData.variants,
          description: formData.description,
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
      } else if (activeTab === 'recommendations') {
        const newRec = {
          _id: editingItem ? editingItem._id : Date.now().toString(),
          sourceCategory: recFormData.sourceCategory,
          recommendedItemIds: recFormData.recommendedItemIds,
          createdAt: editingItem ? editingItem.createdAt : new Date().toISOString()
        };

        const savedRecs = localStorage.getItem('gopizza_recommendations');
        let recList = savedRecs ? JSON.parse(savedRecs) : [];

        if (editingItem) {
          recList = recList.map(rec => rec._id === editingItem._id ? newRec : rec);
        } else {
          recList = [newRec, ...recList];
        }

        localStorage.setItem('gopizza_recommendations', JSON.stringify(recList));
        setRecommendations(recList);
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
    if (activeTab === 'recommendations') {
      const confirmed = window.confirm('Haqiqatdan ham ushbu tavfsiyani o\'chirmoqchimisiz?');
      if (confirmed) {
        setRecommendations(prev => {
          const newList = prev.filter(i => i._id !== id);
          localStorage.setItem('gopizza_recommendations', JSON.stringify(newList));
          return newList;
        });
      }
      return;
    }

    const confirmed = window.confirm('Haqiqatdan ham ushbu elementni o\'chirmoqchimisiz?');
    if (confirmed) {
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

  const currentList = activeTab === 'menu' ? items : (activeTab === 'combos' ? combos : recommendations);
  const filteredItems = currentList.filter(item => {
    const matchesSearch = activeTab === 'recommendations'
      ? item.sourceCategory?.toLowerCase().includes(search.toLowerCase())
      : (item.name?.toLowerCase().includes(search.toLowerCase()) || 
         item.category?.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory = activeTab === 'menu'
      ? (activeAdminCategory === 'Hamma taomlar' || item.category === activeAdminCategory)
      : true;

    return matchesSearch && matchesCategory;
  });

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
          <button 
            className={`btn d-flex align-items-center gap-2 ${activeTab === 'recommendations' ? 'btn-danger' : 'btn-light'}`}
            onClick={() => { setActiveTab('recommendations'); setSearch(''); }}
          >
            <ThumbsUp size={18} /> Tavfsiya
          </button>
        </div>

        <div className="mb-4 d-flex gap-2 flex-wrap">
          <div className="position-relative flex-grow-1">
            <input 
              type="text" 
              className="form-control ps-5 py-2" 
              placeholder={`${activeTab === 'menu' ? 'Taomnomadan' : (activeTab === 'combos' ? 'Combolardan' : 'Tavfsiyalardan')} qidirish...`} 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="position-absolute top-50 translate-middle-y ms-3 text-muted" size={18} />
          </div>
          
          {activeTab === 'menu' && (
            <select 
              className="form-select w-auto"
              value={activeAdminCategory}
              onChange={(e) => setActiveAdminCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          )}
        </div>

        {loading ? (
          <div className="text-center py-5">
            <Loader2 className="animate-spin" size={40} />
          </div>
        ) : (
          <div className="table-responsive bg-white shadow rounded p-3">
            <table className="table table-hover align-middle">
              <thead>
                {activeTab === 'recommendations' ? (
                  <tr>
                    <th>Trigger Kategoriya</th>
                    <th>Tavfsiya Etiladi (Suv, Sous va h.k.)</th>
                    <th>Sana</th>
                    <th>Amallar</th>
                  </tr>
                ) : (
                  <tr>
                    <th>Rasm</th>
                    <th>Nomi</th>
                    <th>Kategoriya</th>
                    <th>Narxi</th>
                    {activeTab === 'combos' && <th>Badge</th>}
                    <th>Amallar</th>
                  </tr>
                )}
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={activeTab === 'combos' ? "6" : "5"} className="text-center py-4 text-muted">Hech narsa topilmadi.</td>
                  </tr>
                ) : (
                  filteredItems.map(item => {
                    if (activeTab === 'recommendations') {
                      const recItems = item.recommendedItemIds.map(id => items.find(i => i._id === id)).filter(Boolean);
                      
                      return (
                        <tr key={item._id}>
                          <td>
                            <div className="d-flex align-items-center gap-2 text-danger fw-bold">
                              <Layers size={18} />
                              <span>{item.sourceCategory || 'Mavjud emas (Eski)'}</span>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex flex-wrap gap-1">
                              {recItems.map(ri => (
                                <span key={ri._id} className="badge bg-info text-dark small">{ri.name}</span>
                              ))}
                              {recItems.length === 0 && <span className="text-muted small">Tavfsiyalar yo'q</span>}
                            </div>
                          </td>
                          <td><small className="text-muted">{new Date(item.createdAt).toLocaleDateString()}</small></td>
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
                      );
                    }

                    return (
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
                        <td>
                          <span className="badge bg-light text-dark border">{item.category || 'Belgilanmagan'}</span>
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
                    );
                  })
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
                <h5 className="modal-title">{editingItem ? 'Tahrirlash' : `Yangi ${activeTab === 'menu' ? 'Taom' : (activeTab === 'combos' ? 'Combo' : 'Tavfsiya')} Qo'shish`}</h5>
                <button type="button" className="btn-close" onClick={() => setIsModalOpen(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    {activeTab === 'recommendations' ? (
                      <div className="col-12">
                        <div className="mb-3">
                          <label className="form-label">Qaysi bo'lim uchun? (Kategoriya)</label>
                          <select 
                            className="form-select" 
                            value={recFormData.sourceCategory} 
                            onChange={e => setRecFormData({...recFormData, sourceCategory: e.target.value})}
                            required
                          >
                            {categories.map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Tavfsiya etiladigan qo'shimchalar (Salqin ichimliklar, Souslar, Qo'shimchalar)</label>
                          <div className="border rounded p-3" style={{ maxHeight: '250px', overflowY: 'auto', backgroundColor: '#f8f9fa' }}>
                            {items.filter(i => ['Salqin ichimlik va sharbatlar', 'Qoʻshimchalar', 'Qaynoq ichimliklar', 'all', 'Hamma taomlar'].includes(i.category) || !i.category).map(item => (
                              <div key={item._id} className="form-check mb-1">
                                <input 
                                  className="form-check-input" 
                                  type="checkbox" 
                                  id={`rec-${item._id}`}
                                  checked={recFormData.recommendedItemIds.includes(item._id)}
                                  onChange={e => {
                                    const ids = e.target.checked 
                                      ? [...recFormData.recommendedItemIds, item._id]
                                      : recFormData.recommendedItemIds.filter(id => id !== item._id);
                                    setRecFormData({...recFormData, recommendedItemIds: ids});
                                  }}
                                />
                                <label className="form-check-label d-flex align-items-center gap-2" htmlFor={`rec-${item._id}`}>
                                  {item.name} <small className="text-muted">({item.price.toLocaleString()} so'm)</small>
                                </label>
                              </div>
                            ))}
                            {items.filter(i => ['Salqin ichimlik va sharbatlar', 'Qoʻshimchalar', 'Qaynoq ichimliklar', 'all', 'Hamma taomlar'].includes(i.category) || !i.category).length === 0 && (
                              <div className="text-center py-3 text-muted small">
                                Tavfsiya uchun mos taomlar topilmadi.<br/>
                                (Ichimliklar yoki Qo'shimchalar bo'limiga taom qo'shing)
                              </div>
                            )}
                          </div>
                          <small className="text-muted">Mijoz ushbu bo'limdan biror narsa tanlasa, yuqoridagi qo'shimchalar tavfsiya qilinadi.</small>
                        </div>
                      </div>
                    ) : (
                      <>
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

                        {activeTab === 'menu' && (
                          <div className="col-md-12 mb-3">
                            <label className="form-label">Kategoriya</label>
                            <select 
                              className="form-select" 
                              value={formData.category} 
                              onChange={e => setFormData({...formData, category: e.target.value})}
                              required
                            >
                              {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                          </div>
                        )}

                        {activeTab === 'menu' && (
                          <div className="col-md-12 mb-3">
                            <label className="form-label">Tavsif (Description)</label>
                            <textarea 
                              className="form-control" 
                              rows="2"
                              value={formData.description} 
                              onChange={e => setFormData({...formData, description: e.target.value})} 
                              placeholder="Mazali va to'yimli, maxsus retsept asosida tayyorlangan."
                            ></textarea>
                          </div>
                        )}

                        {activeTab === 'combos' && (
                          <>
                            <div className="col-md-6 mb-3">
                              <label className="form-label">Badge (Misol: 'Super Narx')</label>
                              <input 
                                type="text" 
                                className="form-control" 
                                value={comboFormData.badge} 
                                onChange={e => setComboFormData({...comboFormData, badge: e.target.value})} 
                                required 
                              />
                            </div>
                            <div className="col-md-12 mb-3">
                              <label className="form-label">Tarkibi (Vergul bilan ajrating)</label>
                              <textarea 
                                className="form-control" 
                                rows="2"
                                value={comboFormData.items} 
                                onChange={e => setComboFormData({...comboFormData, items: e.target.value})} 
                                placeholder="2ta Pitsa, Coca-cola 1.5L..."
                                required 
                              ></textarea>
                            </div>
                          </>
                        )}

                        <div className="col-md-12 mb-3">
                          <label className="form-label">Rasm Linki (ixtiyoriy)</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            value={activeTab === 'menu' ? formData.imageUrl : comboFormData.imageUrl} 
                            onChange={e => activeTab === 'menu' ? setFormData({...formData, imageUrl: e.target.value}) : setComboFormData({...comboFormData, imageUrl: e.target.value})} 
                            placeholder="https://..."
                          />
                        </div>
                        <div className="col-md-12 mb-3">
                          <label className="form-label">Yoki Rasm Yuklash</label>
                          <input 
                            type="file" 
                            className="form-control" 
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                          {imagePreview && (
                            <div className="mt-2 text-center border p-2 rounded">
                              <img src={imagePreview} alt="Preview" style={{ maxHeight: '100px', maxWidth: '100%' }} />
                            </div>
                          )}
                        </div>

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
                      </>
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
