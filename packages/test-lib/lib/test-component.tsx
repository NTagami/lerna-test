import * as React from "react";

export const TestComponent: React.FC<{ message: string }> = ({ message }) => {
  return <div>{message}</div>;
};
