import { useState } from "react";
import { View, StyleSheet, Text, Alert } from "react-native";
import Input from "./Input";
import Button from "../UI/Button";
import { getFormattedDate } from "../../util/date";
import { GlobalStyles } from "../../constants/styles";

const ExpenseForm = ({
  submitButtonLabel,
  defaultValues,
  onSubmit,
  onCancel,
}) => {
  const [inputs, setInputs] = useState({
    amount: {
      value: defaultValues ? defaultValues.amount.toString() : "",
      isValid: true,
    },
    date: {
      value: defaultValues ? getFormattedDate(defaultValues.date) : "",
      isValid: true, 
    },
    description: {
      value: defaultValues ? defaultValues.description : "",
      isValid: true,
    },
  });

  const inputChangeHandler = (key, value) => {
    setInputs((prevState) => {
      return {
        ...prevState,
        [key]: { value, isValid: true },
      };
    });
  };

  const submitHandler = () => {
    const data = {
      amount: +inputs.amount.value,
      date: new Date(inputs.date.value),
      description: inputs.description.value,
    };

    const amountIsValid = !isNaN(data.amount) && data.amount > 0;
    const dateIsValid = data.date.toString() !== "Invalid Date";
    const descriptionIsValid = data.description.trim().length > 0;

    if (!amountIsValid || !dateIsValid || !descriptionIsValid) {
      setInputs((prevState) => {
        return {
          amount: {
            value: prevState.amount.value,
            isValid: amountIsValid,
          },
          date: {
            value: prevState.date.value,
            isValid: dateIsValid,
          },
          description: {
            value: prevState.description.value,
            isValid: descriptionIsValid,
          },
        };
      });
      return;
    }

    onSubmit(data);
  };

  const formIsInvalid = !inputs.amount.isValid || !inputs.date.isValid || !inputs.description.isValid;

  return (
    <View style={styles.form}>
      <Text style={styles.title}>Your Expense</Text>
      <View style={styles.inputsRow}>
        <Input
          label="Amount"
          invalid={!inputs.amount.isValid}
          textInputProps={{
            keyboardType: "decimal-pad",
            onChangeText: inputChangeHandler.bind(this, "amount"),
            value: inputs.amount.value,
          }}
          style={styles.rowInput}
        />
        <Input
          label="Date"
          invalid={!inputs.date.isValid}
          textInputProps={{
            placeholder: "YYYY-MM-DD",
            maxLength: 10,
            onChangeText: inputChangeHandler.bind(this, "date"),
            value: inputs.date.value,
          }}
          style={styles.rowInput}
        />
      </View>
      <Input
        label="Description"
        invalid={!inputs.description.isValid}
        textInputProps={{
          multiline: true,
          // autoCorrect: true,
          // autoCapitalize: "sentences",
          onChangeText: inputChangeHandler.bind(this, "description"),
          value: inputs.description.value,
        }}
      />
      {formIsInvalid && (
        <Text style={styles.errorText}>
          Invalid input values - please check your entered data!
        </Text>
      )}
      <View style={styles.buttonsContainer}>
        <Button
          mode="flat"
          onPress={onCancel}
          style={styles.button}
        >
          Cancel
        </Button>
        <Button
          onPress={submitHandler}
          style={styles.button}
        >
          {submitButtonLabel}
        </Button>
      </View>
    </View>
  );
};

export default ExpenseForm;

const styles = StyleSheet.create({
  form: {
    marginTop: 40,
  },
  title: {
    marginVertical: 24,
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  inputsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rowInput: {
    flex: 1,
  },
  errorText: {
    textAlign: "center",
    color: GlobalStyles.colors.error500,
    margin: 8,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    minWidth: 120,
    marginHorizontal: 8,
  },
});