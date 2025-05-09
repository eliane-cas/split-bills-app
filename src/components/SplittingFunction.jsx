import { db } from "./firebase";
import React, { useState, useEffect } from "react";
import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";

const SplittingFunction = ({ totalPerUser }) => {
  const [display, setDisplay] = useState([]);

  // const exampleArraySorted = [
  //   { Stef: -11 },
  //   { Eliane: 1 },
  //   { Julia: 3 },
  //   { Ixchel: 7 },
  // ];

  const exampleArraySorted = [
    { Stef: -20 },
    { Eliane: -10 },
    { Julia: 8 },
    { Ixchel: 9 },
    { Gabi: 13 },
  ];

  useEffect(() => {
    const exampleObject = Object.entries(totalPerUser);
    const arrE = exampleObject.map(([user, amount]) => ({ [user]: amount }));
    console.log("example object", exampleObject, arrE);
    const sorted = arrE.sort((x, y) => {
      const xValue = Object.values(x)[0];
      const yValue = Object.values(y)[0];
      return xValue - yValue;
    });

    let arr = [...sorted];
    let newDisplay = [];

    while (arr.length > 1) {
      let [p1] = Object.values(arr[0]);
      let [p2] = Object.values(arr[arr.length - 1]);
      p1 = +p1.toFixed(2);
      p2 = +p2.toFixed(2);
      console.log(p1, p2);
      if (Math.abs(p1) > Math.abs(p2)) {
        // console.log("p1 bigger than p2", p1, p2);
        let string1 =
          Object.keys(arr[0]) +
          " owes " +
          Object.keys(arr[arr.length - 1]) +
          " " +
          p2 +
          "€";

        newDisplay.push(string1);
        arr[0][Object.keys(arr[0])[0]] = p1 + p2;
        arr = arr.slice(0, -1); // new array without last element
        continue;
      }

      if (Math.abs(p1) === Math.abs(p2)) {
        // console.log("p1 same as p2", p1, p2);
        let string2 =
          Object.keys(arr[0]) +
          " owes " +
          Object.keys(arr[arr.length - 1]) +
          " " +
          p2 +
          "€";
        newDisplay.push(string2);
        arr = arr.slice(1, -1); // new array without first or last element
        continue;
      }

      if (Math.abs(p1) < Math.abs(p2)) {
        // console.log("p1 smaller than p2", p1, p2);
        let string3 =
          Object.keys(arr[0]) +
          " owes " +
          Object.keys(arr[arr.length - 1]) +
          " " +
          Math.abs(p1) +
          "€";
        newDisplay.push(string3);
        arr[arr.length - 1][Object.keys(arr[arr.length - 1])[0]] = p2 + p1;
        arr = arr.slice(1); // new array without first element
        continue;
      }
    }

    setDisplay(newDisplay);
  }, [totalPerUser]);

  return (
    <div>
      <p>Splitting Function</p>
      {display.length > 0 ? (
        display.map((string, index) => <li key={index}>{string}</li>)
      ) : (
        <p>Loading...</p>
      )}
      <p>This is it!</p>
    </div>
  );
};

export default SplittingFunction;
