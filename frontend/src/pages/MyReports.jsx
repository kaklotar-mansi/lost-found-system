import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

const MyReports = () => {
  const [items, setItems] = useState([]);
  const [receivedClaims, setReceivedClaims] = useState([]);
  const [myClaims, setMyClaims] = useState([]);
  const [tab, setTab] = useState('items');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAll = async () => {
    setLoading(true);
    try {
      const [itemsRes, receivedRes, mineRes] = await Promise.all([
        api.get('/items/mine/reports'),
        api.get('/claims/received'),
        api.get('/claims/mine'),
      ]);
      setItems(itemsRes.data);
      setReceivedClaims(receivedRes.data);
      setMyClaims(mineRes.data);
    } catch (err) {
      setError('Failed to load your reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item report? This cannot be undone.')) return;
    try {
      await api.delete(`/items/${id}`);
      setItems(items.filter((i) => i._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete item');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const { data } = await api.put(`/items/${id}`, { status });
      setItems(items.map((i) => (i._id === id ? data : i)));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleClaimDecision = async (claimId, status) => {
    try {
      await api.put(`/claims/${claimId}`, { status });
      loadAll();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update claim');
    }
  };

  if (loading) return <p className="page-loading">Loading...</p>;

  return (
    <div className="page">
      <h1><i className="fa-solid fa-list-check"></i> My Reports</h1>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="tabs">
        <button className={tab === 'items' ? 'tab active' : 'tab'} onClick={() => setTab('items')}>
          <i className="fa-solid fa-box"></i> My Items ({items.length})
        </button>
        <button className={tab === 'received' ? 'tab active' : 'tab'} onClick={() => setTab('received')}>
          <i className="fa-solid fa-inbox"></i> Claims Received ({receivedClaims.length})
        </button>
        <button className={tab === 'mine' ? 'tab active' : 'tab'} onClick={() => setTab('mine')}>
          <i className="fa-solid fa-paper-plane"></i> My Claims ({myClaims.length})
        </button>
      </div>

      {tab === 'items' && (
        <div className="report-list">
          {items.length === 0 && <p className="empty-state">You haven't reported any items yet.</p>}
          {items.map((item) => (
            <div key={item._id} className="report-row">
              <div>
                <Link to={`/items/${item._id}`}><strong>{item.title}</strong></Link>
                <p className="item-card-meta">
                  <span className={`badge badge-${item.type.toLowerCase()}`}>{item.type}</span>{' '}
                  <span className={`status-pill status-${item.status.toLowerCase()}`}>{item.status}</span>
                </p>
              </div>
              <div className="report-actions">
                <select value={item.status} onChange={(e) => handleStatusUpdate(item._id, e.target.value)}>
                  <option value="Active">Active</option>
                  <option value="Claimed">Claimed</option>
                  <option value="Resolved">Resolved</option>
                </select>
                <Link to={`/edit/${item._id}`} className="btn btn-secondary">
                  <i className="fa-solid fa-pen"></i>
                </Link>
                <button className="btn btn-danger" onClick={() => handleDelete(item._id)}>
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'received' && (
        <div className="report-list">
          {receivedClaims.length === 0 && <p className="empty-state">No claim requests received yet.</p>}
          {receivedClaims.map((claim) => (
            <div key={claim._id} className="report-row">
              <div>
                <strong>{claim.item?.title}</strong>
                <p>
                  {claim.item?.type === 'Found' ? 'Claimed by' : 'Reported found by'}: {claim.claimant?.name} ({claim.claimant?.email})
                </p>
                <p className="claim-message"><i className="fa-solid fa-message"></i> "{claim.message}"</p>
                <span className={`status-pill status-${claim.status.toLowerCase()}`}>{claim.status}</span>
              </div>
              {claim.status === 'Pending' && (
                <div className="report-actions">
                  <button className="btn btn-success" onClick={() => handleClaimDecision(claim._id, 'Approved')}>
                    <i className="fa-solid fa-check"></i> Approve
                  </button>
                  <button className="btn btn-danger" onClick={() => handleClaimDecision(claim._id, 'Rejected')}>
                    <i className="fa-solid fa-xmark"></i> Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === 'mine' && (
        <div className="report-list">
          {myClaims.length === 0 && <p className="empty-state">You haven't submitted any claims yet.</p>}
          {myClaims.map((claim) => (
            <div key={claim._id} className="report-row">
              <div>
                <Link to={`/items/${claim.item?._id}`}><strong>{claim.item?.title}</strong></Link>
                <p className="claim-message"><i className="fa-solid fa-message"></i> "{claim.message}"</p>
                <span className={`status-pill status-${claim.status.toLowerCase()}`}>{claim.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReports;
