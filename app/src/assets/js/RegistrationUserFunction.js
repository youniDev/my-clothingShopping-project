import { checkEmail } from "../../api/UserAPI";
import { SIGNUP, ERROR } from "../../assets/js/Constants";

const isNULL = (value) => {
  if (value) return false;

  return true;
};

const isCorrectValue = (value) => {
  if (value) return false;

  return true;
};

// 이메일 중복 검사를 위해 [입력한 이메일 값] 전송
export const isDuplicationEmail = async (email, state) => {
  // EMAIL 값이 NULL 값이 아니고, 형식이 올바르다면
  if (email && isCorrectValue(state)) {
    const result = await checkToDuplicationEmail(email);

    return result;
  }

  return false;
};
const checkToDuplicationEmail = async (email) => {
  let result = false;
  try {
    result = await checkEmail(email);

    alert(result ? ERROR.SIGNUP.IS_DUPLICATE : ERROR.SIGNUP.GOOD_EMAIL);
  } catch (error) {
    console.error(ERROR.FAIL_COMMUNICATION[ERROR.TEXT_EN], error);
  }

  return result;
};

export const validate = (match, target) => {
  const validationCriteria = SIGNUP.VALIDATION_CRITERIA[match];

  if (validationCriteria) {
    return validationCriteria.test(target);
  }

  return !isNULL(target);
};

export const setErrorMsg = (value) => {
  if (isNULL(value)) return ERROR.SIGNUP.IS_NULL_FIELD;

  return ERROR.SIGNUP.BAD;
};

export const findAddressByPostCode = (data) => {
  let fullAddress = data.address;
  let extraAddress = "";

  if (data.addressType === "R") {
    if (data.bname !== "") {
      extraAddress += data.bname;
    }
    if (data.buildingName !== "") {
      extraAddress +=
        extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
    }
    fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
  }

  return fullAddress;
};

export const isFormRight = (formData, errorState, showButton) => {
  // 1. 필수 항목들이 NULL 값인지 or 각 필드들이 유효성을 모두 통과하지 못했을 경우
  if (!isNullForm(formData, errorState)) {
    return false;
  }
  // 2. 중복 검사와,
  if (!showButton.idDuplication) {
    console.error(ERROR.SIGNUP.NOT_CHECK_BTN);
    alert(ERROR.SIGNUP.NOT_CHECK_BTN);
    return false;
  }
  // 3. 본인인증을 안했을 경우
  if (!showButton.verification) {
    console.error(ERROR.SIGNUP.NOT_AUTHENTICATE_USER);
    alert(ERROR.SIGNUP.NOT_AUTHENTICATE_USER);
    return false;
  }

  return true;
};

export const isNullForm = (formData, errorState) => {
  const excludedFields = ["birth", "path"];
  const isAllFieldsNull =
    Object.keys(formData)
      .filter((key) => !excludedFields.includes(key))
      .every((key) => isNULL(formData[key])) || isNULL(formData.address); // 필수 항목들이 NULL 값인지

  if (isAllFieldsNull) {
    console.error(ERROR.SIGNUP.IS_NULL_FIELD);
    alert(ERROR.SIGNUP.IS_NULL_FIELD);
    return false;
  }
  // 2. 각 필드들이 유효성을 모두 통과하지 못했을 경우
  const anyValidationError = Object.values(errorState).some(
    (field) => field.state !== "",
  );
  if (anyValidationError) {
    console.error(ERROR.SIGNUP.BAD);
    alert(ERROR.SIGNUP.BAD);
    return false;
  }

  return true;
};

export const updateUserForm = (formData) => {
  console.log(formData);

  const updateData = {
    ...formData,
    address: formData.address + "/" + formData.detail,
  };

  return updateData;
};
