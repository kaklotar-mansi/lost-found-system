import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const ItemDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const { data } = await api.get(`/items/${id}`);
        setItem(data);
      } catch (err) {
        setError('Item not found');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const isOwner = item && user && item.reportedBy?._id === user._id;

  const handleClaim = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      await api.post('/claims', { itemId: id, message });
      setSuccess('Claim request submitted successfully!');
      setMessage('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit claim');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="page-loading">Loading...</p>;
  if (!item) return <p className="empty-state"><i className="fa-solid fa-triangle-exclamation"></i> {error || 'Item not found'}</p>;

  return (
    <div className="page">
      <button className="btn-link back-link" onClick={() => navigate(-1)}>
        <i className="fa-solid fa-arrow-left"></i> Back
      </button>
      <div className="detail-card">
        <div className="detail-image">
          {item.image ? <img src={item.image} alt={item.title} /> : <i className="fa-solid fa-box detail-placeholder"></i>}
        </div>
        <div className="detail-body">
          <span className={`badge badge-${item.type.toLowerCase()}`}>{item.type}</span>
          <h2>{item.title}</h2>
          <p>{item.description}</p>
          <ul className="detail-meta">
            <li><i className="fa-solid fa-tag"></i> Category: {item.category}</li>
            <li><i className="fa-solid fa-location-dot"></i> Location: {item.location}</li>
            <li><i className="fa-solid fa-calendar"></i> Date: {new Date(item.date).toLocaleDateString()}</li>
            <li><i className="fa-solid fa-circle-info"></i> Status: <span className={`status-pill status-${item.status.toLowerCase()}`}>{item.status}</span></li>
            <li><i className="fa-solid fa-user"></i> Reported by: {item.reportedBy?.name}</li>
          </ul>

          {!isOwner && user && item.status === 'Active' && (
            <form className="claim-form" onSubmit={handleClaim}>
              <h3>
                <i className="fa-solid fa-hand"></i>{' '}
                {item.type === 'Found' ? 'This is my item' : 'I found this item'}
              </h3>
              <p className="claim-hint">
                {item.type === 'Found'
                  ? 'Was this item reported found by someone else, and it belongs to you? Send a claim with proof/details so the finder can verify it\u2019s really yours.'
                  : 'Did you find this item that someone else lost? Let them know here so they can get in touch and arrange to collect it.'}
              </p>
              {error && <div className="alert alert-error">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}
              <textarea
                placeholder={
                  item.type === 'Found'
                    ? 'Explain why this item belongs to you or share proof details...'
                    : 'Describe where/when you found it and how the owner can identify it...'
                }
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={3}
              />
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                <i className="fa-solid fa-paper-plane"></i>{' '}
                {submitting ? 'Submitting...' : item.type === 'Found' ? 'Submit Claim' : "I Found This \u2014 Notify Owner"}
              </button>
            </form>
          )}
          {isOwner && <p className="alert alert-info"><i className="fa-solid fa-circle-info"></i> This is your own report. View claim requests under My Reports.</p>}
          {!user && <p className="alert alert-info"><i className="fa-solid fa-circle-info"></i> Please login to submit a claim.</p>}
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
