const app = require('./app');
const app = express();
app.use(cors());

app.listen(process.env.PORT, () => {
    console.log(`Authentication service running on port ${process.env.PORT}`);
});
