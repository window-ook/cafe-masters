import { useState } from 'react';

export default function LightDarkToggle() {
  const [light, setLight] = useState(true);

  const handleToggle = (prev) => setLight(!prev);

  return (
    <button onClick={() => handleToggle(light)} className="w-14 h-14">
      {light ? (
        <i className="fa-solid fa-moon text-main text-2xl"></i>
      ) : (
        <i className="fa-regular fa-sun text-main text-2xl"></i>
      )}
    </button>
  );
}
