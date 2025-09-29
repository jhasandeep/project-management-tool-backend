import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app.module";
import { UsersService } from "../users/users.service";
import { ProjectsService } from "../projects/projects.service";
import { TasksService } from "../tasks/tasks.service";
import { ProjectStatus } from "../projects/schemas/project.schema";
import { TaskStatus } from "../tasks/schemas/task.schema";

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const usersService = app.get(UsersService);
  const projectsService = app.get(ProjectsService);
  const tasksService = app.get(TasksService);

  try {
    console.log("🌱 Starting database seeding...");

    // Check if test user already exists
    let testUser = await usersService.findByEmail("test@example.com");

    if (!testUser) {
      console.log("👤 Creating test user...");
      testUser = await usersService.create(
        "test@example.com",
        "Test@123",
        "Test User"
      );
      console.log("✅ Test user created");
    } else {
      console.log("👤 Test user already exists");
    }

    // Create projects
    console.log("📁 Creating projects...");

    const project1 = await projectsService.create(
      {
        title: "Website Redesign",
        description:
          "Complete redesign of the company website with modern UI/UX",
        status: ProjectStatus.ACTIVE,
      },
      testUser._id.toString()
    );

    const project2 = await projectsService.create(
      {
        title: "Mobile App Development",
        description:
          "Development of a new mobile application for iOS and Android",
        status: ProjectStatus.ACTIVE,
      },
      testUser._id.toString()
    );

    console.log("✅ Projects created");

    // Create tasks for project 1
    console.log("📝 Creating tasks for Website Redesign...");

    await tasksService.create(
      project1._id.toString(),
      {
        title: "Design mockups",
        description: "Create wireframes and mockups for the new website design",
        status: TaskStatus.DONE,
        dueDate: "2024-01-15",
      },
      testUser._id.toString()
    );

    await tasksService.create(
      project1._id.toString(),
      {
        title: "Frontend development",
        description: "Implement the frontend using React and TypeScript",
        status: TaskStatus.IN_PROGRESS,
        dueDate: "2024-02-01",
      },
      testUser._id.toString()
    );

    await tasksService.create(
      project1._id.toString(),
      {
        title: "Backend API integration",
        description:
          "Connect frontend with backend APIs and implement data fetching",
        status: TaskStatus.TODO,
        dueDate: "2024-02-15",
      },
      testUser._id.toString()
    );

    // Create tasks for project 2
    console.log("📝 Creating tasks for Mobile App Development...");

    await tasksService.create(
      project2._id.toString(),
      {
        title: "App architecture planning",
        description:
          "Plan the overall architecture and technology stack for the mobile app",
        status: TaskStatus.DONE,
        dueDate: "2024-01-10",
      },
      testUser._id.toString()
    );

    await tasksService.create(
      project2._id.toString(),
      {
        title: "UI/UX design",
        description:
          "Design user interface and user experience for mobile screens",
        status: TaskStatus.IN_PROGRESS,
        dueDate: "2024-01-25",
      },
      testUser._id.toString()
    );

    await tasksService.create(
      project2._id.toString(),
      {
        title: "Development setup",
        description: "Set up development environment and project structure",
        status: TaskStatus.TODO,
        dueDate: "2024-02-05",
      },
      testUser._id.toString()
    );

    console.log("✅ Tasks created");
    console.log("🎉 Database seeding completed successfully!");
    console.log("");
    console.log("📋 Test credentials:");
    console.log("   Email: test@example.com");
    console.log("   Password: Test@123");
    console.log("");
    console.log("📊 Created data:");
    console.log("   - 1 test user");
    console.log("   - 2 projects");
    console.log("   - 6 tasks (3 per project)");
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    throw error;
  } finally {
    await app.close();
  }
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});
