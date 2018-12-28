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
  Hidden
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles';

import HomeIcon from '@material-ui/icons/Home';

import Home from './home/Home';

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
    zIndex: theme.zIndex.drawer + 1
  },
  menuButton: {
    marginLeft: -18,
    marginRight: 10,
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
  }
});

class App extends React.Component {
  menuButtonDecoration = (path) => {
    if(path === this.props.location.pathname) {
      return 'rgba(0, 0, 0, 0.05)';
    }
    else {
      return 'rgba(0, 0, 0, 0)';
    }
  };

  render() {
    const { classes } = this.props;

    /* 상단바 */
    const appbar = (
      <AppBar className={classes.appBar}>
        <Toolbar>
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
            <ListItem style={{ backgroundColor: this.menuButtonDecoration("/main") }} button>
              <ListItemIcon><HomeIcon /></ListItemIcon>
              <ListItemText primary="홈" />
            </ListItem>
          </Link>
        </List>

        <Divider />

        <div className={classes.toolbar} />
        <div className={classes.toolbar} />
      </div>
    );

    /* Route로 변하는 부분을 정의 */
    const RouteView = (
      <Switch>
        <Route path="/main" component={Home} />
        <Redirect to="/main" />
      </Switch>
    );

    return (
      <div className={classes.root}>
        <CssBaseline />

        {appbar}

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
            &copy; 2014 - 2019 한양대학교 한기훈
          </Typography>
        </main>
      </div>
    );
  }
}

/* Router Update가 되지 않는 문제를 해결하기 위해 withRouter 를 사용함.
 * 이 방법은 최적이 아니라고 하며 다른 방법으로 최적화를 하는 것이 좋음.
 * https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/guides/blocked-updates.md
 */
export default withRouter(withStyles(styles, { withTheme: true })(App));