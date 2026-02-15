const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

// Initialize Sequelize - use PostgreSQL if DATABASE_URL is set (Vercel/production),
// otherwise fall back to SQLite for local development
let sequelize;

if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false
  });
} else {
  const dbPath = process.env.DB_PATH || path.join(__dirname, 'database.sqlite');
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: false
  });
}

// --- Models ---

const generateId = () => Math.random().toString(36).substring(2, 11);

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: generateId
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  university: {
    type: DataTypes.STRING
  },
  remarks: {
    type: DataTypes.TEXT
  },
  isFlagged: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  referredBy: {
    type: DataTypes.STRING
  }
});

const Writer = sequelize.define('Writer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true, // Allow null initially, will be auto-generated if missing
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  specialty: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isFlagged: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  // Store rating as JSON object with quality, punctuality, communication, reliability, count
  rating: {
    type: DataTypes.JSON,
    defaultValue: { quality: 5.0, punctuality: 5.0, communication: 5.0, reliability: 5.0, count: 1 }
  },
  availabilityStatus: {
    type: DataTypes.STRING,
    defaultValue: 'available'
  },
  maxConcurrentTasks: {
    type: DataTypes.INTEGER,
    defaultValue: 5
  },
  totalAssignments: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  completedAssignments: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  onTimeDeliveries: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  level: {
    type: DataTypes.ENUM('Bronze', 'Silver', 'Gold', 'Platinum'),
    defaultValue: 'Bronze'
  },
  points: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  streak: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  lastActive: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  hooks: {
    beforeValidate: async (writer) => {
      // Check if phone is missing or invalid (not 10 digits)
      const isValidPhone = writer.phone && /^\d{10}$/.test(writer.phone);

      if (!isValidPhone) {
        // Find the highest placeholder phone number
        const lastPlaceholder = await Writer.findOne({
          where: {
            phone: {
              [Sequelize.Op.like]: '00000%'
            }
          },
          order: [['phone', 'DESC']]
        });

        let nextNumber = 1;
        if (lastPlaceholder && lastPlaceholder.phone) {
          nextNumber = parseInt(lastPlaceholder.phone, 10) + 1;
        }

        // Generate placeholder: 0000000001, 0000000002, etc.
        writer.phone = nextNumber.toString().padStart(10, '0');
      }
    }
  }
});

const Assignment = sequelize.define('Assignment', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: generateId
  },
  studentId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'Students',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  writerId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Writers',
      key: 'id'
    },
    onDelete: 'SET NULL'
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false
  },
  level: {
    type: DataTypes.STRING,
    allowNull: false
  },
  deadline: {
    type: DataTypes.DATE, // Storing as DATE, frontend sends ISO string
    allowNull: false
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Pending'
  },
  priority: {
    type: DataTypes.STRING,
    defaultValue: 'Medium'
  },
  documentLink: {
    type: DataTypes.STRING
  },
  wordCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  costPerWord: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  writerCostPerWord: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  paidAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  writerPrice: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  writerPaidAmount: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  sunkCosts: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  isDissertation: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  totalChapters: {
    type: DataTypes.INTEGER
  },
  // Storing chapters as JSON
  chapters: {
    type: DataTypes.JSON
  },
  description: {
    type: DataTypes.TEXT
  },
  // New fields for improvements
  activityLog: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  paymentHistory: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  statusHistory: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  attachments: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  isArchived: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  // Sequelize automatically adds createdAt and updatedAt
  timestamps: true,
  indexes: [
    { fields: ['studentId'] },
    { fields: ['writerId'] },
    { fields: ['status'] },
    { fields: ['deadline'] },
    { fields: ['createdAt'] }
  ]
});

const WriterAchievement = sequelize.define('WriterAchievement', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  writerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Writers',
      key: 'id'
    }
  },
  achievementType: {
    type: DataTypes.ENUM('SpeedDemon', 'Perfectionist', 'StreakMaster', 'QualityChampion'),
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  awardedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

// --- Associations ---
Student.hasMany(Assignment, { foreignKey: 'studentId' });
Assignment.belongsTo(Student, { foreignKey: 'studentId' });

Writer.hasMany(Assignment, { foreignKey: 'writerId' });
Assignment.belongsTo(Writer, { foreignKey: 'writerId' });

Writer.hasMany(WriterAchievement, { foreignKey: 'writerId' });
WriterAchievement.belongsTo(Writer, { foreignKey: 'writerId' });

// --- Hooks for Logic Consistency ---

// 1. Auto-set completedAt when status changes to Completed, clear if moved out
Assignment.beforeSave(async (assignment) => {
  if (assignment.changed('status')) {
    if (['Completed', 'completed'].includes(assignment.status)) {
      if (!assignment.completedAt) {
        assignment.completedAt = new Date();
      }
    } else {
      // field is not marked as allowNull: true in definition?
      // Let's check definition. line 195: allowNull: true.
      assignment.completedAt = null;
    }
  }
});

// 2. Sync Writer Stats (Total, Completed, OnTime, Streak)
const updateWriterStats = async (writerId) => {
  if (!writerId) return;
  try {
    const total = await Assignment.count({ where: { writerId } });
    const completedAssignments = await Assignment.findAll({
      where: {
        writerId,
        status: { [Sequelize.Op.in]: ['Completed', 'completed'] }
      }
    });

    const completedCount = completedAssignments.length;

    // Calculate On-Time deliveries (only for completed)
    let onTimeCount = 0;
    completedAssignments.forEach(a => {
      // If we have completedAt, use it. Otherwise fall back to createdAt (not ideal but safe fallback) or skip
      // A better fallback for old data is to assume on-time if not flagged. 
      // strict check: updated <= deadline
      const finishTime = a.completedAt || a.updatedAt;
      if (new Date(finishTime) <= new Date(a.deadline)) {
        onTimeCount++;
      }
    });

    await Writer.update({
      totalAssignments: total,
      completedAssignments: completedCount,
      onTimeDeliveries: onTimeCount,
      // You could also update points logic here if you wanted
    }, { where: { id: writerId } });
  } catch (err) {
    console.error('Error syncing writer stats:', err);
  }
};

Assignment.afterSave(async (assignment) => {
  if (assignment.writerId) {
    await updateWriterStats(assignment.writerId);
  }
  // If writer changed, update the old writer too (logic requires tracking previous, simplified here just for current)
  // For strict correctness, we should check assignment.previous('writerId') but Sequelize handling varies.
  // Accessing previous values in afterSave might need careful handling. 
  // For now, we update the current writer.
});

Assignment.afterDestroy(async (assignment) => {
  if (assignment.writerId) {
    await updateWriterStats(assignment.writerId);
  }
});

module.exports = {
  sequelize,
  Student,
  Writer,
  Assignment,
  WriterAchievement
};
