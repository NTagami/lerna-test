import * as React from "react";
import { connect, DispatchProp } from "react-redux";

import { RootState, CommonState } from "./store";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { clearError } from "./action";
import { makeFCHelper } from "./CommonStyles";

type Props = CommonState & DispatchProp;

const ErrorDipsplay: React.FC<Props> = ({ dispatch, error }) => {
  const helper = makeFCHelper();
  return (
    <Dialog
      open={error != null}
      onClose={() => {
        dispatch(clearError());
      }}
    >
      <DialogTitle>Error</DialogTitle>
      <DialogContent>
        <DialogContentText>{error ?? ""}</DialogContentText>
      </DialogContent>
      <DialogActions>
        {helper.button("OK", () => {
          dispatch(clearError());
        })}
      </DialogActions>
    </Dialog>
  );
};

export default connect<CommonState, {}, {}, RootState>(st => st.common)(
  ErrorDipsplay
);
