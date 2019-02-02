import * as React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import {
  Paper,
  Typography,
  Button,
  Table, TableBody, TableCell, TableHead, TableRow,
  TextField,
  FormControl,
  Card, CardActions, CardContent
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

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
  }
});

class OrderRequest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      "menu_list": [],
      "setmenu_list": [],
      "is_menu_list_loading": true,
      "is_setmenu_list_loading": true,
      "is_in_order_processing": false,
      "table_name": "",
      "total_price": 0
    };
  }

  componentDidMount() {
    this.getMenuList();
    this.getSetmenuList();
  }

  getMenuList = () => {
    const url = this.props.api_url + "/v1/menu?group_id=" + (this.props.group_id).toString();
    const headers = {
      "Authorization": "Bearer " + this.props.jwt
    };

    this.setState({
      "is_menu_list_loading": true
    });

    axios.get(url, {"headers": headers})
      .then((response) => {
        this.setState({
          "menu_list": response.data,
          "is_menu_list_loading": false
        });
      })
      .catch((error) => {
        console.log(error);
        //alert(error.response.data.message);
        this.setState({
          "is_menu_list_loading": false
        });
      });
  };

  getSetmenuList = () => {
    const url = this.props.api_url + "/v1/setmenu?group_id=" + (this.props.group_id).toString();
    const headers = {
      "Authorization": "Bearer " + this.props.jwt
    };

    this.setState({
      "is_setmenu_list_loading": true
    });

    axios.get(url, {"headers": headers})
      .then((response) => {
        this.setState({
          "setmenu_list": response.data,
          "is_setmenu_list_loading": false
        });
      })
      .catch((error) => {
        alert(error.response.data.message);
        this.setState({
          "is_setmenu_list_loading": false
        });
      });
  };

  handleMenuItemAdjust = (menuItem, value) => {
    if(menuItem.is_enabled !== 1) {
      return;
    }

    if(isNaN(menuItem.amount)) {
      menuItem.amount = 0;
    }

    menuItem.amount += value;

    this.setState({
      "menu_list": this.state.menu_list,
      "total_price": this.state.total_price + (value * menuItem.price)
    });
  };

  handleSetmenuItemAdjust = (setmenuItem, value) => {
    if(setmenuItem.is_enabled !== 1) {
      return;
    }

    if(isNaN(setmenuItem.amount)) {
      setmenuItem.amount = 0;
    }

    setmenuItem.amount += value;

    this.setState({
      "setmenu_list": this.state.setmenu_list,
      "total_price": this.state.total_price + (value * setmenuItem.price)
    });
  };

  handleTableNameChange = (e) => {
    this.setState({
      "table_name": e.target.value
    });
  };

  handleOnSubmit = (e) => {
    e.preventDefault();

    const url = this.props.api_url + "/v1/order";
    const headers = {
      "Authorization": "Bearer " + this.props.jwt
    };

    const menu_list = [];
    for(const menu of this.state.menu_list) {
      if(!isNaN(menu.amount) && menu.amount !== 0) {
        menu_list.push({
          "id": menu.id,
          "amount": menu.amount
        });
      }
    }

    const setmenu_list = [];
    for(const setmenu of this.state.setmenu_list) {
      if(!isNaN(setmenu.amount) && setmenu.amount !== 0) {
        setmenu_list.push({
          "id": setmenu.id,
          "amount": setmenu.amount
        });
      }
    }

    if(menu_list.length === 0 && setmenu_list.length === 0) {
      alert("선택된 메뉴/세트메뉴 가 하나도 없습니다!");
    } else {
      this.setState({
        "is_in_order_processing": true
      });

      axios.post(url, {
        "group_id": this.props.group_id,
        "table_id": this.state.table_name,
        "menu_list": menu_list,
        "setmenu_list": setmenu_list
      }, {"headers": headers}).then((response) => {
        const alert_msg = "주문 요청이 완료되었습니다.\n" +
          "주문번호 : " + (response.data.order_id).toString() + "\n" +
          "총 금액 : " + (response.data.total_price).toString();

        alert(alert_msg);

        for(const menu of this.state.menu_list) {
          if(!isNaN(menu.amount)) {
            delete menu.amount;
          }
        }

        for(const setmenu of this.state.setmenu_list) {
          if(!isNaN(setmenu.amount)) {
            delete setmenu.amount;
          }
        }

        this.setState({
          "is_in_order_processing": false,
          "table_name": "",
          "total_price": 0,
          "menu_list": this.state.menu_list,
          "setmenu_list": this.state.setmenu_list
        });
      }).catch((error) => {
        alert(error.response.data.message);

        this.setState({
          "is_in_order_processing": false
        });

        this.getMenuList();
        this.getSetmenuList();
      });
    }
  };

  render() {
    const { classes } = this.props;

    const menuItems = this.state.menu_list.map((menuItem) =>
      <TableRow hover={true} key={menuItem.id} style={{ opacity: (parseInt(menuItem.is_enabled, 10) !== 1) ? 0.25 : 1 }}>
        <TableCell className={classes.tablecell}>{menuItem.name}</TableCell>
        <TableCell className={classes.tablecell}>{menuItem.price}</TableCell>
        <TableCell className={classes.tablecell}>{menuItem.amount}</TableCell>
        <TableCell onClick={(e) => this.handleMenuItemAdjust(menuItem, 1)} className={classes.tablecell}>
          <AddIcon />
        </TableCell>
        <TableCell onClick={(e) => this.handleMenuItemAdjust(menuItem, -1)} className={classes.tablecell}>
          <RemoveIcon />
        </TableCell>
      </TableRow>
    );

    const setmenuItems = this.state.setmenu_list.map((setmenuItem) =>
      <TableRow hover={true} key={setmenuItem.id} style={{ opacity: (parseInt(setmenuItem.is_enabled, 10) !== 1) ? 0.25 : 1 }}>
        <TableCell className={classes.tablecell}>{setmenuItem.name}</TableCell>
        <TableCell className={classes.tablecell}>{setmenuItem.price}</TableCell>
        <TableCell className={classes.tablecell}>{setmenuItem.amount}</TableCell>
        <TableCell onClick={(e) => this.handleSetmenuItemAdjust(setmenuItem, 1)} className={classes.tablecell}>
          <AddIcon />
        </TableCell>
        <TableCell onClick={(e) => this.handleSetmenuItemAdjust(setmenuItem, -1)} className={classes.tablecell}>
          <RemoveIcon />
        </TableCell>
      </TableRow>
    );

    return (
      <div>
        <div>
          <Typography variant="headline" align="center">메뉴 목록</Typography>
          <Paper className={classes.root}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.tablecell}>이름</TableCell>
                  <TableCell className={classes.tablecell}>가격</TableCell>
                  <TableCell className={classes.tablecell}>수량</TableCell>
                  <TableCell className={classes.tablecell} colSpan="2">수량 조절</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {menuItems}
              </TableBody>
            </Table>
          </Paper>
        </div>

        <br/>

        <div>
          <Typography variant="headline" align="center">세트메뉴 목록</Typography>
          <Paper className={classes.root}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.tablecell}>이름</TableCell>
                  <TableCell className={classes.tablecell}>가격</TableCell>
                  <TableCell className={classes.tablecell}>수량</TableCell>
                  <TableCell className={classes.tablecell} colSpan="2">수량 조절</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {setmenuItems}
              </TableBody>
            </Table>
          </Paper>
        </div>

        <br/>

        <div>
          <Typography variant="headline" align="center">테이블 이름</Typography>
          <Paper className={classes.root}>
            <FormControl fullWidth>
              <TextField
                placeholder="테이블 이름 입력"
                className={classes.textField}
                value={this.state.table_name}
                onChange={this.handleTableNameChange}
                fullWidth
              />
            </FormControl>
          </Paper>
        </div>

        <br/><hr/><br/>

        <div>
          <Card>
            <CardContent>
              <Typography color="textSecondary">
                주문 정보
              </Typography>
              <Typography variant="title">
                총 가격 : {this.state.total_price}
              </Typography>
              <Typography variant="title">
                테이블 이름 : {this.state.table_name}
              </Typography>
            </CardContent>
            <CardActions>
              <Button fullWidth onClick={this.handleOnSubmit} color="primary" variant="contained">주문 요청</Button>
            </CardActions>
          </Card>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    "jwt": state.auth.jwt,
    "api_url": state.auth.api_url,
    "group_id": state.auth.group_id
  }
};

export default connect(
  mapStateToProps
)(withStyles(styles)(OrderRequest));