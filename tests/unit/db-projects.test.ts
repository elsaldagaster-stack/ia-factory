import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getProjectsByOwner,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
} from '../../lib/db/projects';

const mockPrisma = vi.hoisted(() => ({
  project: {
    findMany: vi.fn(),
    create: vi.fn(),
    findFirst: vi.fn(),
    update: vi.fn(),
  },
}));

vi.mock('../../lib/db/client', () => ({
  prisma: mockPrisma,
}));

const OWNER_ID = 'user_abc123';

const projectFixture = {
  id: 'proj_1',
  name: 'Test Project',
  description: null,
  status: 'ACTIVE' as const,
  ownerId: OWNER_ID,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
};

describe('getProjectsByOwner', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns projects ordered by createdAt DESC', async () => {
    mockPrisma.project.findMany.mockResolvedValueOnce([projectFixture]);

    const result = await getProjectsByOwner(OWNER_ID);

    expect(result).toEqual([projectFixture]);
    expect(mockPrisma.project.findMany).toHaveBeenCalledWith({
      where: { ownerId: OWNER_ID, status: { not: 'DELETED' } },
      orderBy: { createdAt: 'desc' },
    });
  });

  it('returns empty array when owner has no projects', async () => {
    mockPrisma.project.findMany.mockResolvedValueOnce([]);

    const result = await getProjectsByOwner(OWNER_ID);

    expect(result).toEqual([]);
  });

  it('excludes DELETED projects from results', async () => {
    mockPrisma.project.findMany.mockResolvedValueOnce([projectFixture]);

    await getProjectsByOwner(OWNER_ID);

    expect(mockPrisma.project.findMany).toHaveBeenCalledWith({
      where: { ownerId: OWNER_ID, status: { not: 'DELETED' } },
      orderBy: { createdAt: 'desc' },
    });
  });
});

describe('createProject', () => {
  beforeEach(() => vi.clearAllMocks());

  it('creates project and returns it', async () => {
    mockPrisma.project.create.mockResolvedValueOnce(projectFixture);

    const result = await createProject({
      name: 'Test Project',
      ownerId: OWNER_ID,
    });

    expect(result).toEqual(projectFixture);
    expect(mockPrisma.project.create).toHaveBeenCalledWith({
      data: { name: 'Test Project', ownerId: OWNER_ID },
    });
  });

  it('passes description when provided', async () => {
    mockPrisma.project.create.mockResolvedValueOnce({
      ...projectFixture,
      description: 'Some desc',
    });

    await createProject({
      name: 'Test Project',
      ownerId: OWNER_ID,
      description: 'Some desc',
    });

    expect(mockPrisma.project.create).toHaveBeenCalledWith({
      data: { name: 'Test Project', ownerId: OWNER_ID, description: 'Some desc' },
    });
  });
});

describe('getProjectById', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns project when it belongs to owner', async () => {
    mockPrisma.project.findFirst.mockResolvedValueOnce(projectFixture);

    const result = await getProjectById('proj_1', OWNER_ID);

    expect(result).toEqual(projectFixture);
    expect(mockPrisma.project.findFirst).toHaveBeenCalledWith({
      where: { id: 'proj_1', ownerId: OWNER_ID, status: { not: 'DELETED' } },
    });
  });

  it('returns null when project does not belong to owner', async () => {
    mockPrisma.project.findFirst.mockResolvedValueOnce(null);

    const result = await getProjectById('proj_1', 'other_owner');

    expect(result).toBeNull();
  });

  it('returns null for DELETED projects', async () => {
    mockPrisma.project.findFirst.mockResolvedValueOnce(null);

    await getProjectById('proj_1', OWNER_ID);

    expect(mockPrisma.project.findFirst).toHaveBeenCalledWith({
      where: { id: 'proj_1', ownerId: OWNER_ID, status: { not: 'DELETED' } },
    });
  });
});

describe('updateProject', () => {
  beforeEach(() => vi.clearAllMocks());

  it('updates and returns project when owner matches', async () => {
    const updated = { ...projectFixture, name: 'Updated' };
    mockPrisma.project.update.mockResolvedValueOnce(updated);

    const result = await updateProject('proj_1', OWNER_ID, { name: 'Updated' });

    expect(result).toEqual(updated);
    expect(mockPrisma.project.update).toHaveBeenCalledWith({
      where: { id: 'proj_1', ownerId: OWNER_ID },
      data: { name: 'Updated' },
    });
  });

  it('returns null when Prisma throws RecordNotFound (wrong owner or missing)', async () => {
    const notFoundError = Object.assign(new Error('Record not found'), { code: 'P2025' });
    mockPrisma.project.update.mockRejectedValueOnce(notFoundError);

    const result = await updateProject('proj_1', 'wrong_owner', { name: 'x' });

    expect(result).toBeNull();
  });

  it('re-throws non-P2025 errors', async () => {
    const dbError = Object.assign(new Error('Connection lost'), { code: 'P1001' });
    mockPrisma.project.update.mockRejectedValueOnce(dbError);

    await expect(updateProject('proj_1', OWNER_ID, { name: 'x' })).rejects.toThrow('Connection lost');
  });
});

describe('deleteProject', () => {
  beforeEach(() => vi.clearAllMocks());

  it('sets status to DELETED and returns the updated project', async () => {
    const deleted = { ...projectFixture, status: 'DELETED' as const };
    mockPrisma.project.update.mockResolvedValueOnce(deleted);

    const result = await deleteProject('proj_1', OWNER_ID);

    expect(result).toEqual(deleted);
    expect(mockPrisma.project.update).toHaveBeenCalledWith({
      where: { id: 'proj_1', ownerId: OWNER_ID },
      data: { status: 'DELETED' },
    });
  });

  it('returns null when Prisma throws RecordNotFound (wrong owner or missing)', async () => {
    const notFoundError = Object.assign(new Error('Record not found'), { code: 'P2025' });
    mockPrisma.project.update.mockRejectedValueOnce(notFoundError);

    const result = await deleteProject('proj_1', 'wrong_owner');

    expect(result).toBeNull();
  });

  it('re-throws non-P2025 errors', async () => {
    const dbError = Object.assign(new Error('Connection lost'), { code: 'P1001' });
    mockPrisma.project.update.mockRejectedValueOnce(dbError);

    await expect(deleteProject('proj_1', OWNER_ID)).rejects.toThrow('Connection lost');
  });
});
