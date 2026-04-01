import { useState, useEffect } from 'react';
import { getRestaurantStatus } from '../utils/businessHours';
import { Clock } from 'lucide-react';

export default function ClosedOverlay() {
  const [timeLeft, setTimeLeft] = useState('');
  const [isCalculated, setIsCalculated] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const { isOpen, nextOpening } = getRestaurantStatus();
      if (isOpen) {
        setTimeLeft('');
        return;
      }

      const now = new Date();
      const diff = nextOpening - now;

      if (diff <= 0) {
        window.location.reload(); // Refresh when it opens
        return;
      }

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${h}s ${m}m ${s}s`);
      setIsCalculated(true);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!isCalculated && timeLeft === '') return null;

  return (
    <div className="closed-overlay d-flex flex-column align-items-center justify-content-center p-4 text-center bg-light rounded-4 shadow-sm border border-danger border-2 mt-3 mb-4">
      <div className="icon-box bg-danger bg-opacity-10 p-3 rounded-circle mb-3">
        <Clock className="text-danger" size={32} />
      </div>
      <h4 className="text-danger fw-bold mb-2">Hozirda dam olyapmiz</h4>
      <p className="text-muted mb-3">
        Mijozlarimizga xizmat ko'rsatish ish vaqtidan boshlanadi.<br/>
        Hozirda buyurtma va stol band qilish to'xtatilgan.
      </p>
      <div className="timer-box bg-white px-4 py-2 rounded-pill shadow-sm border border-danger">
        <span className="small text-muted d-block" style={{ fontSize: '10px', textTransform: 'uppercase' }}>Ochilishigacha qolgan vaqt:</span>
        <span className="h4 fw-bold text-danger mb-0">{timeLeft}</span>
      </div>
      <p className="mt-3 small text-muted">
        <strong>Ish vaqti:</strong> 09:00 - 02:00
      </p>
    </div>
  );
}
