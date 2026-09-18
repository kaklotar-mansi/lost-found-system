import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const categories = ['Electronics', 'Documents', 'Accessories', 'Clothing', 'Bags', 'Keys', 'Pets', 'Books', 'Other'];

const EditItem = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '', description: '', category: categories[0], location: '', date: '', status: 'Active',
  });
  const [currentImage, setCurrentImage] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const { data } = await api.get(`/items/${id}`);
        if (user && data.reportedBy?._id !== user._id) {
          setError('You are not authorized to edit this item');
          setLoading(false);
          return;
        }
        setForm({
          title: data.title,
          description: data.description,
          category: data.category,
          location: data.location,
          date: data.date ? data.date.substring(0, 10) : '',
          status: data.status,
        });
        setCurrentImage(data.image);
      } catch (err) {
        setError('Item not found');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id, user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFile = (e) => setImage(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append('image', image);

      await api.put(`/items/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate('/my-reports');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update item');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="page-loading">Loading...</p>;
  if (error && !form.title) return <p className="empty-state"><i className="fa-solid fa-triangle-exclamation"></i> {error}</p>;

  return (
    <div className="page">
      <h1><i className="fa-solid fa-pen-to-square"></i> Edit Item</h1>
      <form className="form-card" onSubmit={handleSubmit}>
        {error && <div className="alert alert-error"><i className="fa-solid fa-triangle-exclamation"></i> {error}</div>}

        <label>
          <i className="fa-solid fa-heading"></i> Item Title
          <input type="text" name="title" value={form.title} onChange={handleChange} required />
        </label>

        <label>
          <i className="fa-solid fa-align-left"></i> Description
          <textarea name="description" value={form.description} onChange={handleChange} required rows={4} />
        </label>

        <div className="form-row">
          <label>
            <i className="fa-solid fa-tags"></i> Category
            <select name="category" value={form.category} onChange={handleChange} required>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>

          <label>
            <i className="fa-solid fa-calendar-days"></i> Date
            <input type="date" name="date" value={form.date} onChange={handleChange} required />
          </label>
        </div>

        <label>
          <i className="fa-solid fa-location-dot"></i> Location
          <input type="text" name="location" value={form.location} onChange={handleChange} required />
        </label>

        <label>
          <i className="fa-solid fa-circle-info"></i> Status
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="Active">Active</option>
            <option value="Claimed">Claimed</option>
            <option value="Resolved">Resolved</option>
          </select>
        </label>

        {currentImage && (
          <div>
            <p style={{ margin: '0 0 0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Current photo:</p>
            <img src={currentImage} alt="current" style={{ maxWidth: '160px', borderRadius: '8px' }} />
          </div>
        )}
        <label>
          <i className="fa-solid fa-image"></i> Replace Photo (optional)
          <input type="file" accept="image/*" onChange={handleFile} />
        </label>

        <button type="submit" className="btn btn-primary" disabled={saving}>
          <i className="fa-solid fa-floppy-disk"></i> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default EditItem;
