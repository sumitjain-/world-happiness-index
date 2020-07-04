import React, { useState, useEffect } from "react";

function parseGroupingOptions(arr = []) {
  const result = arr.reduce((outp, item) => {
    Object.keys(item).forEach(groupKey => {
      if (typeof item[groupKey] === "string" && !outp.has(groupKey)) {
        if (item[groupKey] !== "N/A") {
          outp.add(groupKey);
        }
        // console.log(groupKey);
        // console.log(item);
      }
    });
    return outp;
  }, new Set());

  return [...result];
}

function parseAggregateOptions(arr = []) {
  const result = arr.reduce((outp, item) => {
    Object.keys(item).forEach(groupKey => {
      if (typeof item[groupKey] === "number" && !outp.has(groupKey)) {
        outp.add(groupKey);
      }
    });
    return outp;
  }, new Set());

  return [...result];
}

export function AggregateView({ yearDataMap, year }) {
  const [groupBy, setGroupBy] = useState("");
  const [groupingOptions, setGroupingOptions] = useState([]);
  const [aggregateOptions, setAggregateOptions] = useState([]);
  const [groupedData, setGroupedData] = useState({});

  useEffect(() => {
    const newGroupingOptions = parseGroupingOptions(yearDataMap[year]);
    const newAggregateOptions = parseAggregateOptions(yearDataMap[year]);

    setGroupingOptions(newGroupingOptions);
    setAggregateOptions(newAggregateOptions);
  }, [yearDataMap, year]);

  useEffect(() => {
    const result = (yearDataMap[year] || []).reduce((outp, item) => {
      if (!outp[item[groupBy]]) {
        outp[item[groupBy]] = {
          countries: [],
          aggregate: aggregateOptions.reduce((outp, curr) => {
            outp[curr] = 0;
            return outp;
          }, {})
        };
      }
      outp[item[groupBy]].countries.push(item);
      aggregateOptions.forEach(opt => {
        outp[item[groupBy]].aggregate[opt] =
          (outp[item[groupBy]].aggregate[opt] *
            (outp[item[groupBy]].countries.length - 1) +
            item[opt]) /
          outp[item[groupBy]].countries.length;
      });

      return outp;
    }, {});
    setGroupedData(result);
  }, [yearDataMap, year, groupBy, aggregateOptions]);

  useEffect(() => {
    if (groupingOptions.length) {
      setGroupBy(groupingOptions[0]);
    }
  }, [groupingOptions]);

  function renderSelect() {
    return (
      <div className="d-inline-flex align-items-center justify-content-start">
        <select
          value={groupBy}
          className="form-control"
          onChange={e => {
            setGroupBy(e.target.value);
          }}
        >
          {groupingOptions.map(opt => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <h3 className="ml-2 mb-0 align-middle">Data</h3>
      </div>
    );
  }

  function renderTable() {
    const rowKeys = Object.keys(groupedData);

    let showNumCountries = false;

    for (let key of rowKeys) {
      if (groupedData[key].countries.length > 1) {
        showNumCountries = true;
        break;
      }
    }

    return (
      <div className="row">
        <div className="col-12 mw-100 overflow-x-scroll">
          <table className="table mt-4 mw-100 overflow-x-scroll table-bordered">
            <thead>
              {showNumCountries && (
                <tr>
                  <th colSpan="2" className="text-center">
                    {groupBy}
                  </th>
                  <th colSpan={aggregateOptions.length} className="text-center">
                    Averages
                  </th>
                </tr>
              )}
              <tr>
                <th className="align-middle">{groupBy}</th>
                {showNumCountries && (
                  <th className="align-middle">Number of Countries</th>
                )}
                {aggregateOptions.map(opt => (
                  <th className="align-middle" key={opt}>
                    {opt}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rowKeys.map(regionName => (
                <tr
                  key={regionName}
                  title={groupedData[regionName].countries
                    .map(row => row.Country || row["Country or region"])
                    .join(", ")}
                >
                  <td>{regionName}</td>
                  {showNumCountries && (
                    <td>{groupedData[regionName].countries.length}</td>
                  )}
                  {aggregateOptions.map(opt => (
                    <td key={opt}>
                      {groupedData[regionName].aggregate[opt] % 1
                        ? groupedData[regionName].aggregate[opt].toFixed(2)
                        : groupedData[regionName].aggregate[opt]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div>
      {groupingOptions.length && renderSelect()}
      {!!groupBy && renderTable()}
    </div>
  );
}
