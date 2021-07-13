import BoardSquare from "./BoardSquare";
import CharacterIcon from "./CharacterIcon";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useState, useEffect } from "react";

import { Stage, Layer, Rect, Line } from "react-konva";
import { v4 as uuidv4 } from 'uuid';

const grid = 64;
const gridWidth = 833;
const linesA = [];
const linesB = [];

for (let i = 0; i < gridWidth / grid; i++) {
  linesA.push(
    <Line
    key={uuidv4()}
      strokeWidth={2}
      stroke="#d0d0d0"
      points={[i * grid, 0, i * grid, gridWidth]}
    />
  );

  linesB.push(
    <Line
      key={uuidv4()}
      strokeWidth={2}
      stroke="#d0d0d0"
      points={[0, i * grid, gridWidth, i * grid]}
    />
  );
}

const Board = ({icons, setIcons, userIsDM, stompClient}) => {
  return(
    <Stage width={833} height={833}>
      <Layer>
        {linesA}
        {linesB}
      </Layer>

      <Layer>
        {icons.map((icon, index) => (
          (icon.username == JSON.parse(localStorage.getItem('user')).username) || userIsDM ? 
            <Rect
              onDragEnd={(e) => {
                e.target.to({
                  x: Math.round(e.target.x() / grid) * grid,
                  y: Math.round(e.target.y() / grid) * grid
                });
                // const updatedIcons = icons;
                // updatedIcons[index].x = Math.round(e.target.x() / grid) * grid;
                // updatedIcons[index].y = Math.round(e.target.y() / grid) * grid;
                // setIcons(updatedIcons);
                stompClient.current.send(
                  "/api/board",
                  {},
                  JSON.stringify(
                    {
                      id: icon.id, 
                      x: Math.round(e.target.x() / grid) * grid,
                      y: Math.round(e.target.y() / grid) * grid,
                      username: icon.username,
                      color: icon.color
                    }
                  )
                );
              }}
              key={uuidv4()}
              // id={icon.username}
              x={icon.x}
              y={icon.y}
              draggable
              width={64}
              height={64}
              fill={icon.color}
              cornerRadius={[30, 30, 30, 30]}
              dragBoundFunc={(pos) => {
                const newX = pos.x < 0 ? 0 : 
                  pos.x > 768 ? 768 : pos.x;
                  const newY = pos.y < 0 ? 0 : 
                  pos.y > 768 ? 768 : pos.y;
                return {
                  x: newX,
                  y: newY,
                };
              }}
            />
          :
            <Rect
              onDragEnd={(e) => {
                e.target.to({
                  x: Math.round(e.target.x() / grid) * grid,
                  y: Math.round(e.target.y() / grid) * grid
                });
                // const updatedIcons = icons;
                // updatedIcons[index].x = Math.round(e.target.x() / grid) * grid;
                // updatedIcons[index].y = Math.round(e.target.y() / grid) * grid;
                // setIcons(updatedIcons);

                stompClient.current.send(
                  "/api/board",
                  {},
                  JSON.stringify(
                    {
                      id: icon.id, 
                      x: Math.round(e.target.x() / grid) * grid,
                      y: Math.round(e.target.y() / grid) * grid,
                      username: icon.username,
                      color: icon.color
                    }
                  )
                );
              }}
              key={uuidv4()}
              // id={icon.username}
              x={icon.x}
              y={icon.y}
              width={64}
              height={64}
              fill={icon.color}
              cornerRadius={[30, 30, 30, 30]}
              dragBoundFunc={(pos) => {
                const newX = pos.x < 0 ? 0 : 
                  pos.x > 768 ? 768 : pos.x;
                  const newY = pos.y < 0 ? 0 : 
                  pos.y > 768 ? 768 : pos.y;
                return {
                  x: newX,
                  y: newY,
                };
              }}
            />
        ))}
      </Layer>
    </Stage>
  );













  // const [mapSquares, setMapSquares] = useState([]);

  // useEffect(() => {
  //   const tempArray = [];
  //   for (let i = 0; i < 64; i++) {
  //     tempArray.push(renderSquare(i));
  //   }
  //   setMapSquares(tempArray);
  // }, [icons]);

  // const renderSquare = (i) => {
  //   const x = i % 8;
  //   const y = Math.floor(i / 8);

  //   let username;
  //   let oldX;
  //   let oldY;

  //   icons.map((icon) => {
  //     if (x === icon.x && y === icon.y) {
  //       username = icon.username;
  //       oldX = icon.x;
  //       oldY = icon.y;
  //     } 
  //   })

  //   return (
  //     <div 
  //       key={i} 
  //       style={{ width: '12.5%', height: '12.5%' }} 
  //     >
  //       <BoardSquare x={x} y={y} oldX={oldX} oldY={oldY} username={username} moveIcon={moveIcon}>
  //         { icons.map((icon) => {
  //           if (x === icon.x && y === icon.y && username == icon.username) {
  //             return <CharacterIcon /> 
  //             // { return renderIcon(x, y, icon)}
  //           } 
  //         })}
  //       </BoardSquare>
  //     </div>
  //   );
  // };

  // // const renderSquare = (i) => {
  // //   const x = i % 8;
  // //   const y = Math.floor(i / 8);
  // //   return (
  // //     <div 
  // //       key={i} 
  // //       style={{ width: '12.5%', height: '12.5%' }} 
  // //     >
  // //       <BoardSquare x={x} y={y} moveIcon={moveIcon}>
  // //         {renderIcon(x, y, iconPosition)}
  // //       </BoardSquare>
  // //     </div>
  // //   );
  // // };

  // // const renderIcon = (x, y, icon) => {  
  // //   if (x === icon.x && y === icon.y) {
  // //     return <CharacterIcon />
  // //   }
  // // }

  // const renderIcon = (x, y, iconPosition) => {
  //   if (x === iconPosition[0] && y === iconPosition[1]) {
  //     return <CharacterIcon />
  //   }
  // }

  // // const findIcon = (username) => {
  // //   icons.filter(icon => {
  // //     return icon.username === username;
  // //   })
  // // }

  // return (
  //   <DndProvider backend={HTML5Backend}>
  //     {/* <button onClick={() => console.log(icons)}> AAAAAAAAAAAAA</button> */}
  //     <div className="Board">
  //       {mapSquares}
  //     </div>
  //   </DndProvider>
  // );
}

export default Board;