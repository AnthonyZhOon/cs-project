import { PrismaClient, Priority, TaskStatus, WorkspaceMemberRole } from '../app/generated/prisma';

const prisma = new PrismaClient();

// Helper function to create dates relative to today
const getDateFromToday = (days: number): Date => {
  var d = new Date();
  d.setDate(d.getDate() + days)
  return d;
};

// Seed data
const userData: { name: string; email: string }[] = [
  {
    name: "Alex Morgan",
    email: "alex.morgan@example.com",
  },
  {
    name: "Jamie Chen",
    email: "jamie.chen@example.com",
  },
  {
    name: "Sam Rodriguez",
    email: "sam.rodriguez@example.com",
  },
  {
    name: "Taylor Kim",
    email: "taylor.kim@example.com",
  },
  {
    name: "Jordan Lee",
    email: "jordan.lee@example.com",
  }
];

async function main() {
  console.log(`Start seeding...`);

  // Create users
  const createdUsers = [];
  for (const user of userData) {
    const createdUser = await prisma.user.create({
      data: user,
    });
    console.log(`Created user with id: ${createdUser.id}`);
    createdUsers.push(createdUser);
  }

  // Create workspaces
  const workspace1 = await prisma.workspace.create({
    data: {
      name: "Product Development",
      ownerId: createdUsers[0].id,
      members: {
        create: [
          {
            userId: createdUsers[0].id,
            role: WorkspaceMemberRole.MANAGER
          },
          {
            userId: createdUsers[1].id,
            role: WorkspaceMemberRole.MEMBER
          },
          {
            userId: createdUsers[2].id,
            role: WorkspaceMemberRole.MEMBER
          }
        ]
      }
    }
  });
  console.log(`Created workspace: ${workspace1.name}`);

  const workspace2 = await prisma.workspace.create({
    data: {
      name: "Marketing Campaign",
      ownerId: createdUsers[3].id,
      members: {
        create: [
          {
            userId: createdUsers[3].id,
            role: WorkspaceMemberRole.MANAGER
          },
          {
            userId: createdUsers[4].id,
            role: WorkspaceMemberRole.MEMBER
          },
          {
            userId: createdUsers[0].id,
            role: WorkspaceMemberRole.MEMBER
          }
        ]
      }
    }
  });
  console.log(`Created workspace: ${workspace2.name}`);

  // Create tasks for Workspace 1
  const task1 = await prisma.task.create({
    data: {
      title: "Design system architecture",
      description: "Create high-level architecture diagrams for the new product",
      status: TaskStatus.IN_PROGRESS,
      priority: Priority.HIGH,
      deadline: getDateFromToday(14),
      workspaceId: workspace1.id,
      assignees: {
        connect: [
          { id: createdUsers[0].id },
          { id: createdUsers[1].id }
        ]
      },
      tags: {
        create: [
          { tag: "design" },
          { tag: "architecture" }
        ]
      }
    }
  });
  console.log(`Created task: ${task1.title}`);

  const task2 = await prisma.task.create({
    data: {
      title: "Implement authentication flow",
      description: "Build login, registration and password reset functionality",
      status: TaskStatus.TODO,
      priority: Priority.MEDIUM,
      deadline: getDateFromToday(21),
      workspaceId: workspace1.id,
      assignees: {
        connect: [
          { id: createdUsers[2].id }
        ]
      },
      tags: {
        create: [
          { tag: "backend" },
          { tag: "security" }
        ]
      }
    }
  });
  console.log(`Created task: ${task2.title}`);

  const task3 = await prisma.task.create({
    data: {
      title: "API documentation",
      description: "Document all API endpoints using OpenAPI specification",
      status: TaskStatus.TODO,
      priority: Priority.LOW,
      deadline: getDateFromToday(30),
      workspaceId: workspace1.id,
      assignees: {
        connect: [
          { id: createdUsers[1].id }
        ]
      },
      dependencies: {
        connect: [
          { id: task2.id }
        ]
      },
      tags: {
        create: [
          { tag: "documentation" },
          { tag: "api" }
        ]
      }
    }
  });
  console.log(`Created task: ${task3.title}`);

  // Create tasks for Workspace 2
  const task4 = await prisma.task.create({
    data: {
      title: "Social media content calendar",
      description: "Create content schedule for Q3 marketing campaign",
      status: TaskStatus.IN_PROGRESS,
      priority: Priority.HIGH,
      deadline: getDateFromToday(7),
      workspaceId: workspace2.id,
      assignees: {
        connect: [
          { id: createdUsers[3].id },
          { id: createdUsers[4].id }
        ]
      },
      tags: {
        create: [
          { tag: "marketing" },
          { tag: "content" }
        ]
      }
    }
  });
  console.log(`Created task: ${task4.title}`);

  const task5 = await prisma.task.create({
    data: {
      title: "Budget approval",
      description: "Get final sign-off on Q3 marketing budget",
      status: TaskStatus.COMPLETE,
      priority: Priority.HIGH,
      workspaceId: workspace2.id,
      assignees: {
        connect: [
          { id: createdUsers[3].id }
        ]
      },
      tags: {
        create: [
          { tag: "budget" },
          { tag: "approval" }
        ]
      }
    }
  });
  console.log(`Created task: ${task5.title}`);

  // Create events for Workspace 1
  const event1 = await prisma.event.create({
    data: {
      title: "Sprint Planning",
      description: "Plan tasks for the upcoming two-week sprint",
      start: getDateFromToday(3),
      end: new Date(getDateFromToday(3).setHours(getDateFromToday(3).getHours() + 2)),
      workspaceId: workspace1.id,
      attendees: {
        connect: [
          { id: createdUsers[0].id },
          { id: createdUsers[1].id },
          { id: createdUsers[2].id }
        ]
      },
      tags: {
        create: [
          { tag: "meeting" },
          { tag: "planning" }
        ]
      }
    }
  });
  console.log(`Created event: ${event1.title}`);

  const event2 = await prisma.event.create({
    data: {
      title: "Technical Design Review",
      description: "Review architecture and technical designs",
      start: getDateFromToday(5),
      end: new Date(getDateFromToday(5).setHours(getDateFromToday(5).getHours() + 3)),
      workspaceId: workspace1.id,
      attendees: {
        connect: [
          { id: createdUsers[0].id },
          { id: createdUsers[1].id }
        ]
      },
      tags: {
        create: [
          { tag: "review" },
          { tag: "technical" }
        ]
      }
    }
  });
  console.log(`Created event: ${event2.title}`);

  // Create events for Workspace 2
  const event3 = await prisma.event.create({
    data: {
      title: "Campaign Launch Meeting",
      description: "Kickoff meeting for Q3 marketing campaign",
      start: getDateFromToday(10),
      end: new Date(getDateFromToday(10).setHours(getDateFromToday(10).getHours() + 2)),
      workspaceId: workspace2.id,
      attendees: {
        connect: [
          { id: createdUsers[3].id },
          { id: createdUsers[4].id },
          { id: createdUsers[0].id }
        ]
      },
      tags: {
        create: [
          { tag: "launch" },
          { tag: "marketing" }
        ]
      }
    }
  });
  console.log(`Created event: ${event3.title}`);

  // Create workspace invites
  const invite1 = await prisma.workspaceInvite.create({
    data: {
      email: "new.member@example.com",
      workspaceId: workspace1.id,
      memberRole: WorkspaceMemberRole.MEMBER
    }
  });
  console.log(`Created workspace invite for: ${invite1.email}`);

  const invite2 = await prisma.workspaceInvite.create({
    data: {
      email: "designer@example.com",
      workspaceId: workspace2.id,
      memberRole: WorkspaceMemberRole.MEMBER
    }
  });
  console.log(`Created workspace invite for: ${invite2.email}`);

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
