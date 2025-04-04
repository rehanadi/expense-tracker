import { useContext, useEffect, useState } from "react";
import ExpensesOutput from "../components/ExpensesOutput/ExpensesOutput";
import { ExpensesContext } from "../store/expenses-context";
import { getDateMinusDays } from "../util/date";
import { fetchExpenses } from "../util/http";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import ErrorOverlay from "../components/UI/ErrorOverlay";

const RecentExpenses = () => {
  const { expenses, setExpenses } = useContext(ExpensesContext);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState(null);

  const errorHandler = () => {
    setError(null);
  };

  useEffect(() => {
    const getExpenses = async () => {
      try {
        setIsFetching(true);
        const data = await fetchExpenses();
        setExpenses(data);
      } catch (error) {
        setError("Could not fetch expenses!");
      } finally {
        setIsFetching(false);
      }
    }

    getExpenses();
  }, []);

  if (isFetching) {
    return <LoadingOverlay />;
  }

  if (error) {
    return (
      <ErrorOverlay
        message={error}
        onConfirm={errorHandler}
      />
    );
  }

  const recentExpenses = expenses.filter((expense) => {
    const today = new Date();
    const date7DaysAgo = getDateMinusDays(today, 7);
    return (expense.date >= date7DaysAgo) && (expense.date <= today);
  });

  return (
    <ExpensesOutput
      expenses={recentExpenses}
      expensesPeriod="Last 7 days"
      fallbackText="No expenses registered in the last 7 days."
    />
  );
};

export default RecentExpenses;