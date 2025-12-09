# Resolve 360 Unified - NestJS Microservice Base

Production-ready NestJS microservice base repository with enterprise-grade patterns, comprehensive security, and full deployment support.

## 🚀 Technology Stack

- **Framework:** NestJS 11.x
- **Language:** TypeScript 5.4+
- **Runtime:** Node.js 20 LTS
- **Database:** PostgreSQL 16+ with TypeORM 0.3.20+
- **Queue System:** Bull with Redis 7.x
- **Authentication:** JWT (session & web tokens) + API Key
- **API Documentation:** Swagger/OpenAPI
- **Process Manager:** PM2
- **Containerization:** Docker & Docker Compose

## 📋 Prerequisites

- Node.js 20.x or higher
- npm or yarn
- PostgreSQL 16+ (or use Docker Compose)
- Redis 7.x (or use Docker Compose)
- Docker & Docker Compose (optional, for containerized development)

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd resolve-360-unified
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Application
NODE_ENV=dev
PORT=3000

# Database
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_DB=resolve_360_db

# Redis
REDIS_HOST=localhost
REDIS_HOST_PORT=6379

# Authentication (Generate strong secrets!)
JWT_SECRET=your_jwt_secret_for_web
JWT_SESSION_SECRET=your_jwt_session_secret
ENCRYPTION_KEY=your_encryption_key
EXTERNAL_MICROSERVICE_API_KEY=your_api_key
```

**⚠️ Security Warning:** Generate strong secrets for production:

```bash
# Generate JWT secrets
openssl rand -base64 32

# Generate encryption key
openssl rand -base64 24
```

### 4. Start Infrastructure (Using Docker Compose)

```bash
# Start PostgreSQL and Redis
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🏃 Running the Application

### Development Mode

```bash
# Standard development mode with hot reload
npm run start:dev

# Development mode with debugger attached (port 9229)
npm run start:debug
```

### Production Mode

```bash
# Build the application
npm run build

# Run compiled JavaScript
npm run start:prod
```

### Using PM2 (Process Manager)

```bash
# Development
npm run start:dev:deploy

# QA
npm run start:qa:deploy

# UAT
npm run start:uat:deploy

# Production (cluster mode with all CPU cores)
npm run start:prod:deploy
```

### Using Docker

```bash
# Build Docker image
docker build -t resolve-360-unified .

# Run container
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e POSTGRES_HOST=host.docker.internal \
  -e REDIS_HOST=host.docker.internal \
  resolve-360-unified
```

## 🐛 Debugging in VS Code

This project includes comprehensive VS Code debug configurations for all scenarios.

### Available Debug Configurations

| Configuration | Use Case | How to Use |
|---------------|----------|------------|
| **Debug NestJS (Development)** | Standard debugging with breakpoints | Press F5, select config |
| **Debug NestJS (Watch Mode)** | Auto-restart on file changes | Press F5, files auto-reload |
| **Attach to Running Process** | Debug running app (`npm run start:debug`) | Run command, then F5 |
| **Jest: Current File** | Debug single test file | Open test file, press F5 |
| **Jest: All Tests** | Debug entire test suite | Press F5, select config |
| **E2E Tests** | Debug end-to-end tests | Press F5, select config |

### Debug Workflow

1. **Set Breakpoints:**
   - Click left of line numbers ORPress `F9` on a line

2. **Start Debugging:**
   - Press `F5`
   - Select your debug configuration
   - Application starts with debugger attached

3. **Use Debug Controls:**
   - `F5` - Continue
   - `F10` - Step Over
   - `F11` - Step Into
   - `Shift+F11` - Step Out
   - `Shift+F5` - Stop Debugging

4. **Inspect Variables:**
   - Hover over variables to see values
   - Use Debug sidebar to view call stack
   - Add watch expressions for real-time monitoring

### Debug Examples

**Example 1: Debug a Controller Method**

```typescript
@Get(':id')
async findOne(@Param('id') id: string) {
  // Set breakpoint here ← Press F9
  const result = await this.service.findOne(id);
  return result;
}
```

**Example 2: Debug a Test**

```typescript
it('should return user', async () => {
  // Set breakpoint here ← Press F9
  const result = await service.findOne('123');
  expect(result).toBeDefined();
});
```

Then:
1. Open the file in VS Code
2. Press `F5`
3. Select "Jest: Current File"
4. Breakpoint will hit during test execution

## 🧪 Testing

### Unit Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:cov

# Debug tests
npm run test:debug
```

### End-to-End Tests

```bash
# Run E2E tests
npm run test:e2e

# Debug E2E tests
npm run test:e2e:debug
```

### Test Structure

```
test/
├── app.e2e-spec.ts           # E2E tests for application endpoints
└── jest-e2e.json             # E2E test configuration

src/**/*.spec.ts               # Unit tests next to source files
```

## 📚 API Documentation

### Swagger UI

Access interactive API documentation at:

```
http://localhost:3000/api
```

The Swagger UI provides:
- All available endpoints
- Request/response schemas
- Try-it-out functionality
- Authentication testing (JWT & API Key)

### Authentication Methods

1. **JWT Bearer Token (Web):**
   ```bash
   curl -H "Authorization: Bearer <jwt_token>" http://localhost:3000/protected
   ```

2. **JWT Session Token (Mobile):**
   ```bash
   curl -H "Authorization: Bearer <session_token>" http://localhost:3000/protected
   ```

3. **API Key (Internal Microservices):**
   ```bash
   curl -H "x-api-key: <api_key>" http://localhost:3000/internal-endpoint
   ```

## 🏥 Health Checks

The application provides three health check endpoints:

### 1. Basic Health Check

```bash
curl http://localhost:3000/health
```

Returns: Application status (up/down)

### 2. Readiness Probe (Kubernetes)

```bash
curl http://localhost:3000/readiness
```

Checks:
- Database connectivity
- Disk storage (70% threshold)
- Memory heap (150MB threshold)

### 3. Liveness Probe (Kubernetes)

```bash
curl http://localhost:3000/liveness
```

Returns: Basic application liveness status

## 🗂️ Project Structure

```
resolve-360-unified/
├── src/
│   ├── config/                    # Configuration files
│   │   ├── config.ts              # External config service integration
│   │   ├── environment.ts         # NestJS ConfigModule setup
│   │   ├── postgres.ts            # TypeORM configuration
│   │   └── HttpConfig.service.ts  # Axios configuration
│   ├── entities/                  # TypeORM entities
│   │   ├── user.entity.ts         # Example User entity
│   │   └── index.ts               # Entity barrel export
│   ├── modules/
│   │   ├── base/                  # Health checks
│   │   │   ├── base.controller.ts
│   │   │   └── base.module.ts
│   │   └── common/                # Common services
│   │       ├── common.service.ts
│   │       └── common.module.ts
│   ├── shared/
│   │   ├── dto/                   # Data Transfer Objects
│   │   ├── enums/                 # Enumerations
│   │   ├── interfaces/            # TypeScript interfaces
│   │   ├── middlewares/
│   │   │   ├── auth.guard.ts      # JWT & API key validation
│   │   │   ├── internal-request.decorator.ts
│   │   │   └── interceptors/
│   │   │       └── logging.interceptor.ts
│   │   ├── services/
│   │   │   ├── errorHandler.service.ts
│   │   │   └── s3.service.ts      # Optional S3 integration
│   │   └── shared.module.ts
│   ├── lib/
│   │   └── cryptor.ts             # AES encryption utilities
│   ├── app.module.ts              # Root module
│   ├── app.controller.ts          # Root controller
│   ├── app.service.ts             # Root service
│   └── main.ts                    # Bootstrap file
├── test/                          # E2E tests
├── .vscode/                       # VS Code configurations
│   ├── launch.json                # Debug configurations
│   ├── settings.json              # Workspace settings
│   └── extensions.json            # Recommended extensions
├── Dockerfile                     # Docker configuration
├── docker-compose.yml             # Local development infrastructure
├── ecosystem.config.*.json        # PM2 configurations
└── package.json                   # Dependencies and scripts
```

## 🔒 Security Features

### 1. Authentication Guard

- JWT token validation (session and web tokens)
- API key validation for internal requests
- Public route exemption
- Integration with custom decorators

### 2. Security Middleware

- **Helmet:** Security headers
- **Compression:** Response compression
- **CORS:** Configured origin control
- **Rate Limiting:** 10 requests per 60 seconds

### 3. Encryption

AES-192-CBC encryption available via `Encrypter` class:

```typescript
import { encrypter } from './lib/cryptor';

const encrypted = encrypter.encrypt('sensitive data');
const decrypted = encrypter.decrypt(encrypted);
```

### 4. Request Logging

All requests are logged with:
- Correlation ID (x-correlation-id header)
- Request method, URL, body
- Response status, duration
- Error details

## 📊 Environment Variables Reference

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment (dev/qa/uat/prod) | `dev` | No |
| `PORT` | Application port | `3000` | No |
| `POSTGRES_HOST` | PostgreSQL host | `localhost` | Yes |
| `POSTGRES_PORT` | PostgreSQL port | `5432` | No |
| `POSTGRES_USER` | Database user | `postgres` | Yes |
| `POSTGRES_PASSWORD` | Database password | - | Yes |
| `POSTGRES_DB` | Database name | `resolve_360_db` | Yes |
| `SSL` | Enable SSL for database | `false` | No |
| `REDIS_HOST` | Redis host | `localhost` | Yes |
| `REDIS_HOST_PORT` | Redis port | `6379` | No |
| `REDIS_HOST_DB` | Redis database index | `0` | No |
| `REDIS_HOST_PASSWORD` | Redis password | - | No |
| `REDIS_HOST_SSL` | Enable SSL for Redis | `false` | No |
| `JWT_SECRET` | JWT secret for web tokens | - | Yes |
| `JWT_SESSION_SECRET` | JWT secret for session tokens | - | Yes |
| `ENCRYPTION_KEY` | AES encryption key | - | Yes |
| `EXTERNAL_MICROSERVICE_API_KEY` | API key for internal services | - | Yes |
| `CONFIG_SERVICE_URL` | External config service URL | - | No |

## 🚀 Deployment

### Development Deployment

```bash
npm run start:dev:deploy
```

### Production Deployment

```bash
# Build application
npm run build

# Start with PM2 in cluster mode
npm run start:prod:deploy

# Check status
pm2 status

# View logs
pm2 logs resolve-360-unified-prod

# Monitor
pm2 monit
```

### Docker Deployment

```bash
# Build image
docker build -t resolve-360-unified:1.0.0 .

# Run container
docker run -d \
  --name resolve-360-unified \
  -p 3000:3000 \
  --env-file .env \
  resolve-360-unified:1.0.0
```

### Kubernetes Deployment

Use the provided health check endpoints:

```yaml
livenessProbe:
  httpGet:
    path: /liveness
    port: 3000
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /readiness
    port: 3000
  initialDelaySeconds: 10
  periodSeconds: 5
```

## 🔄 Code Quality

### Linting

```bash
# Run ESLint
npm run lint

# Auto-fix issues
npm run lint -- --fix
```

### Formatting

```bash
# Format code with Prettier
npm run format
```

### Pre-commit Checks

Consider adding husky for pre-commit hooks:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run lint && npm run test"
    }
  }
}
```

## 📝 Development Guidelines

### Naming Conventions

- **Files:** kebab-case (`user.service.ts`)
- **Classes:** PascalCase (`UserService`)
- **Interfaces:** I + PascalCase (`IResponse`)
- **Variables/Functions:** camelCase (`getUserById`)
- **Database Columns:** snake_case (`user_ref_id`)

### Adding New Features

1. Create feature module in `src/modules/`
2. Add entities to `src/entities/`
3. Create DTOs in feature module
4. Add services and controllers
5. Import module in `app.module.ts`
6. Add tests
7. Update Swagger documentation

## 🆘 Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
docker-compose ps

# View PostgreSQL logs
docker-compose logs postgres

# Test connection
psql -h localhost -U postgres -d resolve_360_db
```

### Redis Connection Issues

```bash
# Check Redis is running
docker-compose ps

# Test Redis connection
redis-cli ping
```

### Build Errors

```bash
# Clean and rebuild
rm -rf dist node_modules
npm install
npm run build
```

## 📄 License

This project is licensed under the UNLICENSED license.

## 👥 Contributing

1. Create a feature branch
2. Make your changes
3. Add tests
4. Ensure linting passes: `npm run lint`
5. Ensure tests pass: `npm run test`
6. Submit a pull request

## 📞 Support

For issues or questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation at `/api`

---

**Built with ❤️ using NestJS 11.x, TypeScript 5.4+, and Node.js 20 LTS**
