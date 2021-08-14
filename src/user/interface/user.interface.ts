export interface User {
  id: number;
  email: string;
  login: string;
  firstName: string;
  lastName: string;
  password: string;
  dateOfBirth: Date;
}

export default User;