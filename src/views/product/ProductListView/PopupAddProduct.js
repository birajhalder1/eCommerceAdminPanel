import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  makeStyles
} from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles(theme => ({
  closeIcon: {
    fontSize: 20,
    borderRadius: "50%",
    height: "60px",
    width: "60px",
    
  }
}));

export default function PopupAddProduct(props) {
  const classes = useStyles();
  const { title, subTitle, children, openPopup, setOpenPopup } = props;
  return (
    <div>
      <Dialog
        fullWidth
        maxWidth = "md"
        open={openPopup}
      >
        <DialogTitle>
          <Box display="flex">
            <Typography
              variant="h2"
              color="textPrimary"
              component="div"
              style={{ flexGrow: 1 }}
            >
              {title}
            </Typography>
            <Button
              onClick={() => setOpenPopup(false)}
              className={classes.closeIcon}
            >
              X
            </Button>
          </Box>
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2">
              {subTitle}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box>{children}</Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}
