export default function EdgeSquare({
  edgeSquare,
  isHiddenCard,
}: {
  edgeSquare: 'tl' | 'tr' | 'bl' | 'br';
  isHiddenCard: boolean;
}) {
  const getPositionClasses = () => {
    switch (edgeSquare) {
      case 'tl':
        return 'absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2';
      case 'tr':
        return 'absolute top-0 right-0 translate-x-1/2 -translate-y-1/2';
      case 'bl':
        return 'absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2';
      case 'br':
        return 'absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2';
    }
  };

  return (
    <div
      className={`${getPositionClasses()} size-1.5 border ${isHiddenCard ? 'border-main bg-main-600' : 'border-gray-600 bg-gray-500'}`}
    />
  );
}
