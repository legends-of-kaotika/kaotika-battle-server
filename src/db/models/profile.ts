import { model, Schema } from 'mongoose';

const profileSchema = new Schema({
  name: String,
  description: String,
  image: String,
  attributes: [{ name: String, description: String, value: Number }],
});

export const Profile = model('Profile', profileSchema);
