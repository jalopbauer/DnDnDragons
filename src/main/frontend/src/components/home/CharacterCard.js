import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { CardActionArea} from "@material-ui/core";
import { Link } from 'react-router-dom';

const CharacterCard = ({char}) => {
    return ( 
        <Grid item xs = {12} sm = {6} md = {4}>
          <Card variant="outlined" style={{backgroundColor: '#333'}}>
            <Link to={`/character/${char.id}`} style={{ textDecoration: 'none' }}>
              <CardActionArea
                style={{
                  backgroundColor: '#333',
                  // borderStyle: 'none'
                }}
              >
                <CardContent>
                  <Typography 
                    variant="h6" 
                    color="secondary" 
                    gutterBottom
                  >
                    {char.name}
                  </Typography>
                  <Typography variant="body1" >
                    Class: {char["characterClass"]}
                  </Typography>
                  <Typography variant="body1" >
                    Race: {char["race"]}
                  </Typography>
                  <Typography variant="body1" >
                    Alignment: {char["alignment"]}
                  </Typography>
                </CardContent>
              </CardActionArea>
            {/* <CardActions >
              <Button size="small"> Share</Button>
              <Button size = "small"> Add </Button>
            </CardActions> */}
            </Link>
          </Card>
        </Grid> );
}
 
export default CharacterCard;