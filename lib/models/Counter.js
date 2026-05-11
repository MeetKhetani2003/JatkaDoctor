import mongoose from 'mongoose';

const CounterSchema = new mongoose.Schema({
  id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.Counter;
}

export default mongoose.models.Counter || mongoose.model('Counter', CounterSchema);
