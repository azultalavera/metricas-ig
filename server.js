import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;
const DATA_FILE = path.join(__dirname, 'data', 'months.json');

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Utility to read JSON database
function readData() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return {};
    }
    const content = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error reading data file:', error);
    return {};
  }
}

// Utility to write JSON database
function writeData(data) {
  try {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing data file:', error);
    return false;
  }
}

// REST API Endpoints

// GET /api/months - Fetch all months
app.get('/api/months', (req, res) => {
  const data = readData();
  res.json(data);
});

// GET /api/months/:id - Fetch single month
app.get('/api/months/:id', (req, res) => {
  const data = readData();
  const month = data[req.params.id];
  if (!month) {
    return res.status(404).json({ error: 'Mes no encontrado' });
  }
  res.json(month);
});

// POST /api/months - Create or Update month
app.post('/api/months', (req, res) => {
  const monthData = req.body;
  if (!monthData || !monthData.id || !monthData.name) {
    return res.status(400).json({ error: 'Se requiere ID y Nombre del mes' });
  }

  const data = readData();
  data[monthData.id] = monthData;
  if (writeData(data)) {
    res.json({ success: true, month: monthData });
  } else {
    res.status(500).json({ error: 'Error al guardar los datos' });
  }
});

// DELETE /api/months/:id - Delete month
app.delete('/api/months/:id', (req, res) => {
  const data = readData();
  if (!data[req.params.id]) {
    return res.status(404).json({ error: 'Mes no encontrado' });
  }

  delete data[req.params.id];
  if (writeData(data)) {
    res.json({ success: true });
  } else {
    res.status(500).json({ error: 'Error al eliminar el mes' });
  }
});

// POST /api/reset - Reset to default
app.post('/api/reset', (req, res) => {
  const defaultData = {
    "2026-05": {
      "id": "2026-05",
      "name": "Mayo 2026",
      "kpis": {
        "totalViews": 268000,
        "mainViews": 209681,
        "netFollowers": 110,
        "interactions": 5650,
        "reels": 7,
        "dumps": 2,
        "stories": 112,
        "nonFollowersReachPercent": 66,
        "followersReachPercent": 34,
        "mainFollowersPercent": 53.2,
        "mainNonFollowersPercent": 46.8
      },
      "posts": [
        { "id": 1, "title": "Hotel para perros", "type": "Reel", "views": 14327, "reach": 9952, "avgTime": 5, "newFollowers": 1 },
        { "id": 2, "title": "Outfit camiseta del mundial", "type": "Reel", "views": 14271, "reach": 9373, "avgTime": 21, "newFollowers": 68, "isTopConverter": true },
        { "id": 3, "title": "Cordova", "type": "Dump", "views": 10141, "reach": 4061, "avgTime": 152, "newFollowers": 4 },
        { "id": 4, "title": "Outfit camiseta del mundial 2", "type": "Reel", "views": 9759, "reach": 7005, "avgTime": 25, "newFollowers": 44 },
        { "id": 5, "title": "Post día del orgullo", "type": "Dump", "views": 9092, "reach": 3319, "avgTime": 85, "newFollowers": 1 }
      ],
      "demographics": [
        { "country": "Argentina", "flag": "🇦🇷", "percentage": 32.0 },
        { "country": "Estados Unidos", "flag": "🇺🇸", "percentage": 17.6 },
        { "country": "España", "flag": "🇪🇸", "percentage": 6.7 },
        { "country": "México", "flag": "🇲🇽", "percentage": 4.9 },
        { "country": "Uruguay", "flag": "🇺🇾", "percentage": 3.3 },
        { "country": "Otros países", "flag": "🌐", "percentage": 35.5 }
      ],
      "peakHours": {
        "Mar": ["n1", "n2"],
        "Dom": ["n1"]
      }
    }
  };

  writeData(defaultData);
  res.json({ success: true, data: defaultData });
});

app.listen(PORT, () => {
  console.log(`Server Express corriendo en http://localhost:${PORT}`);
});
