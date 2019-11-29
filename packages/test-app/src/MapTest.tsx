import * as React from "react";
import { DispatchProp } from "react-redux";

import { useButtonHelper } from "./CommonStyles";
import { push } from "connected-react-router";
import GoogleMapReact from "google-map-react";
/*
interface MapPos {
  center: { lat: number; lng: number };
  zoom: number;
}
*/
type Props = DispatchProp;

export const MapTest: React.FC<Props> = ({ dispatch }) => {
  const button = useButtonHelper();
  const API_KEY: string = process.env.REACT_APP_GOOGLE_MAP_API_KEY ?? "";
  return (
    <div>
      <div style={{ height: "500px", width: "500px" }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: API_KEY }}
          defaultCenter={{ lat: 59.95, lng: 30.33 }}
          defaultZoom={11}
        ></GoogleMapReact>
      </div>

      <div>{button("Main", () => dispatch(push("/")))}</div>
    </div>
  );
};
