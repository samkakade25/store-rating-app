import express from 'express';
import cors from 'cors';
import adminRoutes from './routes/adminRoutes.js';
import storeOwnerRoutes from './routes/storeOwnerRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Mount admin routes with the correct prefix
app.use('/api/admin', adminRoutes);

// Mount store owner routes with the correct prefix
app.use('/api/store-owner', storeOwnerRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;