import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const styles = (theme) => ({

});

class Statistics extends React.Component {
  render() {
    return (
      <div>
        <Typography component="p">이 기능은 현재 이용하실 수 없습니다.</Typography>
        <Typography component="p">This feature is not available now.</Typography>
      </div>
    );
  }
}

export default withStyles(styles)(Statistics);