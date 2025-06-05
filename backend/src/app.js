import express from 'express';
import cors from 'cors';
import adminRoutes from './routes/adminRoutes.js';
import storeOwnerRoutes from './routes/storeOwnerRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
const app = express();

app.use(cors({
    origin: 'https://store-rating-app-git-main-samkakade25s-projects.vercel.app',
  credentials: true 
}));
app.use(express.json());


app.use('/api/auth', authRoutes);

app.use('/api/admin', adminRoutes);

app.use('/api/store-owner', storeOwnerRoutes);

app.use('/api/user', userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;