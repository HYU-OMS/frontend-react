import * as React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Paper, Typography } from 'material-ui';
import { withStyles } from 'material-ui/styles';

import List, { ListItem, ListItemText } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';

import authAction from '../../action/index';
const { selectGroup } = authAction.auth;

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
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
    const url = this.props.api_url + "/api/group?" + 
      "jwt=" + this.props.jwt + "&page=" + page.toString();
    
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
  
  handleOnSubmit = (e) => {
    e.preventDefault();

    const url = this.props.api_url + "/api/member?jwt=" + this.props.jwt;

    this.setState({
      "is_group_signup_processing": true
    });

    axios.post(url, {
      "group_id": this.state.new_signup_group_id,
      "signup_code": this.state.new_signup_code
    }).then((response) => {
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

    const url = this.props.api_url + "/api/group?jwt=" + this.props.jwt;
    axios.post(url, {
      "name": this.state.group_create_new_name
    }).then((response) => {
      const alert_msg = "그룹 생성이 완료되었습니다.\n" +
        "Group Name : " + this.state.group_create_new_name + "\n" +
        "Group ID : " + (response.data.group_id).toString();

      alert(alert_msg);

      this.setState({
        "group_create_new_name": "",
        "is_group_creation_processing": false
      });

      this.getGroupList(this.state.cur_page);
    }).catch((error) => {
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