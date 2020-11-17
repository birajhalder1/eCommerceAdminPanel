import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgressWithLabel from '@material-ui/core/LinearProgress';
const useStyles = makeStyles(theme => ({
  root: {
    width: '100%'
  },
  progressBarStyle: {
    //backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    borderRadius: 5,
    height: 10,
    backgroundColor: '#1a90ff'
  }
}));

function ProgressBar() {
  const classes = useStyles();
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prevProgress =>
        prevProgress >= 100 ? 10 : prevProgress + 10
      );
    }, 800);
    return () => {
      clearInterval(timer);
    };
  }, []);
  return (
    <div className={classes.root}>
      <LinearProgressWithLabel
        className={classes.progressBarStyle}
        value={progress}
      />
    </div>
  );
}

export default ProgressBar;
