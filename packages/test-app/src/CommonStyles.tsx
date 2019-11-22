/** @jsx jsx */
import * as React from "react";

import { css, jsx } from "@emotion/core";
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

class FCHelper {
  private classes = useStyles();

  public button = (message: string, onClick: () => void) => {
    return makeButton(this.classes, message, onClick);
  };

  public staticButton = (message: string, onClick: () => void) => {
    return React.useMemo(() => makeButton(this.classes, message, onClick), []);
  };
}

// React.FC の中で使用可
export function makeFCHelper() {
  return new FCHelper();
}
