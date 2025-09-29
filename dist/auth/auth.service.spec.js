"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const jwt_1 = require("@nestjs/jwt");
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const users_service_1 = require("../users/users.service");
describe('AuthService', () => {
    let service;
    let usersService;
    let jwtService;
    const mockUser = {
        _id: '1',
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword',
    };
    const mockUsersService = {
        findByEmail: jest.fn(),
        create: jest.fn(),
        validatePassword: jest.fn(),
    };
    const mockJwtService = {
        sign: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                auth_service_1.AuthService,
                {
                    provide: users_service_1.UsersService,
                    useValue: mockUsersService,
                },
                {
                    provide: jwt_1.JwtService,
                    useValue: mockJwtService,
                },
            ],
        }).compile();
        service = module.get(auth_service_1.AuthService);
        usersService = module.get(users_service_1.UsersService);
        jwtService = module.get(jwt_1.JwtService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('register', () => {
        it('should register a new user successfully', async () => {
            const registerDto = {
                email: 'test@example.com',
                password: 'password123',
                name: 'Test User',
            };
            mockUsersService.findByEmail.mockResolvedValue(null);
            mockUsersService.create.mockResolvedValue(mockUser);
            mockJwtService.sign.mockReturnValue('jwt-token');
            const result = await service.register(registerDto);
            expect(result).toEqual({
                access_token: 'jwt-token',
                user: {
                    id: mockUser._id,
                    email: mockUser.email,
                    name: mockUser.name,
                },
            });
            expect(mockUsersService.create).toHaveBeenCalledWith(registerDto.email, registerDto.password, registerDto.name);
        });
        it('should throw ConflictException if user already exists', async () => {
            const registerDto = {
                email: 'test@example.com',
                password: 'password123',
                name: 'Test User',
            };
            mockUsersService.findByEmail.mockResolvedValue(mockUser);
            await expect(service.register(registerDto)).rejects.toThrow(common_1.ConflictException);
        });
    });
    describe('login', () => {
        it('should login user successfully', async () => {
            const loginDto = {
                email: 'test@example.com',
                password: 'password123',
            };
            mockUsersService.findByEmail.mockResolvedValue(mockUser);
            mockUsersService.validatePassword.mockResolvedValue(true);
            mockJwtService.sign.mockReturnValue('jwt-token');
            const result = await service.login(loginDto);
            expect(result).toEqual({
                access_token: 'jwt-token',
                user: {
                    id: mockUser._id,
                    email: mockUser.email,
                    name: mockUser.name,
                },
            });
        });
        it('should throw UnauthorizedException for invalid credentials', async () => {
            const loginDto = {
                email: 'test@example.com',
                password: 'wrongpassword',
            };
            mockUsersService.findByEmail.mockResolvedValue(null);
            await expect(service.login(loginDto)).rejects.toThrow(common_1.UnauthorizedException);
        });
    });
});
//# sourceMappingURL=auth.service.spec.js.map