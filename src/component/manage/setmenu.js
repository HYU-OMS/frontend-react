import * as React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import { Paper, Typography, TextField, FormControl, Button, Card, Chip, Divider } from 'material-ui';
import { withStyles } from 'material-ui/styles';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import TouchAppIcon from '@material-ui/icons/TouchApp';

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
  priceTextField: {
    width: '150px',
    textAlign: 'center'
  },
  formField: {
    paddingLeft: "15px",
    paddingRight: "15px",
    paddingTop: "10px",
    paddingBottom: "10px"
  },
  chip: {
    margin: theme.spacing.unit,
  }
});

class ManageSetmenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      "new_name": "",
      "new_price": 0,
      "new_menu_list": [],
      "setmenu_list": [],
      "menu_list": [],
      "is_menu_list_loading": true,
      "is_setmenu_list_loading": true,
      "is_setmenu_on_creation": false
    };
  }

  componentDidMount() {
    this.getMenuList();
    this.getSetmenuList();
  }

  handleNewSetmenuNameChange = (e) => {
    this.setState({
      "new_name": e.target.value
    });
  };

  handleNewSetmenuPriceChange = (e) => {
    this.setState({
      "new_price": parseInt(e.target.value, 10)
    });
  };

  getMenuList = () => {
    const url = this.props.api_url + "/api/menu?jwt=" + this.props.jwt +
      "&group_id=" + (this.props.group_id).toString();

    this.setState({
      "is_menu_list_loading": true
    });

    axios.get(url)
      .then((response) => {
        this.setState({
          "menu_list": response.data.list,
          "is_menu_list_loading": false
        });
      })
      .catch((error) => {
        alert(error.response.data.message);
        this.setState({
          "is_menu_list_loading": false
        });
      });
  };

  getSetmenuList = () => {
    const url = this.props.api_url + "/api/setmenu?jwt=" + this.props.jwt +
      "&group_id=" + (this.props.group_id).toString();

    this.setState({
      "is_setmenu_list_loading": true
    });

    axios.get(url)
      .then((response) => {
        this.setState({
          "setmenu_list": response.data.list,
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

  handleChangePrice = (setmenuItem, e) => {
    setmenuItem.price = parseInt(e.target.value, 10);
  };

  handleOnBlur = (setmenuItem) => {
    const url = this.props.api_url + "/api/setmenu/" + (setmenuItem.id).toString() + "?jwt=" + this.props.jwt;

    this.setState({
      "is_setmenu_list_loading": true
    });

    axios.put(url, {
      "price": parseInt(setmenuItem.price, 10),
      "is_enabled": parseInt(setmenuItem.is_enabled, 10)
    }).then((response) => {
      this.setState({
        "is_setmenu_list_loading": false
      });
    }).catch((error) => {
      alert(error.response.data.message);
      this.setState({
        "is_setmenu_list_loading": false
      });
    });
  };

  handleStateChange = (setmenuItem, next_state) => {
    if(parseInt(setmenuItem.is_enabled, 10) !== next_state) {
      const url = this.props.api_url + "/api/setmenu/" + (setmenuItem.id).toString() + "?jwt=" + this.props.jwt;

      this.setState({
        "is_setmenu_list_loading": true
      });

      axios.put(url, {
        "price": parseInt(setmenuItem.price, 10),
        "is_enabled": next_state
      }).then((response) => {
        setmenuItem.is_enabled = next_state;

        this.setState({
          "is_setmenu_list_loading": false,
          "setmenu_list": this.state.setmenu_list
        });
      }).catch((error) => {
        alert(error.response.data.message);
        this.setState({
          "is_setmenu_list_loading": false
        });
      });
    }
  };

  handleAddMenuToSet = (menuItem) => {
    const new_menu_list = this.state.new_menu_list;
    new_menu_list.push({
      "key": this.state.new_menu_list.length,
      "id": menuItem.id,
      "name": menuItem.name
    });

    this.setState({
      "new_menu_list": new_menu_list
    });
  };

  handleNewSetmenuSubmit = (e) => {
    e.preventDefault();

    this.setState({
      "is_setmenu_on_creation": true
    });

    const url = this.props.api_url + "/api/setmenu?jwt=" + this.props.jwt;
    const new_menu_list = [];
    for(let item of this.state.new_menu_list) {
      new_menu_list.push(item.id);
    }

    axios.post(url, {
      "group_id": this.props.group_id,
      "name": this.state.new_name,
      "price": this.state.new_price,
      "menu_list": new_menu_list
    }).then((response) => {
      this.setState({
        "new_name": "",
        "new_price": 0,
        "new_menu_list": [],
        "is_setmenu_on_creation": false
      });

      this.getSetmenuList();
    }).catch((error) => {
      alert(error.response.data.message);
      this.setState({
        "is_setmenu_on_creation": false
      });
    });
  };

  render() {
    const { classes } = this.props;

    const setmenuItems = this.state.setmenu_list.map((setmenuItem) =>
      <TableRow key={setmenuItem.id}>
        <TableCell className={classes.tablecell}>{setmenuItem.name}</TableCell>
        <TableCell className={classes.tablecell}>
          <TextField
            value={setmenuItem.price}
            onChange={(e) => this.handleChangePrice(setmenuItem, e)}
            onBlur={(e) => this.handleOnBlur(setmenuItem)}
            type="number"
            className={classes.priceTextField}
            margin="none"
          />
        </TableCell>
        {parseInt(setmenuItem.is_enabled, 10) === 1 &&
        <TableCell className={classes.tablecell} onClick={(e) => this.handleStateChange(setmenuItem, 0)}>
          <DoneIcon />
        </TableCell>
        }
        {parseInt(setmenuItem.is_enabled, 10) === 0 &&
        <TableCell className={classes.tablecell} onClick={(e) => this.handleStateChange(setmenuItem, 1)}>
          <ClearIcon />
        </TableCell>
        }
      </TableRow>
    );

    const new_set_items = this.state.new_menu_list.map((new_menu) =>
      <Chip key={new_menu.key} label={new_menu.name} className={classes.chip} />
    );

    const menuItems = this.state.menu_list.map((menuItem) =>
      <TableRow key={menuItem.id}>
        <TableCell className={classes.tablecell}>{menuItem.name}</TableCell>
        <TableCell className={classes.tablecell}>{menuItem.price}</TableCell>
        <TableCell className={classes.tablecell} onClick={(e) => this.handleAddMenuToSet(menuItem)}>
          <TouchAppIcon/>
        </TableCell>
      </TableRow>
    );

    return (
      <React.Fragment>
        <Typography variant="headline" align="center">세트메뉴 관리</Typography>

        <Paper className={classes.root}>
          <br/>
          <Typography variant="subheading" align="center">세트메뉴 목록</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className={classes.tablecell}>이름</TableCell>
                <TableCell className={classes.tablecell}>가격</TableCell>
                <TableCell className={classes.tablecell}>상태 변경</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {setmenuItems}
            </TableBody>
          </Table>
        </Paper>

        <Paper className={classes.root}>
          <br/>
          <Typography variant="subheading" align="center">새 세트메뉴 등록</Typography>

          <FormControl fullWidth className={classes.formField}>
            <TextField
              label="이름"
              value={this.state.new_name}
              onChange={this.handleNewSetmenuNameChange}
              margin="none"
              placeholder='이름 입력'
              fullWidth
            />

            <br/>

            <TextField
              label="가격"
              value={this.state.new_price}
              onChange={this.handleNewSetmenuPriceChange}
              margin="none"
              type="number"
              placeholder='가격 입력'
              fullWidth
            />

            <br/>

            <br/><Typography variant="caption">선택된 메뉴</Typography><br/>
            <Card>
              {new_set_items}
              <Divider />
              {this.state.new_menu_list.length > 0 &&
              <Button
                fullWidth
                color="secondary"
                size="small"
                onClick={(e) => {
                  this.setState({"new_menu_list": []});
                }}
              >
                초기화
              </Button>
              }
            </Card>

            <br/>

            <br/><Typography variant="caption">메뉴 목록</Typography><br/>
            <Card>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.tablecell}>이름</TableCell>
                    <TableCell className={classes.tablecell}>가격</TableCell>
                    <TableCell className={classes.tablecell}>추가하기</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {menuItems}
                </TableBody>
              </Table>
            </Card>

            <br/>

            <Button fullWidth color="primary" variant="raised" onClick={this.handleNewSetmenuSubmit}>추가하기</Button>
          </FormControl>
        </Paper>
      </React.Fragment>
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
)(withStyles(styles)(ManageSetmenu));