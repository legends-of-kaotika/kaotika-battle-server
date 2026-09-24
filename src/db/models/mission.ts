import { model, Schema } from 'mongoose';

const missionSchema = new Schema({
  name: String,
  description: String,
  enemies: [{ type: Schema.Types.ObjectId, ref: 'Npc' }],
  suggested_level: Number,
  drop_item_level: Number,
  gold: Number,
  exp: Number,
  battle_background: String,
  battle_music: { type: String, default: 'battle.ogg' },
  battle_animations: [String],
  end_of_battle_background: [String],
});

export const Mission = model('Mission', missionSchema);
