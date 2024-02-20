/* import { HttpException, Injectable, Logger } from '@nestjs/common';
import { DataSource, EntityManager, FindOperator, ILike, Raw } from 'typeorm';
import {
  CreateLgaDto,
  CreateLgaWardDto,
  CreatePropertyTypesDto,
  CreateStreetDto,
  CreateSubscriptionDto,
  CreateUserDto,
  GenerateBillingDto,
  GetBillingQuery,
  PostPaymentDto,
} from './dtos/dto';
import { ProfileTypes, SubscriberProfileRoleEnum } from '../lib/enums';
import { throwBadRequest, throwForbidden } from '../utils/helpers';
import { EntitySubscriberProfile } from './entitties/entitySubscriberProfile.entity';
import { EntityUserProfile } from './entitties/entityUserProfile.entity';
import { AuthTokenPayload, AuthenticatedUserData } from '../lib/types';
import { Street } from './entitties/street.entity';
import { PropertyType } from './entitties/propertyTypes.entity';
import { PropertySubscription } from './entitties/propertySubscription.entity';
import { EntitySubscriberProperty } from './entitties/entitySubscriberProperty.entity';
import { PropertySubscriptionUnit } from './entitties/PropertySubscriptionUnit.entity';
import { BillingAccount } from './entitties/billingAccount.entity';
import { Billing } from './entitties/billing.entity';
import { MonthNames } from '../lib/projectConstants';
import { bignumber } from 'mathjs';
import { LgaWard } from './entitties/lgaWard.entity';
import { Lga } from './entitties/lga.entity';
import { Payment } from './entitties/payments.entity';
import { RequestService } from '../shared/request/request.service';
import { ProfileCollection } from './entitties/profileCollection.entity';
import { PhoneCode } from './entitties/phoneCode.entity';
import { pick } from 'lodash';

@Injectable()
export class UtilsBillingService {
  constructor(
    private requestService: RequestService,
    public dbManager: EntityManager,
    private dataSource?: DataSource,
  ) {
    //
    if (!dbManager) {
      if (!dataSource) {
        throw new Error('No data source found');
      }
      this.dbManager = dataSource.manager;
      this.dataSource = dataSource;
    } else {
      this.dbManager = dbManager;
    }
  }

  async createUser(
    createUserDto: CreateUserDto,
    authPayload: AuthTokenPayload,
  ) {
    const { profileType } = createUserDto;
    if (
      ![
        ProfileTypes.ENTITY_SUBSCRIBER_PROFILE,
        ProfileTypes.ENTITY_USER_PROFILE,
      ].includes(profileType)
    ) {
      throwBadRequest('Invalid profile');
    }

    delete createUserDto.profileType;

    const entityProfileId = authPayload.profile.entityProfileId;
    const phoneCode = await this.getPhoneCodeOrThrow({
      phoneCodeId: createUserDto.phoneCodeId,
    });

    // create user in central user manager
    const authServerRequestPath = `/project/app/signup`;

    const defaultPassword = 'no-password';
    const phoneNumber = createUserDto.phone;
    const response = await this.requestService.requestAuth(
      authServerRequestPath,
      {
        body: {
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName,
          email: createUserDto.email,
          password: defaultPassword,
          ...(phoneNumber ? { phone: `${phoneNumber}` } : {}),
          ...(phoneNumber ? { phoneCode: `${phoneCode.name}` } : {}),
        },
        method: 'POST',
      },
    );

    if (response.status !== 201) {
      throw new HttpException('User creation failed', 500);
    }
    const userData:
      | undefined
      | (AuthenticatedUserData & {
          isVerified?: boolean;
          isNewUser?: boolean;
          userCreatedInApp?: boolean;
        }) = response.data;

    if (!userData) {
      throw new HttpException('User creation failed', 500);
    }

    if (!userData.isNewUser && !userData.userCreatedInApp) {
      throwForbidden('User already exist!');
    }

    let userProfile: EntityUserProfile | EntitySubscriberProfile;
    if (profileType === ProfileTypes.ENTITY_USER_PROFILE) {
      userProfile = this.dbManager.create(EntityUserProfile, {
        ...createUserDto,
        entityProfileId,
      });

      await this.dbManager.save(userProfile);
    } else if (profileType === ProfileTypes.ENTITY_SUBSCRIBER_PROFILE) {
      userProfile = this.dbManager.create(EntitySubscriberProfile, {
        ...createUserDto,
        createdByEntityProfileId: entityProfileId,
        createdByEntityUserProfileId: authPayload.profile.profileTypeId,
      });

      await this.dbManager.save(userProfile);
    }

    const profileCollection = this.dbManager.create(ProfileCollection, {
      profileType,
      userId: userData.id,
      isAdmin: false,
      profileTypeId: userProfile.id,
    });

    await this.dbManager.save(profileCollection);
  }

  async getEntityUserSubscriber(
    entityProfileId: string,
    {
      query,
      page,
      count = 10,
    }: { query?: string; page?: number; count?: number } = {},
  ) {
    let entitySubscriberProfiles: EntitySubscriberProfile[] = [];
    entitySubscriberProfiles = await this.dbManager.find(
      EntitySubscriberProfile,
      {
        where: {
          createdByEntityProfileId: entityProfileId,
        },
      },
    );

    return entitySubscriberProfiles;
  }

  async createPropertySubscription(
    createSubscriptionDto: CreateSubscriptionDto,
    authPayload: AuthTokenPayload,
  ) {
    // verify streetId, propertyTypeId, propertySubscriberProfileId, oldCode.
    await this.getStreetOrThrowError({
      streetId: createSubscriptionDto.streetId,
    });

    // verify propertyTypeId
    await this.getPropertyTypeOrThrowError({
      propertyTypeId: createSubscriptionDto.propertyTypeId,
    });

    // verify oldCode
    const existingOldCode = await this.dbManager.findOne(PropertySubscription, {
      where: {
        oldCode: createSubscriptionDto.oldCode,
      },
    });

    if (existingOldCode) {
      throwBadRequest('Old code supplied has been used.');
    }

    // verify propertySubscriberProfileId
    await this.validateEntitySubscriberProfileById(
      createSubscriptionDto.propertySubscriberProfileId,
    );

    const subscriberProfileRole = createSubscriptionDto.isOwner
      ? SubscriberProfileRoleEnum.OWNER
      : SubscriberProfileRoleEnum.CUSTODIAN;

    await this.dbManager.transaction(async (transactionManager) => {
      // create subscriber property
      let subscriberProperty = transactionManager.create(
        EntitySubscriberProperty,
        {
          propertyTypeId: createSubscriptionDto.propertyTypeId,
          ...(createSubscriptionDto.isOwner
            ? {
                ownerEntitySubscriberProfileId:
                  createSubscriptionDto.propertySubscriberProfileId,
              }
            : {}),
        },
      );

      subscriberProperty = await transactionManager.save(subscriberProperty);

      // create property subscription
      let propertySubscription = transactionManager.create(
        PropertySubscription,
        {
          propertySubscriptionName: createSubscriptionDto.propertyName,
          oldCode: createSubscriptionDto.oldCode,
          streetNumber: createSubscriptionDto.streetNumber,
          streetId: createSubscriptionDto.streetId,
          entitySubscriberProfileId:
            createSubscriptionDto.propertySubscriberProfileId,
          subscriberProfileRole: subscriberProfileRole,
          entityProfileId: authPayload.profile.entityProfileId,
        },
      );

      propertySubscription = await transactionManager.save(
        propertySubscription,
      );
      const propertySubscriptionId = propertySubscription.id;

      // create property unit
      const propertySubscriptionUnit = transactionManager.create(
        PropertySubscriptionUnit,
        {
          propertySubscriptionId,
          entiySubscriberPropertyId: subscriberProperty.id,
          propertyUnits: createSubscriptionDto.propertyUnit,
        },
      );

      await transactionManager.save(propertySubscriptionUnit);

      // create billling account
      const billingAccount = transactionManager.create(BillingAccount, {
        propertySubscriptionId,
      });

      await transactionManager.save(billingAccount);
    });
  }

  async getSubscriptions(
    entityProfileId: string,
    {
      limit = 10,
      page = 1,
      streetId,
    }: { limit?: number; page?: number; streetId?: string } = {},
  ) {
    //
    const propertySubscriptions = await this.dbManager.find(
      PropertySubscription,
      {
        where: {
          entityProfileId,
          ...(streetId ? { streetId } : {}),
        },
        take: limit,
        skip: (page - 1) * limit,
        relations: {
          propertySubscriptionUnits: {
            entitySubscriberProperty: {
              propertyType: true,
            },
          },
          billingAccount: true,
          entitySubscriberProfile: {
            phoneCode: true,
          },
          street: true,
        },
      },
    );

    const mappedResponse = propertySubscriptions.map((sub) => {
      return {
        propertySubscriptionId: sub.id,
        propertySubscriptionName: sub.propertySubscriptionName,
        oldCode: sub.oldCode,
        streetNumber: sub.streetNumber,
        createdAt: sub.createdAt,
        streetId: sub.streetId,
        entitySubscriberProfileId: sub.entitySubscriberProfileId,
        propertySubscriptionUnits: sub.propertySubscriptionUnits?.map(
          (unit) => {
            return {
              entitySubscriberPropertyId: unit.entitySubscriberProperty?.id,
              createdAt: unit.entitySubscriberProperty?.createdAt,
              propertyType: {
                ...unit.entitySubscriberProperty?.propertyType,
                updatedAt: undefined,
                entityProfileId: undefined,
              },
            };
          },
        ),
        arrears: (() => {
          let arr =
            Number(sub.billingAccount.totalBillings || '0') -
            Number(sub.billingAccount.totalPayments || '0');
          arr = arr < 0 ? 0 : arr;
          return arr;
        })(),
        entitySubscriberProfile: {
          ...sub.entitySubscriberProfile,
          updatedAt: undefined,
          phone: sub.entitySubscriberProfile?.phone,
          phoneCode: sub.entitySubscriberProfile?.phoneCode?.name,
        },
        streetName: sub.street?.name,
      };
    });

    return mappedResponse;
  }

  async createPropertyType(
    createPropertyTypesDto: CreatePropertyTypesDto,
    entityProfileId: string,
  ) {
    //
    const existingPropertyType = await this.getPropertyTypeOrThrowError({
      name: ILike(`%${createPropertyTypesDto.name}%`),
      unitPrice: createPropertyTypesDto.unitPrice,
      throwError: false,
    });

    if (existingPropertyType) {
      return existingPropertyType;
    }

    const propertyType = this.dbManager.create(PropertyType, {
      unitPrice: createPropertyTypesDto.unitPrice,
      name: createPropertyTypesDto.name,
      entityProfileId,
    });

    await this.dbManager.save(propertyType);
  }

  async getPropertyTypes(
    entityProfileId: string,
    { name, unitPrice }: { name?: string; unitPrice?: string } = {},
  ) {
    //

    const propertyTypes =
      name || unitPrice
        ? await this.dbManager.find(PropertyType, {
            where: {
              entityProfileId,
              ...(name ? { name } : {}),
              ...(unitPrice ? { unitPrice } : {}),
            },
          })
        : await this.dbManager.find(PropertyType, {
            where: {
              entityProfileId,
            },
          });

    return propertyTypes;
  }

  async getBillingsByMonth(
    propertySubscriptionId: string,
    month: string,
    year: string,
    entityProfileId?: string,
  ) {
    //
    const billings = await this.dbManager.find(Billing, {
      where: {
        propertySubscriptionId,
        month,
        year,
        ...(entityProfileId ? { entityProfileId } : {}),
      },
      relations: {
        propertySubscription: {
          propertySubscriptionUnits: true,
          billingAccount: true,
          payments: true,
        },
      },
    });

    const mappedBilling = billings.map((bill) => {
      return {
        billing: {
          id: bill.id,
          amount: bill.amount,
          month: bill.month,
          year: bill.year,
        },
        arreas: bill.propertySubscription.billingAccount.totalBillings,
        propertySubscriptionUnits:
          bill.propertySubscription.propertySubscriptionUnits.map(
            (propertySubscriptionUnit) => {
              return {
                propertyType:
                  propertySubscriptionUnit.entitySubscriberProperty.propertyType
                    .name,
                unitPrice:
                  propertySubscriptionUnit.entitySubscriberProperty.propertyType
                    .unitPrice,
                unitCount: propertySubscriptionUnit.propertyUnits,
              };
            },
          ),
        lastPayment: {
          amount: bill.propertySubscription.payments.pop()?.amount,
          date: bill.propertySubscription.payments.pop()?.createdAt,
        },
      };
    });

    return mappedBilling;
  }

  async generateBilling(
    generatePrintBIllingDto: GenerateBillingDto,
    entityProfileId: string,
  ) {
    // check if to generate for all properties
    if (generatePrintBIllingDto.forAllProperties) {
      throwBadRequest('This is currently not available.');
    } else if (generatePrintBIllingDto.forPropertiesOnStreet) {
      // TODO: handle this
      const properties = await this.dbManager.find(PropertySubscription, {
        where: {
          streetId: generatePrintBIllingDto.streetId,
          entityProfileId,
        },
      });

      await Promise.all(
        properties.map(async (prop) => {
          await this.generateMonthBilling(
            prop.id,
            generatePrintBIllingDto.month,
            generatePrintBIllingDto.year,
          );
        }),
      );
    } else {
      //
      await this.generateMonthBilling(
        generatePrintBIllingDto.propertySuscriptionId,
        generatePrintBIllingDto.month,
        generatePrintBIllingDto.year,
      );
    }
  }

  async getBilling(
    generatePrintBIllingDto: GetBillingQuery,
    entityProfileId: string,
  ) {
    //
    if (generatePrintBIllingDto.forAllProperties) {
      //
      throwBadRequest('This is currently not available.');
    } else if (
      generatePrintBIllingDto.forPropertiesOnStreet ||
      generatePrintBIllingDto.streetId
    ) {
      const properties = await this.dbManager.find(PropertySubscription, {
        where: {
          streetId: generatePrintBIllingDto.streetId,
          entityProfileId,
        },
      });

      const billings = await Promise.all(
        properties.map(async (prop) => {
          await this.getBillingsByMonth(
            prop.id,
            generatePrintBIllingDto.month,
            generatePrintBIllingDto.year,
          );
        }),
      );

      return billings;
    } else {
      const billings = await this.getBillingsByMonth(
        generatePrintBIllingDto.propertySuscriptionId,
        generatePrintBIllingDto.month,
        generatePrintBIllingDto.month,
        entityProfileId,
      );

      return billings;
    }
  }

  async generateMonthBilling(
    propertySubscriptionId: string,
    month: string,
    year?: string,
  ) {
    //
    const propertySubscription = await this.dbManager.findOne(
      PropertySubscription,
      {
        where: {
          id: propertySubscriptionId,
        },
      },
    );
    if (!propertySubscription) {
      throwBadRequest('Property subscription not found.');
    }

    const billingAccount = await this.dbManager.findOne(BillingAccount, {
      where: {
        propertySubscriptionId,
      },
    });

    if (!billingAccount) {
      throwBadRequest('Billing account not found.');
    }

    const billing = await this.dbManager.findOne(Billing, {
      where: {
        propertySubscriptionId: propertySubscription.id,
        month: month || this.getMonthName(),
        year: year || new Date().getFullYear().toString(),
      },
    });

    if (billing) {
      throwBadRequest('Billing already generated.');
    }

    const propertySubscriptionUnits = await this.dbManager.find(
      PropertySubscriptionUnit,
      {
        where: {
          propertySubscriptionId,
        },
        relations: {
          entitySubscriberProperty: {
            propertyType: true,
          },
        },
      },
    );

    const billingAmount = this.calculateBillingAmount(
      propertySubscriptionUnits,
    );

    await this.dbManager.transaction(async (transactionalEntityManager) => {
      const currentBilling = transactionalEntityManager.create(Billing, {
        propertySubscriptionId: propertySubscription.id,
        month: month || this.getMonthName(),
        year: year || new Date().getFullYear().toString(),
        amount: billingAmount.toString(),
      });
      await transactionalEntityManager.save(currentBilling);

      // update billing account
      // TODO: use bigNumber form math js
      billingAccount.totalBillings = bignumber(billingAccount.totalBillings)
        .add(currentBilling.amount)
        .toString();

      await transactionalEntityManager.save(billingAccount);
    });
  }

  calculateBillingAmount(propertyUnits: PropertySubscriptionUnit[]) {
    return propertyUnits.reduce((total, propertySubscriptionUnit) => {
      return (
        total +
        propertySubscriptionUnit.propertyUnits *
          (Number(
            propertySubscriptionUnit.entitySubscriberProperty.propertyType
              .unitPrice,
          ) || 0)
      );
    }, 0);
  }

  async getBillingAccountArrears(
    entityProfileId: string,
    {
      limit = 5,
      page = 1,
      month = this.getMonthName(),
      year = new Date().getFullYear().toString(),
    }: { limit?: number; page?: number; month?: string; year?: string } = {},
  ) {
    const streetsOwnedByEntity = await this.dbManager.find(Street, {
      where: {
        entityProfileId,
        ...(month
          ? {
              propertySubscriptions: {
                billings: {
                  month,
                  year,
                },
              },
            }
          : {}),
      },
      relations: {
        propertySubscriptions: {
          billingAccount: true,
          billings: true,
        },
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    const mappedStreetsAndArrears = streetsOwnedByEntity.map((street) => {
      return {
        streetId: street.id,
        streetName: street.name,
        totalBilling: street.propertySubscriptions.reduce((total, sub) => {
          return total + Number(sub.billingAccount.totalBillings || 0);
        }, 0),
        arrears: street.propertySubscriptions.reduce((total, sub) => {
          const currentArrears =
            Number(sub.billingAccount.totalBillings || 0) -
            Number(sub.billingAccount.totalPayments || 0);

          total += currentArrears > 0 ? currentArrears : 0;
          return total;
        }, 0),
      };
    });

    return mappedStreetsAndArrears;
  }

  async getBillingDetailsOrDefaulters(
    entityProfileId: string,
    {
      streetId,
      billingMonth,
      billingYear = new Date().getFullYear(),
    }: { streetId: string; billingMonth?: string; billingYear?: number },
  ) {
    //
    const street = await this.getStreetOrThrowError({
      streetId,
      entityProfileId,
      throwError: true,
    });

    // TODO: validate billing month

    let billingDetails: {
      streetName: string;
      PropertySubscriptionId: string;
      propertyName: string;
      currentBilling: string;
      arrears: number;
      totalBilling?: string;
    }[] = [];
    if (!billingMonth) {
      const propertySubscriptions = await this.dbManager.find(
        PropertySubscription,
        {
          where: {
            streetId,
            billingAccount: {
              totalBillings: Raw(
                () => `"totalBillings" - "totalPayments" > '0' :: numeric`,
              ),
            },
          },
          relations: {
            billings: true,
            billingAccount: true,
          },
        },
      );

      billingDetails = propertySubscriptions.map((propertySubscription) => {
        let arrears = bignumber(
          propertySubscription.billingAccount.totalBillings,
        )
          .sub(propertySubscription.billingAccount.totalPayments)
          .toNumber();

        arrears = arrears >= 0 ? arrears : 0;
        return {
          streetName: street.name,
          PropertySubscriptionId: propertySubscription.id,
          propertyName: propertySubscription.propertySubscriptionName,
          currentBilling: propertySubscription.billings?.[0].amount,
          arrears,
        };
      });
    } else {
      billingDetails = (
        await this.dbManager
          .createQueryBuilder(PropertySubscription, 'propertySubscription')
          .select((qb) => {
            return qb
              .from(Street, 'street')
              .select('street.name', 'streetName')
              .where('street.id = :streetId', { streetId });
          }, 'streetName')
          .addSelect('propertySubscription.id', 'propertySubscriptionId')
          .addSelect(
            'propertySubscription.propertySubscriptionName',
            'propertyName',
          )
          .addSelect(
            (qb) =>
              qb
                .from(BillingAccount, 'billingAccount')
                .select(
                  `billingAccount.totalBillings :: numeric - billingAccount.totalPayments :: numeric - coalesce((
                    ${this.dbManager
                      .createQueryBuilder(Billing, 'billing')
                      .select('billing.amount', 'amount')
                      .where(`billing.month = :billingMonth`)
                      .andWhere(`billing.year = '${billingYear}'`, {
                        billingMonth,
                      })
                      .andWhere(
                        'billing.propertySubscriptionId = "propertySubscription"."id"',
                      )
                      .getQuery()}
                  ) :: numeric, 0)`,
                  'arrears',
                )
                .where(
                  `billingAccount.propertySubscriptionId = "propertySubscription"."id"`,
                ),
            'arrears',
          )
          .addSelect(
            (qb) =>
              qb
                .from(Billing, 'billing')
                .select('billing.amount', 'amount')
                .where(`billing.month = :billingMonth`)
                .andWhere(`billing.year = '${billingYear}'`, { billingMonth })
                .andWhere(
                  'billing.propertySubscriptionId = "propertySubscription"."id"',
                ),
            'currentBilling',
          )
          .addSelect(
            (qb) =>
              qb
                .from(BillingAccount, 'billingAccount')
                .select(
                  `billingAccount.totalBillings - billingAccount.totalPayments`,
                  'totalBilling',
                )
                .where(
                  `billingAccount.propertySubscriptionId = "propertySubscription"."id"`,
                ),
            'totalBilling',
          )
          .where('propertySubscription.streetId = :streetId', {
            streetId,
            billingMonth,
          })
          .getRawMany()
      ).map((result) =>
        pick(result, [
          'streetName',
          'propertySubscriptionId',
          'propertyName',
          'arrears',
          'currentBilling',
          'totalBilling',
        ]),
      ) as unknown as {
        streetName: string;
        PropertySubscriptionId: string;
        propertyName: string;
        currentBilling: string;
        arrears: number;
        totalBilling?: string;
      }[];
    }

    return billingDetails;
  }

  async getDashboardMetrics(entityProfileId: string) {
    // get number of streets
    // get number of subscribers
    // get number of properties

    const dashboardMetrics = {
      streetCount: 0,
      subscriberCount: 0,
      properitesCount: 0,
      totalBillings: 0,
      totalPayments: 0,
      billingAcrossMonths: [],
      paymentsAcrossMonths: [],
    };

    try {
      dashboardMetrics.streetCount = await this.dbManager.count(Street, {
        where: {
          entityProfileId,
        },
      });
    } catch (err) {
      Logger.log('An error occured while calculating street count', err);
    }

    try {
      dashboardMetrics.subscriberCount = await this.dbManager.count(
        PropertySubscription,
        {
          where: {
            entityProfileId,
          },
        },
      );
    } catch (err) {
      Logger.log('An error occured while calculating subscriber count', err);
    }

    try {
      dashboardMetrics.properitesCount = await this.dbManager.count(
        PropertySubscriptionUnit,
        {
          where: {
            propertySubscription: {
              entityProfileId,
            },
          },
        },
      );
    } catch (err) {
      Logger.log('An error occured while calculating properites count', err);
    }

    // get total billings
    // get total payments
    const month = MonthNames[new Date().getMonth() + 1];
    try {
      const billingAcrossMonths = await this.dbManager.find(Billing, {
        where: {
          propertySubscription: {
            entityProfileId,
          },
          year: new Date().getFullYear().toString(),
        },
      });

      dashboardMetrics.totalBillings = billingAcrossMonths.reduce(
        (acc, curr) => {
          dashboardMetrics.billingAcrossMonths.push({
            month: curr.month,
            amount: curr.amount,
          });
          return bignumber(acc).add(curr.amount).toNumber();
        },
        0,
      );
    } catch (err) {
      Logger.log('An error occured while calculating total billings', err);
    }

    try {
      const paymentsAcrossMonths = await this.dbManager.find(Payment, {
        where: {
          propertySubscription: {
            entityProfileId,
          },
          createdAt: Raw(($alias) => `extract(month from ${$alias}) = :month`, {
            month: this.getMonthNumber(month),
          }),
        },
      });

      dashboardMetrics.totalPayments = paymentsAcrossMonths.reduce(
        (acc, curr) => {
          dashboardMetrics.paymentsAcrossMonths.push({
            month: this.getMonthName(new Date().getMonth() + 1),
            amount: curr.amount,
          });
          return bignumber(acc).add(curr.amount).toNumber();
        },
        0,
      );
    } catch (err) {
      Logger.log('An error occured while calculating total payments', err);
    }

    return dashboardMetrics;
  }

  async postPayment(postPaymentDto: PostPaymentDto, entityProfileId: string) {
    //
    const propertySubscription = await this.dbManager.findOne(
      PropertySubscription,
      {
        where: {
          id: postPaymentDto.propertySubscriptionId,
          entityProfileId,
        },
      },
    );

    if (!propertySubscription) {
      throwBadRequest('Property subscription not found.');
    }

    const payment = this.dbManager.create(Payment, {
      ...postPaymentDto,
    });

    await this.dbManager.save(payment);
  }

  getMonthNumber(monthName: string) {
    const monthNumber = Object.values(MonthNames).indexOf(monthName) + 1;
    return monthNumber;
  }

  async getPayments({
    propertySubscriptionId,
    entityProfileId,
    year = new Date().getFullYear().toString(),
    month,
  }: {
    propertySubscriptionId: string;
    entityProfileId: string;
    year?: string;
    month?: string;
  }) {
    //

    let payments: Payment[] = [];
    if (month && year) {
      payments = await this.dbManager.find(Payment, {
        where: {
          ...(propertySubscriptionId ? { propertySubscriptionId } : {}),
          paymentDate: Raw(
            ($alias) => `extract(month from ${$alias}) = :month`,
            {
              month: this.getMonthNumber(month),
            },
          ),
          propertySubscription: {
            entityProfileId: entityProfileId,
          },
        },
        relations: {
          propertySubscription: true,
        },
      });
    } else {
      payments = await this.dbManager.find(Payment, {
        where: {
          propertySubscriptionId: propertySubscriptionId,
          propertySubscription: {
            entityProfileId: entityProfileId,
          },
          ...(year ? { year } : {}),
        },
        relations: {
          propertySubscription: true,
        },
      });
    }

    return payments.map((payment) => ({
      id: payment.id,
      amount: payment.amount,
      paymentDate: payment.paymentDate,
      propertySubscriptionId: payment.propertySubscriptionId,
      payerName: payment.payerName,
      year: new Date(payment.paymentDate).getFullYear().toString(),
      month: MonthNames[new Date(payment.paymentDate).getMonth() + 1],
      propertySubscriptionName:
        payment.propertySubscription.propertySubscriptionName,
    }));
  }

  async createStreet(
    createStreetDto: CreateStreetDto,
    authPayload: AuthTokenPayload,
  ) {
    const entityProfileId = authPayload.profile.entityProfileId;
    const lgaWardId = createStreetDto.lgaWardId;

    // check if street with name already exists
    let street = await this.dbManager.findOne(Street, {
      where: {
        name: ILike(`%${createStreetDto.name}%`),
        lgaWardId,
        entityProfileId,
      },
    });

    if (!street) {
      // street does not exist, create new street

      // verify lgaWard and lga exist
      await this.getLgaWardOrThrowError({
        lgaWardId,
      });

      street = this.dbManager.create(Street, {
        name: createStreetDto.name,
        lgaWardId,
        entityProfileId,
      });

      await this.dbManager.save(street);
    }

    return street;
  }

  async createLgaWard(createLgaWardDto: CreateLgaWardDto) {
    await this.getLgaOrThrowError({ lgaId: createLgaWardDto.lgaId });
    const lgaId = createLgaWardDto.lgaId;

    // verify lgaWard does not already exist
    let lgaWard = await this.getLgaWardOrThrowError({
      name: ILike(`%${createLgaWardDto.name}%`),
      throwError: false,
    });

    if (!lgaWard) {
      lgaWard = this.dbManager.create(LgaWard, {
        name: createLgaWardDto.name,
        lgaId,
      });

      lgaWard = await this.dbManager.save(lgaWard);
    }
    return lgaWard;
  }

  async createLga(createLgaDto: CreateLgaDto) {
    // verify lga does not exist
    let lga = await this.getLgaOrThrowError({
      name: ILike(`%${createLgaDto.name}%`),
      throwError: false,
    });

    if (!lga) {
      lga = this.dbManager.create(Lga, {
        name: createLgaDto.name,
      });

      await this.dbManager.save(lga);
    }

    return lga;
  }

  async getLgas(query?: string) {
    const lgas = query
      ? await this.dbManager.find(Lga, {
          where: {
            name: ILike(`%${query}%`),
          },
        })
      : await this.dbManager.find(Lga);

    return lgas;
  }

  async getLgaWards({ query, lgaId }: { query?: string; lgaId?: string }) {
    const lgaWards =
      query || lgaId
        ? await this.dbManager.find(LgaWard, {
            where: {
              ...(query ? { name: ILike(`%${query}%`) } : {}),
              ...(lgaId ? { lgaId } : {}),
            },
          })
        : await this.dbManager.find(LgaWard);
    return lgaWards;
  }

  async getStreets(
    entityProfileId: string,
    { query, lgaWardId }: { query?: string; lgaWardId?: string },
  ) {
    const streets =
      query || lgaWardId
        ? await this.dbManager.find(Street, {
            where: {
              ...(query ? { name: ILike(`%${query}%`) } : {}),
              ...(lgaWardId ? { lgaWardId } : {}),
              entityProfileId,
            },
          })
        : await this.dbManager.find(Street, {
            where: {
              entityProfileId,
            },
          });
    return streets;
  }

  async getPhoneCode({
    query,
    phoneCodeId,
  }: { query?: string; phoneCodeId?: string } = {}) {
    if (phoneCodeId) {
      const phoneCode = await this.dbManager.findOne(PhoneCode, {
        where: { id: phoneCodeId },
      });

      return phoneCode;
    }

    const phoneCodes = query
      ? await this.dbManager.find(PhoneCode, {
          where: {
            name: ILike(`%${query}%`),
          },
        })
      : await this.dbManager.find(PhoneCode);

    return phoneCodes;
  }

  //
  async getPhoneCodeOrThrow({
    phoneCodeId,
    name,
    throwError = true,
  }: { phoneCodeId?: string; name?: string; throwError?: boolean } = {}) {
    const phoneCode = await this.dbManager.findOne(PhoneCode, {
      where: {
        ...(phoneCodeId ? { id: phoneCodeId } : { name: ILike(`%${name}%`) }),
      },
    });

    throwError = !phoneCode && throwError;
    if (throwError) {
      throwBadRequest('Phone code not found.');
    }
    return phoneCode;
  }

  async getLgaWardOrThrowError({
    name,
    lgaWardId,
    throwError = true,
  }: {
    name?: string | FindOperator<string>;
    lgaWardId?: string;
    throwError?: boolean;
  }) {
    const lgaWard = await this.dbManager.findOne(LgaWard, {
      where: {
        ...(name ? { name } : { id: lgaWardId }),
      },
    });

    throwError = !lgaWard && throwError;
    if (throwError) {
      throwBadRequest('Lga ward not found.');
    }

    return lgaWard;
  }

  async getLgaOrThrowError({
    name,
    lgaId,
    throwError = true,
  }: {
    name?: string | FindOperator<string>;
    lgaId?: string;
    throwError?: boolean;
  }) {
    const lga = await this.dbManager.findOne(Lga, {
      where: {
        ...(name ? { name } : { id: lgaId }),
      },
    });

    throwError = !lga && throwError;
    if (throwError) {
      throwBadRequest('Lga not found.');
    }

    return lga;
  }

  getMonthName(month?: number) {
    if (!month) {
      month = new Date().getMonth() + 1;
    }

    return MonthNames[month];
  }

  async validateEntitySubscriberProfileById(
    propertySubscriberProfileId: string,
  ) {
    const propertySubscriberProfile = await this.dbManager.findOne(
      EntitySubscriberProfile,
      {
        where: {
          id: propertySubscriberProfileId,
        },
      },
    );

    if (!propertySubscriberProfile) {
      throwBadRequest('Reference to subscriber is invalid.');
    }

    return !!propertySubscriberProfile;
  }

  async getPropertyTypeOrThrowError({
    name,
    propertyTypeId,
    unitPrice,
    throwError = true,
  }: {
    name?: string | FindOperator<string>;
    propertyTypeId?: string;
    unitPrice?: string;
    throwError?: boolean;
  }) {
    const propertyType = await this.dbManager.findOne(PropertyType, {
      where: {
        ...(name ? { name, unitPrice } : { id: propertyTypeId }),
      },
    });

    throwError = !propertyType && throwError;
    if (throwError) {
      throwBadRequest('Reference to property type is invalid.');
    }

    return propertyType;
  }

  async getStreetOrThrowError({
    name,
    streetId,
    entityProfileId,
    throwError = true,
  }: {
    name?: string | FindOperator<string>;
    streetId?: string;
    entityProfileId?: string;
    throwError?: boolean;
  }) {
    const street = await this.dbManager.findOne(Street, {
      where: {
        ...(name ? { name } : { id: streetId }),
        ...(entityProfileId ? { entityProfileId } : {}),
      },
    });

    throwError = !street && throwError;
    if (throwError) {
      throwBadRequest('Reference to street is invalid.');
    }

    return street;
  }
}
 */
