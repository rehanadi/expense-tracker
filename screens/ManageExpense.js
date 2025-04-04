import { useContext, useLayoutEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import IconButton from "../components/UI/IconButton";
import { GlobalStyles } from "../constants/styles";
import { ExpensesContext } from "../store/expenses-context";
import ExpenseForm from "../components/ManageExpense/ExpenseForm";
import { modifyExpense, removeExpense, storeExpense } from "../util/http";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import ErrorOverlay from "../components/UI/ErrorOverlay";

const ManageExpense = ({ route, navigation }) => {
  const {
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
  } = useContext(ExpensesContext);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const expenseId = route.params?.expenseId;
  const isEditing = !!expenseId;
  const selectedExpense = expenses.find((expense) => expense.id === expenseId);

  const deleteExpenseHandler = async () => {
    try {
      setIsSubmitting(true);
      await removeExpense(expenseId);
      deleteExpense(expenseId);
      navigation.goBack();
    } catch (error) {
      setError("Could not delete expense - please try again later!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelHandler = () => {
    navigation.goBack();
  };

  const confirmHandler = async (expenseData) => {
    try {
      setIsSubmitting(true);
  
      if (isEditing) {
        await modifyExpense(expenseId, expenseData);
        updateExpense(expenseId, expenseData);
      } else {
        const id = await storeExpense(expenseData);
        addExpense({ id, ...expenseData });
      }
  
      navigation.goBack();
    } catch (error) {
      setError("Could not save data - please try again later!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const errorHandler = () => {
    setError(null);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? "Edit Expense" : "Add Expense",
    });
  }, [navigation, isEditing]);

  if (isSubmitting) {
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

  return (
    <View style={styles.container}>
      <ExpenseForm
        submitButtonLabel={isEditing ? "Update" : "Add"}
        defaultValues={selectedExpense}
        onSubmit={confirmHandler}
        onCancel={cancelHandler}
      />
      {isEditing && (
        <View style={styles.deleteContainer}>
          <IconButton
            icon="trash"
            color={GlobalStyles.colors.error500}
            size={36}
            onPress={deleteExpenseHandler}
          />
        </View>
      )}
    </View>
  );
};

export default ManageExpense;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.primary800,
    padding: 24,
  },
  deleteContainer: {
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: GlobalStyles.colors.primary200,
    marginTop: 16,
  }
});