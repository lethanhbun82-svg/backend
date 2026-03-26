const express = require('express');
const mongoose = require('mongoose'); // Thay thế Sequelize
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerConfig'); 
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 1. KẾT NỐI MONGODB
// DATABASE_URL trong .env lúc này nên là: mongodb://localhost:27017/your_db_name
mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log("✅ MongoDB Connected!"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// 2. MODELS (Sử dụng Schema của Mongoose)
const ProjectSchema = new mongoose.Schema({
  Name: String,
  short_description: String,
  description: String,
  view_link: String,
  upload_preset: String,
}, { timestamps: true });

const Project = mongoose.model('Project', ProjectSchema);

const ContactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  message: String,
}, { timestamps: true });

const Contact = mongoose.model('Contact', ContactSchema);

// 3. SWAGGER UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 4. ROUTES CHO PROJECTS
// Lấy danh sách
app.get('/api/projects', async (req, res) => {
  try {
    // .sort({ createdAt: -1 }) tương đương DESC trong SQL
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Tạo mới
app.post('/api/projects', async (req, res) => {
  try {
    const newProject = new Project({
      Name: req.body.title,
      short_description: req.body.shortDesc,
      description: req.body.content,
      view_link: req.body.externalLink,
      upload_preset: req.body.imageUrl
    });
    await newProject.save();
    res.status(201).json(newProject);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// Cập nhật (PATCH)
app.patch('/api/projects/:id', async (req, res) => {
  try {
    // { new: true } để trả về object sau khi đã update
    const project = await Project.findByIdAndUpdate(
      req.params.id, 
      {
        Name: req.body.title,
        short_description: req.body.shortDesc,
        description: req.body.content,
        view_link: req.body.externalLink,
        upload_preset: req.body.imageUrl
      }, 
      { new: true, omitUndefined: true } 
    );

    if (!project) return res.status(404).json({ message: "Không tìm thấy project!" });
    res.json(project);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// Xóa (DELETE)
app.delete('/api/projects/:id', async (req, res) => {
  try {
    const result = await Project.findByIdAndDelete(req.params.id);
    if (result) res.json({ message: "Xóa thành công!" });
    else res.status(404).json({ message: "Không tìm thấy để xóa!" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 5. ROUTES CHO CONTACTS
app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/contacts', async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    res.status(201).json(contact);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.delete('/api/contacts/:id', async (req, res) => {
  try {
    const result = await Contact.findByIdAndDelete(req.params.id);
    if (result) res.json({ message: "Đã xóa liên hệ!" });
    else res.status(404).json({ message: "Không tìm thấy liên hệ!" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 6. START
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server: http://localhost:${PORT}`);
  console.log(`📖 Swagger: http://localhost:${PORT}/api-docs`);
});