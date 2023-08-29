import { Body, Controller, Get, HttpStatus, HttpCode, Post, UseGuards, NotFoundException, Param, Delete, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { post_schema_login } from './DTOs/login.dto';
import { post_schema_user } from './DTOs/user.dto';
import { User } from './schemas/user.schemas';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body() post_schema_user: post_schema_user): Promise<{ token: string }> {
    return this.userService.signUp(post_schema_user)
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  login(@Body() post_schema_login: post_schema_login): Promise<{ token: string }> {
    return this.userService.login(post_schema_login)
  }

  @Get()
  //@UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  public async findAll(): Promise<User[]> {
    return this.userService.findAll()
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    try {
      const document = await this.userService.findById(id)
      return document
    } catch (error) {
      throw new NotFoundException(error.message)
    }
  }

  @Delete(':id')
  async deleteById(@Param('id') id: string) {
    try {
      const deletedDocument = await this.userService.deleteById(id)
      return deletedDocument
    } 
    catch (error) { throw new NotFoundException(error.message) }
  }

  @Patch(':id')
  async patchById(@Param('id') id: string, @Body() partialUpdate: Partial<User>) {
    try {
      const updatedDocument = await this.userService.patchById(id, partialUpdate)
      return updatedDocument
    } catch (error) {
      throw new NotFoundException(error.message)
    }
  }
}
