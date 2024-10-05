import { useState } from 'react';

export default function LightDarkToggle() {
  const [light, setLight] = useState(true);

  const handleToggle = (prev) => setLight(!prev);

  return (
    <button onClick={() => handleToggle(light)}>
      {light ? (
        <i className="fa-solid fa-moon text-main"></i>
      ) : (
        <i className="fa-regular fa-sun text-main"></i>
      )}
    </button>
  );
}
