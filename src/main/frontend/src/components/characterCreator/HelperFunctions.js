import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@material-ui/core";
import { v4 as uuidv4 } from 'uuid';

const showSelectedRaceSpeed = (selectedRace) => {
  return <Typography align="justify"><b>Speed:</b> {selectedRace.speed}</Typography>;
};

const showSelectedRaceAbilityModifiers = (selectedRace) => {
  // se invierten para que la opcion de '2 other of...' no quede de primera
  const keys = Object.keys(selectedRace.ability[0]).reverse(); 
  const values = Object.values(selectedRace.ability[0]).reverse();
  var str = '';
  for (var i = 0; i < keys.length; i++) {
    if(keys[i] !== 'choose') {
      str += `${getUpperCaseFirstLetter(keys[i])} ${values[i] > 0 ? '+' + values[i] : values[i] }; `;
    } else {
      str += `${values[i].count} other of your choice increase by +1; `;
    }  
  }
  return (
    <Typography key={uuidv4()} align="justify"> 
      <b>Ability Scores: </b>{str.slice(0, -2)}
    </Typography>
  );
}

const getUpperCaseFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const handleElements = (elements, classFeatures=null) => {
  const array = [];
  elements.map((element) => {
    switch(element.type) {
      case "list":
        array.push(handleList(element.items, array));
        break;
      case "entries":
        array.push(<Typography key={uuidv4()} variant="h5">{element.name}</Typography>);
        array.push(handleEntries(element.entries, array));
        break;
      case "table":
        array.push(handleTable(element, array));
        break;
      // case "refSubclassFeature":
      //   array.push(handleRefSubclassFeature(element, array));
      //   break;
      case "refClassFeature":
        array.push(handleRefClassFeature(element.classFeature, array, classFeatures));
        break;
      case "options":
        array.push(handleEntries(element.entries, array));
        break;
      case "refOptionalfeature":
        if(element.optionalfeature.indexOf('|') == -1) {
          array.push(<Typography key={uuidv4()} className="character-creator-yellow-name" variant="h5">{element.optionalfeature}</Typography>);
          array.push(<Typography key={uuidv4()} align="justify">{element.entry}</Typography>)
        }
        break;
      case "abilityDc":
        array.push(handleAbilityDC(element, array));
        break;
      case "abilityAttackMod":
        array.push(handleAbilityAttackMod(element, array));
        break;
      case undefined:
        array.push(<Typography align="justify">{element}</Typography>)
        break;
    }
  });
  return array;
}

const handleList = (items, array) => {
  items.map((item) => {
    array.push(
      item.name && item.entry ?
      <Typography key={uuidv4()} align="justify">
        <b>{item.name}.</b> {item.entry}
      </Typography> :
      <ul key={uuidv4()}>
        <Typography key={uuidv4()} align="justify">
          {item}
        </Typography>
      </ul>
      );
  });
}

const handleEntries = (entries, array) => {
  entries.map((entry) => {
    array.push(entry.type ? handleElements([entry]) : <Typography key={uuidv4()} align="justify">{entry}</Typography>);
  });
}

const handleTable = (element, array) => {
  array.push(
    <Box key={uuidv4()}>
      {element.caption && <Typography><b>{element.caption}</b></Typography>}
      <Table>
        {element.colLabels.length == 2 &&
        <colgroup>
          <col style={{width:'10%'}}/>
          <col style={{width:'90%'}}/>
        </colgroup>
        }
        <TableHead>
          <TableRow>
            {element.colLabels.map((colLabel) => (
              <TableCell key={uuidv4()} size="small"><Typography>{colLabel}</Typography></TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {element.rows.map((row) => (
            <TableRow key={uuidv4()}>
              {row.map((cell) => (
                <TableCell key={uuidv4()} size="small"><Typography>{cell}</Typography></TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Box pb={1}></Box>
    </Box>
  );
}

const handleRefClassFeature = (featureString, array, classFeatures) => {
  const featureName = featureString.substring(0, featureString.indexOf('|'));
  const featureLevel = featureString.substring(featureString.lastIndexOf('||')+2);
  classFeatures.map((classFeature) => {
    if(classFeature.name == featureName && classFeature.level == featureLevel) {
      array.push(<Typography key={uuidv4()} className="character-creator-yellow-name" variant="h5">{classFeature.name}</Typography>);
      handleEntries(classFeature.entries, array);
    }
  });
}

const handleAbilityDC = (element, array) => {
  let proficiency = transcribeProficiencies(element.attributes);
  let variousProficiencies = false;
  if(proficiency.includes(',')) {
    variousProficiencies = true;
    proficiency = proficiency.replace(", ", "/");
  }
  array.push(
    <Typography align='center'>
      <b>{element.name} save DC</b> = 8 + your proficiency bonus + 
      your {proficiency} modifier 
      {variousProficiencies && " (your choice)"}
    </Typography>
  )
}

const handleAbilityAttackMod = (element, array) => {
  array.push(
    <Typography align='center'>
      <b>{element.name} attack modifier</b> = your proficiency bonus + 
      your {transcribeProficiencies(element.attributes)} modifier
    </Typography>
  )
}

const removeFilterString = (str) => {
  const filterIndex = str.indexOf('@filter');
  if(filterIndex !== -1) {
    const barIndex = str.indexOf('|');
    return str.substring(filterIndex+7, barIndex);
  }
  return str;
}

const filterClassTableGroupsRows = (row) => {
  const array = [];
  row.map((element) => {
    if(typeof(element) === 'object') {
      switch(element.type) {
        case 'dice':
          array.push(
            <TableCell key={uuidv4()} align='center' size='small' style={{padding: "1px 2px 1px 2px"}}>
              <Typography style={{padding: "1px 2px 1px 2px"}}>
                {element.toRoll[0].number + 'd' + element.toRoll[0].faces}
              </Typography>
            </TableCell>
          );
          break;
        case 'bonus':
          array.push(
            <TableCell key={uuidv4()} align='center' size='small' style={{padding: "1px 2px 1px 2px"}}>
              <Typography style={{padding: "1px 2px 1px 2px"}}>
                {'+' + element.value}
              </Typography>
            </TableCell>
          );
          break;
        case 'bonusSpeed':
          array.push(
            <TableCell key={uuidv4()} align='center' size='small' style={{padding: "1px 2px 1px 2px"}}>
              <Typography style={{padding: "1px 2px 1px 2px"}}>
                {element.value > 0 ? '+' + element.value + ' ft.' : element.value}
              </Typography>
            </TableCell>
          );
          break;
      }
    } else {
      array.push(
        <TableCell key={uuidv4()} align='center' size='small' style={{padding: "1px 2px 1px 2px"}}>
          <Typography style={{padding: "1px 2px 1px 2px"}}>
            {removeFilterString(element.toString())}
          </Typography>
        </TableCell>
      ); 
    }
  });
  return array;
}

const filterStartingProficienciesArmors = (armors) => {
  let str = '';
  armors.map((element) => {
    if(typeof(element) === 'object') {
      str += `${element.full}, `
    } else if(element.indexOf('@') === -1) {
      str += `${element} armor, `;
    } else {
      str += `${element.substring(element.lastIndexOf('|')+1, element.length-1)}, `;
    }
  })
  return str.substring(0,str.length-2);
}

const filterStartingProficienciesWeapons = (weapons) => {
  let str = '';
  weapons.map((element) => {
    if(element.indexOf('@') === -1) {
      str += `${element} weapons, `;
    } 
    else {
      str += `${element.substring(element.lastIndexOf('|')+1, element.length-1)}, `;
    }
  })
  return str.substring(0,str.length-2);
}

const filterStartingProficienciesTools = (tools) => {
  let str = '';
  tools.map((element) => {
      str += `${element}, `;
  })
  return str.substring(0,str.length-2);
}

const transcribeProficiencies = (proficiencies) => {
  let str = '';
  proficiencies.map((proficiency) => {
    switch(proficiency) {
      case 'str':
        str += `Strength, `;
        break;
      case 'dex':
        str += `Dexterity, `;
        break;
      case 'con':
        str += `Constitution, `;
        break;
      case 'int':
        str += `Intelligence, `;
        break;
      case 'wis':
        str += `Wisdom, `;
        break;
      case 'cha':
        str += `Charisma, `;
        break;
    }
  })
  return str.substring(0,str.length-2);
}

const getSkills = (skills) => {
  let str = `Choose ${skills[0].choose.count} from `;
  skills[0].choose.from.map((element) => {
      str += `${element}, `;
  })
  return str.substring(0,str.length-2);
}

const getStartingEquipment = (startingEquipment) => {
  const array = [];
  array.push(
    <Typography key={uuidv4()}>
      You start with the following items, plus anything provided by your background.
    </Typography>)
  startingEquipment.default.map((equipment) => {
    array.push(<ul key={uuidv4()}><Typography>{equipment}</Typography></ul>);
  })
  array.push(
    <Typography key={uuidv4()}>
      Alternatively, you may start with {startingEquipment.goldAlternative} gp to buy your own equipment.
    </Typography>
  )
  return array;
}

const getFeatureTitle = (classFeature, type, header=false, subclassShortName) => {
  return ( 
    <div key={uuidv4()}>
      <Typography 
        className={type == "class" ? "character-creator-yellow-name" : "character-creator-blue-name"}
        variant="h5"
      >
        {type == "class" ? classFeature.name : <div className="subclass-title"><div>{classFeature.name}</div><div>{subclassShortName}</div></div>}
      </Typography>
      {/* {type == "class" && <Divider/>} */}
      {!header && <Box className={type == "class" ? "character-creator-yellow-divider" : "character-creator-blue-divider"} my={1}/>}
      {/* {!header && <Box className="character-creator-yellow-divider" my={1}/>} */}
    </div>
  )
}

const getClassFeatures = (selectedClass) => {
  const array = [];

  // lista con informacion detallada de las features de la clase  
  const PHBClassFeaturesDetails = selectedClass.classFeature.filter(feature => feature.source == "PHB");

  // lista con los nombres y niveles features de la clase, e indica si una feature otorga cosas de subclase
  const PHBClassFeaturesList = [];
  selectedClass.characterClass[0].classFeatures.map((feature) => {
    if(feature.gainSubclassFeature) {
      PHBClassFeaturesList.push({
        "name": feature.classFeature.substring(0, feature.classFeature.indexOf('|')),
        "level": feature.classFeature.substring(feature.classFeature.indexOf('||')+2),
        "gainSubclassFeature": true
      });
    } else {
      const lastChar = parseInt(feature.charAt(feature.length-1), 10);
      // si su ultimo caracter no es un numero, no pertenece al PHB
      if(lastChar || (lastChar == 0)) {
        PHBClassFeaturesList.push({
          "name": feature.substring(0, feature.indexOf('|')),
          "level": feature.substring(feature.indexOf('||')+2)
        });
      }
    }
  });

  // lista con informacion detallada de las features de las subclases  
  const PHBSubclassFeaturesDetails = selectedClass.subclassFeature.filter(
    feature => feature.source == "PHB" && 
               feature.classSource == "PHB" &&
               feature.subclassSource == "PHB"
  );

  // lista con los nombres abreviados de las subclases junto con sus features (nombre y nivel)
  const PHBSubclassList = [];
  selectedClass.characterClass[0].subclasses.map((subclass) => {
    if(subclass.source == "PHB") {
      // const features = []
      subclass.subclassFeatures.map((feature) => {
        PHBSubclassList.push({
          "name": feature.substring(0, feature.indexOf('|')),
          "level": feature.substring(feature.lastIndexOf('||')+2),
          "subclassShortName": subclass.shortName,
        });
      });
      // PHBSubclassList.push({
      //   "subclassShortName": subclass.shortName,
      //   "features": features
      // });
    }
  });
  
  PHBClassFeaturesList.map((classFeature) => {
    // titulo de la classFeature
    array.push(getFeatureTitle(classFeature, "class"));
    PHBClassFeaturesDetails.map((classFeatureDetails) => {
      if(classFeatureDetails.name == classFeature.name && classFeatureDetails.level == classFeature.level) {
        array.push(handleElements(classFeatureDetails.entries, PHBClassFeaturesDetails));
        if(classFeature.gainSubclassFeature) {
          PHBSubclassList.map((subclassFeature) => {
            if(subclassFeature.level == classFeature.level) {
              PHBSubclassFeaturesDetails.map((subclassFeatureDetails) => {
                if((subclassFeatureDetails.subclassShortName == subclassFeature.subclassShortName) && 
                    (subclassFeatureDetails.level == subclassFeature.level)) {
                    array.push(getFeatureTitle(subclassFeatureDetails, "subclass", subclassFeatureDetails.header, subclassFeature.subclassShortName));
                    array.push(handleElements(subclassFeatureDetails.entries, PHBSubclassFeaturesDetails));
                }
              })
            }
          })
        }
      }
    });
  });

  return array;
}

const getRaceIndex = (race) => {
  const racesWithIndex = {
    "Dragonborn": 17,
    "Dwarf": 18,
    "Elf": 20,
    "Gnome": 28,
    "Half-Elf": 37,
    "Half-Orc": 38,
    "Halfling": 40,
    "Human": 44,
    "Tiefling": 86,
  }
  return racesWithIndex[race];
};

const getBackgroundIndex = (background) => {
  const backgroundsWithIndex = {
    "Acolyte": 0,
    "Charlatan": 23,
    "Criminal": 30,
    "Entertainer": 35,
    "Folk Hero": 41,
    "Guild Artisan": 47,
    "Hermit": 50,
    "Noble": 65,
    "Outlander": 67,
    "Sage": 74,
    "Sailor": 75,
    "Soldier": 82,
    "Urchin": 87,
  }
  return backgroundsWithIndex[background];
};

const getClassIndex = (characterClass) => {
  const classesWithIndex = {
    "Barbarian": 0,
    "Bard": 1,
    "Cleric": 2,
    "Druid": 3,
    "Fighter": 4,
    "Monk": 5,
    "Paladin": 6,
    "Ranger": 7,
    "Rogue": 8,
    "Sorcerer": 9,
    "Warlock": 10,
    "Wizard": 11,
  }
  return classesWithIndex[characterClass] ? classesWithIndex[characterClass] : 0;
};

const helperFunctions = {
  showSelectedRaceSpeed,
  showSelectedRaceAbilityModifiers,
  handleElements,
  removeFilterString,
  filterClassTableGroupsRows,
  filterStartingProficienciesArmors,
  filterStartingProficienciesWeapons,
  filterStartingProficienciesTools,
  transcribeProficiencies,
  getSkills,
  getStartingEquipment,
  getClassFeatures,
  getRaceIndex,
  getBackgroundIndex,
  getClassIndex
}

export default helperFunctions;