import { useState, useEffect } from 'react';
import api from '../api/axios';
import ItemCard from '../components/ItemCard';

const categories = ['Electronics', 'Documents', 'Accessories', 'Clothing', 'Bags', 'Keys', 'Pets', 'Books', 'Other'];

const Home = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', type: '', category: '', location: '', status: '' });

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = {};
      Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
      const { data } = await api.get('/items', { params });
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchItems();
  };

  const handleReset = () => {
    setFilters({ search: '', type: '', category: '', location: '', status: '' });
    setTimeout(fetchItems, 0);
  };

  return (
    <div className="page">
      <h1><i className="fa-solid fa-magnifying-glass"></i> Browse Lost & Found Items</h1>

      <form className="filter-bar" onSubmit={handleSubmit}>
        <div className="filter-search">
          <i className="fa-solid fa-search"></i>
          <input
            type="text"
            name="search"
            placeholder="Search by name, description or location..."
            value={filters.search}
            onChange={handleChange}
          />
        </div>
        <select name="type" value={filters.type} onChange={handleChange}>
          <option value="">All Types</option>
          <option value="Lost">Lost</option>
          <option value="Found">Found</option>
        </select>
        <select name="category" value={filters.category} onChange={handleChange}>
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={filters.location}
          onChange={handleChange}
        />
        <select name="status" value={filters.status} onChange={handleChange}>
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Claimed">Claimed</option>
          <option value="Resolved">Resolved</option>
        </select>
        <button type="submit" className="btn btn-primary"><i className="fa-solid fa-filter"></i> Filter</button>
        <button type="button" className="btn btn-secondary" onClick={handleReset}><i className="fa-solid fa-rotate-left"></i> Reset</button>
      </form>

      {loading ? (
        <p className="page-loading">Loading items...</p>
      ) : items.length === 0 ? (
        <p className="empty-state"><i className="fa-solid fa-box-open"></i> No items found. Try adjusting your filters.</p>
      ) : (
        <div className="item-grid">
          {items.map((item) => <ItemCard key={item._id} item={item} />)}
        </div>
      )}
    </div>
  );
};

export default Home;
