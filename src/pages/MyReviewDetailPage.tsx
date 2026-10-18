import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { BookmarkCheckIcon, EyeIcon } from '../components/icons'
import StarRating from '../components/StarRating'
import { useMyReviewStore } from '../store/useMyReviewStore'
import { useWatchlistStore, type WatchlistMovie } from '../store/useWatchlistStore'

function ReviewEditor({ id }: { id: string }) {
  const navigate = useNavigate()

  const review = useMyReviewStore((s) => s.reviews[id])
  const saveReview = useMyReviewStore((s) => s.saveReview)
  const deleteReview = useMyReviewStore((s) => s.deleteReview)

  const watchItem = useWatchlistStore((s) => s.watchlist[id])
  const setWatched = useWatchlistStore((s) => s.setWatched)
  const toggleWatchlist = useWatchlistStore((s) => s.toggleWatchlist)

  const [editing, setEditing] = useState(!review)
  const [rating, setRating] = useState(review?.rating ?? 0)
  const [text, setText] = useState(review?.text ?? '')

  const source = review ?? watchItem
  if (!source) {
    return (
      <div className="py-16 text-center space-y-3">
        <p className="text-base-content/70">Movie not found</p>
        <Link to="/my-ratings" className="btn btn-sm btn-secondary">
          Back to My review
        </Link>
      </div>
    )
  }

  const movie: WatchlistMovie = {
    imdbID: source.imdbID,
    Title: source.Title,
    Year: source.Year,
    Poster: source.Poster,
  }
  const watched = watchItem?.watched ?? false
  const inWatchlist = Boolean(watchItem)

  const handleSave = () => {
    if (rating <= 0) return
    saveReview(movie, { rating, text: text.trim() })
    setEditing(false)
  }

  const handleCancel = () => {
    if (review) {
      setRating(review.rating)
      setText(review.text)
      setEditing(false)
    } else {
      navigate('/my-ratings')
    }
  }

  const handleDelete = () => {
    if (!window.confirm('Delete this review?')) return
    deleteReview(id)
    navigate('/my-ratings')
  }

  return (
    <div className="space-y-4">
      <Link to="/my-ratings" aria-label="Back to My Reviews" className="btn btn-ghost btn-sm btn-circle -ml-2">
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
       viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
</Link>

      <article className="rounded-2xl bg-base-200 p-4 sm:p-6">
        {/* Header */}
        <header className="flex items-center justify-between gap-4">
          <h1 className="text-lg font-bold text-neutral">My Review</h1>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex items-center gap-2 text-sm font-bold text-neutral hover:opacity-70 transition-opacity"
              onClick={() => setWatched(movie, !watched)}
              aria-pressed={watched}
              title="Switch watched status"
            >
              {watched ? 'Watched' : 'Unwatched'}
              <EyeIcon watched={watched} className="w-6 h-6" />
            </button>

            <button
              type="button"
              className={`hover:opacity-70 transition-opacity ${
                inWatchlist ? 'text-neutral' : 'text-neutral/30'
              }`}
              onClick={() => toggleWatchlist(movie)}
              aria-pressed={inWatchlist}
              title={inWatchlist ? 'In Watch list (click to remove)' : 'Add to Watch list'}
              aria-label={inWatchlist ? 'Remove from Watch list' : 'Add to Watch list'}
            >
              <BookmarkCheckIcon className="w-6 h-8" checkColor="#fff" />
            </button>
          </div>
        </header>

        <div className="mt-4 flex flex-col sm:flex-row sm:items-stretch gap-6">
          {/* Poster + title */}
          <div className="flex flex-col items-center sm:items-start gap-3 shrink-0 sm:w-48 md:w-60 lg:w-72">
            <img
              src={movie.Poster}
              alt={`Poster of ${movie.Title}`}
              className="w-48 sm:w-full rounded-sm shadow-md object-cover aspect-[2/3]"
            />
            <p className="font-bold text-neutral ">
              {movie.Title} {movie.Year}
            </p>
          </div>

          {/* Review area */}
          <div className="flex flex-col gap-4 flex-1 min-w-0 w-full">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-bold text-neutral">
                {editing ? 'Write your review' : 'Your review'}
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-neutral tabular-nums">
                  {rating.toFixed(1)}
                </span>
                <StarRating value={rating} onChange={editing ? setRating : undefined} />
              </div>
            </div>

            {editing ? (
              <textarea
                className="textarea w-full min-h-64 md:min-h-80 flex-1 bg-base-100 text-base-content"
                placeholder="Write your review here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                aria-label="Your review"
              />
            ) : (
              <div className="w-full min-h-64 md:min-h-80 flex-1 rounded-lg bg-base-100 p-4 text-sm sm:text-base leading-relaxed whitespace-pre-line break-words text-base-content">
                {review?.text || (
                  <span className="text-base-content/50">(No review text written)</span>
                )}
              </div>
            )}

            {/* Buttons */}
            {editing ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {review ? (
                  <button type="button" className="btn btn-error" onClick={handleDelete}>
                    Delete my review
                  </button>
                ) : (
                  <span className="hidden sm:block" />
                )}
                <button type="button" className="btn btn-outline" onClick={handleCancel}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-accent"
                  onClick={handleSave}
                  disabled={rating <= 0}
                  title={rating <= 0 ? 'Please rate the movie before saving' : undefined}
                >
                  Save my review
                </button>
              </div>
            ) : (
              <div className="flex justify-end">
                <button type="button" className="btn btn-accent" onClick={() => setEditing(true)}>
                  Edit my review
                </button>
              </div>
            )}
          </div>
        </div>
      </article>
    </div>
  )
}

export default function MyReviewDetailPage() {
  const { id = '' } = useParams<{ id: string }>()
  return <ReviewEditor key={id} id={id} />
}