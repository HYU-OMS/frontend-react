import * as React from 'react';
import { Route, Switch, Redirect, Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import { CssBaseline } from 'material-ui';
import { withStyles } from 'material-ui/styles';
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Hidden
} from 'material-ui';
import GroupIcon from '@material-ui/icons/Group';
import HomeIcon from '@material-ui/icons/Home';
import GroupAdd from '@material-ui/icons/GroupAdd';
import MenuIcon from '@material-ui/icons/Menu';
import InputIcon from '@material-ui/icons/Input';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import TocIcon from '@material-ui/icons/Toc';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import DonutSmallIcon from '@material-ui/icons/DonutSmall';
import SettingsIcon from '@material-ui/icons/Settings';

import Home from './home/home';
import Group from './group/group';
import OrderRequest from './order/request';
import OrderList from './order/list';
import OrderVerify from './order/verify';
import Queue from './queue/queue';
import ManageMenu from './manage/menu';
import ManageSetmenu from './manage/setmenu';
import ManageGroupAndMember from './manage/group_and_member';
import Statistics from './statistics/statistics';

import authAction from '../action/index';
const { signIn, signOut } = authAction.auth;

const drawerWidth = 260;

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
  appBar: {
    position: 'fixed',
    marginLeft: drawerWidth,
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  navIconHide: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    [theme.breakpoints.up('md')]: {
      position: 'fixed',
    },
  },
  content: {
    [theme.breakpoints.up('md')]: {
      marginLeft: drawerWidth,
    },
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
  },
});

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      "mobileOpen": false,
      "is_in_process": false,
      "is_mobile_menu_expanded": true,
      "check_jwt_valid_interval": null,
      "remain_jwt_valid_time": null
    };

    this.handleDrawerToggle = this.handleDrawerToggle.bind(this);
    this.menuButtonDecoration = this.menuButtonDecoration.bind(this);
  }
  
  componentWillMount() {
    this.setState({
      "check_jwt_valid_interval": setInterval(this.chk_jwt_valid, 1000)
    });
  }
  
  componentWillUnmount() {
    clearInterval(this.state.check_jwt_valid_interval);
  }
  
  chk_jwt_valid = () => {
    if(this.props.jwt) {
      /* global atob */
      let jwt_content = this.props.jwt.split(".")[1];
      let decoded_content = JSON.parse(atob(jwt_content));
      let exp_unixtime = parseInt(decoded_content['exp'], 10);
      let cur_unixtime = Math.round((new Date()).getTime() / 1000);

      if(exp_unixtime - cur_unixtime < 0) {
        alert("로그인 유효 시간이 만료되었습니다.\n다시 로그인해주세요.");
        this.props.history.push("/main");
        this.props.signOut();
        this.setState({
          "remain_jwt_valid_time": null
        });
      }
    }
  };
  
  handleSignoutClick = (e) => {
    this.props.history.push("/main");
    this.props.signOut();
  };
  
  handleFacebookLogin = () => {
    window.FB.login((response) => {
      if(response.status === 'connected') {
        let url = this.props.api_url + "/api/user?type=facebook";

        this.setState({
          "is_in_process": true
        });

        axios.post(url, response.authResponse)
          .then((response) => {
          this.props.signIn(response.data.jwt);
          this.setState({
            "is_in_process": false
          });
          
          this.props.history.push("/main");
        }).catch((error) => {
          alert(error.response.data.message);
          this.setState({
            "is_in_process": false
          });
        });
      }
    });
  };
  
  handleKakaoLogin = () => {
    window.Kakao.Auth.login({
      success: (authObj) => {
        let access_token = authObj['access_token'];
        let url = this.props.api_url + "/api/user?type=kakao";

        this.setState({
          "is_in_process": true
        });

        axios.post(url, {
          "accessToken": access_token
        }).then((response) => {
          this.props.signIn(response.data.jwt);
          this.setState({
            "is_in_process": false
          });
          this.props.history.push("/main");
          // window.Kakao.Auth.logout();
        }).catch((error) => {
          alert(error.response.data.message);
          this.setState({
            "is_in_process": false
          });
        });
      },
      fail: (err) => {
        console.log(err);
      }
    });
  };

  handleDrawerToggle = () => {
    this.setState({
      mobileOpen: !this.state.mobileOpen
    });
  };
  
  menuButtonDecoration = (path) => {
    if(path === this.props.location.pathname) {
      return 'rgba(0, 0, 0, 0.05)';
    }
    else {
      return 'rgba(0, 0, 0, 0)';
    }
  };

  render() {
    const { classes, theme } = this.props;

    /* 상단바 정의 (별 내용 없음) */
    const appbar = (
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={this.handleDrawerToggle}
            className={classes.navIconHide}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="title" color="inherit" noWrap>
            HYU OMS
          </Typography>
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
            <ListItem onClick={this.handleDrawerToggle} style={{ backgroundColor: this.menuButtonDecoration("/main") }} button>
              <ListItemIcon><HomeIcon /></ListItemIcon>
              <ListItemText primary="홈" />
            </ListItem>
          </Link>
        </List>
        
        <Divider />
        
        {this.props.jwt !== null &&
          <div>
            <List>
              <Link to="/group" style={{ textDecoration: 'none' }}>
                <ListItem onClick={this.handleDrawerToggle} style={{ backgroundColor: this.menuButtonDecoration("/group") }} button>
                  <ListItemIcon><GroupIcon /></ListItemIcon>
                  <ListItemText primary="그룹" />
                </ListItem>
              </Link>
            </List>
            
            <Divider />
          </div>
        }
        
        {this.props.jwt !== null && this.props.group_id !== null &&
          <div>
            <List>
              <Link to="/order/request" style={{ textDecoration: 'none' }}>
                <ListItem onClick={this.handleDrawerToggle} style={{ backgroundColor: this.menuButtonDecoration("/order/request") }} button>
                  <ListItemIcon><PlaylistAddIcon /></ListItemIcon>
                  <ListItemText primary="주문 입력" />
                </ListItem>
              </Link>
              <Link to="/order/list" style={{ textDecoration: 'none' }}>
                <ListItem onClick={this.handleDrawerToggle} style={{ backgroundColor: this.menuButtonDecoration("/order/list") }} button>
                  <ListItemIcon><TocIcon /></ListItemIcon>
                  <ListItemText primary="주문 내역" />
                </ListItem>
              </Link>
              {this.props.role > 0 &&
                <Link to="/order/verify" style={{ textDecoration: 'none' }}>
                  <ListItem onClick={this.handleDrawerToggle} style={{ backgroundColor: this.menuButtonDecoration("/order/verify") }} button>
                    <ListItemIcon><PlaylistAddCheckIcon /></ListItemIcon>
                    <ListItemText primary="주문 처리" />
                  </ListItem>
                </Link>
              }
            </List>
            
            <Divider />
          </div>
        }
        
        {this.props.jwt !== null && this.props.group_id !== null &&
          <div>
            <List>
              <Link to="/queue" style={{ textDecoration: 'none' }}>
                <ListItem onClick={this.handleDrawerToggle} style={{ backgroundColor: this.menuButtonDecoration("/queue") }} button>
                  <ListItemIcon><FormatListNumberedIcon /></ListItemIcon>
                  <ListItemText primary="대기열" />
                </ListItem>
              </Link>
            </List>
            
            <Divider />
          </div>
        }
        
        {this.props.jwt !== null && this.props.group_id !== null &&
          <div>
            <List>
              <Link to="/statistics" style={{ textDecoration: 'none' }}>
                <ListItem onClick={this.handleDrawerToggle} style={{ backgroundColor: this.menuButtonDecoration("/statistics") }} button>
                  <ListItemIcon><DonutSmallIcon /></ListItemIcon>
                  <ListItemText primary="통계" />
                </ListItem>
              </Link>
            </List>
            
            <Divider />
          </div>
        }
        
        {this.props.jwt !== null && this.props.group_id !== null && this.props.role > 1 &&
          <div>
            <List>
              <Link to="/manage/menu" style={{ textDecoration: 'none' }}>
                <ListItem onClick={this.handleDrawerToggle} style={{ backgroundColor: this.menuButtonDecoration("/manage/menu") }} button>
                  <ListItemIcon><SettingsIcon /></ListItemIcon>
                  <ListItemText primary="메뉴 관리" />
                </ListItem>
              </Link>
              <Link to="/manage/setmenu" style={{ textDecoration: 'none' }}>
                <ListItem onClick={this.handleDrawerToggle} style={{ backgroundColor: this.menuButtonDecoration("/manage/setmenu") }} button>
                  <ListItemIcon><SettingsIcon /></ListItemIcon>
                  <ListItemText primary="세트메뉴 관리" />
                </ListItem>
              </Link>
              <Link to="/manage/member_and_group" style={{ textDecoration: 'none' }}>
                <ListItem onClick={this.handleDrawerToggle} style={{ backgroundColor: this.menuButtonDecoration("/manage/member_and_group") }} button>
                  <ListItemIcon><GroupAdd /></ListItemIcon>
                  <ListItemText primary="그룹/멤버 관리" />
                </ListItem>
              </Link>
            </List>
            
            <Divider />
          </div>
        }
        
        {this.props.jwt === null &&
          <List>
            <ListItem onClick={(e) => this.handleFacebookLogin()} button>
              <ListItemIcon><InputIcon /></ListItemIcon>
              <ListItemText primary="Facebook 로그인" />
            </ListItem>
            <ListItem onClick={(e) => this.handleKakaoLogin()} button>
              <ListItemIcon><InputIcon /></ListItemIcon>
              <ListItemText primary="Kakao 로그인" />
            </ListItem>
          </List>
        }
        
        {this.props.jwt !== null &&
          <List>
            <ListItem button>
              <ListItemIcon><PowerSettingsNewIcon /></ListItemIcon>
              <ListItemText onClick={this.handleSignoutClick} primary="로그아웃" />
            </ListItem>
          </List>
        }
        
        <Divider />
        
        <div className={classes.toolbar} />
        <div className={classes.toolbar} />
      </div>
    );
    
    /* Order 화면에 대한 Sub Route 를 정의 */
    const OrderRoute = ({ match }) => (
      <Switch>
        <Route path={match.url + "/request"} component={OrderRequest} />
        <Route path={match.url + "/list"} component={OrderList} />
        <Route path={match.url + "/verify"} component={OrderVerify} />
        <Redirect to="/main" />
      </Switch>
    );
    
    /* Manage 화면에 대한 Sub Route 를 정의 */
    const ManageRoute = ({ match }) => (
      <Switch>
        <Route path={match.url + "/menu"} component={ManageMenu} />
        <Route path={match.url + "/setmenu"} component={ManageSetmenu} />
        <Route path={match.url + "/member_and_group"} component={ManageGroupAndMember} />
        <Redirect to="/main" />
      </Switch>
    );
    
    /* Route로 변하는 부분을 정의 */
    const RouteView = (
      <Switch>
        <Route path="/main" component={Home} />
        <Route path="/group" component={Group} />
        <Route path="/order" component={OrderRoute} />
        <Route path="/queue" component={Queue} />
        <Route path="/statistics" component={Statistics} />
        <Route path="/manage" component={ManageRoute} />
        <Redirect to="/main" />
      </Switch>
    );

    return (
      <div className={classes.root}>
        <CssBaseline />
        
        {appbar}
        
        <Hidden mdUp>
          <Drawer
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={this.state.mobileOpen}
            onClose={this.handleDrawerToggle}
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
        
        <Hidden smDown implementation="css">
          <Drawer
            variant="permanent"
            open
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        
        <main className={classes.content}>
          <div className={classes.toolbar} />
          
          {RouteView}
          
          <br/>
          
          <Typography variant="caption" align="center">
            &copy; 2014 - 2018 한양대학교 한기훈
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
    "role": state.auth.role
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    "signIn": (jwt) => {
      dispatch(signIn(jwt));
    },
    "signOut": () => {
      dispatch(signOut());
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
)(withStyles(styles, { "withTheme": true })(App)));