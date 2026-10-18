// src/hooks/useMovie.ts
import { useQuery } from "@tanstack/react-query";
import { fetchMovieById } from "../lib/api";
import type { OmdbMovieDetail } from "../types/movie";

export function useMovie(imdbId: string) {
  return useQuery<OmdbMovieDetail, Error>({
    queryKey: ["movie", imdbId, "full"],
    queryFn: () => fetchMovieById(imdbId, "full"),
    enabled: imdbId.length > 0,
  });
}
