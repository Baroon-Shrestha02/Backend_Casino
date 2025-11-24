const bcrypt = require("bcrypt");
const Admin = require("../../Models/AdminModel");

const createAdmin = async () => {
  const username = "Boro";
  const plainPassword = "Boro123";

  const existingAdmin = await Admin.findOne({ username });
  if (existingAdmin) {
    console.log("Admin user already exists.");
    return;
  }

  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  const newAdmin = new Admin({ username, password: hashedPassword });
  await newAdmin.save();
  console.log("Admin created successfully.");
};

module.exports = { createAdmin };
