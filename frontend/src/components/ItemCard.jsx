import { Link } from 'react-router-dom';

const categoryIcons = {
  Electronics: 'fa-mobile-screen',
  Documents: 'fa-file-lines',
  Accessories: 'fa-glasses',
  Clothing: 'fa-shirt',
  Bags: 'fa-briefcase',
  Keys: 'fa-key',
  Pets: 'fa-paw',
  Books: 'fa-book',
  Other: 'fa-box',
};

const ItemCard = ({ item }) => {
  const icon = categoryIcons[item.category] || 'fa-box';
  return (
    <Link to={`/items/${item._id}`} className="item-card">
      <div className="item-card-image">
        {item.image ? (
          <img src={item.image} alt={item.title} />
        ) : (
          <i className={`fa-solid ${icon} item-card-placeholder`}></i>
        )}
        <span className={`badge badge-${item.type.toLowerCase()}`}>
          <i className={`fa-solid ${item.type === 'Lost' ? 'fa-circle-exclamation' : 'fa-hand-holding'}`}></i>{' '}
          {item.type}
        </span>
      </div>
      <div className="item-card-body">
        <h3>{item.title}</h3>
        <p className="item-card-meta">
          <i className="fa-solid fa-tag"></i> {item.category}
        </p>
        <p className="item-card-meta">
          <i className="fa-solid fa-location-dot"></i> {item.location}
        </p>
        <p className="item-card-meta">
          <i className="fa-solid fa-calendar"></i> {new Date(item.date).toLocaleDateString()}
        </p>
        <span className={`status-pill status-${item.status.toLowerCase()}`}>{item.status}</span>
      </div>
    </Link>
  );
};

export default ItemCard;
