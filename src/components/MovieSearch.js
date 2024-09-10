import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebaseConfig';
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc, setDoc } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faBookmark, faHeart } from '@fortawesome/free-solid-svg-icons';

const MovieSearch = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [likedMovies, setLikedMovies] = useState([]);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          setWatchedMovies(data.watchedMovies || []);
          setLikedMovies(data.likedMovies || []);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const searchMovies = async (e) => {
    e.preventDefault();
    setError('');

    const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}`;

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    };

    try {
      const res = await fetch(url, options);
      const data = await res.json();
      if (data.results.length === 0) {
        setError('Aucun film trouvé');
      } else {
        setMovies(data.results);
      }
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la récupération des données');
    }
  };

  const handleToggleWatchedStatus = async (movieId) => {
    if (!user) {
      alert('Vous devez être connecté pour marquer ce film comme vu.');
      return;
    }

    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          watchedMovies: [],
          likedMovies: []
        });
      }

      if (watchedMovies.includes(movieId)) {
        await updateDoc(userDocRef, {
          watchedMovies: arrayRemove(movieId)
        });
        setWatchedMovies((prevWatchedMovies) => prevWatchedMovies.filter(id => id !== movieId));
      } else {
        await updateDoc(userDocRef, {
          watchedMovies: arrayUnion(movieId)
        });
        setWatchedMovies((prevWatchedMovies) => [...prevWatchedMovies, movieId]);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut du film :', error);
      alert('Erreur lors de la mise à jour du statut du film.');
    }
  };

  const handleToggleLikedStatus = async (movieId) => {
    if (!user) {
      alert('Vous devez être connecté pour aimer ce film.');
      return;
    }

    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          watchedMovies: [],
          likedMovies: []
        });
      }

      if (likedMovies.includes(movieId)) {
        await updateDoc(userDocRef, {
          likedMovies: arrayRemove(movieId)
        });
        setLikedMovies((prevLikedMovies) => prevLikedMovies.filter(id => id !== movieId));
      } else {
        await updateDoc(userDocRef, {
          likedMovies: arrayUnion(movieId)
        });
        setLikedMovies((prevLikedMovies) => [...prevLikedMovies, movieId]);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut du film :', error);
      alert('Erreur lors de la mise à jour du statut du film.');
    }
  };

  return (
    <div className="movie-search container mx-auto px-8 py-12 bg-white text-black">
      <form onSubmit={searchMovies}>
        <input
          type="text"
          placeholder="Rechercher un film..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="p-2 border rounded"
        />
        <button type="submit" className="ml-2 p-2 bg-blue-500 text-white rounded">
          Rechercher
        </button>
      </form>

      {error && <p>{error}</p>}

      <div className="movies grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card p-4 shadow-md rounded-lg bg-white">
            <img
              src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-auto mb-2 rounded"
            />
            <h3 className="text-xl font-bold mb-2 text-center">{movie.title}</h3>
            <p className="text-center text-gray-500 mb-2">{movie.release_date}</p>

            {user && (
              <button
                onClick={() => handleToggleWatchedStatus(movie.id)}
                className="mt-2 p-2 relative group"
              >
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max bg-black text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {watchedMovies.includes(movie.id) ? 'Déjà vu' : 'Marquer comme vu'}
                </span>
                {watchedMovies.includes(movie.id) ? (
                  <FontAwesomeIcon icon={faCheckCircle} size="lg" color="green" />
                ) : (
                  <FontAwesomeIcon icon={faBookmark} size="lg" color="red" />
                )}
              </button>
            )}

            {user && (
              <button
                onClick={() => handleToggleLikedStatus(movie.id)}
                className="mt-2 p-2 relative group"
              >
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max bg-black text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {likedMovies.includes(movie.id) ? 'Aimé' : 'Aimer'}
                </span>
                {likedMovies.includes(movie.id) ? (
                  <FontAwesomeIcon icon={faHeart} size="lg" color="pink" />
                ) : (
                  <FontAwesomeIcon icon={faHeart} size="lg" color="gray" />
                )}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieSearch;
