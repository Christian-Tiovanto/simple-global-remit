import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserNotification } from '../models/user-notification.entity';
import { Repository } from 'typeorm';
import { getMessaging, Messaging } from 'firebase-admin/messaging';
import admin from 'firebase-admin';
import { RegisterUserNotificationDto } from '../dtos/create-user-notification.dto';
import { UserService } from 'src/modules/user/services/user.service';
import { User } from 'src/modules/user/models/user.entity';
console.log(admin.apps.length);
@Injectable()
export class UserNotificationService {
  public messaging: Messaging;
  constructor(
    @InjectRepository(UserNotification) private userNotificationRepository: Repository<UserNotification>,
    private userService: UserService,
  ) {
    admin.initializeApp({
      credential: admin.credential.cert(process.env.FCM_SERVICE_ACCOUNT_PATH),
    });
    this.messaging = getMessaging();
  }

  async registerUserNotificationToken(createUserNotificationDto: RegisterUserNotificationDto) {
    const { user_id, token } = createUserNotificationDto;
    const user = await this.userService.getUserbyId(user_id);
    if (!user) throw new NotFoundException('There is no user with that id');

    const userNotificationToken = await this.userNotificationRepository.findOne({ where: { user } });
    if (!userNotificationToken) return await this.insertUserNotificationToken(user, token);

    return await this.updateUserNotificationToken(userNotificationToken, token);
  }

  private async insertUserNotificationToken(user: User, token: RegisterUserNotificationDto['token']) {
    const userNotification = await this.userNotificationRepository.create({ user, token });
    await this.userNotificationRepository.save(userNotification);
  }
  private async updateUserNotificationToken(
    userNotificationToken: UserNotification,
    token: RegisterUserNotificationDto['token'],
  ) {
    const updatedUserNotificationToken = Object.assign(userNotificationToken, { token });
    await this.userNotificationRepository.save(updatedUserNotificationToken);
  }
}
