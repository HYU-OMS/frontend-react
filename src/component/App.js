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
import DraftsIcon from 'material-ui-icons/Drafts';
import StarIcon from 'material-ui-icons/Star';
import SendIcon from 'material-ui-icons/Send';
import MenuIcon from 'material-ui-icons/Menu';

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

    const drawer = (
      <div>
        <div className={classes.toolbar} />
        <Divider />
        <List>
          <ListItem button>
            <ListItemIcon><InboxIcon /></ListItemIcon>
            <ListItemText primary="Inbox" />
          </ListItem>
          <ListItem button>
            <ListItemIcon><InboxIcon /></ListItemIcon>
            <ListItemText primary="Inbox" />
          </ListItem>
          <ListItem button>
            <ListItemIcon><InboxIcon /></ListItemIcon>
            <ListItemText primary="Inbox" />
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
