import mongoose from 'mongoose';

const aSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

const bSchema = new mongoose.Schema({
  aId: { type: mongoose.Schema.Types.ObjectId, ref: 'A', required: true },
  name: { type: String, required: true },
  value: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

const cSchema = new mongoose.Schema({
  bId: { type: mongoose.Schema.Types.ObjectId, ref: 'B', required: true },
  name: { type: String, required: true },
  value: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

const dSchema = new mongoose.Schema({
  cId: { type: mongoose.Schema.Types.ObjectId, ref: 'C', required: true },
  name: { type: String, required: true },
  value: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

const eSchema = new mongoose.Schema({
  dId: { type: mongoose.Schema.Types.ObjectId, ref: 'D', required: true },
  name: { type: String, required: true },
  value: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

const fSchema = new mongoose.Schema({
  eId: { type: mongoose.Schema.Types.ObjectId, ref: 'E', required: true },
  name: { type: String, required: true },
  value: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

const gSchema = new mongoose.Schema({
  fId: { type: mongoose.Schema.Types.ObjectId, ref: 'F', required: true },
  name: { type: String, required: true },
  value: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const A = mongoose.model('A', aSchema);
export const B = mongoose.model('B', bSchema);
export const C = mongoose.model('C', cSchema);
export const D = mongoose.model('D', dSchema);
export const E = mongoose.model('E', eSchema);
export const F = mongoose.model('F', fSchema);
export const G = mongoose.model('G', gSchema);