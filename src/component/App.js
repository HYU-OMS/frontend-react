import React from 'react';
import { Route, Switch, Redirect, Link, withRouter } from 'react-router-dom';
import {
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Divider,
  List, ListItem, ListItemIcon, ListItemText,
  Drawer,
  Hidden,
  Button, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  LinearProgress,
  Tooltip
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { connect } from 'react-redux';
import axios from 'axios';
import { withSnackbar } from 'notistack';
import io from 'socket.io-client';

import HomeIcon from '@material-ui/icons/Home';
import MenuIcon from '@material-ui/icons/Menu';
import GroupIcon from '@material-ui/icons/Group';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import TocIcon from '@material-ui/icons/Toc';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import DonutSmallIcon from '@material-ui/icons/DonutSmall';
import SettingsIcon from '@material-ui/icons/Settings';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import CloudIcon from '@material-ui/icons/Cloud';
import CloudOffIcon from '@material-ui/icons/CloudOff';
import ImportExportIcon from '@material-ui/icons/ImportExport';

import Home from './home/Home';
import Group from './group/group';
import OrderRequest from './order/request';
import OrderList from './order/list';
import OrderVerify from './order/verify';
import Queue from './queue/queue';
import Statistics from './statistics/statistics';
import ManageMenu from './manage/menu';
import ManageSetmenu from './manage/setmenu';
import ManageMemberAndGroup from './manage/member_and_group';

import { signIn, signOut } from '../action/auth';
import { orderUpdate, queueUpdate, menuUpdate, setmenuUpdate } from '../action/realtimesync';

const drawerWidth = 240;

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    height: '100%',
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%',
  },
  grow: {
    flexGrow: 1,
  },
  appBar: {
    position: 'fixed',
    zIndex: theme.zIndex.drawer + 1,
    boxShadow: '0px 0px 1px 0px rgba(0,0,0,0.2), 0px 0px 1px 0px rgba(0,0,0,0.14), 0px 0px 1px 0px rgba(0,0,0,0.12)',
    backgroundColor: '#fdfdfd',
    height: '56px'
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 10,
    color: '#aaaaaa'
  },
  toolbar: {
    height: '56px',
    minHeight: '56px'
  },
  drawerPaper: {
    width: drawerWidth,
    [theme.breakpoints.up('sm')]: {
      position: 'fixed',
    },
  },
  content: {
    [theme.breakpoints.up('sm')]: {
      marginLeft: drawerWidth,
    },
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    paddingBottom: theme.spacing.unit * 3
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  fbLoginButton: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit / 2,
    backgroundColor: '#3b5998',
    borderColor: '#3b5998',
    color: '#ffffff',
    textTransform: 'initial'
  },
  kakaoLoginButton: {
    marginTop: theme.spacing.unit / 2,
    marginBottom: theme.spacing.unit,
    borderColor: '#f9df33',
    backgroundColor: '#f9df33',
    textTransform: 'initial'
  }
});

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      is_signin_dialog_open: false,
      is_drawer_open: (window.innerWidth >= 600),
      is_signin_in_progress: false,
      socket_io: null,
      ws_connected: false,
      is_ws_disconnected_notify_dialog_open: false
    };
  }

  componentDidMount() {
    if(this.props.jwt !== null) {
      this.connectSocketIO();
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.jwt === null && nextProps.jwt !== null) {
      this.connectSocketIO();
    }
    else if (this.state.socket_io !== null && this.state.socket_io.connected === true &&
      this.props.jwt !== null && (this.props.group_id !== nextProps.group_id)) {
      this.state.socket_io.emit('select_group', {"group_id": nextProps.group_id});
    }
  }

  componentWillUnmount() {
    this.disconnectSocketIO();

    if(this.state.ws_disconnect_chk_timer !== null) {
      clearInterval(this.state.ws_disconnect_chk_timer);
      this.setState({
        "ws_disconnect_chk_timer": null
      });
    }
  }

  connectSocketIO = () => {
    const socket_io = io(this.props.api_url);

    socket_io.on('disconnect', () => {
      this.setState({
        "ws_connected": false,
        "is_ws_disconnected_notify_dialog_open": true
      })
    });

    socket_io.on('connect', () => {
      if(this.props.group_id !== null) {
        socket_io.emit('select_group', {"group_id": this.props.group_id});
      }

      this.setState({
        "socket_io": socket_io,
        "ws_connected": socket_io.connected,
        "is_ws_disconnected_notify_dialog_open": false
      });
    });

    socket_io.on('order_added', (data) => {
      const msg = "[새 주문] 번호: " + data.order_id.toString() +
        ", 테이블명: " + data.table_name +
        ", 총 가격: " + data.price.toString();

      this.handleNotiStackVariant('info')(msg);
      this.props.orderUpdate(new Date());
    });

    socket_io.on('order_verified', (data) => {
      if(data['is_approved'] === true) {
        const msg = "[주문 승인] 번호: " + data.order_id.toString();
        this.handleNotiStackVariant('success')(msg);
        this.props.queueUpdate(new Date());
      }
      else {
        const msg = "[주문 거절] 번호: " + data.order_id.toString();
        this.handleNotiStackVariant('error')(msg);
      }

      this.props.orderUpdate(new Date());
    });

    socket_io.on('menu_added', (data) => {
      const msg = "[메뉴 추가] 이름: " + data['name'] + ", 가격: " + data['price'].toString();
      this.handleNotiStackVariant('info')(msg);
      this.props.menuUpdate(new Date());
    });

    socket_io.on('menu_changed', (data) => {
      const msg = "[메뉴 상태 변경] 이름: " + data['name'] +
        ", 가격: " + data['price'].toString() +
        ", 주문가능상태: " + ((data['is_enabled'] === true) ? 'O' : 'X');

      if(data['is_enabled'] === true) {
        this.handleNotiStackVariant('success')(msg);
      }
      else {
        this.handleNotiStackVariant('error')(msg);
      }

      this.props.menuUpdate(new Date());
    });

    socket_io.on('setmenu_added', (data) => {
      const msg = "[세트메뉴 추가] 이름: " + data['name'] + ", 가격: " + data['price'].toString();
      this.handleNotiStackVariant('info')(msg);
      this.props.setmenuUpdate(new Date());
    });

    socket_io.on('setmenu_changed', (data) => {
      const msg = "[세트메뉴 상태 변경] 이름: " + data['name'] +
        ", 가격: " + data['price'].toString() +
        ", 주문가능상태: " + ((data['is_enabled'] === true) ? 'O' : 'X');

      if(data['is_enabled'] === true) {
        this.handleNotiStackVariant('success')(msg);
      }
      else {
        this.handleNotiStackVariant('error')(msg);
      }

      this.props.setmenuUpdate(new Date());
    });

    socket_io.on('queue_removed', (data) => {
      const msg = "[대기열 제거] 주문번호: " + data.order_id.toString() +
        ", 테이블명: " + data.table_name +
        ", 메뉴명: " + data.menu_name;
      this.handleNotiStackVariant('default')(msg);
      this.props.queueUpdate(new Date());
    });
  };

  disconnectSocketIO = () => {
    if(this.state.socket_io !== null) {
      this.state.socket_io.close();
      this.setState({
        "socket_io": null,
        "ws_connected": false
      });
    }
  };

  handleNotiStackVariant = (variant) => (msg) => {
    this.props.enqueueSnackbar(msg, { variant });
  };

  handleSigninButtonClick = () => {
    this.setState({
      is_signin_dialog_open: true
    });
  };

  handleSigninDialogClose = () => {
    this.setState({
      "is_signin_dialog_open": false
    });
  };

  handleWsDisconnectednotifyDialogClose = () => {
    this.setState({
      "is_ws_disconnected_notify_dialog_open": false
    });
  };

  handleDrawerButtonClick = () => {
    this.setState({
      is_drawer_open: !this.state.is_drawer_open
    });
  };

  menulistDecoration = (path) => {
    if(path === this.props.location.pathname) {
      return 'rgba(0, 0, 0, 0.05)';
    }
    else {
      return 'rgba(0, 0, 0, 0)';
    }
  };

  handleSignoutClick = (e) => {
    this.props.history.push("/main");
    this.props.signOut();
    this.disconnectSocketIO();
  };

  handleFacebookLogin = () => {
    window.FB.login((response) => {
      if(response.status === 'connected') {
        const access_token = response['authResponse']['accessToken'];

        this.setState({
          "is_signin_in_progress": true
        });

        const url = this.props.api_url + "/v1/user";
        const content = {
          "type": "facebook",
          "access_token": access_token
        };

        axios.post(url, content)
          .then((response) => {
            this.props.signIn(response.data.jwt);
            this.setState({
              "is_signin_in_progress": false,
              "is_signin_dialog_open": false
            });

            this.props.history.push("/group");
          })
          .catch((error) => {
            alert(error.response.data.message);
            this.setState({
              "is_signin_in_progress": false
            });
          });
      }
    });
  };

  handleKakaoLogin = () => {
    window.Kakao.Auth.login({
      success: (authObj) => {
        const access_token = authObj['access_token'];

        this.setState({
          "is_signin_in_progress": true
        });

        const url = this.props.api_url + "/v1/user";
        const content = {
          "type": "kakao",
          "access_token": access_token
        };

        axios.post(url, content)
          .then((response) => {
            this.props.signIn(response.data.jwt);
            this.setState({
              "is_signin_in_progress": false,
              "is_signin_dialog_open": false
            });

            this.props.history.push("/group");
          })
          .catch((error) => {
            alert(error.response.data.message);
            this.setState({
              "is_signin_in_progress": false
            });
          });
      },
      fail: (err) => {
        console.log(err);
      }
    });
  };

  render() {
    const { classes, theme } = this.props;

    /* 상단바 */
    const appbar = (
      <AppBar className={classes.appBar} color="default">
        <Toolbar className={classes.toolbar}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            className={classes.menuButton}
            onClick={this.handleDrawerButtonClick}
          >
            <MenuIcon />
          </IconButton>

          <Typography className={classes.grow} variant="title" color="inherit" noWrap>
            HYU-OMS
          </Typography>

          {this.state.ws_connected === true &&
            <React.Fragment>
              {this.props.group_id !== null &&
                <Tooltip title="실시간 업데이트 활성화">
                  <IconButton>
                    <ImportExportIcon />
                  </IconButton>
                </Tooltip>
              }
              <Tooltip title="실시간 동기화 서버 연결됨">
                <IconButton>
                  <CloudIcon />
                </IconButton>
              </Tooltip>
            </React.Fragment>
          }

          {this.state.ws_connected === false &&
            <Tooltip title="실시간 동기화 서버 연결 끊김">
              <IconButton>
                <CloudOffIcon />
              </IconButton>
            </Tooltip>
          }

          {this.props.jwt === null &&
            <Button onClick={this.handleSigninButtonClick} color="inherit">로그인</Button>
          }

          {this.props.jwt !== null &&
            <Button onClick={this.handleSignoutClick} color="inherit">로그아웃</Button>
          }
        </Toolbar>
      </AppBar>
    );

    /* 메뉴 바 정의 */
    const drawer = (
      <div>
        <div className={classes.toolbar} />

        <Divider />

        <List>
          <Link to="/main" style={{ textDecoration: 'none' }}>
            <ListItem style={{ backgroundColor: this.menulistDecoration("/main") }} button>
              <ListItemIcon><HomeIcon /></ListItemIcon>
              <ListItemText primary="홈" />
            </ListItem>
          </Link>
        </List>

        <Divider />

        {this.props.jwt !== null &&
          <React.Fragment>
            <List>
              <Link to="/group" style={{ textDecoration: 'none' }}>
                <ListItem style={{ backgroundColor: this.menulistDecoration("/group") }} button>
                  <ListItemIcon><GroupIcon /></ListItemIcon>
                  <ListItemText primary="그룹" />
                </ListItem>
              </Link>
            </List>

            <Divider />
          </React.Fragment>
        }

        {this.props.jwt !== null && this.props.group_id !== null &&
          <React.Fragment>
            <List>
              <Link to="/order/request" style={{ textDecoration: 'none' }}>
                <ListItem style={{ backgroundColor: this.menulistDecoration("/order/request") }} button>
                  <ListItemIcon><PlaylistAddIcon /></ListItemIcon>
                  <ListItemText primary="주문 입력" />
                </ListItem>
              </Link>
              <Link to="/order/list" style={{ textDecoration: 'none' }}>
                <ListItem style={{ backgroundColor: this.menulistDecoration("/order/list") }} button>
                  <ListItemIcon><TocIcon /></ListItemIcon>
                  <ListItemText primary="주문 내역" />
                </ListItem>
              </Link>
              {this.props.role > 0 &&
              <Link to="/order/verify" style={{ textDecoration: 'none' }}>
                <ListItem style={{ backgroundColor: this.menulistDecoration("/order/verify") }} button>
                  <ListItemIcon><PlaylistAddCheckIcon /></ListItemIcon>
                  <ListItemText primary="대기중인 주문" />
                </ListItem>
              </Link>
              }
            </List>

            <Divider />
          </React.Fragment>
        }

        {this.props.jwt !== null && this.props.group_id !== null &&
          <React.Fragment>
            <List>
              <Link to="/queue" style={{ textDecoration: 'none' }}>
                <ListItem style={{ backgroundColor: this.menulistDecoration("/queue") }} button>
                  <ListItemIcon><FormatListNumberedIcon /></ListItemIcon>
                  <ListItemText primary="메뉴별 대기열" />
                </ListItem>
              </Link>
            </List>

            <Divider />
          </React.Fragment>
        }

        {this.props.jwt !== null && this.props.group_id !== null &&
          <React.Fragment>
            <List>
              <Link to="/statistics" style={{ textDecoration: 'none' }}>
                <ListItem style={{ backgroundColor: this.menulistDecoration("/statistics") }} button>
                  <ListItemIcon><DonutSmallIcon /></ListItemIcon>
                  <ListItemText primary="통계" />
                </ListItem>
              </Link>
            </List>

            <Divider />
          </React.Fragment>
        }

        {this.props.jwt !== null && this.props.group_id !== null && this.props.role > 1 &&
          <React.Fragment>
            <List>
              <Link to="/manage/menu" style={{ textDecoration: 'none' }}>
                <ListItem style={{ backgroundColor: this.menulistDecoration("/manage/menu") }} button>
                  <ListItemIcon><SettingsIcon /></ListItemIcon>
                  <ListItemText primary="메뉴 관리" />
                </ListItem>
              </Link>
              <Link to="/manage/setmenu" style={{ textDecoration: 'none' }}>
                <ListItem style={{ backgroundColor: this.menulistDecoration("/manage/setmenu") }} button>
                  <ListItemIcon><SettingsApplicationsIcon /></ListItemIcon>
                  <ListItemText primary="세트메뉴 관리" />
                </ListItem>
              </Link>
              <Link to="/manage/member_and_group" style={{ textDecoration: 'none' }}>
                <ListItem style={{ backgroundColor: this.menulistDecoration("/manage/member_and_group") }} button>
                  <ListItemIcon><PeopleOutlineIcon /></ListItemIcon>
                  <ListItemText primary="그룹, 멤버 관리" />
                </ListItem>
              </Link>
            </List>

            <Divider />
          </React.Fragment>
        }

      </div>
    );

    /* Route로 변하는 부분을 정의 */
    const RouteView = (
      <Switch>
        <Route path="/main" component={Home} />
        <Route path="/group" component={Group} />

        <Route path="/order/request" component={OrderRequest} />
        <Route path="/order/list" component={OrderList} />
        <Route path="/order/verify" component={OrderVerify} />

        <Route path="/queue" component={Queue} />
        <Route path="/statistics" component={Statistics} />

        <Route path="/manage/menu" component={ManageMenu} />
        <Route path="/manage/setmenu" component={ManageSetmenu} />
        <Route path="/manage/member_and_group" component={ManageMemberAndGroup} />

        <Redirect to="/main" />
      </Switch>
    );

    /* 로그인 Dialog */
    const signinDialog = (
      <Dialog open={this.state.is_signin_dialog_open} onClose={this.handleSigninDialogClose} aria-labelledby="signin-dialog">
        <DialogTitle style={{textAlign: 'center'}}>로그인 방법</DialogTitle>

        <DialogContent>
          <Button
            className={classes.fbLoginButton}
            onClick={this.handleFacebookLogin}
            color="default" variant="outlined" size="large"
            fullWidth
          >
            Facebook
          </Button>
          <Button
            className={classes.kakaoLoginButton}
            onClick={this.handleKakaoLogin}
            color="default" variant="outlined" size="large"
            fullWidth>
            Kakao
          </Button>
        </DialogContent>
      </Dialog>
    );

    /* Socket.IO disconnected 안내 dialog */
    const wsDisconnectedNotifyDialog = (
      <Dialog
        open={this.props.jwt !== null && this.state.is_ws_disconnected_notify_dialog_open === true}
        onClose={this.handleWsDisconnectednotifyDialogClose}
        aria-labelledby="ws-disconnected-notify-dialog"
      >
        <DialogTitle style={{textAlign: 'center'}}>실시간 동기화 서버 연결 끊김</DialogTitle>

        <DialogContent>
          <p>현재 재접속 시도 중이며 실시간 업데이트 외의 다른 기능은 그대로 사용 가능합니다.</p>
          <LinearProgress />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleWsDisconnectednotifyDialogClose} color="primary">
            닫기
          </Button>
        </DialogActions>
      </Dialog>
    );

    return (
      <div className={classes.root}>
        <CssBaseline />

        {appbar}

        <Hidden xsDown implementation="css">
          <Drawer
            variant="persistent"
            open={this.state.is_drawer_open}
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>

        <Hidden smUp>
          <Drawer
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={this.state.is_drawer_open}
            onClose={this.handleDrawerButtonClick}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>

        {signinDialog}
        {wsDisconnectedNotifyDialog}

        <main className={classNames(classes.content, {
          [classes.contentShift]: !this.state.is_drawer_open,
        })}>
          <div className={classes.toolbar} />

          {RouteView}

          <br/>

          <Typography variant="caption" align="center">
            &copy; 2014 - 2019 한양대학교 한기훈
          </Typography>
        </main>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    "jwt": state.auth.jwt,
    "api_url": state.auth.api_url,
    "group_id": state.auth.group_id,
    "role": state.auth.role,
    "order_updated_date": state.realtimesync.order_updated_date,
    "queue_updated_date": state.realtimesync.queue_updated_date,
    "menu_updated_date": state.realtimesync.menu_updated_date,
    "setmenu_updated_date": state.realtimesync.setmenu_updated_date,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    "signIn": (jwt) => {
      dispatch(signIn(jwt));
    },
    "signOut": () => {
      dispatch(signOut());
    },
    "orderUpdate": (date) => {
      dispatch(orderUpdate(date));
    },
    "queueUpdate": (date) => {
      dispatch(queueUpdate(date));
    },
    "menuUpdate": (date) => {
      dispatch(menuUpdate(date));
    },
    "setmenuUpdate": (date) => {
      dispatch(setmenuUpdate(date));
    }
  };
};

/* Router Update가 되지 않는 문제를 해결하기 위해 withRouter 를 사용함.
 * 이 방법은 최적이 아니라고 하며 다른 방법으로 최적화를 하는 것이 좋음.
 * https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/guides/blocked-updates.md
 */
export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles, { "withTheme": true })(withSnackbar(App))));