import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle, XCircle, Loader, ArrowRight } from 'lucide-react';

const ValidateOrder = () => {
  const { token } = useParams();
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [message, setMessage] = useState('Validation de la commande en cours...');

  useEffect(() => {
    if (!loading && !isAuthenticated) {
        // Redirect to login with return url
        // Ideally pass query param ?returnUrl=...
        // For now, just go to login. User will have to click link again or we handle persistence.
        navigate('/login');
    }
  }, [loading, isAuthenticated, navigate]);

  useEffect(() => {
    const validate = async () => {
        if (!isAuthenticated) return;
        
        try {
            const tokenAuth = localStorage.getItem('fama-token');
            const res = await fetch(`http://localhost:5000/api/orders/validate/${token}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${tokenAuth}`
                }
            });
            
            const data = await res.json();
            
            if (res.ok) {
                setStatus('success');
                setMessage('Commande validée avec succès ! Stock mis à jour.');
            } else {
                setStatus('error');
                setMessage(data.message || 'Erreur lors de la validation');
            }
        
        } catch (err) {
            console.error(err);
            setStatus('error');
            setMessage('Erreur de connexion au serveur');
        }
    };

    if (isAuthenticated) {
        validate();
    }
  }, [isAuthenticated, token]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader className="animate-spin text-primary-600" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl border border-slate-100 text-center animate-scale-in">
        <div className="mb-6 flex justify-center">
            {status === 'processing' && <Loader size={48} className="animate-spin text-primary-600" />}
            {status === 'success' && <CheckCircle size={48} className="text-green-500" />}
            {status === 'error' && <XCircle size={48} className="text-red-500" />}
        </div>
        
        <h1 className="text-2xl font-display font-bold text-slate-900 mb-2">
            {status === 'processing' ? 'Validation...' : status === 'success' ? 'Validé !' : 'Erreur'}
        </h1>
        
        <p className="text-slate-600 mb-8">{message}</p>
        
        <button 
            onClick={() => navigate('/admin/orders')}
            className="btn-primary w-full flex items-center justify-center gap-2"
        >
            Voir les commandes <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default ValidateOrder;
