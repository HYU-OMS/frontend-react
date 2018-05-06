import * as React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import { Paper, Typography, TextField, FormControl, Button } from 'material-ui';
import { withStyles } from 'material-ui/styles';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';

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
  }
});

class ManageMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      "new_name": "",
      "new_price": 0,
      "menu_list": [],
      "is_list_loading": true,
      "is_menu_on_creation": false
    };
  }

  componentDidMount() {
    this.getMenuList();
  }

  handleNewMenuNameChange = (e) => {
    this.setState({
      "new_name": e.target.value
    });
  };

  handleNewMenuPriceChange = (e) => {
    this.setState({
      "new_price": parseInt(e.target.value, 10)
    });
  };

  handleNewMenuSubmit = (e) => {
    e.preventDefault();

    this.setState({
      "is_menu_on_creation": true
    });

    const url = this.props.api_url + "/api/menu?jwt=" + this.props.jwt;

    axios.post(url, {
      "group_id": this.props.group_id,
      "name": this.state.new_name,
      "price": this.state.new_price
    }).then((response) => {
      this.setState({
        "new_name": "",
        "new_price": 0,
        "is_list_loading": true,
        "is_menu_on_creation": false
      });

      this.getMenuList();
    }).catch((error) => {
      alert(error.response.data.message);
      this.setState({
        "is_menu_on_creation": false
      });
    });
  };

  getMenuList = () => {
    const url = this.props.api_url + "/api/menu?jwt=" + this.props.jwt +
      "&group_id=" + (this.props.group_id).toString();

    this.setState({
      "is_list_loading": true
    });

    axios.get(url)
      .then((response) => {
        this.setState({
          "menu_list": response.data.list,
          "is_list_loading": false
        });
      })
      .catch((error) => {
        alert(error.response.data.message);
        this.setState({
          "is_list_loading": false
        });
      });
  };

  handleChangePrice = (menuItem, e) => {
    menuItem.price = parseInt(e.target.value, 10);
  };

  handleOnBlur = (menuItem) => {
    const url = this.props.api_url + "/api/menu/" + (menuItem.id).toString() +
      "?jwt=" + this.props.jwt;

    this.setState({
      "is_list_loading": true
    });

    axios.put(url, {
      "price": parseInt(menuItem.price, 10),
      "is_enabled": parseInt(menuItem.is_enabled, 10)
    }).then((response) => {
      this.setState({
        "is_list_loading": false
      });
    }).catch((error) => {
      alert(error.response.data.message);
      this.setState({
        "is_list_loading": false
      });
    });
  };

  handleStateChange = (menuItem, next_state) => {
    if(parseInt(menuItem.is_enabled, 10) !== next_state) {
      const url = this.props.api_url + "/api/menu/" + (menuItem.id).toString() +
        "?jwt=" + this.props.jwt;

      this.setState({
        "is_list_loading": true
      });

      axios.put(url, {
        "price": parseInt(menuItem.price, 10),
        "is_enabled": next_state
      }).then((response) => {
        menuItem.is_enabled = next_state;

        this.setState({
          "is_list_loading": false,
          "menu_list": this.state.menu_list
        });
      }).catch((error) => {
        alert(error.response.data.message);
        this.setState({
          "is_list_loading": false
        });
      });
    }
  };
  
  render() {
    const { classes } = this.props;

    const menuItems = this.state.menu_list.map((menuItem) =>
      <TableRow key={menuItem.id}>
        <TableCell className={classes.tablecell}>{menuItem.name}</TableCell>
        <TableCell className={classes.tablecell}>
          <TextField
            value={menuItem.price}
            onChange={(e) => this.handleChangePrice(menuItem, e)}
            onBlur={(e) => this.handleOnBlur(menuItem)}
            type="number"
            className={classes.priceTextField}
            margin="none"
          />
        </TableCell>
        {parseInt(menuItem.is_enabled, 10) === 1 &&
          <TableCell className={classes.tablecell} onClick={(e) => this.handleStateChange(menuItem, 0)}>
            <DoneIcon />
          </TableCell>
        }
        {parseInt(menuItem.is_enabled, 10) === 0 &&
          <TableCell className={classes.tablecell} onClick={(e) => this.handleStateChange(menuItem, 1)}>
            <ClearIcon />
          </TableCell>
        }
      </TableRow>
    );

    return (
      <React.Fragment>
        <Typography variant="headline" align="center">메뉴 관리</Typography>

        <Paper className={classes.root}>
          <br/>
          <Typography variant="subheading" align="center">메뉴 목록</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className={classes.tablecell}>이름</TableCell>
                <TableCell className={classes.tablecell}>가격</TableCell>
                <TableCell className={classes.tablecell}>상태 변경</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {menuItems}
            </TableBody>
          </Table>
        </Paper>

        <Paper className={classes.root}>
          <br/>
          <Typography variant="subheading" align="center">새 메뉴 등록</Typography>

          <FormControl fullWidth className={classes.formField}>
            <TextField
              label="이름"
              value={this.state.new_name}
              onChange={this.handleNewMenuNameChange}
              margin="none"
              placeholder='이름 입력'
              fullWidth
            />

            <br/>

            <TextField
              label="가격"
              value={this.state.new_price}
              onChange={this.handleNewMenuPriceChange}
              margin="none"
              type="number"
              placeholder='가격 입력'
              fullWidth
            />

            <br/>

            <Button fullWidth color="primary" variant="raised" onClick={this.handleNewMenuSubmit}>추가하기</Button>
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
)(withStyles(styles)(ManageMenu));