// import {
//   IsBoolean,
//   IsDate,
//   //IsDateString,
//   IsEnum,
//   IsNotEmpty,
//   IsNumber,
//   //IsNumberString,
//   IsOptional,
//   IsString,
// } from 'class-validator';
import {
  DeliveryStatus,
  PaymentStatus,
  ProductCategory,
} from './../../lib/enums';

// export class CreateUserDto {
//   @IsNotEmpty()
//   @IsString()
//   // @Max(50)
//   firstName: string;

//   @IsNotEmpty()
//   @IsString()
//   // @Max(50)
//   lastName: string;

//   @IsOptional()
//   @IsString()
//   // @Max(50)
//   email: string;

//   @IsNotEmpty()
//   @IsString()
//   password: string;

//   @IsNotEmpty()
//   @IsString()
//   phone: string;

//   @IsNotEmpty()
//   @IsString()
//   phoneCodeId: string;

//   @IsOptional()
//   @IsEnum(ProfileTypes)
//   profileType: ProfileTypes;
// }

// export class CreateStreetDto {
//   @IsNotEmpty()
//   @IsString()
//   // @Max(50)
//   name: string;

//   // @IsNotEmpty()
//   // @IsNumberString()
//   // lgaId: string;

//   @IsNotEmpty()
//   @IsNumberString()
//   lgaWardId: string;
// }

// export class CreateLgaDto {
//   @IsNotEmpty()
//   @IsString()
//   // @Max(50)
//   name: string;
// }

// export class CreateLgaWardDto {
//   @IsNotEmpty()
//   @IsString()
//   // @Max(50)
//   name: string;

//   @IsNotEmpty()
//   @IsNumberString()
//   lgaId: string;
// }

// export class CreatePropertyTypesDto {
//   @IsNotEmpty()
//   @IsString()
//   // @Max(50)
//   name: string;

//   @IsNotEmpty()
//   @IsNumberString()
//   unitPrice: string;
// }

// export class PostPaymentDto {
//   @IsNotEmpty()
//   @IsNumberString()
//   amount: string;

//   @IsNotEmpty()
//   @IsString()
//   payerName: string;

//   @IsOptional()
//   @IsString()
//   comments: string;

//   @IsNotEmpty()
//   @IsNumberString()
//   propertySubscriptionId: string;

//   @IsNotEmpty()
//   @IsDateString()
//   paymentDate: string;
// }

// export class GetLgaQuery {
//   @IsOptional()
//   @IsString()
//   name: string;
// }

// export class GetLgaWardQuery {
//   @IsOptional()
//   @IsString()
//   name: string;

//   @IsOptional()
//   @IsNumberString()
//   lgaId: string;
// }

// export class GetStreetQuery {
//   @IsOptional()
//   @IsString()
//   name: string;

//   @IsOptional()
//   @IsNumberString()
//   lgaWardId: string;
// }

// export class GetPropertyTypeQuery {
//   @IsOptional()
//   @IsString()
//   name: string;

//   @IsOptional()
//   @IsNumberString()
//   unitPrice: string;
// }

// export class GetPhoneCodesQuery {
//   @IsOptional()
//   @IsString()
//   id: string;

//   @IsOptional()
//   @IsString()
//   query: string;
// }

// export class GetSubscriptionQuery {
//   @IsOptional()
//   @IsNumber()
//   // @IsPositive()
//   limit: number;

//   @IsOptional()
//   @IsNumber()
//   // @IsPositive()
//   page: number;
// }

// export class GenerateBillingDto {
//   @IsOptional()
//   @IsString()
//   streetId: string;

//   @IsNotEmpty()
//   @IsString()
//   propertySuscriptionId: string;

//   @IsOptional()
//   @IsString()
//   year: string;

//   @IsOptional()
//   @IsString()
//   month: string;

//   @IsOptional()
//   @IsBoolean()
//   forAllProperties: boolean;

//   @IsOptional()
//   @IsBoolean()
//   forPropertiesOnStreet: boolean;
// }

// export class GetBillingQuery {
//   @IsOptional()
//   @IsString()
//   streetId: string;

//   @IsNotEmpty()
//   @IsString()
//   propertySuscriptionId: string;

//   @IsOptional()
//   @IsString()
//   year: string;

//   @IsOptional()
//   @IsString()
//   month: string;

//   @IsOptional()
//   @IsBoolean()
//   forAllProperties: boolean;

//   @IsOptional()
//   @IsBoolean()
//   forPropertiesOnStreet: boolean;
// }

// export class GetPaymentsQuery {
//   @IsOptional()
//   @IsString()
//   month: string;

//   @IsOptional()
//   @IsString()
//   year: string;

//   @IsOptional()
//   @IsString()
//   propertySubscriptionId: string;
// }

// export class GetBillingAccountArrear {
//   @IsOptional()
//   @IsNumber()
//   page: number;

//   @IsOptional()
//   @IsNumber()
//   limit: number;
// }

import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class Product {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  tag: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  decription: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  rate: number;

  @IsEnum(ProductCategory)
  category: ProductCategory;
}

export class Order {
  @IsNotEmpty()
  @IsString()
  totalAmount: number;

  @IsNotEmpty()
  @IsBoolean()
  isPaid: boolean;

  @IsNotEmpty()
  @IsNumber()
  userId: bigint;

  @IsNotEmpty()
  @IsDate()
  orderDate: Date;

  @IsNotEmpty()
  @IsNumber()
  cartId: bigint;

  @IsEnum(DeliveryStatus)
  status: DeliveryStatus;
}

export class Cart {
  @IsNotEmpty()
  @IsString()
  decription: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  productId: bigint;

  @IsNotEmpty()
  @IsString()
  image: string;
}

export class User {
  @IsNotEmpty()
  @IsNumber()
  userId: bigint;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class Cart_details {
  @IsNotEmpty()
  @IsNumber()
  totalAmount: number;

  @IsNotEmpty()
  @IsNumber()
  totalItem: number;

  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @IsNotEmpty()
  @IsNumber()
  cartId: bigint;
}

export class Payment {
  @IsNotEmpty()
  @IsNumber()
  orderId: bigint;

  @IsEnum(PaymentStatus)
  status: PaymentStatus;
}
