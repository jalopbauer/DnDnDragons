import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";

const showSelectedRaceSpeed = (selectedRace) => {
  const speed = selectedRace.speed;
  if(!speed) {
    return;
  }
  if(typeof(speed) !== 'object') {
    return <p><b>Speed:</b> {speed}</p>;
  }
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
      str += `${getUpperCaseFirstLetter(keys[i])} ${values[i] > 0 ? '+' + values[i] : values[i] }; `;
    } else {
      str += `${values[i].count} other of your choice increase by +1; `;
    }  
  }
  return <p><b>Ability Scores: </b>{str.slice(0, -2)}</p>; // el slice es para remover el ultimo '; '
}

const getUpperCaseFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getSelectedRaceEntries = (selectedRace) => {
  const array = [];
  entriesHelper(selectedRace.entries, '', array);
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

const handleElements = (elements) => {
  const array = [];
  elements.map((element, index) => {
    switch(element.type) {
      case "list":
        array.push(handleList(element.items, array));
        break;
      case "entries":
        array.push(<h2>{element.name}</h2>);
        array.push(handleEntries(element.entries, array));
        break;
      case "table":
        array.push(handleTable(element, array));
        break;
    }
  });
  return array;
}

const handleList = (items, array) => {
  // const array = [];
  items.map((item) => {
    array.push(<p><b>{item.name}.</b> {item.entry}</p>);
  });
  // return array;
}

const handleEntries = (entries, array) => {
  // const array = [];
  entries.map((entry) => {
    array.push(entry.type ? handleElements([entry]) : <p>{entry}</p>);
  });
  // return array;
}

const handleTable = (element, array) => {
  // const array = []
  array.push(
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          {element.colLabels.map((colLabel) => (
            <TableCell>{colLabel}</TableCell>
          ))}
        </TableHead>
        <TableBody>
          {element.rows.map((row) => (
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
  console.log(array);
  // return array;
}

const rpc = {
  showSelectedRaceSpeed,
  showSelectedRaceAbilityModifiers,
  getSelectedRaceEntries,
  handleElements
}

export default rpc;