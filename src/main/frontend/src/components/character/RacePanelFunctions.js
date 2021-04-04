import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";

const showSelectedRaceSpeed = (selectedRace) => {
  const speed = selectedRace.speed;
  if(!speed) {
    return;
  }
  if(typeof(speed) !== 'object') {
    return <p><b>Speed:</b> {speed}</p>;
  }
  // const keys = Object.keys(speed);
  // const values = Object.values(speed);
  // const array = [];
  // for (var i = 0; i < keys.length; i++) {
  //   array[i] = <p key={i}>{getUpperCaseString(keys[i]) + 'ing'} speed: {values[i]} ft.</p>;
  // }
  // return array;
};

const showSelectedRaceAbilityModifiers = (selectedRace) => {
  const abilityModifiers = selectedRace.ability;
  if(!abilityModifiers) {
    return;
  }
  // se invierten para que la opcion de '2 other of...' no quede de primera
  const keys = Object.keys(abilityModifiers[0]).reverse(); 
  const values = Object.values(abilityModifiers[0]).reverse();
  var str = '';
  for (var i = 0; i < keys.length; i++) {
    if(keys[i] !== 'choose') {
      str += `${getUpperCaseString(keys[i])} ${values[i] > 0 ? '+' + values[i] : values[i] }; `;
    } else {
      str += `${values[i].count} other of your choice increase by +1; `;
    }  
  }
  return <p><b>Ability Scores: </b>{str.slice(0, -2)}</p>; // el slice es para remover el ultimo '; '
}

const getUpperCaseString = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getSelectedRaceEntries = (selectedRace) => {
  const array = [];
  console.log(selectedRace.entries);
  entriesHelper(selectedRace.entries, '', array);



    // array.push(<p><b>{entry.name}:</b> {entry.entries[0]}</p>);
    // if(typeof(entry[1]) === 'object' && entry[1].type === 'table') {
    //   array.push(
        // <TableContainer component={Paper}>
        //   <Table>
        //     <TableHead>
        //       {entry[1].colLabels.map((colLabel) => (
        //         <TableCell>{colLabel}</TableCell>
        //       ))}
        //     </TableHead>
        //   </Table>
        // </TableContainer>
    //   );
    // }

  // })
  return array;
}

const entriesHelper = (entries, name, array) => {
  entries.map((entry, index) => {
    switch(typeof(entry)) {
      case 'string':
        array.push(<p>{index === 0 ? <b>{name}. </b> : null}{entry}</p>);
        break;
      case 'object':
        switch(entry.type) {
          case 'entries':
            entriesHelper(entry.entries, entry.name, array);
            break;
          case 'table':
            array.push(
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    {entry.colLabels.map((colLabel) => (
                      <TableCell>{colLabel}</TableCell>
                    ))}
                  </TableHead>
                  <TableBody>
                    {entry.rows.map((row) => (
                      <TableRow>
                        {row.map((cell) => (
                          <TableCell>{cell}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            );
            break;
        }
        break;
    }
  })
}

const rpc = {
  showSelectedRaceSpeed,
  showSelectedRaceAbilityModifiers,
  //getUpperCaseString
  getSelectedRaceEntries
}

export default rpc;