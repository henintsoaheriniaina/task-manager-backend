import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import { User } from "../models/User.model";
import { UserRole } from "../types";

export const seedUsers = async (count: number = 50) => {
  try {
    const userCount = await User.countDocuments({ role: UserRole.USER });

    if (userCount >= count) {
      console.log("ℹ️ Les utilisateurs de test existent déjà.");
      return;
    }
    console.log(`🌱 Seeding de ${count} utilisateurs en cours...`);
    const hashedPassword = await bcrypt.hash("password123", 10);
    const usersToCreate = [];

    for (let i = 0; i < count; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      usersToCreate.push({
        name: `${firstName} ${lastName}`,
        email: faker.internet.email({ firstName, lastName }).toLowerCase(),
        password: hashedPassword,
        role: UserRole.USER,
        profile: faker.image.avatar(),
      });
    }
    await User.insertMany(usersToCreate);
    console.log(`✅ ${count} utilisateurs créés avec succès !`);
  } catch (error) {
    console.error("❌ Erreur lors du seeding des utilisateurs :", error);
  }
};
