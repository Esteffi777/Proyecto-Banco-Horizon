import { Request, Response } from 'express';
import { SessionsClient } from '@google-cloud/dialogflow';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const projectId = 'horizonbank-428317';
const keyFilename = path.resolve(__dirname, '../dialogflow-credentials.json');
const sessionClient = new SessionsClient({ keyFilename });

async function detectIntent(queryText: string, sessionId: string) {
    const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: queryText,
                languageCode: 'es',
            },
        },
    };
    const responses = await sessionClient.detectIntent(request);
    if (!responses || !responses[0].queryResult) {
        throw new Error('No response from Dialogflow');
    }
    return responses[0].queryResult;
}

export const webhook = async (req: Request, res: Response) => {
    const queryText = req.body.query;
    console.log('Received query:', queryText);
    const sessionId = uuidv4();
    try {
        const queryResult = await detectIntent(queryText, sessionId);
        console.log('Dialogflow response:', JSON.stringify(queryResult, null, 2));
        const fulfillmentText = queryResult.fulfillmentText;
        const fulfillmentMessages = queryResult.fulfillmentMessages;
        console.log('fulfillment: ', fulfillmentText, fulfillmentMessages);

        res.json({ fulfillmentText, fulfillmentMessages });
    } catch (error: any) {
        console.error('Error handling Dialogflow request:', error);
        res.status(500).json({ error: error.message });
    }
};
