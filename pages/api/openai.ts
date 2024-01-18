import OpenAI from 'openai';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { tokenName, tokenDescription } = req.body;

    try {
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_KEY,
      });

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-1106",
        response_format: { "type": "json_object" },
        messages: [
          {
          role: "system",
          content: "You are a knowledgeable assistant about NFT collections and provide output in JSON format."
        }, {
          role: "user",
          content: `Provide a summary about the NFT collection with the token named ${tokenName} which is described as ${tokenDescription} and provide a overview of the collection`
        }],
      });

      res.status(200).json({ data: response.choices[0].message.content});
    } catch (error) {
        if (error instanceof OpenAI.APIError) {
            console.error(error.status);  // e.g. 401
            console.error(error.message); // e.g. The authentication token you passed was invalid...
            console.error(error.code);  // e.g. 'invalid_api_key'
            console.error(error.type);  // e.g. 'invalid_request_error'
          } else {
            // Non-API error
            console.log(error);
          }
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
