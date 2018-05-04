import * as React from 'react';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';

const styles = (theme) => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit * 3,
  }),
});

class Home extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <div>
        <Paper className={classes.root} elevation={4}>
          <Typography variant="headline" component="h3">
            HYU OMS
          </Typography>
          <Typography component="p">
            개선해야 될 점 등의 의견을 남겨주세요!<br/>
            여러분의 의견은 더 나은 시스템을 만드는 데 도움이 됩니다.
          </Typography>
        </Paper>
        
        <Paper className={classes.root} elevation={4}>
          <div id="disqus_thread" />
          {(function() { // DON'T EDIT BELOW THIS LINE
          const d = document, s = d.createElement('script');
          s.src = 'https://2017-hyu-oms.disqus.com/embed.js';
          s.setAttribute('data-timestamp', +new Date());
          (d.head || d.body).appendChild(s);
          })()}
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(Home);