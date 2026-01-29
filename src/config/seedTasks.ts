import { faker } from "@faker-js/faker";
import { Task } from "../models/Task.model";
import { User } from "../models/User.model";
import { TaskStatus, UserRole } from "../types";

export const seedTasks = async (count: number = 100) => {
  try {
    const users = await User.find({ role: UserRole.USER });
    const admin = await User.findOne({ role: UserRole.ADMIN });

    if (users.length === 0 || !admin) {
      console.log(
        "⚠️ Il faut des utilisateurs et au moins un admin pour seeder des tâches.",
      );
      return;
    }

    const taskCount = await Task.countDocuments();
    if (taskCount >= count) {
      console.log("ℹ️ Les tâches de test existent déjà.");
      return;
    }

    console.log(`🌱 Seeding de ${count} tâches en cours...`);
    const tasksToCreate = [];

    for (let i = 0; i < count; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];

      const dateType = Math.random();
      let dueDate: Date;

      if (dateType < 0.2) {
        dueDate = new Date();
      } else if (dateType < 0.6) {
        dueDate = faker.date.soon({ days: 14 });
      } else {
        dueDate = faker.date.recent({ days: 7 });
      }

      tasksToCreate.push({
        title: faker.hacker.phrase().slice(0, 100),
        description: faker.lorem.paragraph(),
        status: faker.helpers.arrayElement(Object.values(TaskStatus)),
        assignedTo: randomUser!._id,
        createdBy: admin._id,
        dueDate: dueDate,
      });
    }

    await Task.insertMany(tasksToCreate);
    console.log(`✅ ${count} tâches créées et assignées avec succès !`);
  } catch (error) {
    console.error("❌ Erreur lors du seeding des tâches :", error);
  }
};
