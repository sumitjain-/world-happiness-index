import React, { useState, useEffect } from "react";
import * as d3 from "d3";

const defaultCountry = {
  "Country or region": "Norway",
  "Freedom to make life choices": 0.603,
  "GDP per capita": 1.488,
  Generosity: 0.271,
  "Healthy life expectancy": 1.028,
  "Overall rank": 3,
  "Perceptions of corruption": 0.341,
  Score: 7.554,
  "Social support": 1.582
};

function numericCellRendererFactory(countryData) {
  return ({ key: f, min, max }) => {
    let val = countryData[f];
    let renderer = p => p;
    if (isNaN(val)) {
      renderer = p => <>&mdash;</>;
    } else if (val % 1 > 0) {
      renderer = p => p.toFixed(2);
    }
    return (
      <tr>
        <td>{f}</td>
        <td>
          {`${renderer(val)} (min: ${renderer(min)} | max: ${renderer(max)})`}
        </td>
      </tr>
    );
  };
}

export function CountryView({ yearDataMap, year, loading }) {
  const [searchValue, setSearchValue] = useState("");
  const [countrySearchResults, setCountrySearchResults] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
  const [fieldTypes, setFieldTypes] = useState({ string: [], number: [] });

  useEffect(() => {
    try {
      const results = searchValue.length
        ? (yearDataMap[year].length ? yearDataMap[year] : [])
            .filter(
              x =>
                (x.Country || x["Country or region"])
                  .toLowerCase()
                  .indexOf(searchValue) >= 0
            )
            .slice(0, 10)
        : [];
      // console.log(results);
      setCountrySearchResults(results);
    } catch (e) {}
  }, [year, yearDataMap, searchValue]);

  useEffect(() => {
    if (Array.isArray(yearDataMap[year]) && yearDataMap[year].length) {
      const newFieldTypes = { string: [], number: [] };
      for (let key in yearDataMap[year][0]) {
        const type = typeof yearDataMap[year][0][key];
        if (type === "string") {
          newFieldTypes[type].push(key);
        } else if (type === "number") {
          const [min, max] = d3.extent(yearDataMap[year], d => d[key]);
          newFieldTypes[type].push({ key, min, max });
        }
      }
      setFieldTypes(newFieldTypes);
    }
  }, [yearDataMap, year]);

  function renderSearch() {
    return (
      <>
        <div className="row">
          <div className="col-12 form-inline mt-4">
            <input
              type="text"
              className="form-control mr-2"
              placeholder="Search country"
              style={{ width: 200 }}
              value={searchValue}
              disabled={loading}
              onChange={e => {
                setSearchValue(e.target.value);
              }}
              onFocus={() => {
                setSearchValue(searchValue);
              }}
            />
          </div>
        </div>
        <div
          className="row search-results my-2 mx-0 p-2 mw-100 d-flex flex-nowrap border border-dark rounded overflow-x-scroll position-absolute bg-white"
          style={{
            width: "100%",
            transition: "all 0.15s ease-out",
            opacity: countrySearchResults.length ? 1 : 0
          }}
        >
          {countrySearchResults.map(item => (
            <div
              className="d-inline p-2 mx-2 bg-light text-nowrap rounded cursor-pointer"
              key={item.Country}
              onClick={() => {
                setSearchValue("");
                console.log(item);
                setSelectedCountry(item);
              }}
            >
              {item.Country || item["Country or region"]}
            </div>
          ))}
        </div>
      </>
    );
  }

  function renderCountryDetails() {
    return (
      <>
        <h3 className="mt-4">
          {selectedCountry["Country"] || selectedCountry["Country or region"]}
        </h3>
        <table className="table table-bordered mt-4">
          <colgroup>
            <col style={{ width: "2%" }} />
            <col style={{ width: "3%", minWidth: "400px" }} />
          </colgroup>
          <tbody>
            {fieldTypes["string"].map(f => (
              <tr>
                <td>{f}</td>
                <td>{selectedCountry[f]}</td>
              </tr>
            ))}
            {fieldTypes["number"].map(
              numericCellRendererFactory(selectedCountry)
            )}
          </tbody>
        </table>
      </>
    );
  }

  return (
    <div className="position-relative">
      {renderSearch()}
      {selectedCountry && renderCountryDetails()}
    </div>
  );
}
