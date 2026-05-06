import { McpServer } from '@modelcontextprotocol/sdk/server';
import { z } from 'zod';
import {
  getPointAlongRoute,
  searchPlace,
  searchPlaceNearCity,
  getRouteOptions
} from './tools.js';

export function createMcpServer() {
  const server = new McpServer({
    name: 'wayfinder',
    version: '1.0.0'
  });

  server.tool(
    'get_point_along_route',
    'Get coordinates at a specific time into the road trip',
    {
      origin: z.string(),
      destination: z.string(),
      hours_into_trip: z.number()
    },
    async (args) => ({
      content: [{ type: 'text', text: JSON.stringify(await getPointAlongRoute(args)) }]
    })
  );

  server.tool(
    'search_place',
    'Search for a real place near coordinates using Google Places',
    {
      query: z.string(),
      lat: z.number(),
      lng: z.number(),
      radius: z.number().optional()
    },
    async (args) => ({
      content: [{ type: 'text', text: JSON.stringify(await searchPlace(args)) }]
    })
  );

  server.tool(
    'search_place_near_city',
    'Search for a place near a city or address',
    {
      query: z.string(),
      city: z.string()
    },
    async (args) => ({
      content: [{ type: 'text', text: JSON.stringify(await searchPlaceNearCity(args)) }]
    })
  );

  server.tool(
    'get_route_options',
    'Get fastest or toll-free route between points',
    {
      origin: z.string(),
      destination: z.string(),
      avoid_tolls: z.boolean().optional(),
      waypoints: z.array(z.string()).optional()
    },
    async (args) => ({
      content: [{ type: 'text', text: JSON.stringify(await getRouteOptions(args)) }]
    })
  );

  return server;
}

export { getPointAlongRoute, searchPlace, searchPlaceNearCity, getRouteOptions };