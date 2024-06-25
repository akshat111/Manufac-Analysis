// src/components/DataAnalysis.js
import React, { useEffect, useState } from "react";

const Table = () => {
  const [data, setData] = useState([]);
  const [maxMinTable, setMaxMinTable] = useState([]);
  const [averageTable, setAverageTable] = useState([]);

  useEffect(() => {
    fetch("/Manufac _ India Agro Dataset.json")
      .then((response) => response.json())
      .then((data) => {
        // Preprocess data
        const processedData = data.map((item) => ({
          ...item,
          "Crop Production (UOM:t(Tonnes))":
            parseFloat(item["Crop Production (UOM:t(Tonnes))"]) || 0,
          "Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))":
            parseFloat(
              item["Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))"]
            ) || 0,
          "Area Under Cultivation (UOM:Ha(Hectares))":
            parseFloat(item["Area Under Cultivation (UOM:Ha(Hectares))"]) || 0,
        }));

        setData(processedData);

        // Create max-min table
        const maxMinMap = {};
        processedData.forEach((item) => {
          const year = item.Year;
          const production = item["Crop Production (UOM:t(Tonnes))"];
          if (!maxMinMap[year]) {
            maxMinMap[year] = { max: item, min: item };
          } else {
            if (
              production >
              maxMinMap[year].max["Crop Production (UOM:t(Tonnes))"]
            ) {
              maxMinMap[year].max = item;
            }
            if (
              production <
              maxMinMap[year].min["Crop Production (UOM:t(Tonnes))"]
            ) {
              maxMinMap[year].min = item;
            }
          }
        });

        const maxMinTableData = Object.keys(maxMinMap).map((year) => ({
          Year: year,
          MaxCrop: maxMinMap[year].max["Crop Name"],
          MaxProduction: maxMinMap[year].max["Crop Production (UOM:t(Tonnes))"],
          MinCrop: maxMinMap[year].min["Crop Name"],
          MinProduction: maxMinMap[year].min["Crop Production (UOM:t(Tonnes))"],
        }));

        setMaxMinTable(maxMinTableData);

        // Create average table
        const cropMap = {};
        processedData.forEach((item) => {
          const crop = item["Crop Name"];
          if (!cropMap[crop]) {
            cropMap[crop] = {
              totalYield: 0,
              totalArea: 0,
              count: 0,
            };
          }
          cropMap[crop].totalYield +=
            item["Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))"];
          cropMap[crop].totalArea +=
            item["Area Under Cultivation (UOM:Ha(Hectares))"];
          cropMap[crop].count += 1;
        });

        const averageTableData = Object.keys(cropMap).map((crop) => ({
          Crop: crop,
          AverageYield: (
            cropMap[crop].totalYield / cropMap[crop].count
          ).toFixed(2),
          AverageArea: (cropMap[crop].totalArea / cropMap[crop].count).toFixed(
            2
          ),
        }));

        setAverageTable(averageTableData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div>
      <h1>Data Analysis</h1>
      <h2>Max/Min Production Table</h2>
      <table>
        <thead>
          <tr>
            <th>Year</th>
            <th>Crop with Max Production</th>
            <th>Max Production (Tonnes)</th>
            <th>Crop with Min Production</th>
            <th>Min Production (Tonnes)</th>
          </tr>
        </thead>
        <tbody>
          {maxMinTable.map((item, index) => (
            <tr key={index}>
              <td>{item.Year}</td>
              <td>{item.MaxCrop}</td>
              <td>{item.MaxProduction}</td>
              <td>{item.MinCrop}</td>
              <td>{item.MinProduction}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Average Yield and Cultivation Area Table</h2>
      <table>
        <thead>
          <tr>
            <th>Crop</th>
            <th>Average Yield (Kg/Ha)</th>
            <th>Average Cultivation Area (Ha)</th>
          </tr>
        </thead>
        <tbody>
          {averageTable.map((item, index) => (
            <tr key={index}>
              <td>{item.Crop}</td>
              <td>{item.AverageYield}</td>
              <td>{item.AverageArea}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
