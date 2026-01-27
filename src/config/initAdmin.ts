import bcrypt from "bcryptjs";
import { User } from "../models/User.model";
import { UserRole } from "../types";

export const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: UserRole.ADMIN });

    if (!adminExists) {
      console.log("Création de l'administrateur par défaut...");

      const hashedPassword = await bcrypt.hash(
        process.env.ADMIN_PASSWORD || "admin123",
        10,
      );

      await User.create({
        name: "Admin",
        email: process.env.ADMIN_EMAIL || "admin@test.com",
        password: hashedPassword,
        role: UserRole.ADMIN,
        profile: "henintsoa",
      });

      console.log("✅ Compte Admin créé avec succès !");
    }
  } catch (error) {
    console.error("❌ Erreur lors du seeding de l'admin :", error);
  }
};
