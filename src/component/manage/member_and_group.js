import * as React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import {
  Paper,
  Typography,
  Button,
  Table, TableBody, TableCell, TableHead, TableRow,
  Hidden,
  TextField,
  FormControl,
  Divider
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarHalfIcon from '@material-ui/icons/StarHalf';
import StarIcon from '@material-ui/icons/Star';
import TouchAppIcon from '@material-ui/icons/TouchApp';

import authAction from '../../action/index';
const { selectGroup } = authAction.auth;

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
  formField: {
    paddingLeft: "15px",
    paddingRight: "15px",
    paddingTop: "10px",
    paddingBottom: "10px"
  }
});

class ManageMemberAndGroup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      "new_signup_code": (this.props.signup_code ? this.props.signup_code : ""),
      "member_list": [],
      "is_list_loading": true,
      "is_on_update": false
    };
  }

  componentDidMount() {
    this.getMemberList();
  }

  getMemberList = () => {
    const url = this.props.api_url + "/v1/member?group_id=" + (this.props.group_id).toString();
    const headers = {
      "Authorization": "Bearer " + this.props.jwt
    };

    this.setState({
      "is_list_loading": true
    });

    axios.get(url, {"headers": headers})
      .then((response) => {
        this.setState({
          "member_list": response.data,
          "is_list_loading": false,
        });
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
  };

  handleChange = (e) => {
    this.setState({
      "new_signup_code": e.target.value
    });
  };

  handleOnSubmit = (e) => {
    e.preventDefault();

    const url = this.props.api_url + "/v1/group/" + (this.props.group_id).toString();
    const headers = {
      "Authorization": "Bearer " + this.props.jwt
    };

    this.setState({
      "is_on_update": true
    });

    axios.put(url, {
      "code": this.state.new_signup_code
    }, {"headers": headers}).then((response) => {
      this.props.selectGroup(this.props.group_id, this.props.role, this.state.new_signup_code);
      this.setState({
        "is_on_update": false
      });
    }).catch((error) => {
      alert(error.response.data.message);
      this.setState({
        "is_on_update": false
      });
    });
  };

  changeMemberRole = (member, role) => {
    if(parseInt(member.role, 10) !== role) {
      const url = this.props.api_url + "/v1/member";
      const headers = {
        "Authorization": "Bearer " + this.props.jwt
      };

      this.setState({
        "is_list_loading": true
      });

      axios.put(url, {
        "group_id": this.props.group_id,
        "user_id": member.id,
        "role": role
      }, {"headers": headers}).then((response) => {
        member.role = role;
        this.setState({
          "member_list": this.state.member_list,
          "is_list_loading": false
        });
      }).catch((error) => {
        alert(error.response.data.message);
        this.setState({
          "is_list_loading": false
        })
      });
    }
  };

  deleteMember = (member) => {
    if(window.confirm("이 멤버를 제거하시겠습니까?")) {
      const url = this.props.api_url + "/v1/member?group_id=" + (this.props.group_id).toString()
        + "&user_id=" + (member.id).toString();
      const headers = {
        "Authorization": "Bearer " + this.props.jwt
      };

      this.setState({
        "is_list_loading": true
      });

      axios.delete(url, {"headers": headers})
        .then((response) => {
          this.setState({
            "is_list_loading": false
          });
          this.getMemberList();
        })
        .catch((error) => {
          alert(error.response.data.message);
          this.setState({
            "is_list_loading": false
          })
        });
    }
  };

  disableGroup = () => {
    if(window.confirm("그룹을 삭제하면 다시 되돌릴 수 없습니다. 계속하시겠습니까?")) {
      const url = this.props.api_url + "/v1/group/" + (this.props.group_id).toString();
      const headers = {
        "Authorization": "Bearer " + this.props.jwt
      };

      axios.delete(url, {"headers": headers})
        .then((response) => {
          alert("그룹이 성공적으로 삭제되었습니다!");
          //browserHistory.push("/group");
          this.props.history.push("/group");
        })
        .catch((error) => {
          alert(error.response.data.message);
        });
    }
  };

  downloadOrderList = () => {
    const url = this.props.api_url + "/v1/download?jwt=" + this.props.jwt +
      "&group_id=" + this.props.group_id + "&type=orders";
    window.open(url);
  };

  render() {
    const { classes } = this.props;

    const member_list = this.state.member_list.map((member) =>
      <TableRow key={member.id}>
        <Hidden xsDown>
          <TableCell className={classes.tablecell}>{member.id}</TableCell>
        </Hidden>
        <TableCell className={classes.tablecell}>{member.name}</TableCell>
        <TableCell
          className={classes.tablecell}
          onClick={(e) => this.changeMemberRole(member, 0)}
          style={{
            backgroundColor: (parseInt(member.role, 10) === 0 ? 'rgba(0, 0, 0, 0.15)' : 'rgba(0, 0, 0, 0)')
          }}
        >
          <StarBorderIcon/>
        </TableCell>
        <TableCell
          className={classes.tablecell}
          onClick={(e) => this.changeMemberRole(member, 1)}
          style={{
            backgroundColor: (parseInt(member.role, 10) === 1 ? 'rgba(0, 0, 0, 0.15)' : 'rgba(0, 0, 0, 0)')
          }}
        >
          <StarHalfIcon/>
        </TableCell>
        <TableCell
          className={classes.tablecell}
          onClick={(e) => this.changeMemberRole(member, 2)}
          style={{
            backgroundColor: (parseInt(member.role, 10) === 2 ? 'rgba(0, 0, 0, 0.15)' : 'rgba(0, 0, 0, 0)')
          }}
        >
          <StarIcon/>
        </TableCell>
        <TableCell className={classes.tablecell} onClick={(e) => this.deleteMember(member)}><TouchAppIcon/></TableCell>
      </TableRow>
    );

    return (
      <React.Fragment>
        <Typography variant="headline" align="center">그룹/멤버 관리</Typography>

        <Paper className={classes.root}>
          <br/>
          <Typography variant="subheading" align="center">멤버 목록</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <Hidden xsDown>
                  <TableCell className={classes.tablecell}>#</TableCell>
                </Hidden>
                <TableCell className={classes.tablecell}>이름</TableCell>
                <TableCell className={classes.tablecell} colSpan="3">권한</TableCell>
                <TableCell className={classes.tablecell}>제거</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {member_list}
            </TableBody>
          </Table>
        </Paper>

        <Paper className={classes.root}>
          <br/>
          <Typography variant="subheading" align="center">그룹 가입 인증코드</Typography>

          <FormControl fullWidth className={classes.formField}>
            <TextField
              label="그룹 고유번호"
              value={this.props.group_id}
              margin="none"
              disabled
              fullWidth
            />

            <br/>

            <TextField
              label="인증코드 (최대길이 64)"
              value={this.state.new_signup_code}
              onChange={this.handleChange}
              margin="none"
              type="text"
              placeholder='인증코드 입력 (비울 경우 본 그룹 가입 중지)'
              fullWidth
            />

            <br/>

            <Button fullWidth color="primary" variant="contained" onClick={this.handleOnSubmit}>변경하기</Button>
          </FormControl>
        </Paper>

        <Paper className={classes.root}>
          <br/>
          <Typography variant="subheading" align="center">기타 관리 기능</Typography>

          <br/>

          <FormControl fullWidth className={classes.formField}>
            <Divider/>
            <Button fullWidth color="secondary" onClick={(e) => this.disableGroup()}>그룹 삭제</Button>
            <Divider/>
            <Button fullWidth color="primary" onClick={(e) => this.downloadOrderList()}>전체 주문 내역 다운로드</Button>
            <Divider/>
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
    "group_id": state.auth.group_id,
    "signup_code": state.auth.signup_code
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    "selectGroup": (group_id, role, signup_code) => {
      dispatch(selectGroup(group_id, role, signup_code));
    }
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ManageMemberAndGroup));
