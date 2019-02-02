import * as React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import {
  Paper,
  Typography,
  Fab,
  Hidden,
  Table, TableBody, TableCell, TableHead, TableRow
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import TouchAppIcon from '@material-ui/icons/TouchApp';

const styles = (theme) => ({
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
  },
  button: {
    margin: theme.spacing.unit,
    fontSize: '12px',
    width: '30px',
    height: '30px'
  },
  buttonAlign: {
    textAlign: 'center'
  }
});

class OrderList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      "list": [],
      "pagination": [],
      "cur_page": 1,
      "is_list_loading": true
    };
  }

  componentDidMount() {
    this.getOrderList(1);
  }

  getOrderList(page) {
    const url = this.props.api_url + "/v1/order?group_id=" +
      (this.props.group_id).toString() + "&page=" + page.toString();
    const headers = {
      "Authorization": "Bearer " + this.props.jwt
    };

    this.setState({
      "is_list_loading": true
    });

    axios.get(url, {"headers": headers})
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
        return (<CheckIcon />);

      case 0:
        return (<HourglassEmptyIcon />);

      case -1:
        return (<CloseIcon />);

      default:
        return null;
    }
  }

  handleGetOrderInfo(orderItem) {
    orderItem.is_loading = true;
    this.setState({
      "list": this.state.list
    });

    const url = this.props.api_url + "/v1/order/" +
      (orderItem.id).toString();
    const headers = {
      "Authorization": "Bearer " + this.props.jwt
    };

    axios.get(url, {"headers": headers})
      .then((response) => {
        orderItem.is_loading = false;
        this.setState({
          "list": this.state.list
        });

        let alert_msg = "주문번호 : " + (response.data.order_id).toString() + "\n";
        alert_msg += "테이블 : " + (orderItem.table_id).toString() + "\n";
        alert_msg += "시간 : " + this.getDateString(orderItem.created_at) + "\n";

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

    const rowItems = this.state.list.map((rowItem) =>
      <TableRow key={rowItem.id}>
        <TableCell className={classes.tablecell}>{rowItem.id}</TableCell>
        <Hidden xsDown>
          <TableCell className={classes.tablecell}>{rowItem.name}</TableCell>
        </Hidden>
        <TableCell className={classes.tablecell} onClick={(e) => this.handleGetOrderInfo(rowItem)}>
          <TouchAppIcon />
        </TableCell>
        <TableCell className={classes.tablecell}>{rowItem.total_price}</TableCell>
        <Hidden xsDown>
          <TableCell className={classes.tablecell}>{rowItem.table_id}</TableCell>
          <TableCell className={classes.tablecell}>{this.getDateString(rowItem.created_at)}</TableCell>
        </Hidden>
        <TableCell className={classes.tablecell}>{this.getStatusIcon(rowItem.status)}</TableCell>
      </TableRow>
    );

    const pageItems = this.state.pagination.map((page) =>
      <Fab key={page.num} color={(page.current === true) ? 'primary' : 'default'} className={classes.button} onClick={(e) => this.handleGetOrderListClick(page.num)}>
        {page.text}
      </Fab>
    );

    return (
      <div>
        <Typography variant="headline" align="center">주문 내역</Typography>
        <Paper className={classes.root}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className={classes.tablecell}>#</TableCell>
                <Hidden xsDown>
                  <TableCell className={classes.tablecell}>주문자명</TableCell>
                </Hidden>
                <TableCell className={classes.tablecell}>내역</TableCell>
                <TableCell className={classes.tablecell}>가격</TableCell>
                <Hidden xsDown>
                  <TableCell className={classes.tablecell}>테이블</TableCell>
                  <TableCell className={classes.tablecell}>시간</TableCell>
                </Hidden>
                <TableCell className={classes.tablecell}>상태</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rowItems}
            </TableBody>
          </Table>
          <div className={classes.buttonAlign}>
            {pageItems}
          </div>
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