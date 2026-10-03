import type { Express, Request, Response } from 'express';
import {
  getSummaryData,
  getReportsData,
  getSellersData,
  getBottlenecksData,
  getOrdersData,
  getQuotesData,
  getDirectoryData,
  handleActionRevertOrder,
  handleActionDeleteQuote,
  handleActionMergeContacts,
  handleActionCreateQuote
} from './pulseService';

export function setupPulseRoutes(
  app: Express,
  PULSE_KEY: string,
  firebaseConfig: Record<string, string> | null
): void {
  app.get('/api/pulse', async (req: Request, res: Response): Promise<void> => {
    const key = (req.query['x-pulse-key'] || req.headers['x-pulse-key'] || req.query.key) as string | undefined;
    if (key !== PULSE_KEY) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!firebaseConfig) {
      res.status(500).json({ error: 'Firebase configuration not found on server' });
      return;
    }

    try {
      const entity = req.query.entity as string;

      if (entity === 'summary') {
        const data = await getSummaryData();
        res.json(data);
        return;
      }
      if (entity === 'reports') {
        const data = await getReportsData();
        res.json(data);
        return;
      }
      if (entity === 'sellers') {
        const data = await getSellersData();
        res.json(data);
        return;
      }
      if (entity === 'bottlenecks') {
        const data = await getBottlenecksData();
        res.json(data);
        return;
      }
      if (entity === 'orders') {
        const data = await getOrdersData();
        res.json(data);
        return;
      }
      if (entity === 'quotes') {
        const data = await getQuotesData();
        res.json(data);
        return;
      }
      if (entity === 'directory') {
        const data = await getDirectoryData();
        res.json(data);
        return;
      }

      res.status(400).json({ error: 'Invalid entity' });
    } catch (error: unknown) {
      console.error('Pulse API Error:', error);
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.post('/api/action/:actionType', async (req: Request, res: Response): Promise<void> => {
    const key = (req.query['x-pulse-key'] || req.headers['x-pulse-key'] || req.query.key) as string | undefined;
    if (key !== PULSE_KEY) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!firebaseConfig) {
      res.status(500).json({ error: 'Firebase configuration not found on server' });
      return;
    }

    const actionType = req.params.actionType;

    try {
      if (actionType === 'revert-order') {
        const { orderId } = req.body as { orderId?: string };
        if (!orderId) {
          res.status(400).json({ error: 'orderId is required' });
          return;
        }
        const data = await handleActionRevertOrder(orderId);
        res.json(data);
        return;
      }

      if (actionType === 'delete-quote') {
        const { quoteId } = req.body as { quoteId?: string };
        if (!quoteId) {
          res.status(400).json({ error: 'quoteId is required' });
          return;
        }
        const data = await handleActionDeleteQuote(quoteId);
        res.json(data);
        return;
      }

      if (actionType === 'merge-contacts') {
        const { sourceContactId, targetContactId } = req.body as {
          sourceContactId?: string;
          targetContactId?: string;
        };
        if (!sourceContactId || !targetContactId) {
          res.status(400).json({ error: 'sourceContactId and targetContactId are required' });
          return;
        }
        const data = await handleActionMergeContacts(sourceContactId, targetContactId);
        res.json(data);
        return;
      }

      if (actionType === 'create-quote') {
        const quoteData = req.body as {
          customer?: string;
          items?: unknown[];
          [key: string]: unknown;
        };
        if (!quoteData || !quoteData.items || !quoteData.customer) {
          res.status(400).json({ error: 'customer and items are required' });
          return;
        }
        const data = await handleActionCreateQuote(quoteData);
        res.json(data);
        return;
      }

      res.status(400).json({ error: 'Invalid action type' });
    } catch (error: unknown) {
      console.error(`Action Error [${actionType}]:`, error);
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });
}
