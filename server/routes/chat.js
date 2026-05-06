import express from 'express';
import {
  getPointAlongRoute,
  searchPlace,
  searchPlaceNearCity,
  getRouteOptions
} from '../mcp/tools.js';

const router = express.Router();

const toolDefinitions = [
  {
    type: 'function',
    function: {
      name: 'get_point_along_route',
      description: 'Get the coordinates at a specific time into a road trip',
      parameters: {
        type: 'object',
        properties: {
          origin: { type: 'string' },
          destination: { type: 'string' },
          hours_into_trip: { type: 'number' }
        },
        required: ['origin', 'destination', 'hours_into_trip']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'search_place',
      description: 'Search for a real place near coordinates using Google Places',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string' },
          lat: { type: 'number' },
          lng: { type: 'number' },
          radius: { type: 'number' }
        },
        required: ['query', 'lat', 'lng']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'search_place_near_city',
      description: 'Search for a place near a specific city or address',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string' },
          city: { type: 'string' }
        },
        required: ['query', 'city']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_route_options',
      description: 'Get fastest or toll-free route between points',
      parameters: {
        type: 'object',
        properties: {
          origin: { type: 'string' },
          destination: { type: 'string' },
          avoid_tolls: { type: 'boolean' },
          waypoints: { type: 'array', items: { type: 'string' } }
        },
        required: ['origin', 'destination']
      }
    }
  }
];

const toolHandlers = {
  get_point_along_route: getPointAlongRoute,
  search_place: searchPlace,
  search_place_near_city: searchPlaceNearCity,
  get_route_options: getRouteOptions
};

router.post('/chat', async (req, res) => {
  const { message, trip, conversationHistory = [] } = req.body;

  if (!message || !trip) {
    return res.status(400).json({ error: 'message and trip are required' });
  }

  try {
    const messages = [
      {
        role: 'system',
        content: `You are a road trip assistant for WayFinder app.
You help users customize their trip from ${trip.origin.name} to ${trip.destination.name}.
Current stops: ${trip.stops.map(s => s.name).join(', ')}.
Use your tools to find real places. Never invent coordinates.
When done, summarize what you changed in plain English.`
      },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    let response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openrouter/free',
        messages,
        tools: toolDefinitions,
        tool_choice: 'auto'
      })
    });

    let data = await response.json();
    let assistantMessage = data.choices[0].message;
    messages.push(assistantMessage);

    // tool call loop
    while (assistantMessage.tool_calls?.length > 0) {
      for (const toolCall of assistantMessage.tool_calls) {
        const name = toolCall.function.name;
        const args = JSON.parse(toolCall.function.arguments);
        console.log(`MCP tool called: ${name}`, args);

        const handler = toolHandlers[name];
        const result = handler ? await handler(args) : { error: 'Unknown tool' };

        messages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify(result)
        });
      }

      response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'openrouter/free',
          messages,
          tools: toolDefinitions,
          tool_choice: 'auto'
        })
      });

      data = await response.json();
      assistantMessage = data.choices[0].message;
      messages.push(assistantMessage);
    }

    res.json({
      reply: assistantMessage.content,
      conversationHistory: messages.slice(1)
    });

  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: err.message || 'Chat failed' });
  }
});

export default router;