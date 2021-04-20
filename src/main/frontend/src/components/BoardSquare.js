import { useDrop } from 'react-dnd'

const BoardSquare = ({x, y, moveIcon, children}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'icon',
    drop: () => moveIcon(x, y),
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  }), [x, y])

  return (
    <div 
      className="BoardSquare"
      ref={drop}  
    >
      {children}
    </div>
  );
}

export default BoardSquare;