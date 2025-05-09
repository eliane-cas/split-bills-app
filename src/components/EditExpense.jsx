import { db } from "./firebase";
import React, { useState, useEffect, useContext } from "react";
import { getDoc, doc, updateDoc, Timestamp } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { ExpensesContext } from "../contexts/ExpensesContext.jsx";
import {
  formatDateForInput,
  parseDateToTimestamp,
} from "../utilities/dateUtils.jsx";
import { MembersContext } from "../contexts/MembersContext.jsx";

function EditExpense() {
  const [expense, setExpense] = useState("");
  const [amount, setAmount] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [startDateStr, setStartDateStr] = useState("");
  const [endDate, setEndDate] = useState(null);
  const [endDateStr, setEndDateStr] = useState("");
  const [payer, setPayer] = useState("");

  const [payers, setPayers] = useState([]);

  const navigate = useNavigate();

  const { firebaseId } = useParams();

  const { storedExpenses, triggerRefresh } = useContext(ExpensesContext);

  // get members context
  const { storedMembers } = useContext(MembersContext);

  useEffect(() => {
    const bill = storedExpenses.find((e) => e.expenseId === firebaseId);
    console.log("bill", bill);
    if (bill) {
      setExpense(bill.Expense);
      setAmount(bill.Amount);
      // is this necessary?
      setStartDate(bill.StartDate);
      setStartDateStr(formatDateForInput(bill.StartDate));
      setEndDate(bill.EndDate);
      setEndDateStr(formatDateForInput(bill.EndDate));
      setPayer(bill.Payer);
      setPayers(bill.Payers);
    }
  }, [firebaseId, storedExpenses]);

  const handleCheckboxChange = (event) => {
    const checkedId = event.target.value;
    setPayers((prev) =>
      prev.includes(checkedId)
        ? prev.filter((id) => id !== checkedId)
        : [...prev, checkedId]
    );
  };

  const updateData = async (e) => {
    e.preventDefault();
    console.log(endDateStr, startDateStr);
    const calculatedShares = {};

    payers.forEach(async (payer) => {
      calculatedShares[payer] = amount / payers.length;
    });
    await updateDoc(doc(db, "expenses", firebaseId), {
      Expense: expense,
      Amount: amount,
      StartDate: parseDateToTimestamp(startDateStr),
      EndDate: parseDateToTimestamp(endDateStr),
      Payer: payer,
      Payers: payers,
      Shares: calculatedShares,
    });
    alert("expense updated in the database");
  };

  return (
    <div>
      Edit Expense
      <div>
        <h6>Edit expense</h6>
        <form
          className="expense-form"
          onSubmit={(e) => {
            updateData(e);
          }}
        >
          <input
            type="text"
            value={expense}
            onChange={(e) => {
              setExpense(e.target.value);
            }}
            required
          />
          <input
            type="number"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
            }}
            required
          />
          <label for="startDate">Start Date:</label>
          <input
            type="date"
            value={startDateStr}
            id="startDate"
            name="start date"
            onChange={(e) => {
              setStartDateStr(e.target.value);
            }}
          />
          <label for="endDate">End Date:</label>
          <input
            type="date"
            id="endDate"
            value={endDateStr}
            name="end date"
            onChange={(e) => {
              setEndDateStr(e.target.value);
            }}
          />
          <div>
            Who paid?
            {storedMembers.map((member, index) => (
              <div key={index}>
                <input
                  required
                  type="radio"
                  id={member.Name}
                  name="who paid"
                  checked={payer == member.memberId}
                  value={member.memberId}
                  onChange={(event) => {
                    setPayer(event.target.value);
                  }}
                />
                <label for={member.Name}>{member.Name}</label>
              </div>
            ))}
          </div>

          <div>
            Split between who?
            {storedMembers.map((member, index) => (
              <div key={index}>
                <input
                  type="checkbox"
                  id={member.Name}
                  name={member.Name}
                  checked={payers.includes(member.memberId)}
                  value={member.memberId}
                  onChange={(event) => {
                    handleCheckboxChange(event);
                  }}
                ></input>
                <label for={member.Name}>{member.Name}</label>
              </div>
            ))}
          </div>

          <button type="submit">Update this Expense</button>
          <button onClick={() => navigate("/")}>go to homepage</button>
        </form>
      </div>
    </div>
  );
}

export default EditExpense;
