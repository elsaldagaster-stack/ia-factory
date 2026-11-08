import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getProjects, getProject, createProject, updateProject } from '../../app/actions/projects';

const mockAuth = vi.hoisted(() => vi.fn());
const mockGetProjectsByOwner = vi.hoisted(() => vi.fn());
const mockGetProjectById = vi.hoisted(() => vi.fn());
const mockCreateProject = vi.hoisted(() => vi.fn());
const mockUpdateProject = vi.hoisted(() => vi.fn());
const mockRevalidatePath = vi.hoisted(() => vi.fn());

vi.mock('@clerk/nextjs/server', () => ({ auth: mockAuth }));
vi.mock('next/cache', () => ({ revalidatePath: mockRevalidatePath }));
vi.mock('../../lib/db/projects', () => ({
  getProjectsByOwner: mockGetProjectsByOwner,
  getProjectById: mockGetProjectById,
  createProject: mockCreateProject,
  updateProject: mockUpdateProject,
}));

const USER_ID = 'user_abc123';

const projectFixture = {
  id: 'proj_1',
  name: 'Test Project',
  description: null,
  status: 'ACTIVE' as const,
  ownerId: USER_ID,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
};

describe('getProjects', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns projects for authenticated user', async () => {
    mockAuth.mockResolvedValueOnce({ userId: USER_ID });
    mockGetProjectsByOwner.mockResolvedValueOnce([projectFixture]);

    const result = await getProjects();

    expect(result).toEqual([projectFixture]);
    expect(mockGetProjectsByOwner).toHaveBeenCalledWith(USER_ID);
  });

  it('throws when user is not authenticated', async () => {
    mockAuth.mockResolvedValueOnce({ userId: null });

    await expect(getProjects()).rejects.toThrow('Unauthorized');
  });
});

describe('getProject', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns project for authenticated user', async () => {
    mockAuth.mockResolvedValueOnce({ userId: USER_ID });
    mockGetProjectById.mockResolvedValueOnce(projectFixture);

    const result = await getProject('proj_1');

    expect(result).toEqual(projectFixture);
    expect(mockGetProjectById).toHaveBeenCalledWith('proj_1', USER_ID);
  });

  it('returns null when project not found or not owned', async () => {
    mockAuth.mockResolvedValueOnce({ userId: USER_ID });
    mockGetProjectById.mockResolvedValueOnce(null);

    const result = await getProject('proj_999');

    expect(result).toBeNull();
  });

  it('throws when user is not authenticated', async () => {
    mockAuth.mockResolvedValueOnce({ userId: null });

    await expect(getProject('proj_1')).rejects.toThrow('Unauthorized');
  });
});

describe('createProject', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns failure result when name is empty', async () => {
    const result = await createProject({ name: '   ' });
    expect(result).toEqual({ success: false, error: 'El nombre es requerido' });
    expect(mockCreateProject).not.toHaveBeenCalled();
  });

  it('creates project and returns success result', async () => {
    mockAuth.mockResolvedValueOnce({ userId: USER_ID });
    mockCreateProject.mockResolvedValueOnce(projectFixture);

    const result = await createProject({ name: 'Test Project' });

    expect(result).toEqual({ success: true, project: projectFixture });
    expect(mockCreateProject).toHaveBeenCalledWith({
      name: 'Test Project',
      ownerId: USER_ID,
    });
  });

  it('passes description when provided', async () => {
    mockAuth.mockResolvedValueOnce({ userId: USER_ID });
    mockCreateProject.mockResolvedValueOnce({ ...projectFixture, description: 'Desc' });

    const result = await createProject({ name: 'Test Project', description: 'Desc' });

    expect(result).toEqual({ success: true, project: { ...projectFixture, description: 'Desc' } });
    expect(mockCreateProject).toHaveBeenCalledWith({
      name: 'Test Project',
      ownerId: USER_ID,
      description: 'Desc',
    });
  });

  it('returns failure result when DB throws', async () => {
    mockAuth.mockResolvedValueOnce({ userId: USER_ID });
    mockCreateProject.mockRejectedValueOnce(new Error('DB connection failed'));

    const result = await createProject({ name: 'Test Project' });

    expect(result).toEqual({ success: false, error: 'DB connection failed' });
  });

  it('returns failure result when user is not authenticated', async () => {
    mockAuth.mockResolvedValueOnce({ userId: null });

    const result = await createProject({ name: 'Test Project' });

    expect(result).toEqual({ success: false, error: 'Unauthorized' });
  });

  it('calls revalidatePath on successful creation', async () => {
    mockAuth.mockResolvedValueOnce({ userId: USER_ID });
    mockCreateProject.mockResolvedValueOnce(projectFixture);

    await createProject({ name: 'Test Project' });

    expect(mockRevalidatePath).toHaveBeenCalledWith('/projects');
  });

  it('does not call revalidatePath when creation fails', async () => {
    mockAuth.mockResolvedValueOnce({ userId: USER_ID });
    mockCreateProject.mockRejectedValueOnce(new Error('DB error'));

    await createProject({ name: 'Test Project' });

    expect(mockRevalidatePath).not.toHaveBeenCalled();
  });
});

describe('updateProject', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns failure when name is empty', async () => {
    const result = await updateProject('proj_1', { name: '   ' });
    expect(result).toEqual({ success: false, error: 'El nombre es requerido' });
    expect(mockUpdateProject).not.toHaveBeenCalled();
  });

  it('updates project and returns success', async () => {
    mockAuth.mockResolvedValueOnce({ userId: USER_ID });
    const updated = { ...projectFixture, name: 'New Name' };
    mockUpdateProject.mockResolvedValueOnce(updated);

    const result = await updateProject('proj_1', { name: 'New Name' });

    expect(result).toEqual({ success: true, project: updated });
    expect(mockUpdateProject).toHaveBeenCalledWith('proj_1', USER_ID, { name: 'New Name' });
  });

  it('passes description when provided', async () => {
    mockAuth.mockResolvedValueOnce({ userId: USER_ID });
    const updated = { ...projectFixture, description: 'Desc' };
    mockUpdateProject.mockResolvedValueOnce(updated);

    await updateProject('proj_1', { name: 'Test', description: 'Desc' });

    expect(mockUpdateProject).toHaveBeenCalledWith('proj_1', USER_ID, {
      name: 'Test',
      description: 'Desc',
    });
  });

  it('saves empty description as null', async () => {
    mockAuth.mockResolvedValueOnce({ userId: USER_ID });
    mockUpdateProject.mockResolvedValueOnce(projectFixture);

    await updateProject('proj_1', { name: 'Test', description: null });

    expect(mockUpdateProject).toHaveBeenCalledWith('proj_1', USER_ID, {
      name: 'Test',
      description: null,
    });
  });

  it('returns Not found when db returns null', async () => {
    mockAuth.mockResolvedValueOnce({ userId: USER_ID });
    mockUpdateProject.mockResolvedValueOnce(null);

    const result = await updateProject('proj_999', { name: 'New Name' });

    expect(result).toEqual({ success: false, error: 'Proyecto no encontrado' });
  });

  it('calls revalidatePath for /projects and /projects/[id] on success', async () => {
    mockAuth.mockResolvedValueOnce({ userId: USER_ID });
    mockUpdateProject.mockResolvedValueOnce({ ...projectFixture, name: 'New' });

    await updateProject('proj_1', { name: 'New' });

    expect(mockRevalidatePath).toHaveBeenCalledWith('/projects');
    expect(mockRevalidatePath).toHaveBeenCalledWith('/projects/proj_1');
    expect(mockRevalidatePath).toHaveBeenCalledTimes(2);
  });

  it('does not call revalidatePath on failure', async () => {
    mockAuth.mockResolvedValueOnce({ userId: USER_ID });
    mockUpdateProject.mockResolvedValueOnce(null);

    await updateProject('proj_999', { name: 'New' });

    expect(mockRevalidatePath).not.toHaveBeenCalled();
  });

  it('returns failure when user is not authenticated', async () => {
    mockAuth.mockResolvedValueOnce({ userId: null });

    const result = await updateProject('proj_1', { name: 'Test' });

    expect(result).toEqual({ success: false, error: 'Unauthorized' });
  });

  it('returns failure on unexpected db error', async () => {
    mockAuth.mockResolvedValueOnce({ userId: USER_ID });
    mockUpdateProject.mockRejectedValueOnce(new Error('DB connection failed'));

    const result = await updateProject('proj_1', { name: 'Test' });

    expect(result).toEqual({ success: false, error: 'DB connection failed' });
  });
});
