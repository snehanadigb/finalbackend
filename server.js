const app = require('./app');
const PORT =  5004;

app.listen(PORT, () => {
    console.log(`Authentication service running on port ${PORT}`);
});
