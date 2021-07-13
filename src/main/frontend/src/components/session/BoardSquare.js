import { useEffect } from 'react';
import { useDrop } from 'react-dnd'

const BoardSquare = ({x, y, oldX, oldY, username, moveIcon, children}) => {
  const [, drop] = useDrop(() => ({
    accept: 'icon',
    drop: () => moveIcon(x, y, oldX, oldY, username),
    collect: monitor => ({
      // isOver: !!monitor.isOver(),
    }),
  }), [x, y]);

  return (
    <div 
      className="BoardSquare"
      ref={drop}
    >
      {/* {console.log('square ' + x + ' ' + y + ' .' + ' Username: ' + username)} */}
      {children}
    </div>
  );
}

export default BoardSquare;