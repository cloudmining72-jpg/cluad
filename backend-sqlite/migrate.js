const fs = require('fs');
const path = require('path');

let content = fs.readFileSync(path.join(__dirname, 'server.js'), 'utf8');

// 1. Replace Mongoose require with Sequelize
content = content.replace(
  "const mongoose = require('mongoose');\nmongoose.set('bufferCommands', false);",
  "const { Sequelize, DataTypes } = require('sequelize');\nconst sequelize = new Sequelize({ dialect: 'sqlite', storage: path.join(__dirname, 'database.sqlite'), logging: false });"
);

// 2. Replace Schemas and Models
const mongooseModelsRegex = /\/\/ ==================== MONGOOSE SCHEMAS & MODELS ====================[\s\S]*?(?=\/\/ JWT Auth Middleware)/;

const sequelizeModels = `// ==================== SEQUELIZE SQLITE MODELS ====================

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, defaultValue: '' },
  country: { type: DataTypes.STRING, defaultValue: 'Pakistan' },
  balance: { type: DataTypes.FLOAT, defaultValue: 0.00 },
  availableCash: { type: DataTypes.FLOAT, defaultValue: 0.00 },
  investedAmount: { type: DataTypes.FLOAT, defaultValue: 0.00 },
  todayPL: { type: DataTypes.FLOAT, defaultValue: 0.00 },
  totalPL: { type: DataTypes.FLOAT, defaultValue: 0.00 },
  kycStatus: { type: DataTypes.ENUM('UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED'), defaultValue: 'UNVERIFIED' },
  referralCode: { type: DataTypes.STRING },
  referredBy: { type: DataTypes.STRING, defaultValue: '' },
  role: { type: DataTypes.ENUM('USER', 'ADMIN'), defaultValue: 'USER' },
  resetOtp: { type: DataTypes.STRING },
  resetOtpExpires: { type: DataTypes.DATE },
});

const MiningPlan = sequelize.define('MiningPlan', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  planName: { type: DataTypes.STRING, allowNull: false },
  investedAmount: { type: DataTypes.FLOAT, allowNull: false },
  dailyProfit: { type: DataTypes.FLOAT, allowNull: false },
  totalTargetReturn: { type: DataTypes.FLOAT, allowNull: false },
  durationDays: { type: DataTypes.INTEGER, defaultValue: 30 },
  claimedDaysCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  lastClaimDate: { type: DataTypes.STRING, defaultValue: '' },
  status: { type: DataTypes.ENUM('ACTIVE', 'COMPLETED'), defaultValue: 'ACTIVE' },
});

const Deposit = sequelize.define('Deposit', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  userName: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  paymentMethod: { type: DataTypes.STRING, allowNull: false },
  walletAddress: { type: DataTypes.STRING, defaultValue: '' },
  status: { type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'), defaultValue: 'PENDING' },
  processedAt: { type: DataTypes.DATE },
});

const Withdrawal = sequelize.define('Withdrawal', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  userName: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  paymentMethod: { type: DataTypes.STRING, allowNull: false },
  accountDetails: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'), defaultValue: 'PENDING' },
  processedAt: { type: DataTypes.DATE },
});

// Setup Associations
User.hasMany(MiningPlan, { foreignKey: 'userId' });
User.hasMany(Deposit, { foreignKey: 'userId' });
User.hasMany(Withdrawal, { foreignKey: 'userId' });
MiningPlan.belongsTo(User, { foreignKey: 'userId' });
Deposit.belongsTo(User, { foreignKey: 'userId' });
Withdrawal.belongsTo(User, { foreignKey: 'userId' });

`;

content = content.replace(mongooseModelsRegex, sequelizeModels);

// 3. Replace Query Syntax
// findById(req.user.id) -> findByPk(req.user.id)
content = content.replace(/User\.findById\(/g, 'User.findByPk(');
content = content.replace(/MiningPlan\.findById\(/g, 'MiningPlan.findByPk(');
content = content.replace(/Deposit\.findById\(/g, 'Deposit.findByPk(');
content = content.replace(/Withdrawal\.findById\(/g, 'Withdrawal.findByPk(');

// findOne({ email: cleanEmail }) -> findOne({ where: { email: cleanEmail } })
content = content.replace(/User\.findOne\(\{ email:/g, 'User.findOne({ where: { email:');
content = content.replace(/MiningPlan\.findOne\(\{ _id:/g, 'MiningPlan.findOne({ where: { id:');
content = content.replace(/Deposit\.findOne\(\{ _id:/g, 'Deposit.findOne({ where: { id:');
content = content.replace(/Withdrawal\.findOne\(\{ _id:/g, 'Withdrawal.findOne({ where: { id:');
content = content.replace(/User\.findOne\(\{ resetOtp:/g, 'User.findOne({ where: { resetOtp:');

// findOne({ _id: planId, userId: req.user.id })
content = content.replace(/MiningPlan\.findOne\(\{ _id: planId, userId: req\.user\.id \}\)/g, "MiningPlan.findOne({ where: { id: planId, userId: req.user.id } })");

// find({ userId: req.user.id }) -> findAll({ where: { userId: req.user.id } })
content = content.replace(/\.find\(\{ userId: req\.user\.id \}\)/g, ".findAll({ where: { userId: req.user.id }, order: [['createdAt', 'DESC']] })");
content = content.replace(/\.find\(\{ userId: req\.user\.id \}\)/g, ".findAll({ where: { userId: req.user.id }, order: [['createdAt', 'DESC']] })");
// Fix any remaining .find() missing sort/where
content = content.replace(/MiningPlan\.find\(\{ userId: req\.user\.id \}\)\.sort\(\{ createdAt: -1 \}\)/g, "MiningPlan.findAll({ where: { userId: req.user.id }, order: [['createdAt', 'DESC']] })");
content = content.replace(/Deposit\.find\(\{ userId: req\.user\.id \}\)\.sort\(\{ createdAt: -1 \}\)/g, "Deposit.findAll({ where: { userId: req.user.id }, order: [['createdAt', 'DESC']] })");
content = content.replace(/Withdrawal\.find\(\{ userId: req\.user\.id \}\)\.sort\(\{ createdAt: -1 \}\)/g, "Withdrawal.findAll({ where: { userId: req.user.id }, order: [['createdAt', 'DESC']] })");

// find() all
content = content.replace(/User\.find\(\)\.sort\(\{ createdAt: -1 \}\)/g, "User.findAll({ order: [['createdAt', 'DESC']] })");
content = content.replace(/Deposit\.find\(\)\.sort\(\{ createdAt: -1 \}\)/g, "Deposit.findAll({ order: [['createdAt', 'DESC']] })");
content = content.replace(/Withdrawal\.find\(\)\.sort\(\{ createdAt: -1 \}\)/g, "Withdrawal.findAll({ order: [['createdAt', 'DESC']] })");

// replace _id with id everywhere except in req.user._id (which becomes id)
content = content.replace(/user\._id/g, 'user.id');
content = content.replace(/plan\._id/g, 'plan.id');
content = content.replace(/deposit\._id/g, 'deposit.id');
content = content.replace(/withdrawal\._id/g, 'withdrawal.id');
content = content.replace(/u\._id/g, 'u.id');
content = content.replace(/delete u\.__v;/g, '');

// .toObject() is not in Sequelize, it's .get({ plain: true })
content = content.replace(/user\.toObject \? user\.toObject\(\) : \{ \.\.\.user \}/g, "user.get ? user.get({ plain: true }) : { ...user }");

// user = new User({ -> User.create({
// Wait, new User() followed by user.save() works in Sequelize! So I don't need to change `new User(...)`

// Replace mongoose.connection.readyState check
content = content.replace(/mongoose\.connection\.readyState === 1/g, "true"); // Sequelize is always connected locally

// Connection setup at the end
content = content.replace(
  /if \(MONGO_URI && !MONGO_URI\.includes[\s\S]*?else \{\n  console\.log\('⚠️ No remote MongoDB URI set\. Running in standalone HTTP mode \(in-memory\)\.'\);\n\}/,
  `sequelize.sync({ alter: true }).then(() => console.log('✅ SQLite Database & Tables Synced')).catch(err => console.error('SQLite Sync Error:', err));`
);

fs.writeFileSync(path.join(__dirname, 'server.js'), content, 'utf8');
console.log('Migration script completed.');
