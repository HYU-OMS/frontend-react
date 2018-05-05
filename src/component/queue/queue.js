import * as React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Paper, Typography, Avatar, IconButton } from 'material-ui';
import ListSubheader from 'material-ui/List/ListSubheader';
import List, {
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText
} from 'material-ui/List';
import DeleteIcon from '@material-ui/icons/Delete';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';

class Queue extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      "queue": [],
      "is_loading": true,
      "remaining_refresh_time": 9,
      "auto_refresh_interval_ref": null
    };
  }
  
  componentDidMount() {
    this.getQueue();
    this.setState({
      "auto_refresh_interval_ref": setInterval(this.autoRefresh, 1000)
    });
  }

  componentWillUnmount() {
    clearInterval(this.state.auto_refresh_interval_ref);
  }
  
  autoRefresh = () => {
    if(this.state.remaining_refresh_time <= 0) {
      if(this.state.is_loading === false) {
        this.setState({
          "remaining_refresh_time": 9
        });

        this.getQueue();
      }
    }
    else {
      this.setState({
        "remaining_refresh_time": this.state.remaining_refresh_time - 1
      });
    }
  };
  
  getQueue() {
    const url = this.props.api_url + "/api/queue?jwt=" + this.props.jwt + 
      "&group_id=" + (this.props.group_id).toString();

    this.setState({
      "is_loading": true
    });

    axios.get(url)
      .then((response) => {
        this.setState({
          "queue": response.data.list,
          "is_loading": false
        });
      })
      .catch((error) => {
        alert(error.response.data.message);
        this.setState({
          "is_loading": false
        });
      });
  }
  
  getCount(queueItem) {
    let count_total = 0;
    for(const data of queueItem.queue) {
      count_total += parseInt(data['amount'], 10);
    }

    return count_total;
  }
  
  visualizeQueue(queueItem) {
    const temp_queue = queueItem.queue.slice(0);
    
    /* 임시 비활성화 -> Queue에 있는 모든 내용을 다 보여준다.
    while(temp_queue.length > 5) {
      temp_queue.pop();
    }
    
    if(queueItem.queue.length > 5) {
      temp_queue.push({
        "no_more": true
      });
      }
    */

    return temp_queue.map((item) => {
      if(item['no_more'] === true) {
        return (
          <ListItem key="0-0-0">
            <ListItemAvatar>
              <Avatar>
                X
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="(더 있음)"
            />
            <ListItemSecondaryAction>
              <IconButton aria-label="Delete">
                <HourglassEmptyIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        );
      }
      else {
        return (
          <ListItem key={(item.order_id).toString() + "-" + (item.menu_id).toString()}>
            <ListItemAvatar>
              <Avatar>
                {item.amount}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={"Table: " + (item.table_id).toString()}
            />
            <ListItemSecondaryAction>
              <IconButton aria-label="Delete" onClick={(e) => this.handleOnClick(item)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        );
      }
    });
  }
  
  handleOnClick = (item) => {
    if(window.confirm("대기열에서 해당 항목을 제거하겠습니까?")) {
      const url = this.props.api_url + "/api/queue?jwt=" + this.props.jwt;

      axios.put(url, {
        "order_id": item.order_id,
        "menu_id": item.menu_id
      }).then((response) => {
        this.setState({
          "remaining_refresh_time": 15
        });
        this.getQueue();
      }).catch((error) => {
        alert(error.response.data.message);
      });
    }
  };
  
  render() {
    const rowItems = this.state.queue.map((rowItem) =>
      <div key={rowItem.id}>
        {this.getCount(rowItem) > 0 &&
          <React.Fragment>
            <Paper>
              <List
              dense={true}
              subheader={
                <ListSubheader>
                  {rowItem.name} ({this.getCount(rowItem)})
                </ListSubheader>
              }>
                {this.visualizeQueue(rowItem)}
              </List>
            </Paper>
            
            <br/>
          </React.Fragment>
        }
      </div>
    );
    
    return (
      <div>
        <Typography variant="headline" align="center">메뉴별 대기열</Typography>
        
        <br/>
        
        {rowItems}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    "jwt": state.auth.jwt,
    "api_url": state.auth.api_url,
    "group_id": state.auth.group_id
  };
};

export default connect(
  mapStateToProps
)(Queue);