import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
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
import InboxIcon from 'material-ui-icons/MoveToInbox';
import GroupIcon from 'material-ui-icons/Group';
import HomeIcon from 'material-ui-icons/Home';
import GroupAdd from 'material-ui-icons/GroupAdd';
import MenuIcon from 'material-ui-icons/Menu';
import InputIcon from 'material-ui-icons/Input';
import PowerSettingsNewIcon from 'material-ui-icons/PowerSettingsNew';
import PlaylistAddIcon from 'material-ui-icons/PlaylistAdd';
import PlaylistAddCheckIcon from 'material-ui-icons/PlaylistAddCheck';
import TocIcon from 'material-ui-icons/Toc';
import FormatListNumberedIcon from 'material-ui-icons/FormatListNumbered';
import DonutSmallIcon from 'material-ui-icons/DonutSmall';
import SettingsIcon from 'material-ui-icons/Settings';

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
      mobileOpen: false,
    };

    this.handleDrawerToggle = this.handleDrawerToggle.bind(this);
  }

  handleDrawerToggle = () => {
    this.setState({
      mobileOpen: !this.state.mobileOpen
    });
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
          <ListItem button>
            <ListItemIcon><HomeIcon /></ListItemIcon>
            <ListItemText primary="홈" />
          </ListItem>
        </List>
        
        <Divider />
        
        <List>
          <ListItem button>
            <ListItemIcon><GroupIcon /></ListItemIcon>
            <ListItemText primary="그룹" />
          </ListItem>
        </List>
        
        <Divider />
        
        <List>
          <ListItem button>
            <ListItemIcon><PlaylistAddIcon /></ListItemIcon>
            <ListItemText primary="주문 입력" />
          </ListItem>
          <ListItem button>
            <ListItemIcon><TocIcon /></ListItemIcon>
            <ListItemText primary="주문 내역" />
          </ListItem>
          <ListItem button>
            <ListItemIcon><PlaylistAddCheckIcon /></ListItemIcon>
            <ListItemText primary="주문 처리" />
          </ListItem>
        </List>
        
        <Divider />
        
        <List>
          <ListItem button>
            <ListItemIcon><FormatListNumberedIcon /></ListItemIcon>
            <ListItemText primary="대기열" />
          </ListItem>
        </List>
        
        <Divider />
        
        <List>
          <ListItem button>
            <ListItemIcon><DonutSmallIcon /></ListItemIcon>
            <ListItemText primary="통계" />
          </ListItem>
        </List>
        
        <Divider />
        
        <List>
          <ListItem button>
            <ListItemIcon><SettingsIcon /></ListItemIcon>
            <ListItemText primary="메뉴 관리" />
          </ListItem>
          <ListItem button>
            <ListItemIcon><SettingsIcon /></ListItemIcon>
            <ListItemText primary="세트메뉴 관리" />
          </ListItem>
          <ListItem button>
            <ListItemIcon><GroupAdd /></ListItemIcon>
            <ListItemText primary="그룹/멤버 관리" />
          </ListItem>
        </List>
        
        <Divider />
        
        <List>
          <ListItem button>
            <ListItemIcon><InputIcon /></ListItemIcon>
            <ListItemText primary="Facebook 로그인" />
          </ListItem>
          <ListItem button>
            <ListItemIcon><InputIcon /></ListItemIcon>
            <ListItemText primary="Kakao 로그인" />
          </ListItem>
          <ListItem button>
            <ListItemIcon><PowerSettingsNewIcon /></ListItemIcon>
            <ListItemText primary="로그아웃" />
          </ListItem>
        </List>
        
        <Divider />
      </div>
    );
    
    /* Order 화면에 대한 Sub Route 를 정의 */
    const OrderRoute = ({ match }) => (
      <Switch>
        <Route path={match.url + "/request"} component={OrderRequest} />
        <Route path={match.url + "/list"} component={OrderList} />
        <Route path={match.url + "/verify"} component={OrderVerify} />
        <Redirect to="/home" />
      </Switch>
    );
    
    /* Manage 화면에 대한 Sub Route 를 정의 */
    const ManageRoute = ({ match }) => (
      <Switch>
        <Route path={match.url + "/menu"} component={ManageMenu} />
        <Route path={match.url + "/setmenu"} component={ManageSetmenu} />
        <Route path={match.url + "/member_and_group"} component={ManageGroupAndMember} />
        <Redirect to="/home" />
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
          <Switch>
            <Route path="/home" component={Home} />
            <Route path="/group" component={Group} />
            <Route path="/order" component={OrderRoute} />
            <Route path="/queue" component={Queue} />
            <Route path="/statistics" component={Statistics} />
            <Route path="/manage" component={ManageRoute} />
            <Redirect to="/home" />
          </Switch>
        </main>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(App);
