import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import {
  Trash2,
  ArrowLeft,
  CheckCircle,
  MapPin,
  User,
  Phone,
  CreditCard,
  Upload,
  Loader2,
  Send,
} from "lucide-react";

// TELEGRAM BOT SOZMALARI (BotFather'dan olingan ma'lumotlarni kiriting)
const BOT_TOKEN = "7689166112:AAGAp7-DbEmu-7CrhtIfDVZMVN5ct5KJ7xE"; // Real Bot Tokeningiz
const CHAT_ID = "248765829"; // Real Chat ID'ingiz (Mijozning yangi ID-si)

export default function Cart() {
  const {
    cartItems: cart,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();
  const [checkoutStep, setCheckoutStep] = useState(null); // null, 'info', 'payment', 'loading', 'success'
  const [orderDetails, setOrderDetails] = useState({
    name: "",
    phone: "",
    address: "",
    receiptFile: null,
    receiptPreview: null,
    paymentMethod: "card", // 'card' yoki 'cash'
    locationUrl: "",
  });
  const [sending, setSending] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const handleGetLocation = async () => {
    if (!navigator.geolocation) {
      alert(
        "Brauzeringiz geolokatsiyani qo'llab-quvvatlamaydi. Iltimos, manzilni qo'lda kiriting.",
      );
      return;
    }

    // Check permission state first if supported
    if (navigator.permissions) {
      try {
        const permission = await navigator.permissions.query({
          name: "geolocation",
        });
        if (permission.state === "denied") {
          alert(
            "🚫 Joylashuvga ruxsat bloklangan.\n\n" +
              "Ruxsatni yoqish uchun:\n" +
              "1. Manzil satridagi 🔒 yoki ⚙️ belgisini bosing\n" +
              "2. 'Joylashuv' yoki 'Location' ni toping\n" +
              "3. 'Ruxsat berish' / 'Allow' ni tanlang\n" +
              "4. Sahifani yangilang va qayta urinib ko'ring.",
          );
          return;
        }
      } catch (e) {
        // permissions API not supported — continue anyway
      }
    }

    setLoadingLocation(true);

    const timeoutId = setTimeout(() => {
      setLoadingLocation(false);
      alert(
        "⏱ Joylashuvni aniqlash vaqti tugadi.\n\nBrauzeringizda joylashuv ruxsatini tekshiring va qayta urinib ko'ring.",
      );
    }, 12000);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timeoutId);
        const { latitude, longitude } = position.coords;
        const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
        setOrderDetails((prev) => ({
          ...prev,
          locationUrl: url,
          address: prev.address || "📍 Joylashuv geolokatsiya orqali aniqlandi",
        }));
        setLoadingLocation(false);
      },
      (error) => {
        clearTimeout(timeoutId);
        setLoadingLocation(false);
        let errorMsg = "Joylashuvni aniqlashda xatolik yuz berdi.";
        if (error.code === 1) {
          errorMsg =
            "🚫 Joylashuvga ruxsat berilmadi.\n\nBrauzer sozlamalarida joylashuv ruxsatini yoqing.";
        } else if (error.code === 2) {
          errorMsg =
            "📡 Joylashuv ma'lumotlari mavjud emas. Internet aloqasini tekshiring.";
        } else if (error.code === 3) {
          errorMsg = "⏱ Vaqt tugadi. Yana bir bor urinib ko'ring.";
        }
        alert(errorMsg);
      },
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 60000 },
    );
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      return total + item.price * (item.quantity || 1);
    }, 0);
  };

  const handleInfoSubmit = (e) => {
    e.preventDefault();
    setCheckoutStep("payment");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setOrderDetails({
        ...orderDetails,
        receiptFile: file,
        receiptPreview: URL.createObjectURL(file),
      });
    }
  };

  const sendOrderToTelegram = async () => {
    setSending(true);

    // Xabar matnini tayyorlash
    let message = `🛒 *YANGI BUYURTMA!*\n\n`;
    message += `👤 *Mijoz:* ${orderDetails.name}\n`;
    message += `📞 *Tel:* ${orderDetails.phone}\n`;
    message += `📍 *Manzil:* ${orderDetails.address}\n`;
    if (orderDetails.locationUrl) {
      message += `🗺️ *Geolokatsiya:* [Google Maps orqali ko'rish](${orderDetails.locationUrl})\n`;
    }
    message += `💳 *To'lov turi:* ${orderDetails.paymentMethod === "card" ? "Karta orqali" : "Naqd pul (Botga bildirildi)"}\n\n`;
    message += `🍕 *Mahsulotlar:*\n`;

    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.name} (${item.size}) - ${item.quantity} ta - ${(item.price * item.quantity).toLocaleString()} so'm\n`;
    });

    message += `\n💰 *JAMI:* ${calculateTotal().toLocaleString()} so'm`;

    try {
      const formData = new FormData();
      formData.append("chat_id", CHAT_ID);
      formData.append("caption", message);
      formData.append("parse_mode", "Markdown");

      let response;
      if (orderDetails.paymentMethod === "card" && orderDetails.receiptFile) {
        formData.append("photo", orderDetails.receiptFile);
        response = await fetch(
          `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`,
          {
            method: "POST",
            body: formData,
          },
        );
      } else {
        response = await fetch(
          `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: CHAT_ID,
              text: message,
              parse_mode: "Markdown",
            }),
          },
        );
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.description || "Telegramga yuborishda noma'lum xatolik",
        );
      }

      setCheckoutStep("success");
      clearCart();
    } catch (error) {
      console.error("Telegramga yuborishda xatolik:", error);
      alert(
        "Xatolik yuz berdi: " +
          error.message +
          "\n\nIltimos BOT_TOKEN va CHAT_ID ni tekshiring.",
      );
    } finally {
      setSending(false);
    }
  };

  if (checkoutStep === "success") {
    return (
      <div className="container text-center py-5 mt-5">
        <CheckCircle size={80} color="#28a745" className="mb-4" />
        <h2 className="fw-bold mb-3">Buyurtmangiz Qabul Qilindi!</h2>
        <p className="text-muted mb-4">
          Tez orada operatorimiz siz bilan bog'lanadi. Rahmat!
        </p>
        <Link
          to="/"
          className="btn btn-danger px-5 py-2"
          style={{ borderRadius: "25px" }}
        >
          Asosiy Sahifa
        </Link>
      </div>
    );
  }

  return (
    <section
      className="section"
      style={{ minHeight: "60vh", marginTop: "100px" }}
    >
      <div className="container" data-aos="fade-up">
        <div className="section-title">
          <h2>
            {checkoutStep === "info"
              ? "Ma'lumotlarni Kiriting"
              : checkoutStep === "payment"
                ? "To'lov va Tasdiqlash"
                : "Xaridlar"}
          </h2>
          <p>
            <span>{checkoutStep ? "Buyurtma" : "Sizning"}</span>
            <span className="description-title">
              {checkoutStep ? "Berish" : "Savatingiz"}
            </span>
          </p>
        </div>

        {cart.length === 0 && !checkoutStep ? (
          <div className="text-center py-5">
            <h4 className="mb-4">Savatingiz hozircha bo'sh</h4>
            <Link
              to="/menu"
              className="btn btn-danger"
              style={{ borderRadius: "20px", padding: "10px 30px" }}
            >
              <ArrowLeft size={18} className="me-2" /> Menyuga Qaytish
            </Link>
          </div>
        ) : (
          <div className="row gy-4">
            {/* Chap tomon: Mahsulotlar yoki Forma */}
            <div className="col-lg-8">
              {!checkoutStep ? (
                <div className="card shadow-sm border-0">
                  <div className="card-body p-4">
                    {cart.map((item, index) => (
                      <div
                        key={index}
                        className="d-flex align-items-center mb-4 pb-4 border-bottom"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded"
                          style={{
                            width: "80px",
                            height: "80px",
                            objectFit: "cover",
                          }}
                        />
                        <div className="ms-3 flex-grow-1">
                          <h5 className="mb-1">{item.name}</h5>
                          {item.size && (
                            <span className="badge bg-secondary mb-2">
                              {item.size}
                            </span>
                          )}
                        </div>
                        <div className="d-flex align-items-center mx-3">
                          <button
                            className="btn btn-sm btn-outline-secondary px-2 py-0"
                            onClick={() =>
                              updateQuantity(
                                item._id,
                                item.size,
                                Math.max(1, (item.quantity || 1) - 1),
                              )
                            }
                          >
                            -
                          </button>
                          <span className="mx-2">{item.quantity || 1}</span>
                          <button
                            className="btn btn-sm btn-outline-secondary px-2 py-0"
                            onClick={() =>
                              updateQuantity(
                                item._id,
                                item.size,
                                (item.quantity || 1) + 1,
                              )
                            }
                          >
                            +
                          </button>
                        </div>
                        <div
                          className="text-end ms-3"
                          style={{ minWidth: "100px" }}
                        >
                          <h5 className="text-danger mb-2">
                            {(
                              item.price * (item.quantity || 1)
                            ).toLocaleString()}{" "}
                            so'm
                          </h5>
                          <button
                            onClick={() => removeFromCart(item._id, item.size)}
                            className="btn btn-sm btn-outline-danger"
                            title="O'chirish"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="mt-4">
                      <Link
                        to="/menu"
                        className="text-danger text-decoration-none d-flex align-items-center"
                      >
                        <ArrowLeft size={16} className="me-1" /> Yana xarid
                        qilish
                      </Link>
                    </div>
                  </div>
                </div>
              ) : checkoutStep === "info" ? (
                <div className="card shadow-sm border-0">
                  <div className="card-body p-4">
                    <form onSubmit={handleInfoSubmit}>
                      <div className="mb-3">
                        <label className="form-label d-flex align-items-center gap-2">
                          <User size={18} /> To'liq ismingiz
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          required
                          value={orderDetails.name}
                          onChange={(e) =>
                            setOrderDetails({
                              ...orderDetails,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label d-flex align-items-center gap-2">
                          <Phone size={18} /> Telefon raqamingiz
                        </label>
                        <input
                          type="tel"
                          className="form-control"
                          placeholder="+998"
                          required
                          value={orderDetails.phone}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9+]/g, "");
                            setOrderDetails({ ...orderDetails, phone: val });
                          }}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="form-label d-flex align-items-center justify-content-between gap-2 mb-2">
                          <div className="d-flex align-items-center gap-2">
                            <MapPin size={18} /> Yetkazib berish manzili
                          </div>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                            onClick={handleGetLocation}
                            disabled={loadingLocation}
                            style={{ fontSize: "0.8rem", borderRadius: "15px" }}
                          >
                            {loadingLocation ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              <MapPin size={12} />
                            )}
                            {orderDetails.locationUrl
                              ? "Joylashuv yangilandi"
                              : "Aniq joylashuvni aniqlash"}
                          </button>
                        </label>
                        <textarea
                          className="form-control"
                          rows="3"
                          placeholder="Ko'cha, uy, mo'ljal..."
                          required
                          value={orderDetails.address}
                          onChange={(e) =>
                            setOrderDetails({
                              ...orderDetails,
                              address: e.target.value,
                            })
                          }
                        />
                        {orderDetails.locationUrl && (
                          <div className="mt-2 small text-success d-flex align-items-center gap-1">
                            <CheckCircle size={14} /> Geolokatsiya
                            muvaffaqiyatli aniqlandi!
                          </div>
                        )}
                      </div>
                      <div className="d-flex gap-3">
                        <button
                          type="button"
                          className="btn btn-outline-secondary w-100"
                          onClick={() => setCheckoutStep(null)}
                        >
                          Savatga qaytish
                        </button>
                        <button type="submit" className="btn btn-danger w-100">
                          Keyingisi
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="card shadow-sm border-0">
                  <div className="card-body p-4 text-center">
                    <CreditCard size={48} className="text-danger mb-3" />
                    <h5 className="mb-3">To'lov Ma'lumotlari</h5>
                    <div className="d-flex justify-content-center gap-3 mb-4">
                      <button
                        type="button"
                        className={`btn px-4 py-2 ${orderDetails.paymentMethod === "card" ? "btn-danger" : "btn-outline-danger"}`}
                        style={{ borderRadius: "25px" }}
                        onClick={() =>
                          setOrderDetails({
                            ...orderDetails,
                            paymentMethod: "card",
                          })
                        }
                      >
                        <CreditCard size={18} className="me-2" /> Karta orqali
                      </button>
                      <button
                        type="button"
                        className={`btn px-4 py-2 ${orderDetails.paymentMethod === "cash" ? "btn-danger" : "btn-outline-danger"}`}
                        style={{ borderRadius: "25px" }}
                        onClick={() =>
                          setOrderDetails({
                            ...orderDetails,
                            paymentMethod: "cash",
                          })
                        }
                      >
                        <Send size={18} className="me-2" /> Naqd pul
                      </button>
                    </div>

                    {orderDetails.paymentMethod === "card" ? (
                      <>
                        <div className="bg-light p-3 rounded mb-4">
                          <p className="mb-3 text-muted small">
                            To'lov qilish uchun quyidagi ilovalardan birini tanlang yoki karta raqami orqali yuboring:
                          </p>
                          
                          <div className="d-flex flex-wrap justify-content-center gap-2 mb-2">
                            <a 
                              href="https://indoor.click.uz/pay?id=037877&t=0" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="btn btn-sm d-flex align-items-center gap-2 px-3 py-2 shadow-sm"
                              style={{ backgroundColor: '#00aef0', color: '#fff', borderRadius: '12px', border: 'none', transition: 'transform 0.2s' }}
                              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                              Click
                            </a>
                            
                            <a 
                              href="https://transfer.paycom.uz/67109ee0e51de1c6a3a5e645" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="btn btn-sm d-flex align-items-center gap-2 px-3 py-2 shadow-sm"
                              style={{ backgroundColor: '#3eeada', color: '#000', borderRadius: '12px', border: 'none', transition: 'transform 0.2s' }}
                              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                          Payme
                            </a>

                            <a 
                              href="https://app.paynet.uz/?m=34970" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="btn btn-sm d-flex align-items-center gap-2 px-3 py-2 shadow-sm"
                              style={{ backgroundColor: '#28a745', color: '#fff', borderRadius: '12px', border: 'none', transition: 'transform 0.2s' }}
                              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                              Paynet
                            </a>
                          </div>
                        </div>

                        <div className="mb-4 text-start">
                          <label className="form-label d-flex align-items-center gap-2 mb-2">
                            <Upload size={18} /> To'lov chekini (skrinshot)
                            yuklang
                          </label>
                          <input
                            type="file"
                            className="form-control"
                            accept="image/*"
                            onChange={handleFileChange}
                            required={orderDetails.paymentMethod === "card"}
                          />
                          {orderDetails.receiptPreview && (
                            <div className="mt-3 text-center">
                              <img
                                src={orderDetails.receiptPreview}
                                alt="Receipt"
                                style={{
                                  maxWidth: "200px",
                                  borderRadius: "10px",
                                  border: "1px solid #ddd",
                                }}
                              />
                            </div>
                          )}
                        </div>

                        <div className="alert alert-warning small mb-4">
                          To'lov chekini yuborganingizdan so'ng buyurtma
                          tasdiqlanadi.
                        </div>
                      </>
                    ) : (
                      <div className="bg-light p-4 rounded mb-4">
                        <p className="mb-0">
                          Naqd pul orqali to'lovni kurerga yoki restoranda
                          amalga oshirishingiz mumkin.
                        </p>
                        <p className="fw-bold mt-2 text-danger">
                          Hech qanday rasm yuklash shart emas.
                        </p>
                      </div>
                    )}

                    <div className="d-flex gap-3">
                      <button
                        type="button"
                        className="btn btn-outline-secondary w-100"
                        onClick={() => setCheckoutStep("info")}
                        disabled={sending}
                      >
                        Orqaga
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger w-100 d-flex align-items-center justify-content-center gap-2"
                        onClick={sendOrderToTelegram}
                        disabled={
                          sending ||
                          (orderDetails.paymentMethod === "card" &&
                            !orderDetails.receiptFile)
                        }
                      >
                        {sending ? (
                          <>
                            <Loader2 className="animate-spin" size={18} />{" "}
                            Yuborilmoqda...
                          </>
                        ) : (
                          <>
                            <Send size={18} /> Buyurtma Berish
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* O'ng tomon: Xulosa */}
            <div className="col-lg-4">
              <div
                className="card shadow-sm border-0 bg-light position-sticky"
                style={{ top: "120px" }}
              >
                <div className="card-body p-4">
                  <h4 className="mb-4">Buyurtma Xulosasi</h4>
                  <div className="d-flex justify-content-between mb-3">
                    <span>Mahsulotlar soni:</span>
                    <strong>{cart.length} ta</strong>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between mb-4">
                    <span className="h5 mb-0">Jami narx:</span>
                    <strong className="h5 mb-0 text-danger">
                      {calculateTotal().toLocaleString()} so'm
                    </strong>
                  </div>

                  {!checkoutStep && (
                    <button
                      className="btn btn-danger w-100 py-3"
                      onClick={() => setCheckoutStep("info")}
                      style={{ borderRadius: "25px", fontWeight: "600" }}
                    >
                      Buyurtmani Tasdiqlash
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
