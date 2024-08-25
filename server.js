const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const cors = require('cors');
const serviceAccount = require('./serviceAccountKey.json'); // Update with the correct path

const app = express();

app.use(cors());
app.use(bodyParser.json());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Add this GET route for testing
app.get('/', (req, res) => {
  res.send('Server is running');
});



app.post('/complaint', async (req, res) => {
  const { title, description, userId } = req.body;

  console.log('Received complaint:', { title, description, userId });

  const message = {
    notification: {
      title: 'New Complaint Registered',
      body: `A new complaint has been registered: ${title}`,
    },
    topic: 'guards_notifications', // Updated to guard-specific topic
  };

  console.log('Sending notification to topic:', message.topic);
  console.log('Notification message:', message);

  try {
    const response = await admin.messaging().send(message);
    console.log('Successfully sent message:', response);
    res.status(200).send('Notification sent successfully');
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).send('Error sending notification');
  }
});

// Update port to 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
