import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import backArrow from '../img/backArrow.png';
import '../index.css';

const FixedBackArrow = () => {
  const container = document.getElementById('arrow-root');
  if (!container) return null;

  return createPortal(
    <Link to="/" className="quiz-back-arrow">
      <img src={backArrow} alt="Back" width={35} />
    </Link>,
    container
  );
};

export default FixedBackArrow;

