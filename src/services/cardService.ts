import { MongoClient } from 'mongodb';

const client = new MongoClient(import.meta.env.VITE_COSMOS_CONNECTION_STRING);
const database = client.db('carddb');
const cardStates = database.collection('cardStates');

export interface CardState {
  userId: string;
  cardId: number;
  isFlipped: boolean;
  lastUpdated: Date;
}

export const cardService = {
  async saveCardState(state: CardState) {
    await cardStates.updateOne(
      { userId: state.userId, cardId: state.cardId },
      { $set: state },
      { upsert: true }
    );
  },

  async getCardStates(userId: string) {
    return await cardStates.find({ userId }).toArray();
  }
}; 