'use client';

import { useEffect, useState } from 'react';
import { auth } from '../firebaseConfig';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

export default function Auth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <div className="flex justify-end mb-4">
      {user ? (
        <div className="flex items-center space-x-4">
          <span className="text-lg font-bold">{user.displayName}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition"
          >
            Se déconnecter
          </button>
        </div>
      ) : (
        <button
          onClick={handleLogin}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Se connecter avec Google
        </button>
      )}
    </div>
  );
}