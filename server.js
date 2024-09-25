const app = require('./app');


app.listen(process.env.PORT, () => {
    console.log(`Authentication service running on port ${process.env.PORT}`);
});
