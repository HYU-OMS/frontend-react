import * as React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import {
  Paper,
  Typography,
  TextField,
  FormControl,
  Button,
  List, ListItem, ListItemText,
  Avatar
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import { selectGroup } from '../../action/auth';

const styles = (theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  formField: {
    paddingLeft: "15px",
    paddingRight: "15px",
    paddingTop: "10px",
    paddingBottom: "10px"
  }
});

class Group extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      "list": [],
      "pagination": [],
      "cur_page": 1,
      "is_list_loading": true,
      "is_group_signup_processing": false,
      "new_signup_group_id": "",
      "new_signup_code": "",
      "group_create_new_name": "",
      "is_group_creation_processing": false
    };
  }

  componentDidMount() {
    this.getGroupList(this.state.cur_page);
  }

  getGroupList(page) {
    this.setState({
      "is_list_loading": true
    });

    const url = this.props.api_url + "/v1/group?page=" + (page).toString();
    const headers = {
      "Authorization": "Bearer " + this.props.jwt
    };

    axios.get(url, {
      "headers": headers
    })
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

  handleGetGroupListClick = (page_num) => {
    this.setState({
      "cur_page": page_num
    });

    this.getGroupList(page_num);
  };

  handleGroupSelectClick = (data) => {
    this.props.selectGroup(data.group_id, data.role, data.signup_code);
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

  displayGroupPermission(role) {
    switch(role) {
      case 0:
        return "일반 멤버";

      case 1:
        return "중간 관리자";

      case 2:
        return "최고 관리자";

      default:
        return "알 수 없음";
    }
  }

  decorateSelectedGroupRow(group_id) {
    if(group_id === this.props.group_id) {
      return 'rgba(0, 0, 0, 0.075)';
    }
    else {
      return 'rgba(0, 0, 0, 0)';
    }
  }

  handleChangeGroupId = (e) => {
    this.setState({
      "new_signup_group_id": e.target.value
    });
  };

  handleChangeCode = (e) => {
    this.setState({
      "new_signup_code": e.target.value
    });
  };

  handleSubmitSignupToGroup = (e) => {
    e.preventDefault();

    const url = this.props.api_url + "/v1/member";
    const headers = {
      "Authorization": "Bearer " + this.props.jwt
    };

    this.setState({
      "is_group_signup_processing": true
    });

    axios.post(url, {
      "group_id": this.state.new_signup_group_id,
      "code": this.state.new_signup_code
    }, {"headers": headers}).then((response) => {
      alert("그룹에 가입되었습니다.");
      this.setState({
        "is_group_signup_processing": false,
        "new_signup_group_id": "",
        "new_signup_code": ""
      });
      this.getGroupList(this.state.cur_page);
    }).catch((error) => {
      alert(error.response.data.message);
      this.setState({
        "is_group_signup_processing": false
      });
    });
  };

  handleChangeNewGroupName = (e) => {
    this.setState({
      "group_create_new_name": e.target.value
    });
  };

  handleSubmitNewGroup = (e) => {
    e.preventDefault();

    this.setState({
      "is_group_creation_processing": true
    });

    const url = this.props.api_url + "/v1/group";
    const headers = {
      "Authorization": "Bearer " + this.props.jwt
    };
    const content = {
      "name": this.state.group_create_new_name
    };

    axios.post(url, content, {"headers": headers})
      .then((response) => {
        const alert_msg = "그룹 생성이 완료되었습니다.\n" +
          "Group Name : " + this.state.group_create_new_name + "\n" +
          "Group ID : " + (response.data.group_id).toString();

        alert(alert_msg);

        this.setState({
          "group_create_new_name": "",
          "is_group_creation_processing": false
        });

        this.getGroupList(this.state.cur_page);
      })
      .catch((error) => {
        alert(error.response.data.message);

        this.setState({
          "is_group_creation_processing": false
        });
      });
  };

  render() {
    const { classes } = this.props;

    /* 그룹 목록을 정의 */
    const group_list = this.state.list.map((rowItem) =>
      <ListItem
        button
        onClick={(e) => this.handleGroupSelectClick({"group_id": rowItem.id, "role": rowItem.role, "signup_code": rowItem.signup_code})}
        key={rowItem.id}
        style={{ backgroundColor: this.decorateSelectedGroupRow(rowItem.id) }}
      >
        <Avatar>
          {rowItem.id}
        </Avatar>
        <ListItemText primary={rowItem.name + " (" + this.displayGroupPermission(rowItem.role) + ")" } secondary={this.getDateString(rowItem.created_at)} />
      </ListItem>
    );

    return (
      <div>
        <Typography variant="headline" align="center">그룹 목록</Typography>

        <Paper className={classes.root}>
          <List>{group_list}</List>
        </Paper>

        <Paper className={classes.root}>
          <br/>
          <Typography variant="subheading" align="center">다른 그룹에 가입하기</Typography>

          <FormControl fullWidth className={classes.formField}>
            <TextField
              label="그룹 고유번호"
              value={this.state.new_signup_group_id}
              onChange={this.handleChangeGroupId}
              margin="none"
              type="number"
              placeholder="고유번호 입력"
              fullWidth
            />

            <br/>

            <TextField
              label="가입 인증코드"
              value={this.state.new_signup_code}
              onChange={this.handleChangeCode}
              margin="none"
              placeholder="인증코드 입력"
              fullWidth
            />

            <br/>

            <Button fullWidth color="primary" variant="contained" onClick={this.handleSubmitSignupToGroup}>가입하기</Button>
          </FormControl>
        </Paper>

        <Paper className={classes.root}>
          <br/>
          <Typography variant="subheading" align="center">새 그룹 생성</Typography>

          <FormControl fullWidth className={classes.formField}>
            <TextField
              label="새 그룹 이름"
              value={this.state.group_create_new_name}
              onChange={this.handleChangeNewGroupName}
              margin="none"
              placeholder="새 그룹 이름 입력"
              fullWidth
            />

            <br/>

            <Button fullWidth color="primary" variant="contained" onClick={this.handleSubmitNewGroup}>생성하기</Button>
          </FormControl>
        </Paper>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    "jwt": state.auth.jwt,
    "api_url": state.auth.api_url,
    "group_id": state.auth.group_id,
    "signup_code": state.auth.signup_code,
    "role": state.auth.role
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    "selectGroup": (group_id, role, signup_code) => {
      dispatch(selectGroup(group_id, role, signup_code));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Group));
