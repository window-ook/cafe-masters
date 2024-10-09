import LightDarkToggle from './light-dark';

export default function Header({ img }) {
  return (
    <div className="mb-2 flex justify-between items-center ">
      <img src={img} alt="brand" className="h-14" />
      <LightDarkToggle />
    </div>
  );
}
