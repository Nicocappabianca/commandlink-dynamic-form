import { FC, useState } from "react";
import {
  Input,
  InputContainer,
  Placeholder,
  Select,
  TextArea,
  TextAreaPlaceholder,
} from "../styled";
import { FieldObject } from "../../models/field";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { updateFormField } from "../../redux/formSlice";
import { isValidEmail } from "../../utils";

export const Field: FC<FieldObject> = ({ id, type, placeholder, required, options }) => {
  const [touched, setTouched] = useState(false);

  const fieldValue = useSelector((state: RootState) => state.form[id] || "");
  const dispatch = useDispatch();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    dispatch(updateFormField({ id, value }));
  };

  const isSelectField = type === "select";
  const isTextArea = type === "textarea";
  const isEmail = type === "email";
  const isInput = !isSelectField && !isTextArea;

  const hasError = required && touched && (!fieldValue || (isEmail && !isValidEmail(fieldValue)));

  return (
    <InputContainer $isRequired={required}>
      {isSelectField && (
        <Select
          onFocus={() => setTouched(true)}
          $hasError={hasError}
          onChange={handleChange}
          defaultValue={placeholder}
          data-testid={`${id}-select`}
        >
          {placeholder && <option disabled>{placeholder}</option>}
          {options?.map((option) => (
            <option value={option} key={option}>
              {option}
            </option>
          ))}
        </Select>
      )}

      {isTextArea && (
        <TextArea
          onFocus={() => setTouched(true)}
          value={fieldValue}
          onChange={handleChange}
          $hasError={hasError}
          rows={4}
        />
      )}

      {isInput && (
        <Input
          value={fieldValue}
          onChange={handleChange}
          id={id}
          type={type}
          required={required ?? false}
          onFocus={() => setTouched(true)}
          $hasError={hasError}
          data-testid={`${id}-input`}
        />
      )}

      {placeholder && isInput && (
        <Placeholder $hasValue={!!fieldValue} htmlFor={id}>
          {placeholder}
        </Placeholder>
      )}
      {placeholder && isTextArea && (
        <TextAreaPlaceholder $hasValue={!!fieldValue} data-testid={`${id}-textarea`}>
          {placeholder}
        </TextAreaPlaceholder>
      )}
    </InputContainer>
  );
};
