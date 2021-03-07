export const validation = {
    required: [(v: any) => !!v || "Required"],
    email: [(v: any) => !!v || "E-mail is required", (v: any) => /.+@.+\..+/.test(v) || "E-mail must be valid"],
    passwordLength: [(v: any) => v.length >= 8 || "Password must be at least 8 characters long"],
    pwdMatchesRules: (pwd1: any) => [(pwd2: any) => pwd1 == pwd2 || 'Password does not match'],
}

export default validation;