import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schemas';
import { JwtService } from '@nestjs/jwt';
import { post_schema_user } from './DTOs/user.dto';
import { post_schema_login } from './DTOs/login.dto';
import { Request } from 'express';
import * as bcrypt from 'bcryptjs';
import { JwtPayload } from './jwt/jwt-payload.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) { }

  async signUp(post_schema_user: post_schema_user): Promise<{ token: string, nome: string, email: string, username: string, id: any }> {
    const { nome, username, email, senha } = post_schema_user
    const hashedPassword = await bcrypt.hash(senha, 10)
    const user = await this.userModel.create({ nome, username, email, senha: hashedPassword })
    const token = this.jwtService.sign({ id: user._id })
    return { id: user.id, nome, username, email, token }
  }

  async login(post_schema_login: post_schema_login): Promise<{ token: string, email_ou_username: string, id: any }> {
    const { email_ou_username, senha } = post_schema_login
    const user = await this.userModel.findOne({ $or: [{ email: email_ou_username }, { username: email_ou_username }] })
    if (!user) { throw new UnauthorizedException('Email, username ou senha inválidos') }
    const isPasswordMatched = await bcrypt.compare(senha, user.senha)
    if (!isPasswordMatched) { throw new UnauthorizedException('Email, username ou senha inválidos') }
    const token = this.jwtService.sign({ id: user._id })
    return { id: user._id, email_ou_username, token }
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find()
  }

  async findById(id: string): Promise<User> {
    try {
      const document = await this.userModel.findById(id).exec()
      if (!document) { throw new NotFoundException(`Document with ID ${id} not found`) }
      return document
    } 
    catch (error) { throw new NotFoundException(`Document with ID ${id} not found`) }
  }

  async deleteById(id: string): Promise<User> {
    const document = await this.findById(id)
    if (!document) { throw new NotFoundException(`Document with ID ${id} not found`) }
    const deletedDocument = await this.userModel.findByIdAndRemove(id).exec()
    return deletedDocument;
  }

  async patchById(id: string, partialUpdate: Partial<User>): Promise<User> {
    const document = await this.findById(id)
    if (!document) { throw new NotFoundException(`Document with ID ${id} not found`) }
    Object.assign(document, partialUpdate)
    const updatedDocument = await document.save()
    return updatedDocument
  }

  private static jwtExtractor(request: Request): string {
    const authHeader = request.headers.authorization
    if (!authHeader) { throw new BadRequestException('Bad request.') }
    const [, token] = authHeader.split(' ')
    return token
  }

  public returnJwtExtractor(): (request: Request) => string {
    return UserService.jwtExtractor
  }

  public async validateUser(jwtPayload: JwtPayload): Promise<User> {
    const user = await this.userModel.findOne({ _id: jwtPayload.userId })
    if (!user) { throw new UnauthorizedException('User not found.') }
    return user
  }
}


