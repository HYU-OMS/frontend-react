import * as React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Paper, Typography, TextField, Button } from 'material-ui';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import { FormControl } from 'material-ui/Form';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import AddIcon from 'material-ui-icons/Add';
import RemoveIcon from 'material-ui-icons/Remove';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  },
  tablecell: {
    padding: "15px",
    textAlign: "center"
  },
  textField: {
    paddingLeft: "15px",
    paddingRight: "15px",
    paddingTop: "10px",
    paddingBottom: "10px"
  }
});

class OrderList extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      "list": [],
      "pagination": [],
      "cur_page": 1,
      "is_list_loading": true,
      "remaining_refresh_time": 15,
      "auto_refresh_interval_ref": null
    };
  }
  
  componentDidMount() {
    this.getOrderList(1);
    this.setState({
      "auto_refresh_interval_ref": setInterval(this.autoRefresh, 1000)
    });
  }

  componentWillUnmount() {
    clearInterval(this.state.auto_refresh_interval_ref);
  }

  autoRefresh = () => {
    if(this.state.remaining_refresh_time <= 0) {
      if(this.state.is_list_loading === false) {
        this.setState({
          "is_list_loading": true,
          "remaining_refresh_time": 9
        });

        this.getOrderList(this.state.cur_page);
      }
    }
    else {
      this.setState({
        "remaining_refresh_time": this.state.remaining_refresh_time - 1
      });
    }
  };

  getOrderList(page) {
    const url = this.props.api_url + "/api/order?jwt=" + 
      this.props.jwt + "&group_id=" + (this.props.group_id).toString() + 
      "&page=" + page.toString();

    this.setState({
      "is_list_loading": true
    });

    axios.get(url)
      .then((response) => {
        this.setState({
          "list": response.data.list,
          "pagination": response.data.pagination,
          "is_list_loading": false
        });
      })
      .catch((error) => {
        alert(error.response.data.message);
        this.setState({
          "is_list_loading": false
        });
      });
  }

  handleGetOrderListClick = (page_num) => {
    this.setState({
      "cur_page": page_num,
      "remaining_refresh_time": 9
    });

    this.getOrderList(page_num);
  };

  getDateString(dateInfo) {
    const dateObj = new Date(dateInfo);
    const dateString = dateObj.getFullYear() + "년 " +
      (dateObj.getMonth() + 1).toString() + "월 " +
      dateObj.getDate() + "일 " +
      dateObj.getHours() + "시 " +
      dateObj.getMinutes() + "분";

    return dateString;
  }

  getStatusIcon(status) {
    switch(status) {
      case 1:
        // return (<Icon name='checkmark' color="blue" size='large' />);

      case 0:
        // return (<Icon name='question' size='large' />);

      case -1:
        // return (<Icon name='remove' color="red" size='large' />);

      default:
        return null;
    }
  }

  handleGetOrderInfo(orderItem) {
    orderItem.is_loading = true;
    this.setState({
      "list": this.state.list
    });

    const url = this.props.api_url + "/api/order/" + 
      (orderItem.id).toString() + "?jwt=" + this.props.jwt;

    axios.get(url)
      .then((response) => {
        orderItem.is_loading = false;
        this.setState({
          "list": this.state.list
        });

        let alert_msg = "주문번호 : " + (response.data.order_id).toString() + "\n";
        alert_msg += "\n[일반메뉴]\n";
        for(const menu_info of response.data.order_menus) {
          alert_msg += (menu_info['name'] + " : " + menu_info['amount'] + "\n");
        }

        alert_msg += "\n[세트메뉴]\n";
        for(const setmenu_info of response.data.order_setmenus) {
          alert_msg += (setmenu_info['name'] + " : " + setmenu_info['amount'] + "\n");
        }

        alert(alert_msg);
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
  }
  
  render() {
    const { classes } = this.props;
    
    return (
      <div>
        <Typography variant="headline" align="center">주문 내역</Typography>
        <Paper className={classes.root}>
        
        </Paper>
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
)(withStyles(styles)(OrderList));