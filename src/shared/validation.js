export const required = value => value ? undefined : 'Required';
export const password = value => {
    const regEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[$@$!%*?&])[A-Za-z$@$!%*?&]{4,10}/;
    
    return value && regEx.test(value) ? undefined : 'Must be more than 4 but less then 10 characters and contains at least one uppercase and lowercase letters and symbol from: "$@$!%*?&"' && 'Pass wrong';
};
export const maxLength = max => value => value && value.length > max ? `Must be ${max} characters or less` : undefined;
export const minLength = min => value => value && value < min ? `Must be at least ${min} characters` : undefined;