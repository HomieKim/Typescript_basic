// Validation
export interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

export function validate(validateObj: Validatable) {
  console.log("dsfasdf", validateObj.value.toString().trim().length);

  if (
    validateObj.minLength != null &&
    typeof validateObj.value === "string" &&
    validateObj.value.length < validateObj.minLength
  ) {
    return true;
  }
  if (
    validateObj.maxLength != null &&
    typeof validateObj.value === "string" &&
    validateObj.value.length > validateObj.maxLength
  ) {
    return true;
  }
  if (
    validateObj.min != null &&
    typeof validateObj.value === "number" &&
    validateObj.value < validateObj.min
  ) {
    return true;
  }
  if (
    validateObj.max != null &&
    typeof validateObj.value === "number" &&
    validateObj.value > validateObj.max
  ) {
    return true;
  }
  if (validateObj.value.toString().trim().length === 0) {
    return true;
  }
  return false;
}