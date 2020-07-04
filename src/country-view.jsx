import React, { useState, useEffect } from "react";

export function CountryView({ yearDataMap, year, loading }) {
  const [searchValue, setSearchValue] = useState("");
  const [countrySearchResults, setCountrySearchResults] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

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

  return (
    <div className="position-relative">
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
              setSelectedCountry(item);
            }}
          >
            {item.Country || item["Country or region"]}
          </div>
        ))}
      </div>
      {selectedCountry && (
        <>
          <h3 className="mt-4">{selectedCountry.Country}</h3>
          <table className="table table-bordered">
            <tbody>
              {Object.keys(selectedCountry).map(f => {
                let val = selectedCountry[f];
                if (typeof val === "string") {
                } else if (isNaN(val)) {
                  val = <>&mdash;</>;
                } else if (val % 1 > 0) {
                  val = val.toFixed(2);
                }
                return (
                  <tr>
                    <td>{f}</td>
                    <td>{val}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
