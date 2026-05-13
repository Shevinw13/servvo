import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FirebaseService } from '../../config/firebase/firebase.service';
import { User } from '../users/user.entity';

export interface JwtPayload {
  sub: string;
  firebaseUid: string;
  businessId: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async verifyTokenAndLogin(idToken: string): Promise<{
    accessToken: string;
    user: User;
  }> {
    let decodedToken;
    try {
      decodedToken = await this.firebaseService.verifyIdToken(idToken);
    } catch {
      throw new UnauthorizedException('Invalid Firebase ID token');
    }

    const firebaseUid = decodedToken.uid;
    const phone = decodedToken.phone_number || '';

    let user = await this.userRepository.findOne({
      where: { firebase_uid: firebaseUid },
    });

    if (!user) {
      user = this.userRepository.create({
        firebase_uid: firebaseUid,
        phone,
        business_id: decodedToken['businessId'] || decodedToken['business_id'],
      });
      user = await this.userRepository.save(user);
    } else {
      user.last_login_at = new Date();
      user = await this.userRepository.save(user);
    }

    const payload: JwtPayload = {
      sub: user.id,
      firebaseUid: user.firebase_uid,
      businessId: user.business_id,
    };

    const accessToken = this.jwtService.sign(payload);

    return { accessToken, user };
  }

  async validateJwtPayload(payload: JwtPayload): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id: payload.sub },
    });
  }

  async getUserById(userId: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id: userId },
    });
  }
}
