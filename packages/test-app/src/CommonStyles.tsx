/** @jsx jsx */
import * as React from "react";

import { jsx, css } from "@emotion/core";
//import css from "@emotion/css/macro";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

export const vertical = css`
  display: flex;
  flex-direction: column;
`;

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1)
  }
}));

function makeButton(classes: any, message: string, onClick: () => void) {
  return (
    <Button
      className={classes.button}
      onClick={onClick}
      variant="contained"
      color="primary"
    >
      {message}
    </Button>
  );
}

export function useButtonHelper() {
  const classes = useStyles();

  const button = React.useCallback(
    (message: string, onClick: () => void) =>
      makeButton(classes, message, onClick),
    [classes]
  );
  return button;
}
