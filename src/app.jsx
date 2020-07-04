import React, { useState, useEffect } from "react";
import axios from "axios";

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";
import { AggregateView } from "./aggregate-view";
import { CountryView } from "./country-view";

const yearOptions = [2015, 2016, 2017, 2018, 2019];

export default function App() {
  const [viewMode, setViewMode] = useState("aggregate"); // 'country' | 'aggregate'
  const [year, setYear] = useState(2015);
  const [loading, setLoading] = useState(false);

  const [yearDataMap, setYearData] = useState({});

  useEffect(() => {
    if (!yearDataMap[year]) {
      (async () => {
        setLoading(true);
        const response = await axios.get(`/${year}.json`);
        console.log(response);
        setYearData({
          ...yearDataMap,
          [year]: response.data
        });
        setLoading(false);
      })();
    }
    // reset form
  }, [year, yearDataMap]);

  return (
    <div className="container mt-4 position-relative">
      <h1>World Happiness Index</h1>
      <div className="row mt-4">
        <div className="col-12 col-md-6">
          <span>View</span>
          {["country", "aggregate"].map(k => (
            <div className="ml-3 form-check form-check-inline" key={k}>
              <input
                type="radio"
                name="view-mode"
                className="form-check-input"
                id={`view-${k}`}
                checked={viewMode === k}
                value={k}
                onChange={function(e) {
                  setViewMode(e.target.value);
                }}
              />
              <label className="form-check-label" htmlFor={`view-${k}`}>
                {k}
              </label>
            </div>
          ))}
        </div>
        <div className="col-12 col-md-6 form-inline">
          <select
            name=""
            id=""
            className="form-control"
            disabled={loading}
            value={year}
            onChange={function(e) {
              setYear(e.target.value.toLowerCase());
            }}
          >
            {yearOptions.map(y => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>
      {viewMode === "country" && yearDataMap[year] && !loading && (
        <CountryView yearDataMap={yearDataMap} year={year} loading={loading} />
      )}
      {viewMode === "aggregate" && yearDataMap[year] && !loading && (
        <AggregateView
          yearDataMap={yearDataMap}
          year={year}
          loading={loading}
        />
      )}
    </div>
  );
}
