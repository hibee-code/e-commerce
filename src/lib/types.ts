import { Cart } from '@/utils-billing/entitties/cart.entity';
import { ProfileTypes } from './enums';

export interface AuthTokenPayload {
  userData?: AuthenticatedUserData;
  cartData?: AuthenticatedCartData;
  //profile?: ProfileSummary;
  exp?: number | unknown;
}

export interface AuthenticatedUserData {
  id: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  //phone: string;
}

export interface AuthenticatedCartData {
  id: number;
}

export type ProfileSummary = {
  id: string;
  profileTypeId: string;
  profileType: ProfileTypes;
  entityProfileId?: string;
};

export interface PlatformRequest extends Request {
  authPayload: AuthTokenPayload;
}
