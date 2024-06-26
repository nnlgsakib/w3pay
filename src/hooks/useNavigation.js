// src/hooks/useNavigation.js
import { useState } from 'react';

const useNavigation = () => {
  const [currentPath, setCurrentPath] = useState('/');

  const navigate = (path, state) => {
    setCurrentPath(path);
    window.history.pushState(state, '', path);
  };

  const goBack = () => {
    window.history.back();
  };

  return {
    currentPath,
    navigate,
    goBack,
  };
};

export default useNavigation;
