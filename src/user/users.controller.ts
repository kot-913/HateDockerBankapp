import { Get, Param, Body, Controller, Post, Put, Delete, Res } from '@nestjs/common';
import UsersService from './users.service';
import CreateUserDto from './dto/create-user.dto';
import UpdateUserDto from './dto/update-user.dto';
import { UseInterceptors, UploadedFile } from  '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from  'multer';
import { parse, join } from  'path';

@Controller('users')
export default class UsersController {
  constructor(private readonly usersService: UsersService
    ) {}

  @Get()
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(Number(id));
  }

  @Put(':id')
  async modifyUser(@Param('id') id: string, @Body() user: UpdateUserDto) {
    return this.usersService.modifyUser(Number(id), user);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    this.usersService.deleteUser(Number(id));
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('file',
    {
      storage: diskStorage({
        destination: './avatars', 
        filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
        const extension: string = parse(file.originalname).ext;
        return cb(null, `${randomName}${extension}`)
      }
      })
    }
  )
  )
  uploadAvatar(@Param('id') id: number, @UploadedFile() file: any) {
    console.log(file);
    this.usersService.setAvatar(Number(id), file.randomName);
  }
  @Get('avatar/:img')
  downloadAvatar(@Param('img') imgName: any, @Res() res: any) {
    return res.sendFile(
      join(process.cwd(), `avatars/${imgName}`),
    );
  }
}

