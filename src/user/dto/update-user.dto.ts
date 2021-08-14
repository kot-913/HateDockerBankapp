class UpdateUserDto {
  id?: number;
  email?: string;
  login?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  avatar?: string;
  dateOfBirth?: Date;
}

export default UpdateUserDto;
