import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@ValidatorConstraint({ async: false })
export class EitherOrConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const { object } = args as { object: CreateUserDto }; // Specify CreateUserDto as the type
    return object.email !== null || object.mobile !== null;
  }

  defaultMessage(args: ValidationArguments) {
    const propertyName = args.property;
    const constraints = args.constraints;

    return `At least one of ${propertyName} or ${constraints[0]} is required`;
  }
}

export function EitherOr(validationOptions?: ValidationOptions) {
  return function (object: CreateUserDto, propertyName: string) { 
    // Use CreateUserDto as the type
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: EitherOrConstraint,
    });
  };
}
