import { Request } from 'express';
import User from '../user/users.entity';
 
interface UserRequest extends Request {
  user: User;
}
 
export default UserRequest;