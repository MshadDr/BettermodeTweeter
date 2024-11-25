import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsService } from './permissions.service';
import { Permission } from './permissions.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Tweet } from '../tweets/tweets.entity';
import { Group } from '../groups/groups.entity';
import { PermissionCreateRequestDto } from './dtos/requests.dto/permission.create.request.dto';

describe('PermissionsService', () => {
  let service: PermissionsService;
  let permissionRepository: Repository<Permission>;
  let tweetRepository: Repository<Tweet>;
  let groupRepository: Repository<Group>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsService,
        {
          provide: getRepositoryToken(Permission),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Tweet),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Group),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<PermissionsService>(PermissionsService);
    permissionRepository = module.get<Repository<Permission>>(
      getRepositoryToken(Permission),
    );
    tweetRepository = module.get<Repository<Tweet>>(getRepositoryToken(Tweet));
    groupRepository = module.get<Repository<Group>>(getRepositoryToken(Group));
  });

  describe('determinePermissionCreationStrategy', () => {
    it('should call createCustomPermission if permission request data is provided', async () => {
      const permissionRequestData: PermissionCreateRequestDto = {
        publicViewPermission: true,
        usersViewPermissions: [1],
        usersEditPermissions: [1],
      };

      const createPermissionMock = permissionRepository.create as jest.Mock;
      const savePermissionMock = permissionRepository.save as jest.Mock;

      createPermissionMock.mockResolvedValue(permissionRequestData);
      savePermissionMock.mockResolvedValue(permissionRequestData);

      const result = await service.determinePermissionCreationStrategy(
        1,
        null,
        permissionRequestData,
      );

      expect(createPermissionMock).toHaveBeenCalledWith(permissionRequestData);
      expect(savePermissionMock).toHaveBeenCalledWith(permissionRequestData);
      expect(result).toEqual(permissionRequestData);
    });

    it('should return null if a parent tweet is provided', async () => {
      const parentTweet = new Tweet();

      const result = await service.determinePermissionCreationStrategy(
        1,
        parentTweet,
        null,
      );

      expect(result).toBeNull();
    });

    it('should call createFallbackPermission if no permission data is provided and no parent tweet exists', async () => {
      const createFallbackMock = permissionRepository.create as jest.Mock;
      const saveFallbackMock = permissionRepository.save as jest.Mock;

      const userId = 1;
      const fallbackPermission = {
        publicViewPermission: true,
        usersViewPermissions: [userId],
        usersEditPermissions: [userId],
      };

      createFallbackMock.mockResolvedValue(fallbackPermission);
      saveFallbackMock.mockResolvedValue(fallbackPermission);

      const result = await service.determinePermissionCreationStrategy(
        userId,
        null,
        null,
      );

      expect(createFallbackMock).toHaveBeenCalledWith({
        publicViewPermission: true,
        usersViewPermissions: [userId],
        usersEditPermissions: [userId],
      });
      expect(saveFallbackMock).toHaveBeenCalledWith(fallbackPermission);
      expect(result).toEqual(fallbackPermission);
    });
  });
});
