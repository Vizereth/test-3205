import React, { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { PatternFormat } from "react-number-format";

import "./MyForm.scss";
import { FormData, UsersType } from "../../types/common";
import { validateEmail, validateNumber } from "../../utils/validators";
import { createInputValuesObject, unformatNumber } from "../../utils/helpers";
import UsersList from "../UsersList/UsersList";

function MyForm() {
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

  const [isLoading, setIsLoading] = useState<Boolean>(false);

  const [formData, setFormData] = useState<FormData>({
    email: {
      value: "",
      validator: validateEmail,
      unformatter: (value: string) => value,
      valid: true,
    },
    number: {
      value: "",
      validator: validateNumber,
      unformatter: unformatNumber,
      valid: true,
    },
  });

  const [result, setResult] = useState<UsersType | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const newFormData = { ...formData };

    newFormData[name].value = newFormData[name].unformatter(value);

    setFormData(newFormData);
  };

  const validateForm = () => {
    const updatedFormData = { ...formData };

    Object.keys(updatedFormData).forEach((key) => {
      updatedFormData[key].valid = updatedFormData[key].validator(
        updatedFormData[key].value
      );
    });

    const isValid = Object.keys(updatedFormData).every(
      (key) => updatedFormData[key].valid
    );

    setFormData(updatedFormData);
    return isValid;
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsLoading(true);

      const abortController = new AbortController();
      const { signal } = abortController;

      setAbortController(abortController);

      const userInputData = createInputValuesObject(formData);

      const response = await fetch("http://localhost:8080/submitForm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInputData),
        signal,
      });

      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.warn("Request canceled.");
      } else {
        console.error("Error submitting the form", error);
      }
    } finally {
      setIsLoading(false);
      setAbortController(null);
    }
  };

  useEffect(() => {
    return () => {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [abortController]);

  return (
    <div className="container flex-col">
      <form className="form flex-col" onSubmit={submitForm}>
        <div className="form__container flex-col">
          <div className="form__field flex-col">
            <label htmlFor="email" className="form__label">
              Email*:
            </label>
            <input
              id="user-email"
              type="email"
              name="email"
              className="form__input"
              onChange={handleChange}
            />
            <p
              className={`form__error ${
                !formData["email"].valid ? "visible" : ""
              }`}
            >
              Email указан неверно
            </p>
          </div>
          <div className="form__field flex-col">
            <label htmlFor="user-number-input" className="form__label">
              Номер:
            </label>
            <PatternFormat
              format="##-##-##"
              valueIsNumericString
              mask="_"
              placeholder="XX-XX-XX"
              id="user-number"
              type="text"
              name="number"
              className="form__input"
              onChange={handleChange}
            />
            <p
              className={`form__error ${
                !formData["number"].valid ? "visible" : ""
              }`}
            >
              Номер указан неверно
            </p>
          </div>
        </div>
        <button type="submit" className="form__btn">
          Отправить
        </button>
        <div className={`loader ${isLoading ? "visible" : ""}`}>
          <BarLoader color="#00ffff" />
        </div>
      </form>
      {result && <UsersList users={result} />}
    </div>
  );
}

export default MyForm;
