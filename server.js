// server.js
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = 3000;

app.use(express.static(__dirname));
app.use(express.json());

app.post('/get-avatar', async (req, res) => {
  const { username } = req.body;

  try {
    // Get user ID from username
    const userRes = await fetch(`https://users.roblox.com/v1/usernames/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usernames: [username] })
    });

    const userData = await userRes.json();
    const user = userData.data[0];

    if (!user) return res.status(404).json({ error: 'User not found' });

    const userId = user.id;

    // Get avatar URL
    const avatarRes = await fetch(
      `https://thumbnails.roblox.com/v1/users/avatar?userIds=${userId}&size=420x420&format=Png&isCircular=false`
    );

    const avatarData = await avatarRes.json();
    const imageUrl = avatarData.data[0].imageUrl;

    res.json({ imageUrl });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
