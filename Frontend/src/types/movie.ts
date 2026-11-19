// src/types/movie.ts

/** OMDb API - Full movie detail response (?i=ttXXXXXXX) */
export interface OmdbMovieDetail {
  Title: string
  Year: string
  Rated: string
  Released: string
  Runtime: string
  Genre: string           
  Director: string
  Writer: string
  Actors: string          
  Plot: string
  Language: string
  Country: string
  Awards: string
  Poster: string          
  Ratings: OmdbRating[]
  Metascore: string
  imdbRating: string      
  imdbVotes: string       
  imdbID: string          
  Type: string            
  totalSeasons?: string
  Response: string        
  Error?: string          
}

export interface OmdbRating {
  Source: string
  Value: string
}

/** OMDb API - Search response (?s=keyword) */
export interface OmdbSearchResponse {
  Search: OmdbSearchItem[]
  totalResults: string
  Response: string
}

export interface OmdbSearchItem {
  Title: string
  Year: string
  imdbID: string
  Type: string
  Poster: string
}

/** Fields needed to render a movie in a card (shared by detail + search results) */
export type MovieSummary = Pick<OmdbMovieDetail, 'Title' | 'Year' | 'Poster' | 'imdbID'>

/** OMDb plot length option */
export type OmdbPlotLength = 'short' | 'full'
