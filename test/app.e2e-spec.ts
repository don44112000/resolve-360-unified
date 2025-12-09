import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Application (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterEach(async () => {
        await app.close();
    });

    describe('Health Endpoints', () => {
        it('/health (GET) - should return health status', () => {
            return request(app.getHttpServer())
                .get('/health')
                .expect(200)
                .expect((res) => {
                    expect(res.body.status).toBe('ok');
                });
        });

        it('/readiness (GET) - should return readiness status', () => {
            return request(app.getHttpServer())
                .get('/readiness')
                .expect(200)
                .expect((res) => {
                    expect(res.body.status).toBe('ok');
                });
        });

        it('/liveness (GET) - should return liveness status', () => {
            return request(app.getHttpServer())
                .get('/liveness')
                .expect(200)
                .expect((res) => {
                    expect(res.body.status).toBe('ok');
                });
        });
    });

    describe('Application Endpoints', () => {
        it('/ (GET) - should return application info', () => {
            return request(app.getHttpServer())
                .get('/')
                .expect(200)
                .expect((res) => {
                    expect(res.body.success).toBe(true);
                    expect(res.body.data).toHaveProperty('name');
                    expect(res.body.data).toHaveProperty('version');
                });
        });
    });

    describe('Authentication', () => {
        it('/protected (GET) - should fail without token', () => {
            return request(app.getHttpServer())
                .get('/protected')
                .expect(401);
        });

        it('/protected (GET) - should succeed with valid token', async () => {
            // Note: This test requires a valid JWT token
            // In a real scenario, you would generate or mock a token
            const token = 'valid-jwt-token-here';

            return request(app.getHttpServer())
                .get('/protected')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);
        });
    });
});
