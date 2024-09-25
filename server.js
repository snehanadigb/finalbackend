const app = require('./app');
const cors=require('cors');
app.use(cors());

app.listen(process.env.PORT, () => {
    console.log(`Authentication service running on port ${process.env.PORT}`);
});
