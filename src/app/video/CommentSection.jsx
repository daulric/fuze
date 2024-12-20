import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { User } from 'lucide-react';

import SupabaseClient from "@/supabase/server";

const Comment = ({ username, profilePic, content, created_at }) => {
  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  return (
    <div className="flex space-x-4 py-4">
      <Avatar className="w-10 h-10">
        <AvatarImage src={profilePic} alt={username} />
        <AvatarFallback className='bg-gray-600' ><User /></AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-sm text-gray-200">{username}</span>
          <span className="text-xs text-gray-400">{timeAgo(new Date(created_at))}</span>
        </div>
        <p className="mt-1 text-sm text-gray-300">{content}</p>
      </div>
    </div>
  );
};

const CommentSection = ({ videoId, setIsTyping }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const supabase = SupabaseClient();
  const user_client = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const loadComments = async () => {
      setIsLoading(true);
      try {
        //const fetchedComments = await fetchComments(videoId);
        const {data: Comments} = await supabase.from("Video Comments")
          .select("*")
          .eq("video_id", videoId)
          .order("created_at", {ascending: true});

        setComments(Comments);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
        // Here you might want to set an error state and display an error message to the user
      } finally {
        setIsLoading(false);
      }
    };

    loadComments();
  }, [supabase, videoId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim() === "") return;

    // In a real app, you'd send this to your API
    const comment = {
      id: Date.now(), // This would normally be set by the backend
      username: user_client.username, // In a real app, this would be the logged-in user
      profilePic: user_client.avatar_url,
      content: newComment,
      created_at: new Date().toISOString(),
    };

    // Optimistically update the UI
    setComments(prevComments => [comment, ...prevComments]);
    setNewComment("");

    // Here you would typically make an API call to save the comment
    // If the API call fails, you might want to remove the comment from the state
    try {
      // await api.postComment(videoId, comment);
      console.log("Comment posted successfully");
    } catch (error) {
      console.error("Failed to post comment:", error);
      // Remove the optimistically added comment
      setComments(prevComments => prevComments.filter(c => c.id !== comment.id));
      // Here you might want to show an error message to the user
    }
  };

  function handleTyping(e) {
    setIsTyping(true);
    setNewComment(e.target.value);
    clearTimeout(window.typingTimeout);
    window.typingTimeout = setTimeout(() => setIsTyping(false), 1000);
  }

  if (isLoading) {
    return <div className="mt-8 text-gray-300">Loading comments...</div>;
  }

  return (
    <div className="mt-8 bg-gray-900 text-gray-100">
      <h2 className="text-lg font-semibold mb-4 text-gray-100">{comments.length} Comments</h2>
      {user_client && <div className="flex space-x-4 mb-6">
        <Avatar className="w-10 h-10">
          <AvatarImage src={user_client.avatar_url} alt="Current User" />
          <AvatarFallback className='bg-gray-600'><User /></AvatarFallback>
        </Avatar>
        <form onSubmit={handleSubmit} className="flex-1">
          <Textarea
            value={newComment}
            onChange={handleTyping}
            placeholder="Add a comment..."
            className="mb-2 resize-none bg-gray-800 text-gray-100 border-gray-700"
          />
          <div className="flex justify-end">
            <Button type="submit" variant="secondary" className="bg-gray-700 text-gray-100 hover:bg-gray-600">Comment</Button>
          </div>
        </form>
      </div>}
      <Separator className="my-4 bg-gray-700" />
      {comments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div>
          {comments.map((comment) => (
            <Comment key={comment.id} {...comment} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;