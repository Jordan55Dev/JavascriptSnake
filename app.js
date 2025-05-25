const express = require('express');
const app = express();
const indexRoutes = require('./routes/index');

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use('/', indexRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => 
    console.log(`Server running on http://localhost:${port}`)
);
