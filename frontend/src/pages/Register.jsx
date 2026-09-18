import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2><i className="fa-solid fa-user-plus"></i> Register</h2>
        {error && <div className="alert alert-error"><i className="fa-solid fa-triangle-exclamation"></i> {error}</div>}
        <label>
          <i className="fa-solid fa-user"></i> Name
          <input type="text" name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          <i className="fa-solid fa-envelope"></i> Email
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          <i className="fa-solid fa-lock"></i> Password
          <input type="password" name="password" value={form.password} onChange={handleChange} required minLength={6} />
        </label>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Creating account...' : 'Register'}
        </button>
        <p>Already have an account? <Link to="/login">Login here</Link></p>
      </form>
    </div>
  );
};

export default Register;
