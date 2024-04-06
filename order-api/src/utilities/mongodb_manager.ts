import { MongoClient, Db, Collection } from 'mongodb';

export async function connectToMongoDB(): Promise<Db> {
    const MONGODB_URL = process.env['MONGODB_URL']!;
    const client = new MongoClient(MONGODB_URL);
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        return client.db(process.env.MONGODB_DATABASE);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}