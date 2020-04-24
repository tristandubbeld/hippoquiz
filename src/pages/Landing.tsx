import React from 'react';
import { useHistory } from 'react-router-dom';

import { useSaveToFirestore } from '../context/firebaseContext';
import { saveToLocalStorage } from '../utils/localStorage';

export const Landing = () => {
  const name = React.useRef<HTMLInputElement>(null);
  const { loading, error, saveToStore } = useSaveToFirestore();
  const history = useHistory();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (name && name.current) {
      const nameValue = name.current.value;

      saveToStore('users', { name: name.current.value }).then(id => {
        if (typeof id === 'string') {
          saveToLocalStorage<{ name: string; id: string }>('user', {
            name: nameValue,
            id: id,
          });

          history.push('/quiz');
        }
      });
    }
  };

  return (
    <div>
      <div>Welkom</div>
      <div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Naam</label>
          <input id="name" type="text" ref={name} disabled={loading} />
          <button type="submit" disabled={loading}>
            Start
          </button>
          {error && <div>{error}</div>}
        </form>
      </div>
    </div>
  );
};