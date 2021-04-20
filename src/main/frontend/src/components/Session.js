import { Box, Typography } from "@material-ui/core";
import { useState } from "react";
import CharacterIcon from "./CharacterIcon";
import Board from "./Board";
import BoardSquare from "./BoardSquare";

const Session = () => {

  const [iconPosition, setIconPosition] = useState([0,0]);

  const moveIcon = (x, y) => {
    setIconPosition([x,y]);
  } 

  return (
    <div className="Session">
      <Board iconPosition={iconPosition} moveIcon={moveIcon} />
    </div>
  );
}

export default Session;