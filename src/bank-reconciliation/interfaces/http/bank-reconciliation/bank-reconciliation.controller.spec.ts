import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { BankReconciliationModule } from '../../../bank-reconciliation.module';
import { ValidateBankReconciliationRequestDto } from '../../dtos/validate-bank-reconciliation-request.dto';
import { ReasonResponseDTO } from 'src/bank-reconciliation/domain/types/reason.type';

describe('BankReconciliationController (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [BankReconciliationModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Apply same validation pipe as in main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /movements/validation', () => {
    describe('Successful validation (200 OK)', () => {
      it('should return valid result when reconciliation succeeds', async () => {
        const body: ValidateBankReconciliationRequestDto = {
          movements: [
            { id: 1, date: '2025-03-01', wording: 'DEPOT', amount: 500 },
            { id: 2, date: '2025-03-05', wording: 'CARTE', amount: -100 },
            {
              id: 3,
              date: '2025-03-10',
              wording: 'VIREMENT SALAIRE',
              amount: 2100,
            },
          ],
          balances: [
            { date: '2025-02-28', balance: 1500 },
            { date: '2025-03-31', balance: 4000 },
          ],
        };

        const response = await request(app.getHttpServer())
          .post('/movements/validation')
          .send(body)
          .expect(HttpStatus.OK);

        const expectedResponseBody = response.body as ReasonResponseDTO;

        expect(expectedResponseBody).toHaveProperty('isValid', true);
        expect(expectedResponseBody).toHaveProperty('reasons');

        expect(expectedResponseBody.reasons).toHaveLength(1);

        expect(expectedResponseBody.reasons[0].message).toBe('ACCEPTED');
      });
    });

    describe('Failed validation (200 OK with isValid: false)', () => {
      it('should return invalid result when balances do not match', async () => {
        const body = {
          movements: [
            { id: 1, date: '2025-03-01', wording: 'DEPOT', amount: 500 },
          ],
          balances: [
            { date: '2025-02-28', balance: 1000 },
            { date: '2025-03-31', balance: 2000 },
          ],
        };

        const response = await request(app.getHttpServer())
          .post('/movements/validation')
          .send(body)
          .expect(HttpStatus.BAD_REQUEST);

        const expectedResponseBody = response.body as ReasonResponseDTO;

        expect(expectedResponseBody).toHaveProperty('isValid', false);
        expect(expectedResponseBody).toHaveProperty('reasons');

        expect(expectedResponseBody.reasons.length).toBeGreaterThan(0);

        expect(expectedResponseBody.reasons[0]).toHaveProperty('code');

        expect(expectedResponseBody.reasons[0]).toHaveProperty('message');
      });
    });

    describe('Invalid request (400 BAD_REQUEST)', () => {
      it('should return 400 when movements field is missing', async () => {
        const body = {
          balances: [
            { date: '2025-02-28', balance: 1000 },
            { date: '2025-03-31', balance: 2000 },
          ],
        };

        const response = await request(app.getHttpServer())
          .post('/movements/validation')
          .send(body)
          .expect(HttpStatus.BAD_REQUEST);

        const expectedResponseBody = response.body as ReasonResponseDTO;

        expect(expectedResponseBody).toHaveProperty('message');
        expect(expectedResponseBody).toHaveProperty('statusCode', 400);
      });

      it('should return 400 when balances field is missing', async () => {
        const body = {
          movements: [
            { id: 1, date: '2025-03-01', wording: 'DEPOT', amount: 500 },
          ],
        };

        const response = await request(app.getHttpServer())
          .post('/movements/validation')
          .send(body)
          .expect(HttpStatus.BAD_REQUEST);

        const expectedResponseBody = response.body as ReasonResponseDTO;

        expect(expectedResponseBody).toHaveProperty('message');
        expect(expectedResponseBody).toHaveProperty('statusCode', 400);
      });

      it('should return 400 when movement has invalid structure', async () => {
        const body = {
          movements: [{ id: 1, invalidField: 'test' }],
          balances: [
            { date: '2025-02-28', balance: 1000 },
            { date: '2025-03-31', balance: 2000 },
          ],
        };

        const response = await request(app.getHttpServer())
          .post('/movements/validation')
          .send(body)
          .expect(HttpStatus.BAD_REQUEST);

        const expectedResponseBody = response.body as ReasonResponseDTO;

        expect(expectedResponseBody).toHaveProperty('message');
      });
    });
  });
});
