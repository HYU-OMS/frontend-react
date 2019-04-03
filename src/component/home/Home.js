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
          <ul>
            <li>2019년도 한양대학교 봄 축제는 진행되지 않을 예정이라고 합니다.</li>
            <li>HYU-OMS 는 계속 서비스를 할 예정이지만 올해의 경우 별도의 서버 사양 업그레이드는 진행하지 않을 예정입니다. 이용에 참고하시기 바랍니다.</li>
          </ul>
        </Typography>

        <br/>

        <Typography component="p">
          더 나은 서비스를 위해 개편 중입니다.<br/>
          <strong>문의</strong>: <a href="mailto: kordreamfollower@gmail.com">kordreamfollower@gmail.com</a><br/>
          <strong>GitHub Repository</strong>: <a href="https://github.com/HYU-OMS">HYU-OMS Dev Group</a>
        </Typography>
      </div>
    );
  }
}

export default withStyles(styles, { "withTheme": true })(Home);