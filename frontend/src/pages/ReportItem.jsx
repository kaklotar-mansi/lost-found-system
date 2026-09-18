import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';

const categories = ['Electronics', 'Documents', 'Accessories', 'Clothing', 'Bags', 'Keys', 'Pets', 'Books', 'Other'];

const ReportItem = () => {
  const { type } = useParams(); // 'lost' or 'found'
  const itemType = type === 'found' ? 'Found' : 'Lost';
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '', description: '', category: categories[0], location: '', date: '',
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFile = (e) => setImage(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append('type', itemType);
      if (image) fd.append('image', image);

      await api.post('/items', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate('/my-reports');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1>
        <i className={`fa-solid ${itemType === 'Lost' ? 'fa-circle-exclamation' : 'fa-hand-holding'}`}></i>{' '}
        Report a {itemType} Item
      </h1>
      <form className="form-card" onSubmit={handleSubmit}>
        {error && <div className="alert alert-error"><i className="fa-solid fa-triangle-exclamation"></i> {error}</div>}

        <label>
          <i className="fa-solid fa-heading"></i> Item Title
          <input type="text" name="title" value={form.title} onChange={handleChange} required placeholder="e.g. Black Leather Wallet" />
        </label>

        <label>
          <i className="fa-solid fa-align-left"></i> Description
          <textarea name="description" value={form.description} onChange={handleChange} required rows={4} placeholder="Describe the item in detail..." />
        </label>

        <div className="form-row">
          <label>
            <i className="fa-solid fa-tags"></i> Category
            <select name="category" value={form.category} onChange={handleChange} required>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>

          <label>
            <i className="fa-solid fa-calendar-days"></i> Date {itemType}
            <input type="date" name="date" value={form.date} onChange={handleChange} required />
          </label>
        </div>

        <label>
          <i className="fa-solid fa-location-dot"></i> Location
          <input type="text" name="location" value={form.location} onChange={handleChange} required placeholder="e.g. Central Library, 2nd Floor" />
        </label>

        <label>
          <i className="fa-solid fa-image"></i> Photo (optional)
          <input type="file" accept="image/*" onChange={handleFile} />
        </label>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          <i className="fa-solid fa-paper-plane"></i> {loading ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
};

export default ReportItem;
