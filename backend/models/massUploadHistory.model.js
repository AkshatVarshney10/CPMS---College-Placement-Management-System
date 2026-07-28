const mongoose = require('mongoose');

const RecordSchema = new mongoose.Schema({
  srNo: { type: String, required: false },
  email: { type: String, required: true },
  name: { type: String, required: false },
  status: { type: String, required: true }, // e.g., 'Sent', 'Already Exists', 'Wrong Email', 'Failed'
});

const MassUploadHistorySchema = new mongoose.Schema({
  uploadDate: { type: Date, default: Date.now },
  totalRecords: { type: Number, required: true },
  successful: { type: Number, default: 0 },
  existing: { type: Number, default: 0 },
  failed: { type: Number, default: 0 },
  records: [RecordSchema]
}, { timestamps: true });

module.exports = mongoose.model('MassUploadHistory', MassUploadHistorySchema);
