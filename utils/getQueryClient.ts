// utils/getQueryClient.ts
import { QueryClient } from '@tanstack/react-query';

export default function getQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 хвилина (у вашому коді було "staleline: 68 * 1888" — це помилка)
      },
    },
  });
}