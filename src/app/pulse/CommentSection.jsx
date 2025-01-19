import { X, Send, Heart } from 'lucide-react'

export const CommentsSection = ({ video, toggleComments, newComment, setNewComment, handleCommentSubmit }) => {
  return (
    <div 
      className="absolute inset-0 bg-black/90 z-20"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-white text-lg font-semibold">
            Comments ({video.comments.length})
          </h2>
          <button 
            onClick={() => toggleComments(false)}
            className="text-white p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {video.comments.map(comment => (
            <div key={comment.id} className="p-4 border-b border-gray-800">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-600 rounded-full" />
                <div className="flex-1">
                  <p className="text-white font-semibold">{comment.username}</p>
                  <p className="text-white/80 mt-1">{comment.text}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-white/60 text-sm">{comment.timestamp}</span>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4 text-white/60" />
                      <span className="text-white/60 text-sm">{comment.likes || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <form 
          onSubmit={handleCommentSubmit}
          className="p-4 border-t border-gray-800 bg-black"
        >
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-gray-600 rounded-full flex-shrink-0" />
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-gray-800 rounded-full px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                type="submit"
                className="p-2 text-blue-500 disabled:text-gray-600"
                disabled={!newComment.trim()}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}