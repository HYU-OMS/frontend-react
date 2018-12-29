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
  Dialog, DialogTitle, DialogContent, DialogContentText
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import HomeIcon from '@material-ui/icons/Home';
import MenuIcon from '@material-ui/icons/Menu';

import Home from './home/Home';

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
    padding: theme.spacing.unit * 3
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
      is_drawer_open: true
    };
  }

  handleSigninButtonClick = () => {
    this.setState({
      is_signin_dialog_open: true
    });
  };

  handleSigninDialogClose = () => {
    this.setState({
      is_signin_dialog_open: false
    });
  };

  handleMenuButtonClick = () => {
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

  render() {
    const { classes } = this.props;

    /* 상단바 */
    const appbar = (
      <AppBar className={classes.appBar} color="default">
        <Toolbar className={classes.toolbar}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            className={classes.menuButton}
            onClick={this.handleMenuButtonClick}
          >
            <MenuIcon />
          </IconButton>

          <Typography className={classes.grow} variant="title" color="inherit" noWrap>
            HYU-OMS
          </Typography>

          <Button onClick={this.handleSigninButtonClick} color="inherit">로그인</Button>
        </Toolbar>
      </AppBar>
    );

    /* 메뉴 바 정의 */
    const drawer = (
      <div>
        <div className={classes.toolbar} />

        <List>
          <Link to="/main" style={{ textDecoration: 'none' }}>
            <ListItem style={{ backgroundColor: this.menulistDecoration("/main") }} button>
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

    /* 로그인 Dialog */
    const signinDialog = (
      <Dialog open={this.state.is_signin_dialog_open} onClose={this.handleSigninDialogClose} aria-labelledby="signin-dialog">
        <DialogTitle style={{textAlign: 'center'}}>로그인 방법</DialogTitle>

        <DialogContent>
          <Button className={classes.fbLoginButton} color="default" variant="outlined" size="large" fullWidth>Facebook</Button>
          <Button className={classes.kakaoLoginButton} color="default" variant="outlined" size="large" fullWidth>Kakao</Button>
        </DialogContent>
      </Dialog>
    );

    /* 화면 크기 미지원 안내 Dialog */
    const displaySizeNotSupportedDialog = (
      <Dialog open aria-labelledby="mobile-page-redirection-alert">
        <DialogTitle>화면 크기 미지원 안내</DialogTitle>

        <Divider/>
        <br/>

        <DialogContent>
          <DialogContentText>
            현재 사용 중인 Web App 은 현재 화면 크기를 지원하지 않습니다.<br/>
            화면을 가로로 회전하여 계속 사용하시거나 아래 버튼을 통해 모바일 전용 Web App 을 사용하시기 바랍니다.
          </DialogContentText>
        </DialogContent>

        <Divider/>
        <br/>

        <DialogContent>
          <DialogContentText>
            <Button
              onClick={() => { alert("준비중입니다!"); }}
              color="primary"
              variant="contained"
              size="large"
              fullWidth
            >
              모바일 Web App 으로 이동
            </Button>
          </DialogContentText>
        </DialogContent>
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

        {signinDialog}

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

        <Hidden smUp>
          {displaySizeNotSupportedDialog}
        </Hidden>
      </div>
    );
  }
}

/* Router Update가 되지 않는 문제를 해결하기 위해 withRouter 를 사용함.
 * 이 방법은 최적이 아니라고 하며 다른 방법으로 최적화를 하는 것이 좋음.
 * https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/guides/blocked-updates.md
 */
export default withRouter(withStyles(styles, { withTheme: true })(App));