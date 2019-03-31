import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const styles = (theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  }
});

class Home extends React.Component {
  render() {
    return (
      <div>
        <Typography component="h4" variant="h6">
          HYU-OMS (한양대학교 주문관리시스템)
        </Typography>

        <br/>

        <Typography component="p">
          더 나은 서비스를 위해 개편 중입니다.<br/>
          <strong>문의</strong>: <a href="mailto: kordreamfollower@gmail.com">kordreamfollower@gmail.com</a>
        </Typography>
      </div>
    );
  }
}

export default withStyles(styles, { "withTheme": true })(Home);