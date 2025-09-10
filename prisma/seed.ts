import {createAPI} from '@/lib/api';
import type {PrismaClient} from '@/lib/prisma';

const base = async (prisma: PrismaClient): Promise<void> => {
  const { id: alice } = await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'axxx0000@student.monash.edu',
    },
    select: { id: true },
  });
  const { id: bob } = await prisma.user.create({
    data: {
      name: 'Bob',
      email: 'bxxx0000@student.monash.edu',
    },
    select: { id: true },
  });
  const { id: workspaceId } = await prisma.workspace.create({
    data: {
      name: 'Club',
      owner: { connect: { id: alice } },
      members: {
        createMany: {
          data: [
            { userId: alice, role: 'MANAGER' },
            { userId: bob, role: 'MEMBER' },
          ],
        },
      },
    },
    select: { id: true },
  });

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const tags = (...tags: readonly string[]) => ({
    connectOrCreate: tags.map(name => ({
      where: { workspaceId_name: { workspaceId, name } },
      create: { workspaceId, name },
    })),
  });

  await prisma.task.create({
    data: {
      workspaceId,
      title: 'Alice Task 1',
      deadline: new Date('2025-08-24'),
      tags: tags('tag1', 'tag2'),
      assignees: { connect: { id: alice } },
    },
  });
  await prisma.task.create({
    data: {
      workspaceId,
      title: 'Alice Task 2',
      deadline: new Date('2025-08-31'),
      tags: tags('tag2', 'tag3'),
      assignees: { connect: { id: alice } },
    },
  });
  await prisma.task.create({
    data: {
      workspaceId,
      title: 'Bob Task 1',
      deadline: new Date(2025, 7, 26),
      assignees: { connect: { id: bob } },
    },
  });
  await prisma.task.create({
    data: {
      workspaceId,
      title: 'Bob Task 2',
      deadline: new Date(2025, 8, 2),
      assignees: { connect: { id: bob } },
    },
  });
};

const resetDatabase = async (prisma: PrismaClient): Promise<void> => {
  console.log('Resetting database...');

  try {
    // Delete in order of dependencies to avoid foreign key constraints
    await prisma.workspaceInvite.deleteMany();
    await prisma.workspaceMember.deleteMany();
    await prisma.event.deleteMany();
    await prisma.task.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.workspace.deleteMany();
    await prisma.user.deleteMany();

    console.log('Database reset complete');
  } catch (error) {
    console.error('Error resetting database:', error);
    throw error;
  }
};
const populateUniversityDramaClub = async (
  prisma: PrismaClient,
): Promise<void> => {
  const api = createAPI(prisma);
  // Create Users (Club Members)
  console.log('Creating club members...');

  // Club Executives
  const theseusId = await api.createUser({
    email: 'theseus@university.edu',
    name: 'Theseus Chen (Club President)',
  });

  const hippolytaId = await api.createUser({
    email: 'hippolyta@university.edu',
    name: 'Hippolyta Rodriguez (Vice President)',
  });

  const egeusId = await api.createUser({
    email: 'egeus@university.edu',
    name: 'Professor Egeus (Faculty Advisor)',
  });

  // Club Members
  const lysanderId = await api.createUser({
    email: 'lysander@university.edu',
    name: 'Lysander Kim',
  });

  const demetriusId = await api.createUser({
    email: 'demetrius@university.edu',
    name: 'Demetrius Johnson',
  });

  const hermiaId = await api.createUser({
    email: 'hermia@university.edu',
    name: 'Hermia Patel',
  });

  const helenaId = await api.createUser({
    email: 'helena@university.edu',
    name: 'Helena Williams',
  });

  // Production Crew
  const quinceId = await api.createUser({
    email: 'quince@university.edu',
    name: 'Peter Quince (Technical Director)',
  });

  const bottomId = await api.createUser({
    email: 'bottom@university.edu',
    name: 'Nick Bottom (Lead Actor)',
  });

  // Create Workspace
  console.log('Creating workspace...');

  const dramaClubId = await api.createWorkspace({
    name: 'University Drama Club',
    owner: theseusId,
  });

  // Add all users to the workspace
  console.log('Adding members to workspace...');

  const allUserIds = [
    theseusId,
    hippolytaId,
    egeusId,
    lysanderId,
    demetriusId,
    hermiaId,
    helenaId,
    quinceId,
    bottomId,
  ];

  // TODO: Change to workspaceAddMembers when implemented
  await prisma.workspaceMember.createMany({
    data: allUserIds.map(userId => ({
      userId,
      workspaceId: dramaClubId,
      role: [theseusId, hippolytaId, egeusId].includes(userId)
        ? 'MANAGER'
        : 'MEMBER',
    })),
  });
  // Create Tasks for Act 1
  console.log('Creating Act 1 tasks...');

  const springShowTaskId = await api.createTask({
    title: 'Plan Spring Show Production',
    workspaceId: dramaClubId,
    description: 'Organize end-of-semester drama club production',
    assignees: [theseusId, hippolytaId, quinceId],
    deadline: new Date('2024-05-15'),
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    tags: ['spring-show', 'executive-committee', 'production'],
  });

  const castingDisputeTaskId = await api.createTask({
    title: 'Resolve Lead Role Casting Dispute',
    workspaceId: dramaClubId,
    description: 'Address conflict between members over romantic lead casting',
    assignees: [egeusId, hermiaId, demetriusId],
    deadline: new Date('2024-04-25'),
    priority: 'HIGH',
    status: 'TODO',
    tags: ['casting', 'conflict-resolution', 'faculty-advisor'],
  });

  const auditionPrepTaskId = await api.createTask({
    title: 'Prepare Audition Materials',
    workspaceId: dramaClubId,
    description: 'Create audition pieces and scheduling for spring production',
    assignees: [theseusId, hippolytaId],
    deadline: new Date('2024-04-22'),
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    visibility: 'MANAGER',
    tags: ['auditions', 'preparation', 'executive-committee'],
  });

  const playSelectionTaskId = await api.createTask({
    title: 'Select Play for Production',
    workspaceId: dramaClubId,
    description:
      'Choose appropriate play for university drama club performance',
    assignees: [quinceId, bottomId, theseusId],
    deadline: new Date('2024-04-20'),
    priority: 'HIGH',
    status: 'COMPLETE',
    tags: ['play-selection', 'technical-director', 'executive-decision'],
  });

  // Create Events for Act 1 scenes
  console.log('Creating Act 1 events...');

  const clubMeetingEvent = await api.createEvent({
    title: 'Emergency Club Meeting - Casting Issues',
    workspaceId: dramaClubId,
    description: 'Address casting disputes and club member conflicts',
    start: new Date('2024-04-18T19:00:00'),
    end: new Date('2024-04-18T20:30:00'),
    attendees: [
      theseusId,
      hippolytaId,
      egeusId,
      hermiaId,
      lysanderId,
      demetriusId,
    ],
    tags: ['club-meeting', 'emergency', 'conflict-resolution'],
  });

  const informalGatheringEvent = await api.createEvent({
    title: 'Informal Study Group',
    workspaceId: dramaClubId,
    description: 'Club members meet to discuss personal matters and club drama',
    start: new Date('2024-04-18T21:00:00'),
    end: new Date('2024-04-18T23:00:00'),
    attendees: [lysanderId, hermiaId, demetriusId, helenaId],
    visibility: 'MANAGER',
    tags: ['informal', 'study-group', 'personal-drama'],
  });

  const techCrewMeetingEvent = await api.createEvent({
    title: 'Production Crew Planning Session',
    workspaceId: dramaClubId,
    description: 'Technical director and crew plan production logistics',
    start: new Date('2024-04-19T16:00:00'),
    end: new Date('2024-04-19T18:00:00'),
    attendees: [quinceId, bottomId, theseusId],
    tags: ['production-crew', 'planning', 'logistics'],
  });

  console.log('University Drama Club database populated with Act 1!');
  console.log(`Created 9 users, 1 workspace, 4 tasks, and 3 events`);
};

// Execute the reset and population
export default async (prisma: PrismaClient): Promise<void> => {
  await base(prisma);
  await populateUniversityDramaClub(prisma);
};
