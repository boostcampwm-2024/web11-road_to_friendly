import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ name: 'isYoutubeLink', async: false })
@Injectable()
export class IsYoutubeLinkConstraint implements ValidatorConstraintInterface {
  validate(link: string, args: ValidationArguments): boolean {
    const youtubeUrlPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    return youtubeUrlPattern.test(link);
  }
}

export function IsYoutubeLink(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsYoutubeLinkConstraint,
    });
  };
}
