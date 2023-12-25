import React, { useReducer } from "react";
import { SEARCH, SET_LOADING } from "../types";
import IpoContext from "./ipoContext";
import IpoReducer from "./ipoReducer";
import axios from "axios";
import XMLParser from "react-xml-parser";

const IpoState = (props) => {
  const initialState = { loading: false, ipoData: [] };

  const [state, dispatch] = useReducer(IpoReducer, initialState);

  // Search IPO Allotment
  const searchIpoAllotment = async (PAN) => {
    setLoading();
    let ipoDataTemp = [];
    let baseURL = "http://localhost:5000";
    if (process.env.NODE_ENV === "production") {
      baseURL = process.env.BASE_URL;
    }
    console.log("Using Env: " + process.env.NODE_ENV);
    try {
      const res = await axios.get(`${baseURL}/ipo`);
      // console.log(res.data);
      const ipos = res.data;
      for (let i = 0; i < ipos.length; i++) {
        const body = {
          clientid: ipos[i].company_id,
          PAN: PAN,
          key_word: "PAN",
        };
        const res = await axios.post(`${baseURL}/ipo`, body);
        const object = JSON.parse(res.data);
        // console.log("xml: " + i);
        // console.log(object.d);
        var xml = new XMLParser().parseFromString(object.d);
        try {
          if (xml.getElementsByTagName("id")[0] !== undefined) {
            var id = xml.getElementsByTagName("id")[0].value;
            var company = xml.getElementsByTagName("companyname")[0].value;
            var shares = xml.getElementsByTagName("SHARES")[0].value;
            var allotment = xml.getElementsByTagName("ALLOT")[0].value;

            ipoDataTemp.push({
              id,
              company,
              shares,
              allotment,
            });
          } else {
            ipoDataTemp.push({
              id: ipos[i].company_id,
              company: ipos[i].companyname,
              shares: "Not applied",
              allotment: "0",
            });
          }
        } catch (error) {
          console.log("Error in PAN Search: " + error);
        }
      } //for loop exit
      // console.log(ipoDataTemp);
    } catch (err) {
      console.log("Error in fetching IPOs: " + err);
    }

    dispatch({
      type: SEARCH,
      payload: ipoDataTemp,
    });
  };

  //set Loading/spinner
  const setLoading = () => {
    dispatch({
      type: SET_LOADING,
    });
  };

  return (
    <IpoContext.Provider
      value={{
        loading: state.loading,
        ipoData: state.ipoData,
        searchIpoAllotment,
        setLoading,
      }}
    >
      {props.children}
    </IpoContext.Provider>
  );
};

export default IpoState;
