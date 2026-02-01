import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// прибираємо password з відповіді
userSchema.methods.toJSON = function toJSON() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

// якщо username не заданий — ставимо як email при створенні
userSchema.pre('save', function () {
  if (this.isNew && !this.username) {
    this.username = this.email;
  }
});

export const User = model('User', userSchema);
