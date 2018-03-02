let validationMessages = {};

export const initValidationMessages = messages => validationMessages = messages;

export const required = message => value => value ? undefined : { ...message, ...validationMessages.required };
export const password = (regEx, message) => value => {
    const passwordRegEx = regEx || /^(?=.*[a-z])(?=.*[A-Z])(?=.*[$@$!%*?&])[A-Za-z$@$!%*?&]{4,10}/;
    
    return value && passwordRegEx.test(value) ? undefined : { ...message, ...validationMessages.password };
};
export const maxLength = (max = 25, message) => value => {
    return value && value.length > max ? { ...message, ...validationMessages.maxLength, values: { max } } : undefined;
};
export const minLength = (min = 0, message) => value => {
    return value && value.length < min ?  { ...message, ...validationMessages.minLength, values: { min } } : undefined;
};