import BoardSquare from "./BoardSquare";
import CharacterIcon from "../CharacterIcon";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const Board = ({iconPosition, moveIcon}) => {

  const renderMap = (i) => {
    const x = i % 8;
    const y = Math.floor(i / 8);
    return (
      <div 
        key={i} 
        style={{ width: '12.5%', height: '12.5%' }} 
      >
        <BoardSquare x={x} y={y} moveIcon={moveIcon}>
          {renderIcon(x, y, iconPosition)}
        </BoardSquare>
      </div>
    );
  };

  const renderIcon = (x, y, iconPosition) => {
    if (x === iconPosition[0] && y === iconPosition[1]) {
      return <CharacterIcon />
    }
  }

  const mapSquares = [];
  for (let i = 0; i < 64; i++) {
    mapSquares.push(renderMap(i));
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="Board">
        {mapSquares}
      </div>
    </DndProvider>
  );
}

export default Board;